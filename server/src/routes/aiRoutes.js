// server/src/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { askAI, getAIStatus, saveAIConfig } = require('../controllers/aiController');

// Rutas de Inteligencia Artificial para Multirepuestos RG
router.post('/ask', verifyToken, askAI);
router.get('/status', verifyToken, getAIStatus);
router.post('/config', verifyToken, isAdmin, saveAIConfig);

module.exports = router;
