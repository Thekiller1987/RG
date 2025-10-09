const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');
const productController = require('../controllers/productController.js');

router.get('/inventory/history', verifyToken, productController.getInventoryHistory);
router.get('/', verifyToken, productController.getAllProducts);
router.get('/:id', verifyToken, productController.getProductById);
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);
router.patch('/:id/stock', verifyToken, productController.adjustStock);

module.exports = router;