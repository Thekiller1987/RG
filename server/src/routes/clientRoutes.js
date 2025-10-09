// ==========================================================
// ARCHIVO: server/src/routes/clientRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de clientes con el middleware
router.use(authMiddleware);

router.get('/', clientController.getAllClients);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.post('/:id/abono', clientController.addCreditPayment);
router.get('/:id/creditos', clientController.getCreditosByClient);
router.get('/:id/abonos', clientController.getAbonosByClient);

module.exports = router;