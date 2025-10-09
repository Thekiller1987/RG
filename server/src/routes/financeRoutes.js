const express = require('express');
const router = express.Router();
const { 
    getAllIngresos, 
    createIngreso,
    getAllEgresos,
    createEgreso,
    getFinancialSummary
} = require('../controllers/financeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); 

router.get('/ingresos', verifyToken, getAllIngresos);
router.post('/ingresos', verifyToken, isAdmin, createIngreso);

router.get('/egresos', verifyToken, getAllEgresos);
router.post('/egresos', verifyToken, isAdmin, createEgreso);

router.get('/summary', verifyToken, getFinancialSummary);

module.exports = router;