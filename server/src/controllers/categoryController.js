// ==========================================================
// ARCHIVO: server/src/controllers/categoryController.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const db = require('../config/db.js'); // CORRECCIÓN: Se importa 'db' en lugar de '{ pool }'

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    // CORRECCIÓN: Usar db.query()
    const { rows } = await db.query('SELECT * FROM categorias ORDER BY nombre');
    res.json(rows); 
  } catch (error) {
    console.error('Error al obtener categorías:', error); 
    res.status(500).json({ msg: 'Error al obtener categorías' });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  const { nombre } = req.body;
  try {
    // CORRECCIÓN: Usar db.query()
    const { rows } = await db.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING id_categoria, nombre', [nombre]);
    res.status(201).json(rows[0]); 
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ msg: 'Error al crear la categoría' });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // CORRECCIÓN: Usar db.query()
    const result = await db.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ msg: 'Categoría no encontrada.' });
    }
    
    res.json({ msg: 'Categoría eliminada' });
    
  } catch (error) {
    // Manejo de error para Foreign Key Violation
    if (error.code === '23503') {
        return res.status(400).json({ msg: 'No se puede eliminar la categoría porque está en uso por uno o más productos.' });
    }
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ msg: 'Error al eliminar la categoría' });
  }
};