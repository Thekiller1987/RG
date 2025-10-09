// ==========================================================
// ARCHIVO: server/src/controllers/providerController.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const db = require('../config/db'); // CORRECCIÓN: Se importa 'db'

// Obtener todos los proveedores
exports.getAllProviders = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM proveedores ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error); 
    res.status(500).json({ msg: 'Error al obtener proveedores' });
  }
};

// Crear un nuevo proveedor
exports.createProvider = async (req, res) => {
  const { nombre } = req.body;
  try {
    const { rows } = await db.query('INSERT INTO proveedores (nombre) VALUES ($1) RETURNING id_proveedor, nombre', [nombre]);
    res.status(201).json(rows[0]);
  } catch (error) {
    // Manejo de error para nombre duplicado (UNIQUE constraint)
    if (error.code === '23505') {
        return res.status(400).json({ msg: 'Ya existe un proveedor con ese nombre.' });
    }
    console.error('Error al crear el proveedor:', error);
    res.status(500).json({ msg: 'Error al crear el proveedor' });
  }
};

// Eliminar un proveedor
exports.deleteProvider = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM proveedores WHERE id_proveedor = $1', [id]);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ msg: 'Proveedor no encontrado.' });
    }

    res.json({ msg: 'Proveedor eliminado' });
    
  } catch (error) {
    // Manejo de error para Foreign Key Violation
    if (error.code === '23503') {
        return res.status(400).json({ msg: 'No se puede eliminar el proveedor porque está en uso por uno o más productos.' });
    }
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ msg: 'Error al eliminar el proveedor' });
  }
};