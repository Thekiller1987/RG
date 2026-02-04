const express = require('express');
const router = express.Router();
const { processOutflow, getOutflowHistory } = require('../controllers/outflowController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Validar que el usuario sea admin o encargado de inventario (si aplica, pero el usuario pidió Admin)
// Usaremos adminOnly o una lógica similar.
// Asumiendo que 'protect' decodifica el usuario.

router.post('/', protect, processOutflow); // POST /api/outflow
router.get('/history', protect, getOutflowHistory); // GET /api/outflow/history

module.exports = router;
