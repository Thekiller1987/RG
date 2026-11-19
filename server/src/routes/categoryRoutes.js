const express = require('express');
const router = express.Router();

const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController.js');
const { verifyToken } = require('../middleware/authMiddleware.js');

router.route('/')
  .get(verifyToken, getAllCategories)
  .post(verifyToken, createCategory);

router.route('/:id')
  .put(verifyToken, updateCategory)
  .delete(verifyToken, deleteCategory);

module.exports = router;
