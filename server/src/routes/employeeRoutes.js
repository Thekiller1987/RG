// server/src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');
const { verifyToken, requirePermission } = require('../middleware/authMiddleware');

// Reporte y cálculo en vivo de Planilla y Comisiones con reglas sobre Ganancia
router.get('/payroll-report', verifyToken, requirePermission('planilla.acceso'), ctrl.getPayrollReport);

// Registrar o eliminar vales, adelantos, deducciones o bonos extra
router.post('/payroll-movement', verifyToken, requirePermission('planilla.liquidar_pagos'), ctrl.addPayrollMovement);
router.delete('/payroll-movement/:id', verifyToken, requirePermission('planilla.liquidar_pagos'), ctrl.deletePayrollMovement);

// Liquidar y cerrar pago de planilla / comisión e imprimir colilla
router.post('/liquidate', verifyToken, requirePermission('planilla.liquidar_pagos'), ctrl.liquidatePayroll);

// Listado de empleados (usado también en POS para selector de vendedor)
router.get('/', verifyToken, ctrl.getAll);
router.post('/', verifyToken, ctrl.create);
router.put('/:id', verifyToken, ctrl.update);
router.delete('/:id', verifyToken, ctrl.remove);

module.exports = router;
