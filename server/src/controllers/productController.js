/**
 * @file productController.js
 * @description Controladores para la lógica de negocio de los productos.
 * @version 2.1.4 (Final)
 */

const db = require('../config/db.js');

const createProduct = async (req, res) => {
  const { codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria, id_proveedor, tipo_venta, mayoreo } = req.body;
  const id_usuario = req.user?.id_usuario || req.user?.id;
  if (!codigo || !nombre || costo === undefined || venta === undefined || existencia === undefined) {
    return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo, venta y existencia.' });
  }
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [exist] = await connection.query('SELECT id_producto FROM productos WHERE codigo = ? OR nombre = ?', [codigo, nombre]);
    if (exist.length > 0) throw new Error('Ya existe un producto con este código o nombre.');
    const productData = { codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria, id_proveedor, tipo_venta, mayoreo };
    const [result] = await connection.query('INSERT INTO productos SET ?', [productData]);
    const id_producto = result.insertId;
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id_producto, 'CREACION', `Producto creado con existencia inicial de ${existencia}`, id_usuario]
    );
    await connection.commit();
    res.status(201).json({ id: id_producto, ...productData });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en createProduct:', error);
    res.status(500).json({ msg: error.message });
  } finally {
    if (connection) connection.release();
  }
};

const getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      ORDER BY p.nombre ASC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ msg: 'Error al obtener productos.' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
       FROM productos p
       LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
       LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
       WHERE p.id_producto = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Producto no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ msg: 'Error al obtener el producto.' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria, id_proveedor, tipo_venta, mayoreo } = req.body;
  const id_usuario = req.user?.id_usuario || req.user?.id;
  if (!codigo || !nombre || costo === undefined || venta === undefined || existencia === undefined) {
    return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo, venta y existencia.' });
  }
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [producto] = await connection.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
    if (!producto.length) throw new Error('Producto no encontrado.');
    const [exist] = await connection.query(
      'SELECT id_producto FROM productos WHERE (codigo = ? OR nombre = ?) AND id_producto != ?',
      [codigo, nombre, id]
    );
    if (exist.length > 0) throw new Error('Ya existe otro producto con este código o nombre.');
    const productData = { codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria, id_proveedor, tipo_venta, mayoreo };
    await connection.query('UPDATE productos SET ? WHERE id_producto = ?', [productData, id]);
    const detalles =
      producto[0].existencia !== existencia
        ? `Stock actualizado de ${producto[0].existencia} a ${existencia}.`
        : 'Detalles del producto actualizados.';
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'EDICION', detalles, id_usuario]
    );
    await connection.commit();
    res.json({ id, ...productData });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en updateProduct:', error);
    res.status(500).json({ msg: error.message });
  } finally {
    if (connection) connection.release();
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.user?.id_usuario || req.user?.id;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.query('SELECT nombre FROM productos WHERE id_producto = ?', [id]);
    if (!rows.length) return res.status(404).json({ msg: 'Producto no encontrado.' });
    await connection.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'ELIMINACION', `Producto "${rows[0].nombre}" eliminado.`, id_usuario]
    );
    await connection.commit();
    res.json({ msg: 'Producto eliminado correctamente.' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ msg: error.message });
  } finally {
    if (connection) connection.release();
  }
};

const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { cantidad, razon } = req.body;
  const id_usuario = req.user?.id_usuario || req.user?.id;
  const cantidadNum = parseInt(cantidad, 10);
  if (isNaN(cantidadNum)) return res.status(400).json({ msg: 'La cantidad debe ser un número válido.' });
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.query('SELECT existencia FROM productos WHERE id_producto = ? FOR UPDATE', [id]);
    if (!rows.length) throw new Error('Producto no encontrado.');
    const oldStock = rows[0].existencia;
    const newStock = oldStock + cantidadNum;
    await connection.query('UPDATE productos SET existencia = ? WHERE id_producto = ?', [newStock, id]);
    const detalles = `Ajuste: ${cantidadNum > 0 ? '+' : ''}${cantidadNum}. Razón: ${razon || 'No especificada'}. Stock ${oldStock} → ${newStock}.`;
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'AJUSTE_STOCK', detalles, id_usuario]
    );
    await connection.commit();
    res.json({ msg: 'Stock ajustado correctamente.', newStock });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en adjustStock:', error);
    res.status(500).json({ msg: error.message });
  } finally {
    if (connection) connection.release();
  }
};

const getInventoryHistory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mi.id_movimiento, mi.fecha, mi.tipo_movimiento, mi.detalles,
             p.nombre AS nombre_producto, p.codigo AS codigo_producto, u.nombre_usuario
      FROM movimientos_inventario mi
      LEFT JOIN productos p ON mi.id_producto = p.id_producto
      LEFT JOIN usuarios u ON mi.id_usuario = u.id_usuario
      ORDER BY mi.fecha DESC LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en getInventoryHistory:', error);
    res.status(500).json({ msg: 'Error al obtener historial.' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adjustStock,
  getInventoryHistory
};

