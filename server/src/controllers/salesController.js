const pool = require('../config/db'); // Conexión a MySQL

/* ───────────────────────── Helpers ───────────────────────── */
function safeParseJSON(v) {
  try { return typeof v === 'string' ? JSON.parse(v) : (v || {}); }
  catch { return {}; }
}

/* ───────────────────────── createSale (SIN CAMBIOS) ───────────────────────── */
const createSale = async (req, res) => {
  const connection = await pool.getConnection();

  const { totalVenta, items, pagoDetalles, userId, clientId } = req.body;
  console.log(`LOG: Iniciando transacción para nueva venta. Cliente ID: ${clientId}, Total: ${totalVenta}`);

  try {
    await connection.beginTransaction();

    if (!totalVenta && totalVenta !== 0 || !items || items.length === 0 || !pagoDetalles || !userId) {
      return res.status(400).json({ message: 'Faltan datos o no hay productos en la venta.' });
    }

    const montoCredito = pagoDetalles.credito || 0;

    const saleData = {
      fecha: new Date(),
      total_venta: totalVenta,
      subtotal: req.body.subtotal || totalVenta,
      descuento: req.body.descuento || 0,
      estado: 'COMPLETADA',
      id_usuario: userId,
      id_cliente: clientId,
      pago_detalles: JSON.stringify({ ...pagoDetalles, tasaDolarAlMomento: req.body.tasaDolarAlMomento }),
      tipo_venta: montoCredito > 0 ? 'CREDITO' : 'CONTADO',
      referencia_pedido: req.body.referencia_pedido
    };

    const [saleResult] = await connection.query('INSERT INTO ventas SET ?', saleData);
    const saleId = saleResult.insertId;

    if (montoCredito > 0 && clientId) {
      await connection.query(
        'UPDATE clientes SET saldo_pendiente = saldo_pendiente + ? WHERE id_cliente = ?',
        [montoCredito, clientId]
      );
    }

    for (const item of items) {
      await connection.query(
        'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [saleId, item.id || item.id_producto, item.quantity, item.precio]
      );

      const [product] = await connection.query('SELECT existencia, nombre FROM productos WHERE id_producto = ? FOR UPDATE', [item.id || item.id_producto]);

      if (product.length === 0 || product[0].existencia < item.quantity) {
        await connection.rollback();
        throw new Error(`Stock insuficiente para el producto: ${product[0]?.nombre || item.nombre}`);
      }

      await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [item.quantity, item.id || item.id_producto]);
    }

    await connection.commit();
    
    const [newSale] = await connection.query('SELECT * FROM ventas WHERE id_venta = ?', [saleId]);

    res.status(201).json({
      message: 'Venta creada exitosamente',
      saleId,
      saleData: { ...newSale[0], items, pagoDetalles }
    });

  } catch (error) {
    await connection.rollback();
    console.error('ERROR CRÍTICO en transacción de venta:', error);
    res.status(500).json({ message: error.message || 'Error en el servidor al crear la venta' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── cancelSale (SIN CAMBIOS) ───────────────────────── */
const cancelSale = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const [sale] = await connection.query('SELECT id_cliente, estado, pago_detalles FROM ventas WHERE id_venta = ? FOR UPDATE', [id]);

    if (sale.length === 0) throw new Error('La venta no existe.');
    if (sale[0].estado === 'CANCELADA') throw new Error('Esta venta ya fue cancelada.');

    const saleData = sale[0];
    const clientId = saleData.id_cliente;

    let detalles = {};
    try {
      detalles = typeof saleData.pago_detalles === 'string' ? JSON.parse(saleData.pago_detalles) : saleData.pago_detalles;
    } catch (e) {}

    const montoCredito = detalles.credito || 0;

    const [items] = await connection.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = ?', [id]);
    for (const item of items) {
      await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [item.cantidad, item.id_producto]);
    }

    if (montoCredito > 0 && clientId) {
      await connection.query(
        'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
        [montoCredito, clientId]
      );
    }

    await connection.query('UPDATE ventas SET estado = ? WHERE id_venta = ?', ['CANCELADA', id]);

    await connection.commit();
    res.status(200).json({ message: 'Venta cancelada exitosamente.' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message || 'Error al cancelar la venta' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── createReturn (REESCRITA - SPLIT TICKET) ───────────────────────── */
const createReturn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Recibimos datos
    const { originalSaleId, item, quantity, userId } = req.body; // item es el producto a devolver
    const qtyToReturn = Number(quantity);

    if (!originalSaleId || !item || !qtyToReturn || !userId) {
      throw new Error('Faltan datos para procesar la devolución.');
    }

    // 1. Obtener la venta original y bloquearla
    const [originalSaleRows] = await connection.query('SELECT * FROM ventas WHERE id_venta = ? FOR UPDATE', [originalSaleId]);
    if (originalSaleRows.length === 0) throw new Error('Venta original no encontrada');
    const originalSale = originalSaleRows[0];

    if (originalSale.estado === 'CANCELADA') throw new Error('La venta ya está cancelada, no se puede devolver.');

    // 2. Obtener los items originales
    const [originalItems] = await connection.query(
      `SELECT dv.*, p.nombre, p.existencia as stock_actual 
       FROM detalle_ventas dv 
       JOIN productos p ON dv.id_producto = p.id_producto 
       WHERE dv.id_venta = ?`, 
      [originalSaleId]
    );

    // 3. Verificar que el item a devolver existe en la venta
    const targetItemIndex = originalItems.findIndex(i => i.id_producto == (item.id || item.id_producto));
    if (targetItemIndex === -1) throw new Error('El producto a devolver no pertenece a esta venta.');
    
    const targetItem = originalItems[targetItemIndex];
    if (targetItem.cantidad < qtyToReturn) throw new Error('No puedes devolver más cantidad de la que se vendió.');

    // 4. REVERTIR TODO EL STOCK de la venta original (Para limpiar)
    //    Devolvemos todo al inventario primero.
    for (const prod of originalItems) {
      await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [prod.cantidad, prod.id_producto]);
    }

    // 5. CANCELAR la venta original (Ticket viejo "Borrado" lógicamente)
    //    También revertimos saldo cliente si fue crédito
    let pagoDetallesOrig = safeParseJSON(originalSale.pago_detalles);
    if ((pagoDetallesOrig.credito || 0) > 0 && originalSale.id_cliente) {
       await connection.query(
        'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
        [pagoDetallesOrig.credito, originalSale.id_cliente]
      );
    }
    await connection.query('UPDATE ventas SET estado = "CANCELADA" WHERE id_venta = ?', [originalSaleId]);


    // 6. CALCULAR NUEVA LISTA DE ITEMS (Restando lo devuelto)
    //    Si devolvimos todo de un producto, se elimina de la lista.
    //    Si devolvimos parcial, se reduce la cantidad.
    const newItemsList = [];
    let refundTotal = 0; // Dinero a devolver al cliente

    for (const prod of originalItems) {
      let newQty = prod.cantidad;
      
      // Si este es el producto que estamos devolviendo
      if (prod.id_producto == (item.id || item.id_producto)) {
        newQty = prod.cantidad - qtyToReturn;
        refundTotal += (Number(prod.precio_unitario) * qtyToReturn);
      }

      if (newQty > 0) {
        newItemsList.push({
          id_producto: prod.id_producto,
          cantidad: newQty,
          precio_unitario: Number(prod.precio_unitario)
        });
      }
    }

    // 7. CREAR NUEVO TICKET con los items restantes (si quedó algo)
    let newSaleId = null;

    if (newItemsList.length > 0) {
      // Calcular nuevos totales
      const newSubtotal = newItemsList.reduce((acc, curr) => acc + (curr.cantidad * curr.precio_unitario), 0);
      
      // Recalcular descuento proporcional (si había)
      let newDiscount = 0;
      if (originalSale.subtotal > 0 && originalSale.descuento > 0) {
        const discountRate = originalSale.descuento / originalSale.subtotal;
        newDiscount = newSubtotal * discountRate;
      }
      const newTotal = newSubtotal - newDiscount;

      // Ajustar pagoDetalles para el nuevo ticket
      // Asumimos que la diferencia se devolvió en efectivo, así que el nuevo pago es el nuevo total
      const newPagoDetalles = {
        ...pagoDetallesOrig,
        efectivo: newTotal, // Simplificación: asumimos que se ajusta a lo que quedó
        ingresoCaja: newTotal, // Importante para reportes futuros
        credito: 0 // Si había crédito, se asume pagado o reajustado, simplificado para efectivo
      };
      
      // Insertar Venta Nueva
      const [insertResult] = await connection.query(
        'INSERT INTO ventas (fecha, total_venta, subtotal, descuento, estado, id_usuario, id_cliente, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, ?, ?, "COMPLETADA", ?, ?, ?, ?, ?)',
        [newTotal, newSubtotal, newDiscount, userId, originalSale.id_cliente, JSON.stringify(newPagoDetalles), originalSale.tipo_venta, originalSale.referencia_pedido]
      );
      newSaleId = insertResult.insertId;

      // Insertar Detalles Nuevos y RESTAR STOCK NUEVAMENTE (solo de lo que se queda)
      for (const newItem of newItemsList) {
        await connection.query(
          'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [newSaleId, newItem.id_producto, newItem.cantidad, newItem.precio_unitario]
        );
        await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [newItem.cantidad, newItem.id_producto]);
      }
    }

    await connection.commit();

    // 8. Responder
    // refundTotal: es la cantidad de dinero que salió de la caja (importante para el Frontend)
    res.status(201).json({ 
      message: 'Devolución procesada. Ticket antiguo cancelado, ticket nuevo creado.', 
      originalSaleId,
      newSaleId,
      refundAmount: refundTotal 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en transacción de devolución:', error);
    res.status(500).json({ message: error.message || 'Error al procesar la devolución' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── getSales (SIN CAMBIOS) ───────────────────────── */
const getSales = async (req, res) => {
  try {
    const { date } = req.query;
    let where = '1=1';
    const params = [];

    if (date) {
      where += ` AND DATE(CONVERT_TZ(v.fecha, 'UTC', 'America/Managua')) = ?`;
      params.push(date);
    } 

    const [sales] = await pool.query(
      `SELECT v.id_venta AS id, v.fecha, v.total_venta AS totalVenta, v.subtotal, v.descuento, v.estado, v.pago_detalles AS pagoDetalles, v.id_usuario AS userId, v.id_cliente AS clientId, c.nombre AS clienteNombre, v.tipo_venta, v.referencia_pedido FROM ventas v LEFT JOIN clientes c ON v.id_cliente = c.id_cliente WHERE ${where} ORDER BY v.fecha DESC`,
      params
    );

    if (!sales.length) return res.json([]);
    const saleIds = sales.map(s => s.id);
    const [details] = await pool.query(
      `SELECT dv.id_venta, p.id_producto AS id, p.nombre, dv.cantidad AS quantity, dv.precio_unitario AS precio FROM detalle_ventas dv JOIN productos p ON dv.id_producto = p.id_producto WHERE dv.id_venta IN (?)`,
      [saleIds]
    );

    const salesWithDetails = sales.map(sale => ({
      ...sale,
      pagoDetalles: safeParseJSON(sale.pagoDetalles),
      items: details.filter(d => d.id_venta === sale.id)
    }));

    res.json(salesWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
};

module.exports = { createSale, getSales, createReturn, cancelSale };