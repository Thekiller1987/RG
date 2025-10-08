/**
 * @file productRoutes.js
 * @description Define todas las rutas para la API de productos.
 * @version 2.0.0 (Solución Definitiva)
 */

const express = require('express');
const router = express.Router();

// SOLUCIÓN: Importamos directamente las funciones que necesitamos del middleware.
// Esto se llama "desestructuración" y es una forma más limpia y segura.
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');
const productController = require('../controllers/productController.js');

// Ahora podemos usar 'verifyToken' directamente, en lugar de 'auth.verifyToken'.

// RUTA NUEVA: Obtener el historial de movimientos de inventario.
router.get('/inventory/history', verifyToken, productController.getInventoryHistory);

// OBTENER todos los productos
router.get('/', verifyToken, productController.getAllProducts);

// OBTENER un producto por su ID
router.get('/:id', verifyToken, productController.getProductById);

// CREAR un nuevo producto
router.post('/', verifyToken, productController.createProduct);

// ACTUALIZAR un producto existente
router.put('/:id', verifyToken, productController.updateProduct);

// ELIMINAR un producto
// NOTA: Si solo los admins pueden borrar, la ruta sería:
// router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

// AJUSTAR el stock de un producto
router.patch('/:id/stock', verifyToken, productController.adjustStock);

module.exports = router;

