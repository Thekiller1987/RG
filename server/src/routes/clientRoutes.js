const express = require('express');
const router = express.Router();

// ===================================================================
// =================== CORRECCIÓN PRINCIPAL AQUÍ =====================
// ===================================================================
const { 
    getAllClients, 
    createClient, 
    updateClient, 
    deleteClient, 
    addCreditPayment,
    getCreditosByClient, // <-- AÑADE ESTA LÍNEA
    getAbonosByClient    // <-- AÑADE ESTA LÍNEA
} = require('../controllers/clientController');
// ===================================================================

const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
    .get(getAllClients)
    .post(createClient);

router.route('/:id')
    .put(updateClient)
    .delete(deleteClient);

router.post('/:id/abono', addCreditPayment);

// Estas rutas ya no darán error porque las funciones fueron importadas arriba
router.get('/:id/creditos', getCreditosByClient);
router.get('/:id/abonos', getAbonosByClient);

module.exports = router;