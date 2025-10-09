// ==========================================================
// ARCHIVO: server/src/routes/salesRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de ventas
router.use(authMiddleware);

router.get('/', salesController.getSales);
router.post('/', salesController.createSale);
router.post('/returns', salesController.createReturn); // Ruta para devoluciones
router.delete('/:id', salesController.cancelSale);

module.exports = router;