const express = require('express');
const router = express.Router();

const { getAllProviders, createProvider, updateProvider, deleteProvider } = require('../controllers/providerController.js');
const { verifyToken } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(verifyToken, getAllProviders)
  .post(verifyToken, createProvider);

router.route('/:id')
  .put(verifyToken, updateProvider)
  .delete(verifyToken, deleteProvider);

module.exports = router;
