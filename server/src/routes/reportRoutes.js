// ==========================================================
// ARCHIVO: server/src/routes/reportRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de reportes
router.use(authMiddleware);

router.get('/sales-summary', reportController.getSalesSummaryReport);
router.get('/inventory-value', reportController.getInventoryValueReport);
router.get('/sales-by-user', reportController.getSalesByUserReport);
router.get('/top-products', reportController.getTopProductsReport);
router.get('/sales-chart', reportController.getSalesChartReport);

module.exports = router;