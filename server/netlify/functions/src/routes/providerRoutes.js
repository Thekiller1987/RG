const express = require('express');
const router = express.Router();
const { getAllProviders, createProvider, deleteProvider } = require('../controllers/providerController.js');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');

router.route('/')
    .get(verifyToken, getAllProviders)
    .post(verifyToken, isAdmin, createProvider);

router.route('/:id')
    .delete(verifyToken, isAdmin, deleteProvider);

module.exports = router;