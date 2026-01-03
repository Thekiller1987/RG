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
      await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [item.quantity, item.id || item.id_producto]);
    }

    await connection.commit();

    // ─── SOCKET.IO EMIT ───
    const io = req.app.get('io');
    if (io) io.emit('inventory_update');

    const [newSale] = await connection.query('SELECT * FROM ventas WHERE id_venta = ?', [saleId]);

    res.status(201).json({
      message: 'Venta creada exitosamente',
      saleId,
      saleData: { ...newSale[0], items, pagoDetalles }
    });

  } catch (error) {
    await connection.rollback();
    console.error('ERROR en createSale:', error);
    res.status(500).json({ message: error.message || 'Error en el servidor' });
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

    if (sale.length === 0) throw new Error('Venta no encontrada.');
    if (sale[0].estado === 'CANCELADA') throw new Error('Venta ya cancelada.');

    const saleData = sale[0];
    const clientId = saleData.id_cliente;
    let detalles = safeParseJSON(saleData.pago_detalles);
    const montoCredito = detalles.credito || 0;

    const [items] = await connection.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = ?', [id]);
    for (const item of items) {
      await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [item.cantidad, item.id_producto]);
    }

    if (montoCredito > 0 && clientId) {
      await connection.query('UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?', [montoCredito, clientId]);
    }

    await connection.query('UPDATE ventas SET estado = ? WHERE id_venta = ?', ['CANCELADA', id]);
    await connection.commit();

    // ─── SOCKET.IO EMIT ───
    const io = req.app.get('io');
    if (io) io.emit('inventory_update');

    res.status(200).json({ message: 'Venta cancelada exitosamente.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── createReturn (MODIFICADO: ACTUALIZA TICKET ORIGINAL) ───────────────────────── */
const createReturn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { originalSaleId, item, quantity, userId } = req.body;
    const qtyToReturn = Number(quantity);

    if (!originalSaleId || !item || !qtyToReturn || !userId) {
      throw new Error('Faltan datos para la devolución.');
    }

    // 1. Obtener venta original
    const [originalSaleRows] = await connection.query('SELECT * FROM ventas WHERE id_venta = ? FOR UPDATE', [originalSaleId]);
    if (originalSaleRows.length === 0) throw new Error('Venta original no encontrada');
    const originalSale = originalSaleRows[0];

    if (originalSale.estado === 'CANCELADA') throw new Error('No se puede devolver sobre una venta cancelada.');

    // 2. Devolver Stock al inventario (siempre se suma lo que entra)
    const productId = item.id || item.id_producto;
    await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [qtyToReturn, productId]);

    // 3. Buscar el item en detalle_ventas para modificarlo
    const [detalleRows] = await connection.query('SELECT * FROM detalle_ventas WHERE id_venta = ? AND id_producto = ?', [originalSaleId, productId]);

    if (detalleRows.length === 0) throw new Error('El producto no existe en esta venta.');
    const currentItem = detalleRows[0];

    if (currentItem.cantidad < qtyToReturn) throw new Error('No puedes devolver más cantidad de la que se vendió.');

    // 4. Actualizar o Borrar la línea del producto en el ticket
    if (currentItem.cantidad === qtyToReturn) {
      // Se devuelve TODO: borrar la línea
      await connection.query('DELETE FROM detalle_ventas WHERE id_venta = ? AND id_producto = ?', [originalSaleId, productId]);
    } else {
      // Se devuelve PARTE: restar cantidad
      await connection.query('UPDATE detalle_ventas SET cantidad = cantidad - ? WHERE id_venta = ? AND id_producto = ?', [qtyToReturn, originalSaleId, productId]);
    }

    // 5. Recalcular el Ticket Original (Sumar lo que quedó)
    const [remainingItems] = await connection.query('SELECT * FROM detalle_ventas WHERE id_venta = ?', [originalSaleId]);

    let newSubtotal = 0;
    remainingItems.forEach(i => {
      newSubtotal += (Number(i.cantidad) * Number(i.precio_unitario));
    });

    // Calcular descuento proporcional si existía
    let newDiscount = 0;
    if (originalSale.subtotal > 0 && originalSale.descuento > 0) {
      const discountRate = originalSale.descuento / originalSale.subtotal;
      newDiscount = newSubtotal * discountRate;
    }
    const newTotal = newSubtotal - newDiscount;

    // Calcular cuánto dinero estamos devolviendo
    const refundAmount = (Number(originalSale.total_venta) - newTotal);

    // 6. Actualizar Cabecera de Venta (Total, Subtotal)
    // También ajustamos pago_detalles para que cuadre con el nuevo total
    let pagoDetalles = safeParseJSON(originalSale.pago_detalles);

    // Si era crédito, ajustamos crédito. Si era contado, ajustamos efectivo/ingresoCaja.
    if ((pagoDetalles.credito || 0) > 0) {
      const creditoRevertir = Math.min(pagoDetalles.credito, refundAmount);
      pagoDetalles.credito -= creditoRevertir;
      // También actualizar saldo del cliente en tabla clientes
      if (originalSale.id_cliente) {
        await connection.query('UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?', [creditoRevertir, originalSale.id_cliente]);
      }
    } else {
      // Asumimos que se devuelve efectivo y el ingreso de caja baja
      pagoDetalles.ingresoCaja = (pagoDetalles.ingresoCaja || originalSale.total_venta) - refundAmount;
      pagoDetalles.efectivo = (pagoDetalles.efectivo || originalSale.total_venta) - refundAmount;
    }

    // Si no quedan items, marcar como CANCELADA, sino mantener COMPLETADA con nuevos montos
    const nuevoEstado = remainingItems.length === 0 ? 'CANCELADA' : 'COMPLETADA';

    await connection.query(
      'UPDATE ventas SET total_venta = ?, subtotal = ?, descuento = ?, pago_detalles = ?, estado = ? WHERE id_venta = ?',
      [newTotal, newSubtotal, newDiscount, JSON.stringify(pagoDetalles), nuevoEstado, originalSaleId]
    );

    // 7. Insertar registro de auditoría (opcional, para saber que hubo devolución)
    // Creamos un registro tipo "DEVOLUCION" con monto negativo para el historial, pero no afecta al ticket original ya modificado
    const logPagoDetalles = { efectivo: refundAmount, ingresoCaja: -refundAmount, nota: `Devolución s/Ticket #${originalSaleId}` };
    await connection.query(
      "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta) VALUES (NOW(), ?, 'DEVOLUCION', ?, ?, 'DEVOLUCION')",
      [-refundAmount, userId, JSON.stringify(logPagoDetalles)]
    );

    await connection.commit();

    // ─── SOCKET.IO EMIT ───
    const io = req.app.get('io');
    if (io) io.emit('inventory_update');

    // Enviamos refundAmount para que el Frontend reste de la caja (POS.jsx lo maneja)
    res.status(201).json({
      message: 'Devolución procesada. Ticket original actualizado.',
      originalSaleId,
      refundAmount
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en devolución:', error);
    res.status(500).json({ message: error.message || 'Error al procesar la devolución' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── syncCart (NUEVO: RESERVA STOCK TEMPORAL) ───────────────────────── */
const syncCart = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  const { cart } = req.body;

  if (!userId) return res.status(400).json({ message: 'User ID required' });

  try {
    const cartJson = JSON.stringify(cart || []);

    await pool.query(
      `INSERT INTO active_carts (user_id, cart_data) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE cart_data = VALUES(cart_data)`,
      [userId, cartJson]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ message: 'Error syncing cart' });
  }
};

/* ───────────────────────── getSales (SIN CAMBIOS) ───────────────────────── */
const getSales = async (req, res) => {
  try {
    const { date } = req.query;
    let where = '1=1';
    const params = [];

    if (date) {
      where += ` AND DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = ?`;
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

module.exports = { createSale, getSales, createReturn, cancelSale, syncCart };