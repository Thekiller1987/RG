// ==========================================================
// ARCHIVO: server/src/routes/orderRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de pedidos
router.use(authMiddleware);

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderDetails);
router.post('/:id/abono', orderController.addAbono);
router.post('/:id/liquidar', orderController.liquidarOrder);
router.delete('/:id', orderController.cancelOrder);

module.exports = router;