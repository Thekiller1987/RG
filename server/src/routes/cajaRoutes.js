// CommonJS
const express = require('express');
const pool = require('../config/db'); // MySQL Pool
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Aplicar autenticación a TODAS las rutas de caja
router.use(verifyToken);

/* ───────── Utils ───────── */
function displayName(u) {
  if (!u) return '—';
  if (typeof u === 'string') return u;
  return (
    u.name ||
    u.nombre ||
    u.fullName ||
    u.displayName ||
    u.nombre_usuario ||
    u.username ||
    (u.user && (u.user.name || u.user.username || u.user.displayName)) ||
    (u.id ? `Usuario ${u.id}` : '—')
  );
}

function normalizeUser(u, fallbackId) {
  const base = (u && typeof u === 'object') ? { ...u } : {};
  const id = String(base.id ?? fallbackId ?? '').trim();
  const name =
    base.name ??
    base.nombre ??
    base.fullName ??
    base.displayName ??
    base.nombre_usuario ??
    base.username ??
    (id ? `Usuario ${id}` : undefined);

  return {
    ...base,
    ...(id ? { id } : {}),
    ...(name ? { name } : {}),
  };
}

function localDayKey(isoOrDate) {
  if (!isoOrDate) return null;
  const d = (isoOrDate instanceof Date) ? isoOrDate : new Date(isoOrDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// ───────── PREVENCIÓN DE ERRORES: AUTOCORRECCIÓN DE BASE DE DATOS ─────────
async function ensureSchema() {
  try {
    // 1. Crear tabla cierres_caja si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cierres_caja (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha_apertura DATETIME NOT NULL,
        fecha_cierre DATETIME NULL DEFAULT NULL,
        usuario_id INT NOT NULL,
        usuario_nombre VARCHAR(255) DEFAULT '',
        monto_inicial DECIMAL(12,2) DEFAULT 0,
        final_esperado DECIMAL(12,2) DEFAULT 0,
        final_real DECIMAL(12,2) DEFAULT 0,
        diferencia DECIMAL(12,2) DEFAULT 0,
        total_ventas_efectivo DECIMAL(12,2) DEFAULT 0,
        total_ventas_tarjeta DECIMAL(12,2) DEFAULT 0,
        total_ventas_transferencia DECIMAL(12,2) DEFAULT 0,
        total_ventas_credito DECIMAL(12,2) DEFAULT 0,
        total_dolares DECIMAL(12,2) DEFAULT 0,
        total_entradas DECIMAL(12,2) DEFAULT 0,
        total_salidas DECIMAL(12,2) DEFAULT 0,
        observaciones TEXT,
        detalles_json JSON,
        INDEX idx_usuario (usuario_id),
        INDEX idx_fecha_apertura (fecha_apertura),
        INDEX idx_fecha_cierre (fecha_cierre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 1b. Agregar columna total_dolares si no existe (migración)
    try {
      await pool.query(`ALTER TABLE cierres_caja ADD COLUMN total_dolares DECIMAL(12,2) DEFAULT 0 AFTER total_ventas_credito;`);
    } catch (e) {
      // Ignoramos si ya existe
    }

    // 2. Crear tabla de carritos si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS active_carts (
        user_id INT PRIMARY KEY,
        carts_json JSON,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 3. Corregir tabla cierres_caja para permitir NULL en fecha_cierre
    try {
      await pool.query(`ALTER TABLE cierres_caja MODIFY COLUMN fecha_cierre DATETIME NULL DEFAULT NULL;`);
    } catch (e) {
      // Ignoramos error si ya es NULL
    }

    // 4. Agregar columnas cerrado_por_id y cerrado_por_nombre si no existen
    try {
      await pool.query(`ALTER TABLE cierres_caja ADD COLUMN cerrado_por_id INT NULL DEFAULT NULL AFTER usuario_nombre;`);
    } catch (e) { /* ya existe */ }
    try {
      await pool.query(`ALTER TABLE cierres_caja ADD COLUMN cerrado_por_nombre VARCHAR(255) DEFAULT '' AFTER cerrado_por_id;`);
    } catch (e) { /* ya existe */ }

    // 5. LIMPIEZA CRÍTICA: Convertir fechas "zero" (0000-00-00) a NULL para evitar error 500 en Node.js
    try {
      console.log('--- Iniciando limpieza de fechas en cierres_caja ---');
      const [cleanResult] = await pool.query(`
        UPDATE cierres_caja 
        SET fecha_cierre = NULL 
        WHERE CAST(fecha_cierre AS CHAR) = '0000-00-00 00:00:00' 
           OR fecha_cierre < '1970-01-01';
      `);
      console.log(`✅ Base de datos saneada: ${cleanResult.affectedRows} fechas corregidas.`);
    } catch (e) {
      console.warn('⚠️ No se pudo ejecutar la limpieza automática:', e.message);
    }

    console.log('✅ Esquema de caja verificado/creado correctamente.');
  } catch (error) {
    console.error('❌ Error fatal verificando esquema DB:', error);
  }
}

// Ejecutar corrección al cargar el archivo
ensureSchema();

// ───────── Helper: Calcular totales de sesión desde transacciones (★ BLINDADO) ─────────
function calcularTotalesSesion(transactions, details) {
  // Helper anti-NaN
  const safe = (v) => { const n = Number(v); return (isNaN(n) || !isFinite(n)) ? 0 : n; };

  let totalEfectivo = 0, totalTarjeta = 0, totalTransferencia = 0, totalCredito = 0;
  let totalDolares = 0, totalIngresos = 0, totalGastos = 0;
  let movimientoNetoEfectivo = 0;
  let ventasAjuste = 0; // God Mode: ajuste de ventas totales

  const tasaDefault = safe(details?.tasaDolar) || 36.60;

  (transactions || []).forEach(tx => {
    let tipo = (tx.type || '').toLowerCase().trim();
    tipo = tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let d = tx.pagoDetalles || {};
    if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = {}; } }
    if (!d || typeof d !== 'object') d = {};

    const txEfectivo = safe(d.efectivo);
    const txTarjeta = safe(d.tarjeta);
    const txTransf = safe(d.transferencia);
    const txCredito = safe(d.credito);
    const txDolares = safe(d.dolares);
    const txCambio = safe(d.cambio);
    const txIngresoCaja = safe(d.ingresoCaja);
    const txAmount = safe(tx.amount);
    const txTotalVenta = safe(d.totalVenta) || txAmount;
    const txTasa = safe(d.tasaDolarAlMomento) || tasaDefault;

    // VENTAS
    if (tipo.startsWith('venta')) {
      totalEfectivo += txEfectivo;
      totalTarjeta += txTarjeta;
      totalTransferencia += txTransf;
      totalCredito += txCredito;
      totalDolares += txDolares;

      // Movimiento neto efectivo (3 tiers de fallback)
      const cashIn = txEfectivo + (txDolares * txTasa);
      const cashOut = txCambio;
      const calculatedNet = cashIn - cashOut;

      if (Math.abs(calculatedNet) > 0.001) {
        // TIER 1: Campos desglosados (efectivo/dólares/cambio)
        movimientoNetoEfectivo += calculatedNet;
      } else if (Math.abs(txIngresoCaja) > 0.001) {
        // TIER 2: ingresoCaja ya calculado
        movimientoNetoEfectivo += txIngresoCaja;
      } else {
        // TIER 3: Residual (totalVenta - no-efectivo)
        const noEfectivo = txTarjeta + txTransf + txCredito;
        const residual = txTotalVenta - noEfectivo;
        // Solo sumamos el residual si es mayor a 0 para evitar ruidos
        if (residual > 0.001) {
          movimientoNetoEfectivo += residual;
        }
      }
    }
    // ABONOS Y LIQUIDACIONES
    else if (tipo.includes('abono') || tipo.includes('liquid') || tipo.includes('pedido') || tipo.includes('apartado')) {
      const netAbonoCash = (txEfectivo + (txDolares * txTasa)) - txCambio;

      if (Math.abs(netAbonoCash) > 0.001) {
        totalEfectivo += netAbonoCash;
        movimientoNetoEfectivo += netAbonoCash;
      } else if (Math.abs(txIngresoCaja) > 0.001) {
        totalEfectivo += txIngresoCaja;
        movimientoNetoEfectivo += txIngresoCaja;
      } else {
        const noEfectivo = txTarjeta + txTransf;
        const residual = Math.max(0, txAmount - noEfectivo);
        totalEfectivo += residual;
        movimientoNetoEfectivo += residual;
      }

      if (txTarjeta > 0.001) totalTarjeta += txTarjeta;
      if (txTransf > 0.001) totalTransferencia += txTransf;
      if (txDolares > 0.001) totalDolares += txDolares;
    }
    // ENTRADAS
    else if (tipo === 'entrada') {
      const m = Math.abs(txAmount);
      totalIngresos += m;
      movimientoNetoEfectivo += m;
    }
    // SALIDAS
    else if (tipo === 'salida') {
      const m = Math.abs(txAmount);
      totalGastos += m;
      movimientoNetoEfectivo -= m;
    }
    // DEVOLUCIONES / CANCELACIONES
    else if (tipo.includes('devolucion') || tipo.includes('cancelacion') || tipo.includes('anulacion')) {
      totalEfectivo -= txEfectivo;
      totalTarjeta -= txTarjeta;
      totalTransferencia -= txTransf;
      totalCredito -= txCredito;
      totalDolares -= txDolares;

      if (d.ingresoCaja !== undefined && d.ingresoCaja !== null) {
        movimientoNetoEfectivo += safe(d.ingresoCaja); // Será negativo
      } else if (txEfectivo > 0.001) {
        movimientoNetoEfectivo -= txEfectivo;
      } else {
        const noEfectivo = txTarjeta + txTransf + txCredito;
        const cashPart = Math.abs(txAmount) - noEfectivo;
        if (cashPart > 0.001) {
          movimientoNetoEfectivo -= cashPart;
        }
      }
    }
    // AJUSTES SECRETOS
    else if (tipo === 'ajuste') {
      const monto = txAmount;
      if (d.target === 'efectivo') {
        movimientoNetoEfectivo += monto;
        // USER REQUEST: Si el ajuste al efectivo es negativo (un faltante o reintegro), 
        // debe restar de las Ventas Totales para que la contabilidad del dia baje junto con el cash.
        if (monto < 0) {
          ventasAjuste += monto;
        }
      }
      else if (d.target === 'credito') totalCredito += monto;
      else if (d.target === 'tarjeta') totalTarjeta += monto;
      else if (d.target === 'transferencia') totalTransferencia += monto;
      else if (d.target === 'dolares') totalDolares += monto;
      else if (d.target === 'ventas_totales') ventasAjuste += monto;
    }
  });

  // ★ BLINDAJE FINAL: Mapeo exacto para el Frontend
  const cajaInicial = safe(details?.initialAmount || 0);
  const efectivoEsperadoCordobas = cajaInicial + movimientoNetoEfectivo;
  const efectivoEsperado = efectivoEsperadoCordobas + (totalDolares * tasaDefault);

  return {
    cajaInicial,
    netCordobas: safe(movimientoNetoEfectivo),
    netDolares: safe(totalDolares),
    efectivoEsperado: safe(efectivoEsperado),
    efectivoEsperadoCordobas: safe(efectivoEsperadoCordobas),
    efectivoEsperadoDolares: safe(totalDolares),
    totalVentasDia: safe(totalEfectivo + totalTarjeta + totalTransferencia + totalCredito + ventasAjuste), // Incluye ajuste God Mode
    totalTarjeta: safe(totalTarjeta),
    totalTransferencia: safe(totalTransferencia),
    totalCredito: safe(totalCredito),
    totalNoEfectivo: safe(totalTarjeta + totalTransferencia + totalCredito),
    sumDevolucionesCancelaciones: 0,
    totalHidden: 0,
    tasaRef: tasaDefault,
    // Métricas originales del servidor para debug
    totalEfectivo: safe(totalEfectivo),
    totalIngresos: safe(totalIngresos),
    totalGastos: safe(totalGastos),
    movimientoNetoEfectivo: safe(movimientoNetoEfectivo)
  };
}

// ───────── Sesiones de Caja (SQL ONLY) ─────────

// Helper: Reconstruir objeto de sesión desde fila SQL
function mapRowToSession(row) {
  if (!row) return null;
  let details = {};
  try {
    details = (typeof row.detalles_json === 'string')
      ? JSON.parse(row.detalles_json)
      : (row.detalles_json || { transactions: [] });
  } catch (e) {
    details = { transactions: [] };
  }

  // closedBy: usar datos reales del cierre si existen, sino fallback al abridor
  const closedById = row.cerrado_por_id || row.usuario_id;
  const closedByName = row.cerrado_por_nombre || row.usuario_nombre;

  return {
    id: row.id, // ID numérico de SQL
    sqlId: row.id,
    openedAt: row.fecha_apertura,
    openedBy: { id: row.usuario_id, name: row.usuario_nombre },
    initialAmount: Number(row.monto_inicial || 0),
    transactions: details.transactions || [],
    closedAt: row.fecha_cierre, // Será null si está abierta
    closedBy: row.fecha_cierre ? { id: closedById, name: closedByName } : null,
    countedAmount: row.final_real ? Number(row.final_real) : null,
    difference: row.diferencia ? Number(row.diferencia) : null,
    tasaDolar: Number(details.tasaDolar || 0),
    totalDolares: Number(row.total_dolares || 0),
    notes: row.observaciones || '',

    // Stats pre-calculadas para evitar lógica en el cliente
    stats: calcularTotalesSesion(details.transactions || [], { ...details, initialAmount: row.monto_inicial }),

    // Campos oficiales de SQL para sincronización perfecta
    sqlTotals: {
      efectivo: Number(row.total_ventas_efectivo || 0),
      tarjeta: Number(row.total_ventas_tarjeta || 0),
      transferencia: Number(row.total_ventas_transferencia || 0),
      credito: Number(row.total_ventas_credito || 0),
      dolares: Number(row.total_dolares || 0),
      entradas: Number(row.total_entradas || 0),
      salidas: Number(row.total_salidas || 0),
      esperado: Number(row.final_esperado || 0)
    }
  };
}

// GET /api/caja/session?userId=123
router.get('/session', async (req, res) => {
  const userId = String(req.query.userId || '').trim();
  if (!userId) return res.status(400).json({ message: 'Falta userId' });

  try {
    // 1. Buscar sesión ABIERTA en SQL
    const [openRows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND (fecha_cierre IS NULL OR fecha_cierre < '2000-01-01')
      ORDER BY fecha_apertura DESC LIMIT 1
    `, [userId]);

    if (openRows.length > 0) {
      return res.json(mapRowToSession(openRows[0]));
    }

    // 2. Si no hay abierta, buscar la última CERRADA (para UI de "abrir caja")
    const [lastRows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NOT NULL 
      ORDER BY fecha_cierre DESC LIMIT 1
    `, [userId]);

    if (lastRows.length > 0) {
      return res.json(mapRowToSession(lastRows[0]));
    }

    return res.json(null);

  } catch (error) {
    console.error('Error GET /session:', error);
    res.status(500).json({ message: 'Error recuperando sesión: ' + error.message });
  }
});

// POST /api/caja/session/open
router.post('/session/open', async (req, res) => {
  const { userId, openedAt, openedBy, initialAmount = 0, tasaDolar } = req.body || {};
  if (!userId || !openedAt || !openedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, openedAt, openedBy' });
  }

  try {
    // 1. Verificar si ya tiene una abierta (Idempotencia DB)
    const [existing] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (existing.length > 0) {
      return res.json(mapRowToSession(existing[0]));
    }

    // 2. Crear nueva sesión en SQL
    const usuarioNombre = displayName(openedBy);
    const initialJson = JSON.stringify({
      transactions: [],
      session_id_legacy: `caja-${userId}-${Date.now()}`, // Solo referencia
      tasaDolar: Number(tasaDolar || 0)
    });

    const [result] = await pool.query(`
      INSERT INTO cierres_caja (
        fecha_apertura, fecha_cierre, usuario_id, usuario_nombre, 
        monto_inicial, final_esperado, final_real, diferencia,
        total_ventas_efectivo, total_ventas_tarjeta, total_ventas_transferencia, total_ventas_credito,
        total_entradas, total_salidas, detalles_json
      ) VALUES (?, NULL, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?)
    `, [
      new Date(openedAt), userId, usuarioNombre,
      initialAmount, initialJson
    ]);

    // Devolver objeto sesión completo
    const newSession = {
      id: result.insertId,
      openedAt,
      openedBy: { id: userId, name: usuarioNombre },
      initialAmount: Number(initialAmount),
      transactions: [],
      tasaDolar: Number(tasaDolar || 0),
      closedAt: null
    };

    // 3. Emitir evento por socket
    const io = req.app.get('io');
    if (io) {
      io.emit('caja:session_update', { userId, status: 'open', timestamp: openedAt });
    }

    res.status(201).json(newSession);

  } catch (error) {
    console.error('Error POST /session/open:', error);
    // CRITICAL DEBUG: Return the exact SQL error message to the frontend
    res.status(500).json({ message: 'Error SQL: ' + error.message, sqlError: error.code });
  }
});

// POST /api/caja/session/tx
router.post('/session/tx', async (req, res) => {
  const { userId, tx } = req.body || {};
  if (!userId || !tx) return res.status(400).json({ message: 'Faltan userId o tx' });

  try {
    // 1. Obtener sesión abierta
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No hay sesión abierta' });
    }

    const row = rows[0];
    let details = {};
    try {
      details = (typeof row.detalles_json === 'string')
        ? JSON.parse(row.detalles_json)
        : (row.detalles_json || {});
    } catch { details = {}; }

    if (!details.transactions) details.transactions = [];

    // 2. Deduplicación: Si ya existe una transacción con el mismo ID, no agregar de nuevo
    const txId = tx.id || `tx-${Date.now()}`;
    const alreadyExists = details.transactions.some(existing => existing.id && existing.id === txId);
    if (alreadyExists) {
      console.warn(`[addCajaTx] Transacción duplicada ignorada: ${txId}`);
      return res.status(200).json(mapRowToSession({ ...row, detalles_json: details }));
    }

    // 3. Agregar transacción
    details.transactions.push({
      id: txId,
      type: tx.type,
      amount: Number(tx.amount || 0),
      note: tx.note || '',
      at: tx.at || new Date().toISOString(),
      pagoDetalles: tx.pagoDetalles || {}
    });

    // 3. Recalcular totales corridos desde TODAS las transacciones
    const totals = calcularTotalesSesion(details.transactions, details);

    const finalEsperado = Number(row.monto_inicial || 0) + totals.movimientoNetoEfectivo;

    // 4. Guardar JSON + totales actualizados en BD (cada tx actualiza las columnas)
    await pool.query(`
      UPDATE cierres_caja 
      SET detalles_json = ?,
          total_ventas_efectivo = ?,
          total_ventas_tarjeta = ?,
          total_ventas_transferencia = ?,
          total_ventas_credito = ?,
          total_dolares = ?,
          total_entradas = ?,
          total_salidas = ?,
          final_esperado = ?
      WHERE id = ?
    `, [
      JSON.stringify(details),
      totals.totalEfectivo, totals.totalTarjeta, totals.totalTransferencia,
      totals.totalCredito, totals.totalDolares,
      totals.totalIngresos, totals.totalGastos,
      finalEsperado,
      row.id
    ]);

    // 5. Devolver sesión actualizada
    // 6. Emitir evento por socket
    const io = req.app.get('io');
    if (io) {
      io.emit('caja:transaction_new', { userId, tx: { id: txId, type: tx.type, amount: Number(tx.amount || 0) } });
      io.emit('caja:session_update', { userId });
    }

    res.status(201).json(mapRowToSession({ ...row, detalles_json: details }));

  } catch (error) {
    console.error('Error POST /session/tx:', error);
    res.status(500).json({ message: 'Error guardando transacción: ' + error.message });
  }
});

// POST /api/caja/session/dedup — Limpia transacciones duplicadas de la sesión abierta
router.post('/session/dedup', async (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ message: 'Falta userId' });

  try {
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No hay sesión abierta para limpiar' });
    }

    const row = rows[0];
    let details = {};
    try {
      details = (typeof row.detalles_json === 'string')
        ? JSON.parse(row.detalles_json)
        : (row.detalles_json || {});
    } catch { details = {}; }

    const original = details.transactions || [];
    const originalCount = original.length;

    // Deduplicar: mantener solo la primera aparición de cada ID
    const seen = new Set();
    const cleaned = [];

    for (const tx of original) {
      // Dedup solo por ID exacto. El fingerprint causaba problemas con ventas idénticas legítimas.
      if (tx.id && seen.has(tx.id)) continue;
      if (tx.id) seen.add(tx.id);

      cleaned.push(tx);
    }

    details.transactions = cleaned;
    const removedCount = originalCount - cleaned.length;

    // Recalcular totales
    const totals = calcularTotalesSesion(cleaned, details);
    const finalEsperado = Number(row.monto_inicial || 0) + totals.movimientoNetoEfectivo;

    await pool.query(`
      UPDATE cierres_caja 
      SET detalles_json = ?,
          total_ventas_efectivo = ?,
          total_ventas_tarjeta = ?,
          total_ventas_transferencia = ?,
          total_ventas_credito = ?,
          total_dolares = ?,
          total_entradas = ?,
          total_salidas = ?,
          final_esperado = ?
      WHERE id = ?
    `, [
      JSON.stringify(details),
      totals.totalEfectivo, totals.totalTarjeta, totals.totalTransferencia,
      totals.totalCredito, totals.totalDolares,
      totals.totalIngresos, totals.totalGastos,
      finalEsperado,
      row.id
    ]);

    console.log(`[dedup] Sesión ${row.id}: ${originalCount} TX → ${cleaned.length} TX (${removedCount} duplicadas removidas)`);

    res.json({
      success: true,
      message: `Limpieza completada: ${removedCount} transacciones duplicadas removidas de ${originalCount} totales.`,
      originalCount,
      cleanedCount: cleaned.length,
      removedCount,
      session: mapRowToSession({ ...row, detalles_json: details })
    });

  } catch (error) {
    console.error('Error POST /session/dedup:', error);
    res.status(500).json({ message: 'Error limpiando sesión: ' + error.message });
  }
});

// POST /api/caja/session/close
router.post('/session/close', async (req, res) => {
  const { userId, countedAmount = 0, closedAt, closedBy, notes } = req.body || {};
  if (!userId || !closedAt || !closedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, closedAt, closedBy' });
  }

  try {
    // 1. Buscar sesión abierta
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      console.warn(`[Cierre] No se encontró sesión abierta para usuario ${userId}. Buscando recientes...`);
      // check if it was just closed?
      const [lastClosed] = await pool.query(`
        SELECT * FROM cierres_caja 
        WHERE usuario_id = ? AND fecha_cierre IS NOT NULL 
        ORDER BY fecha_cierre DESC LIMIT 1
      `, [userId]);

      if (lastClosed.length > 0) {
        const diff = Date.now() - new Date(lastClosed[0].fecha_cierre).getTime();
        if (diff < 60000) {
          console.log('[Cierre] Sesión ya estaba cerrada hace < 1min. Retornando éxito.');
          return res.json({ success: true, message: 'Sesión ya cerrada (Idempotente)', ...mapRowToSession(lastClosed[0]) });
        }
      }
      // CRITICAL CHANGE: Return 404 to alert frontend instead of silent "success"
      return res.status(404).json({ message: 'No se encontró una sesión abierta para cerrar. Refresca la página.' });
    }

    const row = rows[0];
    let details = {};
    try {
      details = (typeof row.detalles_json === 'string')
        ? JSON.parse(row.detalles_json)
        : (row.detalles_json || {});
    } catch { details = { transactions: [] }; }

    const transactions = details.transactions || [];

    // 2. Calcular totales finales usando helper compartido
    const totals = calcularTotalesSesion(transactions, details);

    const montoInicial = Number(row.monto_inicial || 0);
    const finalEsperado = montoInicial + totals.movimientoNetoEfectivo;
    const finalReal = Number(countedAmount);
    const diferencia = finalReal - finalEsperado;

    // 3. Guardar quién cerró la caja
    const closerName = displayName(closedBy);
    const closerId = (closedBy && typeof closedBy === 'object') ? (closedBy.id || closedBy.id_usuario || userId) : userId;

    // 4. Actualizar la fila (Cierre definitivo)
    await pool.query(`
      UPDATE cierres_caja SET
        fecha_cierre = ?,
        cerrado_por_id = ?,
        cerrado_por_nombre = ?,
        final_esperado = ?,
        final_real = ?,
        diferencia = ?,
        total_ventas_efectivo = ?,
        total_ventas_tarjeta = ?,
        total_ventas_transferencia = ?,
        total_ventas_credito = ?,
        total_dolares = ?,
        total_entradas = ?,
        total_salidas = ?,
        observaciones = ?
      WHERE id = ?
    `, [
      new Date(closedAt), closerId, closerName,
      finalEsperado, finalReal, diferencia,
      totals.totalEfectivo, totals.totalTarjeta, totals.totalTransferencia, totals.totalCredito,
      totals.totalDolares,
      totals.totalIngresos, totals.totalGastos,
      notes || '',
      row.id
    ]);

    // Responder éxito
    // 5. Emitir evento por socket
    const io = req.app.get('io');
    if (io) {
      io.emit('caja:session_update', { userId, status: 'closed', timestamp: closedAt });
    }

    res.json({ success: true, message: 'Sesión cerrada correctamente.', session: mapRowToSession({ ...row, fecha_cierre: closedAt }) });

  } catch (error) {
    console.error('Error POST /session/close:', error);
    res.status(500).json({ message: 'Error SQL: ' + error.message, sqlError: error.code });
  }
});


// ───────── Reporte (MIGRADO A SQL) ─────────
// GET /api/caja/reporte?date=YYYY-MM-DD
router.get('/reporte', async (req, res) => {
  const dateStr = (req.query.date || localDayKey(new Date())).trim(); // YYYY-MM-DD

  try {
    // 1. Obtener Cierres Completados desde SQL
    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = ?
      ORDER BY fecha_cierre DESC
    `, [dateStr]);

    const cerradas = rows.map(r => {
      const session = mapRowToSession(r);
      return {
        ...session,
        // Mantener compatibilidad con campos esperados por el frontend legacy
        id: r.id,
        sql: true,
        abierta_por: r.usuario_nombre,
        cerrada_por: r.cerrado_por_nombre || r.usuario_nombre,
        hora_apertura: r.fecha_apertura,
        hora_cierre: r.fecha_cierre,
        monto_inicial: Number(r.monto_inicial),
        esperado: Number(r.final_esperado),
        contado: Number(r.final_real),
        diferencia: Number(r.diferencia),
        total_efectivo: Number(r.total_ventas_efectivo),
        total_tarjeta: Number(r.total_ventas_tarjeta),
        total_transferencia: Number(r.total_ventas_transferencia),
        total_credito: Number(r.total_ventas_credito),
        total_dolares: Number(r.total_dolares || 0),
        total_gastos: Number(r.total_salidas),
        total_ingresos: Number(r.total_entradas),
        detalles_json: r.detalles_json
      };
    });

    // 2. Obtener Sesiones ABIERTAS desde SQL
    const [activeRows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE fecha_cierre IS NULL
      AND DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = ?
    `, [dateStr]);

    const abiertas = activeRows.map(r => {
      const session = mapRowToSession(r);
      return {
        ...session,
        abierta_por: r.usuario_nombre,
        hora_apertura: r.fecha_apertura,
        monto_inicial: Number(r.monto_inicial || 0)
      };
    });

    // Retorno limpio, SIN legacy JSON merging.
    res.json({ abiertas, cerradas });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error cargando reportes: ' + error.message });
  }
});

// GET /api/caja/abiertas/activas (Para CashReport: mostrar quién está trabajando)
router.get('/abiertas/activas', async (req, res) => {
  try {
    // Consulta SQL: sessiones sin cerrar.
    // Usamos columnas explícitas para evitar errores con columnas no usadas o corruptas
    const cols = [
      'id', 'usuario_id', 'usuario_nombre', 'monto_inicial', 
      'CAST(fecha_apertura AS CHAR) as fa_char', 
      'CAST(fecha_cierre AS CHAR) as fc_char',
      'fecha_apertura', 'fecha_cierre', 'detalles_json'
    ].join(', ');

    const [rows] = await pool.query(`
      SELECT ${cols} FROM cierres_caja 
      WHERE (fecha_cierre IS NULL OR fecha_cierre < '1970-01-01')
      ORDER BY fecha_apertura DESC
    `);

    console.log(`[DEBUG] /abiertas/activas found ${rows.length} sessions.`);

    let finalRows = rows;
    if (rows.length === 0) {
      const [recentRows] = await pool.query(`
        SELECT ${cols} FROM cierres_caja 
        WHERE fecha_apertura > NOW() - INTERVAL 48 HOUR
          AND (fecha_cierre IS NULL OR fecha_cierre < '1900-01-01' OR CAST(fecha_cierre AS CHAR) = '0000-00-00 00:00:00')
        ORDER BY fecha_apertura DESC
      `);
      finalRows = recentRows;
      if (recentRows.length > 0) {
        console.log(`[DEBUG] /abiertas/activas fallback found ${recentRows.length} sessions.`);
      }
    }

    const abiertas = finalRows.map(row => {
      let details = {};
      try {
        details = (typeof row.detalles_json === 'string')
          ? JSON.parse(row.detalles_json)
          : (row.detalles_json || {});
      } catch { details = {}; }

      return {
        id: row.id,
        // Usar fa_char si fecha_apertura falla, pero mysql2 suele parsear bien si no es 0000
        openedAt: row.fecha_apertura || row.fa_char, 
        openedBy: { id: row.usuario_id, name: row.usuario_nombre },
        monto_inicial: Number(row.monto_inicial || 0),
        tasaDolar: Number(details.tasaDolar || 0),
        abierta_por: row.usuario_nombre,
      };
    });

    abiertas.sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt));
    res.json({ abiertas });

  } catch (error) {
    console.error('CRITICAL ERROR /abiertas/activas:', error);
    // Devolvemos el error detallado para debug en producción
    res.status(500).json({ 
      message: 'Error obteniendo sesiones activas', 
      error: error.message,
      stack: error.stack,
      abiertas: [] 
    });
  }
});


// ───────── Active Carts (Persistence) ─────────
// GET /api/caja/cart?userId=123
router.get('/cart', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const [rows] = await pool.query('SELECT carts_json FROM active_carts WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      let data = rows[0].carts_json;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { }
      }
      return res.json(data);
    }
    return res.json([]);
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return empty if table doesn't exist yet to avoid crashing app
    res.json([]);
  }
});

// POST /api/caja/cart
router.post('/cart', async (req, res) => {
  const { userId, carts } = req.body;
  if (!userId || !carts) return res.status(400).json({ message: 'Missing data' });

  try {
    const jsonStr = JSON.stringify(carts);
    await pool.query(`
      INSERT INTO active_carts (user_id, carts_json) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE carts_json = VALUES(carts_json)
    `, [userId, jsonStr]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Error saving cart' });
  }
});

module.exports = router;
