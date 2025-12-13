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

// GET /api/caja/session?userId=123
router.get('/session', (req, res) => {
  const userId = String(req.query.userId || '').trim();
  if (!userId) return res.status(400).json({ message: 'Falta userId' });

  const db = readDB();
  const sessions = db.sessions.filter(s => String(s.openedBy?.id) === userId);
  if (!sessions.length) return res.json(null);

  const open = sessions.find(s => !s.closedAt);
  if (open) return res.json(open);

  // Intentar buscar el último cerrado en JSON (fallback rápido)
  // Nota: Idealmente deberíamos buscar el último histórico en SQL también,
  // pero el frontend usa esto para "resumir sesión anterior" o "abrir nueva".
  const last = sessions.sort((a, b) =>
    new Date(b.openedAt) - new Date(a.openedAt)
  )[0];
  return res.json(last || null);
});

// POST /api/caja/session/open
router.post('/session/open', (req, res) => {
  const { userId, openedAt, openedBy, initialAmount = 0, tasaDolar } = req.body || {};
  if (!userId || !openedAt || !openedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, openedAt, openedBy' });
  }

  const db = readDB();
  const yaAbierta = db.sessions.find(
    s => String(s.openedBy?.id) === String(userId) && !s.closedAt
  );
  if (yaAbierta) return res.json(yaAbierta);

  const session = {
    id: `caja-${userId}-${Date.now()}`,
    openedAt,
    openedBy: normalizeUser(openedBy, userId),
    initialAmount: Number(initialAmount) || 0,
    transactions: [],
    closedAt: null,
    closedBy: null,
    countedAmount: null,
    difference: null,
    notes: '',
    tasaDolar: Number(tasaDolar ?? 0)
  };
  db.sessions.push(session);
  writeDB(db);
  res.status(201).json(session);
});

// POST /api/caja/session/tx (Mantiene en JSON para control rápido durante el día)
router.post('/session/tx', (req, res) => {
  const { userId, tx } = req.body || {};
  if (!userId || !tx) return res.status(400).json({ message: 'Faltan userId o tx' });

  const db = readDB();
  const s = db.sessions.find(
    s => String(s.openedBy?.id) === String(userId) && !s.closedAt
  );
  if (!s) return res.status(404).json({ message: 'No hay sesión abierta' });

  s.transactions.push({
    id: tx.id || `tx-${Date.now()}`,
    type: tx.type,
    amount: Number(tx.amount || 0),
    note: tx.note || '',
    at: tx.at || new Date().toISOString(),
    pagoDetalles: tx.pagoDetalles || {}
  });
  writeDB(db);
  res.status(201).json(s);
});

// POST /api/caja/session/close (MIGRADO A SQL CON SNAPSHOT)
router.post('/session/close', async (req, res) => {
  const { userId, countedAmount = 0, closedAt, closedBy, notes } = req.body || {};
  if (!userId || !closedAt || !closedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, closedAt, closedBy' });
  }

  const db = readDB();
  const s = db.sessions.find(
    s => String(s.openedBy?.id) === String(userId) && !s.closedAt
  );
  if (!s) return res.status(404).json({ message: 'No hay sesión abierta para cerrar.' });

  try {
    // 1. Calcular totales basados en la sesión actual (JSON) y/o verificar con SQL
    //    Para simplificar y asegurar consistencia con lo que veía el cajero, usaremos
    //    la lógica de acumulación que ya existía, pero guardaremos el resultado final en SQL.

    // a. Desglose de Ventas (Iterar transacciones de sesión)
    //    Esto es clave: al leer del JSON "transactions", estamos leyendo lo que el frontend
    //    registró como ventas durante el día. Esto incluye ventas efectivo, tarjeta, etc.
    //    Esto asume que el backend `/session/tx` fue llamado correctamente cada vez.

    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalTransferencia = 0;
    let totalCredito = 0;
    let totalIngresos = 0; // Entradas manuales
    let totalGastos = 0;   // Salidas manuales

    // Totales calculados para "Esperado en Caja" (Solo efectivo y movimientos de caja)
    let movimientoNetoEfectivo = 0;

    const detallesSnapshot = s.transactions.map(tx => {
      // Analizar cada transacción para sumar totales
      const tipo = tx.type; // venta_contado, venta_credito, entrada, salida
      const detalles = tx.pagoDetalles || {};

      // Sumar al global por método de pago (si es venta)
      if (tipo.startsWith('venta')) {
        totalEfectivo += Number(detalles.efectivo || 0);
        totalTarjeta += Number(detalles.tarjeta || 0);
        totalTransferencia += Number(detalles.transferencia || 0);
        totalCredito += Number(detalles.credito || 0);
      }

      // Calcular impacto en CAJA FÍSICA (movimientoNetoEfectivo)
      // Esto define cuánto dinero debería haber físicamente.
      if (tipo === 'entrada') {
        const monto = Number(tx.amount || 0);
        totalIngresos += monto;
        movimientoNetoEfectivo += monto;
      } else if (tipo === 'salida') {
        const monto = Number(tx.amount || 0);
        totalGastos += monto;
        movimientoNetoEfectivo -= monto; // Resta dinero físico
      } else if (tipo === 'venta_contado') {
        // CORRECCIÓN CRÍTICA:
        // 'ingresoCaja' desde el POS trae la suma de TODO (Efectivo + Tarjeta + Transf).
        // Para el cuadro de caja, SOLO nos interesa el EFECTIVO FÍSICO.
        // Fórmula: (Efectivo Recibido + Dólares en C$) - Cambio

        const cashIn = Number(detalles.efectivo || 0);
        const dolaresVal = Number(detalles.dolares || 0);
        const tasa = Number(detalles.tasaDolarAlMomento || s.tasaDolar || 1);
        const cashOut = Number(detalles.cambio || 0);

        const netoFisico = (cashIn + (dolaresVal * tasa)) - cashOut;

        movimientoNetoEfectivo += netoFisico;
      }

      return tx; // Devolver para el snapshot
    });

    const montoInicial = Number(s.initialAmount || 0);
    const finalEsperado = montoInicial + movimientoNetoEfectivo;
    const finalReal = Number(countedAmount);
    const diferencia = finalReal - finalEsperado;

    // 2. Insertar en MySQL `cierres_caja`
    const insertSQL = `
      INSERT INTO cierres_caja (
        fecha_apertura, fecha_cierre, usuario_id, usuario_nombre,
        monto_inicial, final_esperado, final_real, diferencia,
        total_ventas_efectivo, total_ventas_tarjeta, total_ventas_transferencia, total_ventas_credito,
        total_entradas, total_salidas,
        detalles_json, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const usuarioNombre = displayName(s.openedBy);
    const jsonStr = JSON.stringify({
      transactions: detallesSnapshot,
      session_id: s.id,
      tasaDolar: s.tasaDolar
    });

    const [result] = await pool.execute(insertSQL, [
      new Date(s.openedAt), new Date(closedAt), userId, usuarioNombre,
      montoInicial, finalEsperado, finalReal, diferencia,
      totalEfectivo, totalTarjeta, totalTransferencia, totalCredito,
      totalIngresos, totalGastos,
      jsonStr, notes || ''
    ]);

    // 3. Actualizar JSON para marcar cerrado (Legacy support)
    s.closedAt = closedAt;
    s.closedBy = normalizeUser(closedBy, closedBy?.id || userId);
    s.countedAmount = finalReal;
    s.difference = diferencia;
    s.sqlId = result.insertId; // Referencia al ID SQL
    writeDB(db);

    res.json({ success: true, message: 'Cierre guardado en BD', id: result.insertId, ...s });

  } catch (error) {
    console.error('Error al guardar cierre en BD:', error);
    res.status(500).json({ message: 'Error interno guardando el cierre', error: error.message });
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
