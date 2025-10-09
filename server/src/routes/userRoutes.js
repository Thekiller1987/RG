// ==========================================================
// ARCHIVO: server/src/routes/userRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Obtener todos los usuarios
// @access  Private (protegido por middleware)
router.get('/', authMiddleware, userController.getAllUsers);

// @route   POST /api/users
// @desc    Crear un nuevo usuario
// @access  Private
router.post('/', authMiddleware, userController.createUser);

// @route   PUT /api/users/:id
// @desc    Actualizar un usuario
// @access  Private
router.put('/:id', authMiddleware, userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Eliminar un usuario
// @access  Private
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;