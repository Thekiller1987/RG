// CommonJS
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_FILE = path.join(process.cwd(), 'data', 'caja-sessions.json');

// ───────── Helpers de archivo JSON ─────────
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
// Nombre mostrable robusto
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

// Enriquecer objeto usuario guardado en sesión (sin borrar campos)
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

// Fecha local YYYY-MM-DD (evita desfase por UTC)
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
    openedBy: normalizeUser(openedBy, userId), // AÑADIDO: guardar nombre normalizado
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

// POST /api/caja/session/tx
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

// POST /api/caja/session/close
router.post('/session/close', (req, res) => {
  const { userId, countedAmount = 0, closedAt, closedBy } = req.body || {};
  if (!userId || !closedAt || !closedBy) {
    return res.status(400).json({ message: 'Faltan campos: userId, closedAt, closedBy' });
  }

  const db = readDB();
  const s = db.sessions.find(
    s => String(s.openedBy?.id) === String(userId) && !s.closedAt
  );
  if (!s) return res.status(404).json({ message: 'No hay sesión abierta' });

  const movimientoNetoEfectivo = (s.transactions || []).reduce((total, tx) => {
    if (tx.type === 'venta_credito') return total;
    const ingreso = Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0);
    if (tx.type === 'entrada') return total + ingreso;
    if (tx.type === 'salida') return total - ingreso;
    return total + ingreso;
  }, 0);
  const esperado = Number(s.initialAmount) + movimientoNetoEfectivo;

  s.closedAt = closedAt;
  s.closedBy = normalizeUser(closedBy, closedBy?.id || userId); // AÑADIDO: guardar nombre normalizado
  s.countedAmount = Number(countedAmount);
  s.difference = s.countedAmount - esperado;

  writeDB(db);
  res.json(s);
});


// ───────── AÑADIDO: Sesiones Abiertas (para CashReport.jsx) ─────────
// GET /api/caja/abiertas/activas
router.get('/abiertas/activas', (req, res) => {
  const db = readDB();
  const sessions = db.sessions || [];

  const abiertas = sessions
    .filter(s => !s.closedAt) // Solo las que no tienen fecha de cierre
    .map(s => ({
      id: s.id,
      openedAt: s.openedAt,
      openedBy: s.openedBy, // objeto completo
      monto_inicial: Number(s.initialAmount || 0),
      tasaDolar: Number(s.tasaDolar || 0),
      abierta_por: displayName(s.openedBy), // nombre directo
    }));

  abiertas.sort((a,b) => new Date(b.openedAt) - new Date(a.openedAt));
  res.json({ abiertas }); 
});


// ───────── NUEVO: Reporte por fecha ─────────
// GET /api/caja/reporte?date=YYYY-MM-DD
router.get('/reporte', (req, res) => {
  const date = (req.query.date || localDayKey(new Date())).trim(); // clave local del día seleccionado
  const db = readDB();
  const sessions = db.sessions || [];

  const calcEsperado = (s) => {
    const net = (s.transactions || []).reduce((total, tx) => {
      if (tx.type === 'venta_credito') return total;
      const ingreso = Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0);
      if (tx.type === 'entrada') return total + ingreso;
      if (tx.type === 'salida') return total - ingreso;
      return total + ingreso;
    }, 0);
    return Number(s.initialAmount || 0) + net;
  };

  const abiertas = [];
  const cerradas = [];

  for (const s of sessions) {
    const openedDay = localDayKey(s.openedAt); // ← FECHA LOCAL
    const closedDay = localDayKey(s.closedAt); // ← FECHA LOCAL

    if (!s.closedAt && openedDay === date) {
      abiertas.push({
        id: s.id,
        abierta_por: displayName(s.openedBy),
        hora_apertura: s.openedAt,
        monto_inicial: Number(s.initialAmount || 0)
      });
    }

    if (s.closedAt && closedDay === date) {
      const esperado = calcEsperado(s);
      const contado = Number(s.countedAmount ?? 0);
      const diferencia = Number(contado - esperado);

      cerradas.push({
        id: s.id,
        abierta_por: displayName(s.openedBy),
        cerrada_por: displayName(s.closedBy),
        hora_apertura: s.openedAt,
        hora_cierre: s.closedAt,
        monto_inicial: Number(s.initialAmount || 0),
        esperado,
        contado,
        diferencia,
        reporte_url: null
      });
    }
  }

  abiertas.sort((a,b) => new Date(b.hora_apertura) - new Date(a.hora_apertura));
  cerradas.sort((a,b) => new Date(b.hora_cierre) - new Date(a.hora_cierre));

  res.json({ abiertas, cerradas });
});

module.exports = router;
    