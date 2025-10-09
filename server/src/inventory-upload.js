const express = require('express');
const router = express.Router();
const multer = require('multer');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Configuración de Multer para manejar el archivo en memoria
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/inventory/upload
// @desc    Sube y procesa un archivo de inventario (CSV o Excel)
// @access  Private (requiere token)
router.post('/upload', authMiddleware, upload.single('file'), inventoryController.massiveUpload);

module.exports = router;
