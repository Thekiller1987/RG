/**
 * @file productRoutes.js
 * @description Define las rutas de la API de productos e inventario.
 * @version 2.3.0 (sin errores y alineada al controller)
 */

const express = require('express');
const router = express.Router();

// Middleware de autenticación
const { verifyToken /*, isAdmin */ } = require('../middleware/authMiddleware.js');

// Controlador principal de productos
const productController = require('../controllers/productController.js');

/* ===================== HISTORIAL DE INVENTARIO ===================== */
/**
 * GET /api/products/inventory/history
 * Devuelve los últimos movimientos de inventario (máximo 100).
 */
router.get(
  '/inventory/history',
  verifyToken,
  productController.getInventoryHistory
);

/* ===================== CRUD DE PRODUCTOS ===================== */
/**
 * GET /api/products
 * Lista todos los productos.
 */
router.get('/', verifyToken, productController.getAllProducts);

/**
 * GET /api/products/:id
 * Obtiene un producto por su ID.
 */
router.get('/:id', verifyToken, productController.getProductById);

/**
 * POST /api/products
 * Crea un nuevo producto.
 */
router.post('/', verifyToken, productController.createProduct);

/**
 * PUT /api/products/:id
 * Actualiza los datos de un producto (sin modificar existencia).
 */
router.put('/:id', verifyToken, productController.updateProduct);

/**
 * DELETE /api/products/:id
 * Elimina un producto de forma permanente.
 * Si deseas restringir a administradores, activa `isAdmin`:
 *   router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
 */
router.delete('/:id', verifyToken, productController.deleteProduct);

/* ===================== AJUSTE DE STOCK ===================== */
/**
 * PATCH /api/products/:id/stock
 * Ajusta la existencia de un producto, registrando la razón en el historial.
 */
router.patch('/:id/stock', verifyToken, productController.adjustStock);

/* ===================== ARCHIVAR PRODUCTO ===================== */
/**
 * PATCH /api/products/:id/archive
 * Marcado lógico de producto (requiere columna `activo` si se desea usar).
 */
router.patch('/:id/archive', verifyToken, productController.archiveProduct);

/* ===================== EXPORTAR RUTAS ===================== */
module.exports = router;
