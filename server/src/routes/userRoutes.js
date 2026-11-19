// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getPermissionsCatalog,
  updateUser,
  deleteUser,
  getUserTraceability
} = require('../controllers/userController.js');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');

// Catálogo maestro de permisos y plantillas por rol
router.get('/permissions-catalog', verifyToken, isAdmin, getPermissionsCatalog);

// Bitácora de trazabilidad y actividad por usuario
router.get('/traceability', verifyToken, isAdmin, getUserTraceability);

// Lista completa de usuarios con permisos y KPIs de trazabilidad
router.route('/')
  .get(verifyToken, isAdmin, getAllUsers);

// Actualizar (rol, contraseña, estado activo y casillas de permisos) o eliminar usuario
router.route('/:id')
  .put(verifyToken, isAdmin, updateUser)
  .delete(verifyToken, isAdmin, deleteUser);

module.exports = router;
