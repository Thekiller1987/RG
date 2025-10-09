const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController.js');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js'); 

router.route('/')
    .get(verifyToken, isAdmin, getAllUsers);

router.route('/:id')
    .put(verifyToken, isAdmin, updateUser)
    .delete(verifyToken, isAdmin, deleteUser);

module.exports = router;