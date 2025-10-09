const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory } = require('../controllers/categoryController.js');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(verifyToken, getAllCategories)
  .post(verifyToken, isAdmin, createCategory);

router.route('/:id')
  .delete(verifyToken, isAdmin, deleteCategory);

module.exports = router;