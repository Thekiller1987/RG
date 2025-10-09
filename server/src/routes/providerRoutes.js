// ==========================================================
// ARCHIVO: server/src/routes/providerRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de proveedores
router.use(authMiddleware);

router.get('/', providerController.getAllProviders);
router.post('/', providerController.createProvider);
router.delete('/:id', providerController.deleteProvider);

module.exports = router;