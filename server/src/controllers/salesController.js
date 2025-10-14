// sales.controller.js
const pool = require('../config/db'); // Conexión a MySQL

/* ───────────────────────── Helpers ───────────────────────── */
function safeParseJSON(v) {
  try { return typeof v === 'string' ? JSON.parse(v) : (v || {}); }
  catch { return {}; }
}

/* ───────────────────────── createSale (igual) ───────────────────────── */
// AÑADE CRÉDITO A SALDO_PENDIENTE
const createSale = async (req, res) => {
  const connection = await pool.getConnection();

  const { totalVenta, items, pagoDetalles, userId, clientId } = req.body;
  console.log(`LOG: Iniciando transacción para nueva venta. Cliente ID: ${clientId}, Total: ${totalVenta}`);
  console.log(`LOG: Pago Detalles recibidos:`, pagoDetalles);

  try {
    await connection.beginTransaction();

    if (!totalVenta && totalVenta !== 0 || !items || items.length === 0 || !pagoDetalles || !userId) {
      console.error("ERROR: Faltan datos o no hay productos.");
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

    // 1) Venta
    const [saleResult] = await connection.query('INSERT INTO ventas SET ?', saleData);
    const saleId = saleResult.insertId;
    console.log(`LOG: Venta insertada con ID: ${saleId}`);

    // 2) Crédito
    if (montoCredito > 0 && clientId) {
      await connection.query(
        'UPDATE clientes SET saldo_pendiente = saldo_pendiente + ? WHERE id_cliente = ?',
        [montoCredito, clientId]
      );
      console.log(`LOG: Crédito de C$${montoCredito.toFixed(2)} sumado al cliente ID: ${clientId}`);
    } else {
      console.log(`LOG: No se sumó crédito. Monto: ${montoCredito}, Cliente ID: ${clientId}`);
    }

    // 3) Detalle + stock
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
      console.log(`LOG: Stock actualizado para producto ID ${item.id || item.id_producto}. Cantidad: -${item.quantity}`);
    }

    await connection.commit();
    console.log(`LOG: Transacción Venta #${saleId} completada exitosamente.`);

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

/* ───────────────────────── cancelSale (igual) ───────────────────────── */
// RESTA CRÉDITO Y REVIERTE STOCK
const cancelSale = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  console.log(`LOG: Iniciando cancelación de Venta #${id}`);

  try {
    await connection.beginTransaction();

    // 1) Venta
    const [sale] = await connection.query('SELECT id_cliente, estado, pago_detalles FROM ventas WHERE id_venta = ? FOR UPDATE', [id]);

    if (sale.length === 0) throw new Error('La venta no existe.');
    if (sale[0].estado === 'CANCELADA') throw new Error('Esta venta ya fue cancelada.');

    const saleData = sale[0];
    const clientId = saleData.id_cliente;

    let detalles = {};
    try {
      detalles = typeof saleData.pago_detalles === 'string' ? JSON.parse(saleData.pago_detalles) : saleData.pago_detalles;
    } catch (e) {
      console.warn(`Advertencia: No se pudo parsear pago_detalles para Venta #${id}. Asumiendo 0 crédito.`, e);
    }

    const montoCredito = detalles.credito || 0;

    // 2) Revertir stock
    const [items] = await connection.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = ?', [id]);
    for (const item of items) {
      await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [item.cantidad, item.id_producto]);
      console.log(`LOG: Stock revertido para producto ID ${item.id_producto}. Cantidad: +${item.cantidad}`);
    }

    // 3) Revertir crédito
    if (montoCredito > 0 && clientId) {
      await connection.query(
        'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
        [montoCredito, clientId]
      );
      console.log(`LOG: Crédito de C$${montoCredito.toFixed(2)} revertido al cliente ID: ${clientId}`);
    }

    // 4) Estado
    await connection.query('UPDATE ventas SET estado = ? WHERE id_venta = ?', ['CANCELADA', id]);
    console.log(`LOG: Venta #${id} marcada como CANCELADA.`);

    await connection.commit();
    res.status(200).json({ message: 'Venta cancelada exitosamente, stock y crédito revertidos.' });

  } catch (error) {
    await connection.rollback();
    console.error('ERROR CRÍTICO en la cancelación de venta:', error);
    res.status(500).json({ message: error.message || 'Error en el servidor al cancelar la venta' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── createReturn (tu versión, sin tocar) ───────────────────────── */
// DEVOLUCIÓN PARCIAL
const createReturn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { originalSaleId, item, quantity, userId } = req.body;

    if (!originalSaleId || !item || !quantity || !userId) {
      return res.status(400).json({ message: 'Faltan datos para la devolución.' });
    }

    const returnAmount = item.precio * quantity;
    const pagoDetalles = { efectivo: returnAmount, ingresoCaja: returnAmount * -1, devueltoDeVenta: originalSaleId };

    const [insertSaleResult] = await connection.query(
      "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta) VALUES (NOW(), ?, ?, ?, ?, 'DEVOLUCION')",
      [returnAmount * -1, 'DEVOLUCION', userId, JSON.stringify(pagoDetalles)]
    );
    const returnId = insertSaleResult.insertId;

    await connection.query(
      'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
      [returnId, item.id || item.id_producto, quantity, item.precio]
    );
    await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [quantity, item.id || item.id_producto]);

    await connection.commit();
    res.status(201).json({ message: 'Devolución procesada exitosamente', returnId });
  } catch (error) {
    await connection.rollback();
    console.error('Error en transacción de devolución:', error);
    res.status(500).json({ message: error.message || 'Error en el servidor al procesar la devolución' });
  } finally {
    if (connection) connection.release();
  }
};

/* ───────────────────────── getSales (AJUSTE SOLICITADO) ───────────────────────── */
// Si viene ?date => rango del día; si NO, historial completo (incluye canceladas y devoluciones)
const getSales = async (req, res) => {
  try {
    const { date } = req.query;

    let where = '1=1';
    const params = [];

    if (date) {
      where += ' AND v.fecha BETWEEN ? AND ?';
      params.push(`${date} 00:00:00`, `${date} 23:59:59`);
      console.log(`LOG: Ventas del ${date} (rango del día).`);
    } else {
      console.log('LOG: Ventas (historial completo, sin filtro de fecha).');
    }

    const [sales] = await pool.query(
      `
      SELECT 
        v.id_venta AS id, 
        v.fecha, 
        v.total_venta AS totalVenta, 
        v.subtotal,
        v.descuento,
        v.estado, 
        v.pago_detalles AS pagoDetalles,
        v.id_usuario AS userId,
        v.id_cliente AS clientId,
        c.nombre AS clienteNombre,
        v.tipo_venta,
        v.referencia_pedido
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      WHERE ${where}
      ORDER BY v.fecha DESC
      `,
      params
    );

    if (!sales.length) return res.json([]);

    const saleIds = sales.map(s => s.id);
    if (!saleIds.length) {
      return res.json(sales.map(s => ({ ...s, pagoDetalles: safeParseJSON(s.pagoDetalles), items: [] })));
    }

    const [details] = await pool.query(
      `
      SELECT 
        dv.id_venta, 
        p.id_producto AS id,
        p.nombre,
        dv.cantidad AS quantity,
        dv.precio_unitario AS precio
      FROM detalle_ventas dv
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta IN (?)
      `,
      [saleIds]
    );

    const salesWithDetails = sales.map(sale => ({
      ...sale,
      pagoDetalles: safeParseJSON(sale.pagoDetalles),
      items: details.filter(d => d.id_venta === sale.id)
    }));

    res.json(salesWithDetails);

  } catch (error) {
    console.error('ERROR CRÍTICO al obtener las ventas:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener las ventas' });
  }
};

module.exports = {
  createSale,
  getSales,
  createReturn,
  cancelSale,
};
