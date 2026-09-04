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

// AUTO-MIGRACIÓN PARA GUARDAR BASE64 EN BD (LONGTEXT)
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
                referencia VARCHAR(255),
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                comprobante_url LONGTEXT DEFAULT NULL,
                FOREIGN KEY(id_factura) REFERENCES facturas_proveedores(id) ON DELETE CASCADE
            )
        `);

        try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN tipo_compra ENUM('CONTADO', 'CREDITO') DEFAULT 'CREDITO'"); } catch (e) {}
        try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN metodo_pago VARCHAR(50) DEFAULT NULL"); } catch (e) {}
        try { await db.query("ALTER TABLE facturas_proveedores ADD COLUMN factura_url LONGTEXT DEFAULT NULL"); } catch (e) {}
        try { await db.query("ALTER TABLE abonos_proveedores ADD COLUMN comprobante_url LONGTEXT DEFAULT NULL"); } catch (e) {}

        // Asegurar que las columnas sean LONGTEXT para almacenar Base64 sin límite de 64KB
        try { await db.query("ALTER TABLE facturas_proveedores MODIFY COLUMN factura_url LONGTEXT DEFAULT NULL"); } catch (e) {}
        try { await db.query("ALTER TABLE abonos_proveedores MODIFY COLUMN comprobante_url LONGTEXT DEFAULT NULL"); } catch (e) {}
    } catch (error) {
        console.error('Error migrando facturas_proveedores/abonos_proveedores a LONGTEXT:', error);
    }
})();

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
    monto_total, notas, tipo_compra, metodo_pago, referencia,
    comprobante_base64, comprobante_name,
    factura_base64, factura_name
  } = req.body;

  try {
    const isContado = tipo_compra === 'CONTADO';
    const estado = isContado ? 'PAGADA' : 'PENDIENTE';
    const monto_abonado = isContado ? monto_total : 0;
    const finalVencimiento = (isContado && !fecha_vencimiento) ? fecha_emision : (fecha_vencimiento || fecha_emision);
    const finalMetodoPago = isContado ? (metodo_pago || 'EFECTIVO') : (metodo_pago || null);
    
    // Guardar directamente Base64 en la base de datos MySQL (LONGTEXT)
    const facturaUrl = factura_base64 || null;

    const [result] = await db.query(
      `INSERT INTO facturas_proveedores 
      (proveedor, numero_factura, fecha_emision, fecha_vencimiento, monto_total, notas, estado, tipo_compra, metodo_pago, monto_abonado, factura_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [proveedor, numero_factura, fecha_emision, finalVencimiento, monto_total, notas, estado, tipo_compra || 'CREDITO', finalMetodoPago, monto_abonado, facturaUrl]
    );

    const newInvoiceId = result.insertId;

    if (isContado) {
      const comprobanteUrl = comprobante_base64 || null;
      await db.query(
        `INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, referencia, comprobante_url) VALUES (?, ?, ?, ?, ?)`,
        [newInvoiceId, monto_total, finalMetodoPago, referencia || 'Pago de Contado', comprobanteUrl]
      );
    }

    res.status(201).json({ id: newInvoiceId, factura_url: facturaUrl, message: 'Factura creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear factura' });
  }
};

// Editar factura completa
exports.updateInvoice = async (req, res) => {
  const { id } = req.params;
  const {
    proveedor, numero_factura, fecha_emision, fecha_vencimiento,
    monto_total, notas, tipo_compra, metodo_pago,
    factura_base64, factura_name
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

    const totalNum = Number(monto_total !== undefined ? monto_total : inv.monto_total);
    const tipoCompraFinal = tipo_compra ?? inv.tipo_compra;
    const metodoPagoFinal = metodo_pago !== undefined ? metodo_pago : inv.metodo_pago;

    let abonadoNum = Number(inv.monto_abonado || 0);
    if (tipoCompraFinal === 'CONTADO' && abonadoNum < totalNum) {
      abonadoNum = totalNum;
    }

    const nuevoEstado = abonadoNum >= totalNum ? 'PAGADA' : (inv.estado === 'PAGADA' && abonadoNum < totalNum ? 'PENDIENTE' : inv.estado);

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
        abonadoNum,
        facturaUrl,
        nuevoEstado,
        id
      ]
    );

    if (metodoPagoFinal) {
      try {
        await db.query(
          'UPDATE abonos_proveedores SET metodo_pago = ? WHERE id_factura = ? ORDER BY id ASC LIMIT 1',
          [metodoPagoFinal, id]
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

// Registrar abono
exports.registerPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method, reference, comprobante_base64, comprobante_name } = req.body;

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

    // 4. Registrar Abono en Historial (Base64 guardado en MySQL)
    const comprobanteUrl = comprobante_base64 || null;
    await db.query(
      `INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, referencia, comprobante_url) VALUES (?, ?, ?, ?, ?)`,
      [id, amount, method || 'EFECTIVO', reference || 'Abono', comprobanteUrl]
    );

    res.json({ message: 'Abono registrado', nuevoAbonado, nuevoEstado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar pago' });
  }
};

// Editar abono individual
exports.updatePayment = async (req, res) => {
  const { abonoId } = req.params;
  const { amount, method, reference, comprobante_base64, comprobante_name } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Monto inválido' });
  }

  try {
    // 1. Obtener el abono para saber cuánto revertir/actualizar
    const [rows] = await db.query('SELECT * FROM abonos_proveedores WHERE id = ?', [abonoId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Abono no encontrado' });

    const abono = rows[0];
    const { id_factura, monto: oldMonto, comprobante_url: oldUrl } = abono;

    // 2. Calcular la diferencia y actualizar la factura
    const [invRows] = await db.query('SELECT * FROM facturas_proveedores WHERE id = ?', [id_factura]);
    if (invRows.length === 0) return res.status(404).json({ message: 'Factura no encontrada' });

    const inv = invRows[0];
    const diff = Number(amount) - Number(oldMonto);
    const nuevoAbonado = Number(inv.monto_abonado) + diff;
    const nuevoEstado = nuevoAbonado >= Number(inv.monto_total) ? 'PAGADA' : 'PENDIENTE';

    await db.query(
      'UPDATE facturas_proveedores SET monto_abonado = ?, estado = ? WHERE id = ?',
      [nuevoAbonado, nuevoEstado, id_factura]
    );

    // 3. Procesar comprobante Base64 en MySQL
    let comprobanteUrl = oldUrl;
    if (comprobante_base64) {
      cleanLegacyDiskFile(oldUrl);
      comprobanteUrl = comprobante_base64;
    }

    // 4. Actualizar el abono
    await db.query(
      'UPDATE abonos_proveedores SET monto = ?, metodo_pago = ?, referencia = ?, comprobante_url = ? WHERE id = ?',
      [amount, method || 'EFECTIVO', reference || 'Abono Editado', comprobanteUrl, abonoId]
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
    // Limpieza de archivos antiguos de disco si existían
    const [abonos] = await db.query('SELECT * FROM abonos_proveedores WHERE id_factura = ?', [id]);
    for (const abono of abonos) {
        cleanLegacyDiskFile(abono.comprobante_url);
    }

    const [invoices] = await db.query('SELECT factura_url FROM facturas_proveedores WHERE id = ?', [id]);
    if (invoices.length > 0) {
        cleanLegacyDiskFile(invoices[0].factura_url);
    }
    
    // Borrado en cascada en BD
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
    const { id_factura, monto, comprobante_url } = abono;

    // 2. Limpieza de archivo antiguo de disco si existía
    cleanLegacyDiskFile(comprobante_url);

    // 3. Eliminar el abono
    await db.query('DELETE FROM abonos_proveedores WHERE id = ?', [abonoId]);

    // 4. Revertir el monto en la factura
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