const express = require('express');
const router = express.Router();
const { createSale, getSales, createReturn, cancelSale } = require('../controllers/salesController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route('/')
    .post(createSale)
    .get(getSales);

router.post('/returns', createReturn);

router.delete('/:id', isAdmin, cancelSale);

module.exports = router;