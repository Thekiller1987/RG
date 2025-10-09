const express = require('express');
const router = express.Router();
const { getOrders, getOrderDetails, createOrder, addAbono, liquidarOrder, cancelOrder } = require('../controllers/orderController');
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

module.exports = router;