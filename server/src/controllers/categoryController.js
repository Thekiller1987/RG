const { pool } = require('../config/db.js');

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    // CAMBIO 1: Usar pool.query()
    const result = await pool.query('SELECT * FROM categorias ORDER BY nombre');
    
    // CAMBIO 2: Obtener resultados de .rows
    res.json(result.rows); 
    
  } catch (error) {
    // Mantenemos el console.error para debugging en Netlify Logs
    console.error('Error al obtener categorías:', error); 
    res.status(500).json({ msg: 'Error al obtener categorías' });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  const { nombre } = req.body;
  try {
    // CAMBIO 1: Usar $1 en lugar de ?
    // CAMBIO 2: PostgreSQL puede devolver el registro insertado con RETURNING *
    const result = await pool.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING id_categoria, nombre', [nombre]);
    
    // CAMBIO 3: Devolvemos el objeto insertado directamente desde .rows[0]
    res.status(201).json(result.rows[0]); 
    
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ msg: 'Error al crear la categoría' });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // CAMBIO: Usar pool.query() y $1
    const result = await pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
    
    // NOTA: No necesitamos verificar result.affectedRows ya que PostgreSQL maneja la FK.
    if (result.rowCount === 0) {
        return res.status(404).json({ msg: 'Categoría no encontrada.' });
    }
    
    res.json({ msg: 'Categoría eliminada' });
    
  } catch (error) {
    // En PostgreSQL, la eliminación fallará si la FK está activa, lo que genera un error 400.
    // Buscamos el código de error 23503 (Foreign Key Violation)
    if (error.code === '23503') {
        return res.status(400).json({ msg: 'No se puede eliminar la categoría porque está en uso por uno o más productos.' });
    }
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ msg: 'Error al eliminar la categoría' });
  }
};