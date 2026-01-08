// CommonJS
const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db'); // MySQL Pool

const router = express.Router();
const DB_FILE = path.join(process.cwd(), 'data', 'caja-sessions.json');

// ───────── Helpers de archivo JSON (Mantener para sesión activa) ─────────
function ensureDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ sessions: [] }, null, 2));
  }
}
function readDB() {
  ensureDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8') || '{"sessions":[]}';
    const json = JSON.parse(raw);
    if (!json.sessions) json.sessions = [];
    return json;
  } catch {
    return { sessions: [] };
  }
}
function writeDB(data) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ───────── Utils AÑADIDOS ───────── */
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

// ───────── Sesiones de Caja ─────────

// ───────── Sesiones de Caja (MIGRADO A SQL COMPLETAMENTE) ─────────

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

  return {
    id: row.id, // ID numérico de SQL
    sqlId: row.id,
    openedAt: row.fecha_apertura,
    openedBy: { id: row.usuario_id, name: row.usuario_nombre },
    initialAmount: Number(row.monto_inicial || 0),
    transactions: details.transactions || [],
    closedAt: row.fecha_cierre, // Será null si está abierta
    closedBy: row.fecha_cierre ? { id: row.usuario_id, name: row.usuario_nombre } : null,
    countedAmount: row.final_real ? Number(row.final_real) : null,
    difference: row.diferencia ? Number(row.diferencia) : null,
    tasaDolar: Number(details.tasaDolar || 0),
    notes: row.observaciones || ''
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
      WHERE usuario_id = ? AND fecha_cierre IS NULL 
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
    res.status(500).json({ message: 'Error recuperando sesión' });
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
        fecha_apertura, usuario_id, usuario_nombre, 
        monto_inicial, final_esperado, final_real, diferencia,
        total_ventas_efectivo, total_ventas_tarjeta, total_ventas_transferencia, total_ventas_credito,
        total_entradas, total_salidas, detalles_json
      ) VALUES (?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?)
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

    res.status(201).json(newSession);

  } catch (error) {
    console.error('Error POST /session/open:', error);
    res.status(500).json({ message: 'Error abriendo sesión' });
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

    // 2. Agregar transacción
    details.transactions.push({
      id: tx.id || `tx-${Date.now()}`,
      type: tx.type,
      amount: Number(tx.amount || 0),
      note: tx.note || '',
      at: tx.at || new Date().toISOString(),
      pagoDetalles: tx.pagoDetalles || {}
    });

    // 3. Guardar JSON actualizado en BD
    await pool.query(`
      UPDATE cierres_caja 
      SET detalles_json = ? 
      WHERE id = ?
    `, [JSON.stringify(details), row.id]);

    // 4. Devolver sesión actualizada
    res.status(201).json(mapRowToSession({ ...row, detalles_json: details }));

  } catch (error) {
    console.error('Error POST /session/tx:', error);
    res.status(500).json({ message: 'Error guardando transacción' });
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

    // Manejo de Idempotencia: Si no hay abierta, buscar reciente cerrada
    if (rows.length === 0) {
      const [lastClosed] = await pool.query(`
        SELECT * FROM cierres_caja 
        WHERE usuario_id = ? AND fecha_cierre IS NOT NULL 
        ORDER BY fecha_cierre DESC LIMIT 1
      `, [userId]);

      if (lastClosed.length > 0) {
        const diff = Date.now() - new Date(lastClosed[0].fecha_cierre).getTime();
        if (diff < 60000) {
          return res.json({ success: true, message: 'Sesión ya cerrada (Idempotente)', ...mapRowToSession(lastClosed[0]) });
        }
      }
      return res.json({ success: true, message: 'Sesión no encontrada (Autocorrección)', id: null });
    }

    const row = rows[0];
    let details = {};
    try {
      details = (typeof row.detalles_json === 'string')
        ? JSON.parse(row.detalles_json)
        : (row.detalles_json || {});
    } catch { details = { transactions: [] }; }

    const transactions = details.transactions || [];

    // 2. Calcular totales finales
    let totalEfectivo = 0, totalTarjeta = 0, totalTransferencia = 0, totalCredito = 0;
    let totalIngresos = 0, totalGastos = 0;
    let movimientoNetoEfectivo = 0;

    transactions.forEach(tx => {
      const tipo = tx.type;
      const d = tx.pagoDetalles || {};

      if (tipo.startsWith('venta')) {
        totalEfectivo += Number(d.efectivo || 0);
        totalTarjeta += Number(d.tarjeta || 0);
        totalTransferencia += Number(d.transferencia || 0);
        totalCredito += Number(d.credito || 0);
      }

      if (tipo === 'entrada') {
        const m = Number(tx.amount || 0);
        totalIngresos += m;
        movimientoNetoEfectivo += m;
      } else if (tipo === 'salida') {
        const m = Number(tx.amount || 0);
        totalGastos += m;
        movimientoNetoEfectivo -= m;
      } else if (tipo === 'devolucion' || tipo === 'cancelacion') {
        totalEfectivo -= Number(d.efectivo || 0);
        totalTarjeta -= Number(d.tarjeta || 0);
        totalTransferencia -= Number(d.transferencia || 0);
        totalCredito -= Number(d.credito || 0);

        let impacto = Number(d.ingresoCaja || tx.amount || 0);
        if (impacto > 0) impacto = -impacto;
        movimientoNetoEfectivo += impacto;

      } else if (tipo === 'venta_contado' || tipo === 'venta') {
        const cashIn = Number(d.efectivo || 0);
        const dolaresVal = Number(d.dolares || 0);
        const tasa = Number(d.tasaDolarAlMomento || details.tasaDolar || 1);
        const cashOut = Number(d.cambio || 0);
        const netoFisico = (cashIn + (dolaresVal * tasa)) - cashOut;
        movimientoNetoEfectivo += netoFisico;
      }
    });

    const montoInicial = Number(row.monto_inicial || 0);
    const finalEsperado = montoInicial + movimientoNetoEfectivo;
    const finalReal = Number(countedAmount);
    const diferencia = finalReal - finalEsperado;

    // 3. Actualizar la fila (Cierre definitivo)
    await pool.query(`
      UPDATE cierres_caja SET
        fecha_cierre = ?,
        final_esperado = ?,
        final_real = ?,
        diferencia = ?,
        total_ventas_efectivo = ?,
        total_ventas_tarjeta = ?,
        total_ventas_transferencia = ?,
        total_ventas_credito = ?,
        total_entradas = ?,
        total_salidas = ?,
        observaciones = ?
      WHERE id = ?
    `, [
      new Date(closedAt), finalEsperado, finalReal, diferencia,
      totalEfectivo, totalTarjeta, totalTransferencia, totalCredito,
      totalIngresos, totalGastos,
      notes || '',
      row.id
    ]);

    // Responder éxito
    res.json({ success: true, message: 'Cierre guardado en BD', id: row.id, ...mapRowToSession({ ...row, fecha_cierre: closedAt }) });

  } catch (error) {
    console.error('Error POST /session/close:', error);
    res.status(500).json({ message: 'Error cerrando sesión' });
  }
});


// ───────── Reporte (MIGRADO A SQL) ─────────
// GET /api/caja/reporte?date=YYYY-MM-DD
router.get('/reporte', async (req, res) => {
  const dateStr = (req.query.date || localDayKey(new Date())).trim(); // YYYY-MM-DD

  try {
    // 1. Obtener Cierres Completados desde SQL
    // Filtramos por fecha de APERTURA o CIERRE? Usualmente Cierre.
    // Aunque el usuario selecciona "Ver reporte del día X". Si cerró a las 00:05 del día siguiente,
    // técnicamente pertenece a la venta del día anterior.
    // Por simplicidad, buscaremos por fecha de APERTURA que coincida con el día, 
    // O fecha de cierre que coincida.
    // Vamos a buscar por fecha de APERTURA que inicie en ese día (00:00 a 23:59)
    // CORRECCIÓN ZONA HORARIA (MANAGUA UTC-6)
    // Las fechas en BD están en UTC (o hora servidor).
    // Si el usuario pide el dia '2023-10-12', quiere todo lo que ocurrió en ese dia LOCAL.
    // Una venta a las 10pm del 12 (Managua) es las 4am del 13 (UTC).
    // Solución: Restamos 6 horas a la fecha de la base de datos antes de comparar.

    // Opción A (Index Friendly): Calcular rangos en JS.
    // Start: YYYY-MM-DD 06:00:00 UTC
    // End:   YYYY-MM-DD+1 05:59:59 UTC
    // Pero MySQL DATE_SUB es más legible y el volumen de datos no es masivo.

    const [rows] = await pool.query(`
      SELECT * FROM cierres_caja 
      WHERE DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = ?
      ORDER BY fecha_cierre DESC
    `, [dateStr]);

    const cerradas = rows.map(r => ({
      id: r.id,
      sql: true,
      abierta_por: r.usuario_nombre,
      cerrada_por: r.usuario_nombre, // Asumimos mismo usuario por ahora o nulo
      hora_apertura: r.fecha_apertura,
      hora_cierre: r.fecha_cierre,
      monto_inicial: Number(r.monto_inicial),
      esperado: Number(r.final_esperado),
      contado: Number(r.final_real),
      diferencia: Number(r.diferencia),
      // Campos extra para el frontend nuevo
      total_efectivo: Number(r.total_ventas_efectivo),
      total_tarjeta: Number(r.total_ventas_tarjeta),
      total_transferencia: Number(r.total_ventas_transferencia),
      total_credito: Number(r.total_ventas_credito),
      total_gastos: Number(r.total_salidas),
      total_ingresos: Number(r.total_entradas),
      detalles_json: r.detalles_json // Snapshot completo con productos
    }));

    // 2. Obtener Sesiones ABIERTAS desde JSON (ya que esas no están en SQL todavía)
    const dbJSON = readDB();
    const abiertas = dbJSON.sessions
      .filter(s => !s.closedAt && localDayKey(s.openedAt) === dateStr)
      .map(s => ({
        id: s.id,
        abierta_por: displayName(s.openedBy),
        hora_apertura: s.openedAt,
        monto_inicial: Number(s.initialAmount || 0)
      }));

    // 3. Fusionar compatibilidad con cierres viejos en JSON (opcional)
    // Para no perder el historial anterior a hoy, podemos leer también del JSON si lo desean.
    // Pero el usuario pidió "crear tabla... guardar info". Asumimos que desde HOY usa SQL.
    // Si quiere ver lo viejo, podríamos mezclar.
    // Mezcla simple: Traer del JSON los que NO tengan sqlId (legacy).
    const legacyClosed = dbJSON.sessions
      .filter(s => s.closedAt && localDayKey(s.openedAt) === dateStr && !s.sqlId)
      .map(s => {
        // Recalcular esperado legacy
        const calcEsperado = (sess) => {
          const net = (sess.transactions || []).reduce((t, tx) => {
            if (tx.type === 'venta_credito') return t;
            const ing = Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0);
            if (tx.type === 'entrada') return t + ing;
            if (tx.type === 'salida') return t - ing;
            return t + ing;
          }, 0);
          return Number(sess.initialAmount || 0) + net;
        };
        const esp = calcEsperado(s);
        return {
          id: s.id,
          abierta_por: displayName(s.openedBy),
          cerrada_por: displayName(s.closedBy),
          hora_apertura: s.openedAt,
          hora_cierre: s.closedAt,
          monto_inicial: Number(s.initialAmount),
          esperado: esp,
          contado: Number(s.countedAmount),
          diferencia: Number(s.countedAmount) - esp
        };
      });

    res.json({ abiertas, cerradas: [...cerradas, ...legacyClosed] });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error cargando reportes' });
  }
});

// GET /api/caja/abiertas/activas (Para CashReport: mostrar quién está trabajando)
router.get('/abiertas/activas', (req, res) => {
  const db = readDB();
  const abiertas = (db.sessions || [])
    .filter(s => !s.closedAt)
    .map(s => ({
      id: s.id,
      openedAt: s.openedAt,
      openedBy: s.openedBy,
      monto_inicial: Number(s.initialAmount || 0),
      tasaDolar: Number(s.tasaDolar || 0),
      abierta_por: displayName(s.openedBy),
    }));
  abiertas.sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt));
  res.json({ abiertas });
});

module.exports = router;
