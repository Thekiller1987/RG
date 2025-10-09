const db = require('../config/db');

// OBTENER TODOS LOS PRODUCTOS
exports.getAllProducts = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM productos ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    console.error('Error en getAllProducts:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// CREAR UN PRODUCTO
exports.createProduct = async (req, res) => {
    const { codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO productos (codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error en createProduct:', err.message);
        res.status(500).send('Error en el servidor');
    }
};

// ACTUALIZAR UN PRODUCTO
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE productos SET codigo = $1, nombre = $2, costo = $3, venta = $4, existencia = $5, id_categoria = $6, id_proveedor = $7 WHERE id_producto = $8 RETURNING *',
            [codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor, id]
        );
        if (rows.length === 0) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        console.error('Error en updateProduct:', err.message);
        res.status(500).send('Error en el servidor');
    }
};

// ELIMINAR UN PRODUCTO
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM productos WHERE id_producto = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json({ msg: 'Producto eliminado' });
    } catch (err) {
        console.error('Error en deleteProduct:', err.message);
        res.status(500).send('Error en el servidor');
    }
};