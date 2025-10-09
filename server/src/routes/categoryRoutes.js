// ==========================================================
// ARCHIVO: server/src/routes/categoryRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/categories
// @desc    Obtener todas las categorías
// @access  Private
router.get('/', authMiddleware, categoryController.getAllCategories);

// @route   POST /api/categories
// @desc    Crear una nueva categoría
// @access  Private (Asegúrate de que solo los admins puedan hacer esto si es necesario)
router.post('/', authMiddleware, categoryController.createCategory);

// @route   DELETE /api/categories/:id
// @desc    Eliminar una categoría
// @access  Private
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;