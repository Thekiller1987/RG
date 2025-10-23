// routes/orderRoutes.js - SOLO AGREGA ESTAS RUTAS NUEVAS

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

router.route('/:id')
    .get(getOrderDetails)
    .delete(cancelOrder);

router.post('/:id/abono', addAbono);
router.post('/:id/liquidar', liquidarOrder);

// ✅ SOLO AGREGA ESTAS 2 RUTAS NUEVAS AL FINAL
router.get('/usuarios/listar', getUsuarios);
router.get('/reporte-pedidos/diario', getReportePedidos);

module.exports = router;