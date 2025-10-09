// ==========================================================
// ARCHIVO: server/src/routes/authRoutes.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const express = require('express');
const router = express.Router();

// Importamos el controlador
const authController = require('../controllers/authController');

// Importamos el middleware de autenticación para la ruta protegida
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Obtener datos del usuario logueado
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;