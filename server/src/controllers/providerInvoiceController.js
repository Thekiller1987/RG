const db = require('../config/db');

// Obtener todas las facturas
exports.getInvoices = async (req, res) => {
  try {
    const { startDate, endDate, proveedor } = req.query;
    let query = 'SELECT * FROM facturas_proveedores WHERE 1=1';
    const queryParams = [];

    if (startDate && endDate) {
      query += ' AND fecha_emision BETWEEN ? AND ?';
      queryParams.push(startDate, endDate);
    }

    if (proveedor && proveedor !== '') {
      query += ' AND proveedor = ?';
      queryParams.push(proveedor);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener facturas' });
  }
};

// Crear nueva factura
exports.createInvoice = async (req, res) => {
  const {
    proveedor, numero_factura, fecha_emision, fecha_vencimiento,
    monto_total, notas, tipo_compra, metodo_pago, referencia
  } = req.body;

  try {
    const isContado = tipo_compra === 'CONTADO';
    const estado = isContado ? 'PAGADA' : 'PENDIENTE';
    const monto_abonado = isContado ? monto_total : 0;

    const [result] = await db.query(
      `INSERT INTO facturas_proveedores 
      (proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas, estado, tipo_compra, metodo_pago, monto_abonado) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas, estado, tipo_compra || 'CREDITO', isContado ? metodo_pago : null, monto_abonado]
    );

    const newInvoiceId = result.insertId;

    if (isContado) {
      await db.query(
        `INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, referencia) VALUES (?, ?, ?, ?)`,
        [newInvoiceId, monto_total, metodo_pago || 'EFECTIVO', referencia || 'Pago de Contado']
      );
    }

    res.status(201).json({ id: newInvoiceId, message: 'Factura creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear factura' });
  }
};

// Registrar abono
exports.registerPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method, reference } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Monto inválido' });
  }

  try {
    // 1. Buscar la factura
    const [invoices] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id]);
    if (invoices.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });

    const invoice = invoices[0];
    const nuevoAbonado = Number(invoice.monto_abonado) + Number(amount);

    // 2. Calcular si ya se pagó completa
    let nuevoEstado = invoice.estado;
    if (nuevoAbonado >= invoice.monto_total) {
      nuevoEstado = 'PAGADA';
    }

    // 3. Actualizar BD Factura
    await db.query(
      'UPDATE facturas_proveedores SET monto_abonado = ?, estado = ? WHERE id = ?',
      [nuevoAbonado, nuevoEstado, id]
    );

    // 4. Registrar Abono en Historial
    await db.query(
      `INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, referencia) VALUES (?, ?, ?, ?)`,
      [id, amount, method || 'EFECTIVO', reference || 'Abono']
    );

    res.json({ message: 'Abono registrado', nuevoAbonado, nuevoEstado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar pago' });
  }
};

// Obtener historial de abonos de una factura
exports.getInvoicePayments = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM abonos_proveedores WHERE id_factura = ? ORDER BY fecha DESC', [id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener historial de abonos' });
  }
};

// Eliminar factura
exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    // Borrado en cascada configurado en BD
    await db.query('DELETE FROM facturas_proveedores WHERE id = ?', [id]);
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar factura' });
  }
};

// Eliminar un abono específico (corregir duplicados)
exports.deletePayment = async (req, res) => {
  const { abonoId } = req.params;
  try {
    // 1. Obtener el abono para saber cuánto revertir
    const [rows] = await db.query('SELECT * FROM abonos_proveedores WHERE id = ?', [abonoId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Abono no encontrado' });

    const abono = rows[0];
    const { id_factura, monto } = abono;

    // 2. Eliminar el abono
    await db.query('DELETE FROM abonos_proveedores WHERE id = ?', [abonoId]);

    // 3. Revertir el monto en la factura
    const [invRows] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id_factura]);
    if (invRows.length > 0) {
      const inv = invRows[0];
      const nuevoAbonado = Math.max(0, Number(inv.monto_abonado) - Number(monto));
      const nuevoEstado = nuevoAbonado >= Number(inv.monto_total) ? 'PAGADA' : (inv.estado === 'PAGADA' ? 'PENDIENTE' : inv.estado);
      await db.query(
        'UPDATE facturas_proveedores SET monto_abonado = ?, estado = ? WHERE id = ?',
        [nuevoAbonado, nuevoEstado, id_factura]
      );
    }

    res.json({ message: 'Abono eliminado y factura actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el abono' });
  }
};