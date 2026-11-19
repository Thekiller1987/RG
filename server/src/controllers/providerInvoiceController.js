const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper para limpiar archivos físicos antiguos (compatibilidad con registros previos a Base64)
const cleanLegacyDiskFile = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('/uploads/')) return;
  try {
    const parts = url.split('/uploads/');
    if (parts.length === 2) {
      const relPath = parts[1];
      const fullPath = path.join(__dirname, '../../public/uploads', relPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (err) {
    console.warn('Advertencia limpiando archivo antiguo en disco:', err);
  }
};

// AUTO-MIGRACIÓN PARA GUARDAR BASE64 EN BD (LONGTEXT) Y CAMPOS DE REFERENCIA/BANCO
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS facturas_proveedores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        proveedor VARCHAR(255) NOT NULL,
        numero_factura VARCHAR(100) NOT NULL,
        fecha_emision DATE NOT NULL,
        fecha_vencimiento DATE NOT NULL,
        monto_total DECIMAL(10,2) NOT NULL,
        monto_abonado DECIMAL(10,2) DEFAULT 0,
        notas TEXT,
        estado VARCHAR(50) DEFAULT 'PENDIENTE',
        tipo_compra ENUM('CONTADO', 'CREDITO') DEFAULT 'CREDITO',
        metodo_pago VARCHAR(50) DEFAULT NULL,
        banco VARCHAR(120) DEFAULT NULL,
        referencia_pago VARCHAR(255) DEFAULT NULL,
        factura_url LONGTEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS abonos_proveedores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_factura INT NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodo_pago VARCHAR(50) NOT NULL,
        banco VARCHAR(120) DEFAULT NULL,
        referencia VARCHAR(255),
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        comprobante_url LONGTEXT DEFAULT NULL,
        FOREIGN KEY(id_factura) REFERENCES facturas_proveedores(id) ON DELETE CASCADE
      )
    `);

    try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN tipo_compra ENUM('CONTADO', 'CREDITO') DEFAULT 'CREDITO'"); } catch (e) {}
    try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN metodo_pago VARCHAR(50) DEFAULT NULL"); } catch (e) {}
    try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN banco VARCHAR(120) DEFAULT NULL"); } catch (e) {}
    try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN referencia_pago VARCHAR(255) DEFAULT NULL"); } catch (e) {}
    try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN factura_url LONGTEXT DEFAULT NULL"); } catch (e) {}
    try { await db.query("ALTER TABLE abonos_proveedores ADD COLUMN banco VARCHAR(120) DEFAULT NULL"); } catch (e) {}
    try { await db.query("ALTER TABLE abonos_proveedores ADD COLUMN comprobante_url LONGTEXT DEFAULT NULL"); } catch (e) {}

    // Asegurar que las columnas sean LONGTEXT para almacenar Base64 sin límite de 64KB
    try { await db.query("ALTER TABLE facturas_proveedores MODIFY COLUMN factura_url LONGTEXT DEFAULT NULL"); } catch (e) {}
    try { await db.query("ALTER TABLE abonos_proveedores MODIFY COLUMN comprobante_url LONGTEXT DEFAULT NULL"); } catch (e) {}
  } catch (error) {
    console.error('Error migrando facturas_proveedores/abonos_proveedores a LONGTEXT:', error);
  }
})();

// Obtener todas las facturas incluyendo su último comprobante de pago y referencia
exports.getInvoices = async (req, res) => {
  try {
    const { startDate, endDate, proveedor } = req.query;
    let query = `
      SELECT 
        fp.*,
        (SELECT ap.comprobante_url FROM abonos_proveedores ap WHERE ap.id_factura = fp.id AND ap.comprobante_url IS NOT NULL ORDER BY ap.id DESC LIMIT 1) AS ultimo_comprobante_url,
        (SELECT ap.referencia FROM abonos_proveedores ap WHERE ap.id_factura = fp.id ORDER BY ap.id DESC LIMIT 1) AS ultima_referencia,
        (SELECT ap.metodo_pago FROM abonos_proveedores ap WHERE ap.id_factura = fp.id ORDER BY ap.id DESC LIMIT 1) AS ultimo_metodo_pago,
        (SELECT ap.banco FROM abonos_proveedores ap WHERE ap.id_factura = fp.id ORDER BY ap.id DESC LIMIT 1) AS ultimo_banco,
        (SELECT COUNT(*) FROM abonos_proveedores ap WHERE ap.id_factura = fp.id) AS total_abonos_count
      FROM facturas_proveedores fp
      WHERE 1=1
    `;
    const queryParams = [];

    if (startDate && endDate) {
      query += ' AND fp.fecha_emision BETWEEN ? AND ?';
      queryParams.push(startDate, endDate);
    }

    if (proveedor && proveedor !== '') {
      query += ' AND fp.proveedor = ?';
      queryParams.push(proveedor);
    }

    query += ' ORDER BY fp.created_at DESC';

    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener facturas' });
  }
};

// Crear nueva factura (con digitalización obligatoria)
exports.createInvoice = async (req, res) => {
  const {
    proveedor,
    numero_factura,
    fecha_emision,
    fecha_vencimiento,
    monto_total,
    notas,
    tipo_compra,
    metodo_pago,
    banco,
    referencia,
    comprobante_base64,
    factura_base64,
    usar_misma_factura_comprobante
  } = req.body;

  try {
    // 1. Validar que la factura física haya sido digitalizada obligatoriamente
    if (!factura_base64 || String(factura_base64).trim().length < 30) {
      return res.status(400).json({
        message: '📸 Digitalización Obligatoria: Debes subir la foto o PDF de la factura del proveedor antes de guardarla.'
      });
    }

    const isContado = tipo_compra === 'CONTADO';
    const estado = isContado ? 'PAGADA' : 'PENDIENTE';
    const monto_abonado = isContado ? monto_total : 0;
    const finalVencimiento = isContado && !fecha_vencimiento ? fecha_emision : (fecha_vencimiento || fecha_emision);
    const finalMetodoPago = isContado ? (metodo_pago || 'EFECTIVO') : (metodo_pago || null);
    const finalBanco = isContado ? (banco || null) : null;
    const cleanRef = referencia ? String(referencia).trim() : '';

    // 2. Si es DE CONTADO, validar comprobante de pago y referencia según método
    let finalComprobanteContado = comprobante_base64 || null;
    if (isContado) {
      if (!finalComprobanteContado && usar_misma_factura_comprobante) {
        finalComprobanteContado = factura_base64;
      }
      if (!finalComprobanteContado) {
        return res.status(400).json({
          message: '🧾 Comprobante Obligatorio: Al registrar una factura De Contado debes digitalizar el comprobante de pago (o marcar que la factura escaneada ya incluye sello de cancelado).'
        });
      }
      if (['TRANSFERENCIA', 'TARJETA', 'CHEQUE', 'DEPOSITO'].includes(String(finalMetodoPago).toUpperCase()) && !cleanRef) {
        return res.status(400).json({
          message: `🔢 Referencia Obligatoria: Para pagos de contado por ${finalMetodoPago} debes ingresar el número de referencia, voucher o cheque.`
        });
      }
    }

    const fullRef = finalBanco && cleanRef ? `${finalBanco} · Ref: ${cleanRef}` : (cleanRef || (isContado ? 'Pago de Contado' : null));

    const [result] = await db.query(
      `INSERT INTO facturas_proveedores 
        (proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas, estado, tipo_compra, metodo_pago, banco, referencia_pago, monto_abonado, factura_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        proveedor,
        numero_factura,
        fecha_emision,
        finalVencimiento,
        monto_total,
        notas,
        estado,
        tipo_compra || 'CREDITO',
        finalMetodoPago,
        finalBanco,
        fullRef,
        monto_abonado,
        factura_base64
      ]
    );

    const newInvoiceId = result.insertId;

    if (isContado) {
      await db.query(
        `INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, banco, referencia, comprobante_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [newInvoiceId, monto_total, finalMetodoPago, finalBanco, fullRef, finalComprobanteContado]
      );
    }

    res.status(201).json({
      id: newInvoiceId,
      factura_url: factura_base64,
      message: 'Factura registrada y digitalizada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear factura:', error);
    res.status(500).json({ message: 'Error al crear factura: ' + error.message });
  }
};

// Editar factura completa
exports.updateInvoice = async (req, res) => {
  const { id } = req.params;
  const {
    proveedor,
    numero_factura,
    fecha_emision,
    fecha_vencimiento,
    monto_total,
    notas,
    tipo_compra,
    metodo_pago,
    banco,
    referencia,
    factura_base64
  } = req.body;

  try {
    const [invoices] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id]);
    if (invoices.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });

    const inv = invoices[0];
    let facturaUrl = inv.factura_url;

    if (factura_base64) {
      cleanLegacyDiskFile(inv.factura_url);
      facturaUrl = factura_base64;
    }

    if (!facturaUrl) {
      return res.status(400).json({
        message: '📸 Digitalización Obligatoria: Esta factura aún no tiene foto/PDF digitalizado. Por favor adjunta la factura escaneada.'
      });
    }

    const totalNum = Number(monto_total !== undefined ? monto_total : inv.monto_total);
    const tipoCompraFinal = tipo_compra ?? inv.tipo_compra;
    const metodoPagoFinal = metodo_pago !== undefined ? metodo_pago : inv.metodo_pago;
    const bancoFinal = banco !== undefined ? banco : inv.banco;
    const refFinal = referencia !== undefined ? referencia : inv.referencia_pago;

    let abonadoNum = Number(inv.monto_abonado || 0);
    if (tipoCompraFinal === 'CONTADO' && abonadoNum < totalNum) {
      abonadoNum = totalNum;
    }

    const nuevoEstado =
      abonadoNum >= totalNum
        ? 'PAGADA'
        : inv.estado === 'PAGADA' && abonadoNum < totalNum
        ? 'PENDIENTE'
        : inv.estado;

    await db.query(
      `UPDATE facturas_proveedores SET 
        proveedor = ?, 
        numero_factura = ?, 
        fecha_emision = ?, 
        fecha_vencimiento = ?, 
        monto_total = ?, 
        notas = ?, 
        tipo_compra = ?, 
        metodo_pago = ?,
        banco = ?,
        referencia_pago = ?,
        monto_abonado = ?,
        factura_url = ?, 
        estado = ? 
      WHERE id = ?`,
      [
        proveedor ?? inv.proveedor,
        numero_factura ?? inv.numero_factura,
        fecha_emision ?? inv.fecha_emision,
        fecha_vencimiento ?? inv.fecha_vencimiento,
        totalNum,
        notas !== undefined ? notas : inv.notas,
        tipoCompraFinal,
        metodoPagoFinal,
        bancoFinal,
        refFinal,
        abonadoNum,
        facturaUrl,
        nuevoEstado,
        id
      ]
    );

    if (metodoPagoFinal) {
      try {
        await db.query(
          'UPDATE abonos_proveedores SET metodo_pago = ?, banco = COALESCE(?, banco), referencia = COALESCE(?, referencia) WHERE id_factura = ? ORDER BY id ASC LIMIT 1',
          [metodoPagoFinal, bancoFinal || null, refFinal || null, id]
        );
      } catch (err) {
        console.warn('Error actualizando abono relacionado:', err);
      }
    }

    res.json({
      message: 'Factura actualizada exitosamente',
      id,
      factura_url: facturaUrl,
      estado: nuevoEstado
    });
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    res.status(500).json({ message: 'Error al actualizar factura' });
  }
};

// Registrar abono o cancelación de factura (con comprobante y referencia obligatorios)
exports.registerPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method, banco, reference, comprobante_base64 } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Monto inválido' });
  }

  // 1. Validar que el comprobante de pago haya sido digitalizado obligatoriamente
  if (!comprobante_base64 || String(comprobante_base64).trim().length < 30) {
    return res.status(400).json({
      message: '🧾 Comprobante Obligatorio: Debes digitalizar (subir foto o PDF) el comprobante o voucher de pago para abonar o cancelar la factura.'
    });
  }

  const cleanMethod = String(method || 'EFECTIVO').toUpperCase();
  const cleanRef = reference ? String(reference).trim() : '';
  const cleanBanco = banco ? String(banco).trim() : '';

  if (['TRANSFERENCIA', 'TARJETA', 'CHEQUE', 'DEPOSITO'].includes(cleanMethod) && !cleanRef) {
    return res.status(400).json({
      message: `🔢 Referencia Obligatoria: Para pagos con ${cleanMethod} debes ingresar el número de referencia bancaria, voucher o cheque.`
    });
  }

  try {
    const [invoices] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id]);
    if (invoices.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });

    const invoice = invoices[0];
    const nuevoAbonado = Number(invoice.monto_abonado) + Number(amount);

    let nuevoEstado = invoice.estado;
    if (nuevoAbonado >= Number(invoice.monto_total) - 0.05) {
      nuevoEstado = 'PAGADA';
    }

    const fullRef = cleanBanco && cleanRef ? `${cleanBanco} · Ref: ${cleanRef}` : (cleanRef || `Pago en ${cleanMethod}`);

    await db.query(
      'UPDATE facturas_proveedores SET monto_abonado = ?, estado = ?, metodo_pago = COALESCE(?, metodo_pago), banco = COALESCE(?, banco), referencia_pago = COALESCE(?, referencia_pago) WHERE id = ?',
      [nuevoAbonado, nuevoEstado, cleanMethod, cleanBanco || null, fullRef, id]
    );

    await db.query(
      `INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, banco, referencia, comprobante_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, amount, cleanMethod, cleanBanco || null, fullRef, comprobante_base64]
    );

    res.json({ message: 'Pago y comprobante registrados correctamente', nuevoAbonado, nuevoEstado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar pago' });
  }
};

// Editar abono individual
exports.updatePayment = async (req, res) => {
  const { abonoId } = req.params;
  const { amount, method, banco, reference, comprobante_base64 } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Monto inválido' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM abonos_proveedores WHERE id = ?', [abonoId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Abono no encontrado' });

    const abono = rows[0];
    const { id_factura, monto: oldMonto, comprobante_url: oldUrl } = abono;

    const [invRows] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id_factura]);
    if (invRows.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });

    const inv = invRows[0];
    const diff = Number(amount) - Number(oldMonto);
    const nuevoAbonado = Number(inv.monto_abonado) + diff;
    const nuevoEstado = nuevoAbonado >= Number(inv.monto_total) - 0.05 ? 'PAGADA' : 'PENDIENTE';

    let comprobanteUrl = oldUrl;
    if (comprobante_base64) {
      cleanLegacyDiskFile(oldUrl);
      comprobanteUrl = comprobante_base64;
    }

    if (!comprobanteUrl) {
      return res.status(400).json({
        message: '🧾 Comprobante Obligatorio: Todo pago o abono debe contar con su comprobante digitalizado.'
      });
    }

    const cleanMethod = String(method || abono.metodo_pago || 'EFECTIVO').toUpperCase();
    const cleanRef = reference !== undefined ? String(reference).trim() : (abono.referencia || '');
    const cleanBanco = banco !== undefined ? String(banco).trim() : (abono.banco || '');

    if (['TRANSFERENCIA', 'TARJETA', 'CHEQUE', 'DEPOSITO'].includes(cleanMethod) && !cleanRef) {
      return res.status(400).json({
        message: `🔢 Referencia Obligatoria: Para pagos con ${cleanMethod} debes especificar el número de referencia o voucher.`
      });
    }

    await db.query(
      'UPDATE facturas_proveedores SET monto_abonado = ?, estado = ? WHERE id = ?',
      [nuevoAbonado, nuevoEstado, id_factura]
    );

    await db.query(
      'UPDATE abonos_proveedores SET monto = ?, metodo_pago = ?, banco = ?, referencia = ?, comprobante_url = ? WHERE id = ?',
      [amount, cleanMethod, cleanBanco || null, cleanRef || 'Abono Editado', comprobanteUrl, abonoId]
    );

    res.json({ message: 'Abono actualizado correctamente', nuevoAbonado, nuevoEstado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar abono' });
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
    const [abonos] = await db.query('SELECT * FROM abonos_proveedores WHERE id_factura = ?', [id]);
    for (const abono of abonos) {
      cleanLegacyDiskFile(abono.comprobante_url);
    }

    const [invoices] = await db.query('SELECT factura_url FROM facturas_proveedores WHERE id = ?', [id]);
    if (invoices.length > 0) {
      cleanLegacyDiskFile(invoices[0].factura_url);
    }

    await db.query('DELETE FROM facturas_proveedores WHERE id = ?', [id]);
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar factura' });
  }
};

// Eliminar un abono específico
exports.deletePayment = async (req, res) => {
  const { abonoId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM abonos_proveedores WHERE id = ?', [abonoId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Abono no encontrado' });

    const abono = rows[0];
    const { id_factura, monto, comprobante_url } = abono;

    cleanLegacyDiskFile(comprobante_url);
    await db.query('DELETE FROM abonos_proveedores WHERE id = ?', [abonoId]);

    const [invRows] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id_factura]);
    if (invRows.length > 0) {
      const inv = invRows[0];
      const nuevoAbonado = Math.max(0, Number(inv.monto_abonado) - Number(monto));
      const nuevoEstado = nuevoAbonado >= Number(inv.monto_total) - 0.05 ? 'PAGADA' : (inv.estado === 'PAGADA' ? 'PENDIENTE' : inv.estado);
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
