const express = require('express');
const router = express.Router();
const controller = require('../controllers/providerInvoiceController');

// Rutas base: /api/facturas-proveedores
router.get('/', controller.getInvoices);
router.post('/', controller.createInvoice);
router.delete('/abonos/:abonoId', controller.deletePayment); // Eliminar abono individual (ANTES de /:id)
router.post('/:id/pagar', controller.registerPayment);
router.get('/:id/abonos', controller.getInvoicePayments);
router.delete('/:id', controller.deleteInvoice);

module.exports = router;