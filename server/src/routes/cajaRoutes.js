// src/routes/cajaRoutes.js  (CommonJS)
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DB_FILE = path.join(process.cwd(), 'data', 'caja-sessions.json');

// Helpers de archivo JSON
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
    openedBy,
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
  s.closedBy = closedBy;
  s.countedAmount = Number(countedAmount);
  s.difference = s.countedAmount - esperado;

  writeDB(db);
  res.json(s);
});

module.exports = router;
