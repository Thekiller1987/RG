const express = require('express');
const router = express.Router();
const { login, register, me } = require('../controllers/authController.js');
const { verifyToken } = require('../middleware/authMiddleware.js');

// Ruta para el login de un usuario
// POST /api/auth/login
router.post('/login', login);

// Ruta para registrar un nuevo usuario
// POST /api/auth/register
router.post('/register', register);

// Ruta para verificar token y obtener usuario activo
// GET /api/auth/me
router.get('/me', verifyToken, me);

module.exports = router;
