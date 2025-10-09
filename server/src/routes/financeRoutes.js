// ==========================================================
// ARCHIVO: server/src/routes/financeRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de finanzas
router.use(authMiddleware);

// Rutas para Ingresos
router.get('/ingresos', financeController.getAllIngresos);
router.post('/ingresos', financeController.createIngreso);

// Rutas para Egresos
router.get('/egresos', financeController.getAllEgresos);
router.post('/egresos', financeController.createEgreso);

// Ruta para el Resumen Financiero
router.get('/summary', financeController.getFinancialSummary);

module.exports = router;