const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, isAdmin, updateSettings);

module.exports = router;
