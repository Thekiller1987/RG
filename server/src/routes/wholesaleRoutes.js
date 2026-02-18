
const express = require('express');
const router = express.Router();
const {
    validatePin,
    getPromotions,
    createPromotion,
    updatePromotion,
    togglePromotionStatus,
    deletePromotion
} = require('../controllers/wholesaleController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public or Protected? Protected by Token usually, but PIN is extra.
// We verify token for all.

router.post('/validate-pin', verifyToken, validatePin);

// Promotions Management (Admin Only? Or Wholesale Manager?)
// For now, allow regular users if they have the PIN logic, but usually management is Admin.
// Let's stick to Token verification.

router.get('/promotions', verifyToken, getPromotions);
router.post('/promotions', verifyToken, isAdmin, createPromotion);
router.put('/promotions/:id', verifyToken, isAdmin, updatePromotion);
router.put('/promotions/:id/toggle', verifyToken, isAdmin, togglePromotionStatus);
router.delete('/promotions/:id', verifyToken, isAdmin, deletePromotion);

module.exports = router;
