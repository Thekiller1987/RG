// routes/orderRoutes.js - VERSIÓN ACTUALIZADA

const express = require('express');
const router = express.Router();
const { 
    getOrders, 
    getOrderDetails, 
    createOrder, 
    addAbono, 
    liquidarOrder, 
    cancelOrder,
    getUsuarios,
    getReportePedidos 
} = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
    .get(getOrders)
    .post(createOrder);

// NUEVA RUTA para obtener detalles específicos de un pedido
router.route('/:id')
    .get(getOrderDetails)
    .delete(cancelOrder); // Para cancelar

router.post('/:id/abono', addAbono);
router.post('/:id/liquidar', liquidarOrder);

// ✅ NUEVAS RUTAS PARA LAS FUNCIONALIDADES MEJORADAS
router.get('/usuarios/listar', getUsuarios); // Ruta para obtener usuarios
router.get('/reportes/pedidos', getReportePedidos); // Ruta para reporte de pedidos

module.exports = router;