const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getSalesSummaryReport,
    getInventoryValueReport,
    getSalesByUserReport,
    getTopProductsReport,
    getSalesChartReport
} = require('../controllers/reportController');

router.get('/sales-summary', verifyToken, getSalesSummaryReport);
router.get('/inventory-value', verifyToken, getInventoryValueReport);
router.get('/sales-by-user', verifyToken, getSalesByUserReport);
router.get('/top-products', verifyToken, getTopProductsReport);
router.get('/sales-chart', verifyToken, getSalesChartReport);

module.exports = router;