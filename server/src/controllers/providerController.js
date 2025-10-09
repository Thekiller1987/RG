const { pool } = require('../config/db.js');

// Obtener todos los proveedores
exports.getAllProviders = async (req, res) => {
  try {
    // CAMBIO 1: Usar pool.query()
    const result = await pool.query('SELECT * FROM proveedores ORDER BY nombre');
    
    // CAMBIO 2: Obtener resultados de .rows
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error al obtener proveedores:', error); 
    res.status(500).json({ msg: 'Error al obtener proveedores' });
  }
};

// Crear un nuevo proveedor
exports.createProvider = async (req, res) => {
  const { nombre } = req.body;
  try {
    // CAMBIO 1: Usar $1 en lugar de ?
    // CAMBIO 2: PostgreSQL devuelve el registro insertado con RETURNING *
    const result = await pool.query('INSERT INTO proveedores (nombre) VALUES ($1) RETURNING id_proveedor, nombre', [nombre]);
    
    // CAMBIO 3: Devolvemos el objeto insertado directamente desde .rows[0]
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    // Los errores por UNIQUE (nombre duplicado) son 23505 en PostgreSQL
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
    // CAMBIO: Usar pool.query() y $1
    const result = await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1', [id]);
    
    // Si la eliminación fue exitosa (rowCount > 0)
    if (result.rowCount === 0) {
        return res.status(404).json({ msg: 'Proveedor no encontrado.' });
    }

    res.json({ msg: 'Proveedor eliminado' });
    
  } catch (error) {
    // En PostgreSQL, la violación de Clave Foránea (FK) es el error 23503.
    if (error.code === '23503') {
        return res.status(400).json({ msg: 'No se puede eliminar el proveedor porque está en uso por uno o más productos.' });
    }
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ msg: 'Error al eliminar el proveedor' });
  }
};