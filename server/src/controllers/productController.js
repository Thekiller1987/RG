/**
 * @file productController.js
 * @description Controladores para la lógica de negocio de los productos.
 * @version 2.2.2 (BD alineada + DELETE con FKs SET NULL)
 */

const db = require('../config/db.js');

/* ===================== CREATE ===================== */
const createProduct = async (req, res) => {
  const {
    codigo, nombre, costo, venta, existencia,
    minimo, maximo, id_categoria, id_proveedor,
    tipo_venta, mayoreo
  } = req.body;

  const id_usuario = req.user?.id_usuario || req.user?.id;

  if (!codigo || !nombre || costo === undefined || venta === undefined || existencia === undefined) {
    return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo, venta y existencia.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // No duplicados por código o nombre
    const [exist] = await connection.query(
      'SELECT id_producto FROM productos WHERE codigo = ? OR nombre = ?',
      [codigo, nombre]
    );
    if (exist.length > 0) throw new Error('Ya existe un producto con este código o nombre.');

    const productData = {
      codigo, nombre, costo, venta, existencia,
      minimo, maximo, id_categoria, id_proveedor,
      tipo_venta, mayoreo
    };

    const [result] = await connection.query('INSERT INTO productos SET ?', [productData]);
    const id_producto = result.insertId;

    // Movimiento inventario
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id_producto, 'CREACION', `Producto creado con existencia inicial de ${existencia}`, id_usuario || null]
    );

    await connection.commit();
    res.status(201).json({ id: id_producto, ...productData });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en createProduct:', error);
    res.status(500).json({ msg: error.message || 'Error al crear el producto.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== READ ===================== */
const getAllProducts = async (_req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
      FROM productos p
      LEFT JOIN categorias c   ON p.id_categoria  = c.id_categoria
      LEFT   JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
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
         LEFT JOIN categorias  c  ON p.id_categoria  = c.id_categoria
         LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
       WHERE p.id_producto = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ msg: 'Producto no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ msg: 'Error al obtener el producto.' });
  }
};


/* ===================== UPDATE ===================== */
// En tu archivo: productController.js

// En tu productController.js

const updateProduct = async (req, res) => {
  const { id } = req.params;
  
  // ✅ CAMBIO 1: Ya no se extrae 'existencia' del body.
  const {
    codigo, nombre, costo, venta,
    minimo, maximo, id_categoria, id_proveedor,
    tipo_venta, mayoreo, descripcion // Se añade 'descripcion' si también la editas
  } = req.body;

  const id_usuario = req.user?.id_usuario || req.user?.id;

  // ✅ CAMBIO 2: Se elimina 'existencia' de la validación.
  if (!codigo || !nombre || costo === undefined || venta === undefined) {
    return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo y venta.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Primero, asegura que el producto exista
    const [producto] = await connection.query('SELECT existencia FROM productos WHERE id_producto = ?', [id]);
    if (!producto.length) {
      throw new Error('Producto no encontrado.');
    }

    // Luego, revisa duplicados (excluyendo el producto actual)
    const [exist] = await connection.query(
      'SELECT id_producto FROM productos WHERE (codigo = ? OR nombre = ?) AND id_producto != ?',
      [codigo, nombre, id]
    );
    if (exist.length > 0) {
      throw new Error('Ya existe otro producto con este código o nombre.');
    }

    // ✅ CAMBIO 3: El objeto a actualizar ya no incluye 'existencia'.
    const productData = {
      codigo, nombre, costo, venta,
      minimo, maximo, id_categoria, id_proveedor,
      tipo_venta, mayoreo, descripcion
    };

    // Actualiza el producto en la base de datos
    await connection.query('UPDATE productos SET ? WHERE id_producto = ?', [productData, id]);

    // Registra el movimiento de auditoría
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'EDICION', 'Detalles del producto actualizados.', id_usuario || null]
    );

    await connection.commit();

    // Devuelve el objeto actualizado pero con la existencia que ya estaba en la BD.
    res.json({ id, ...productData, existencia: producto[0].existencia });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en updateProduct:', error);
    res.status(500).json({ msg: error.message || 'Error al actualizar el producto.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== DELETE (con FKs ON DELETE SET NULL) ===================== */
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const id_usuario = req.user?.id_usuario || req.user?.id;

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT nombre FROM productos WHERE id_producto = ?', [id]);
    if (!rows.length) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Producto no encontrado.' });
    }

    const nombreProd = rows[0].nombre;

    // 1) Registrar el movimiento ANTES del DELETE
    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'ELIMINACION', `Producto "${nombreProd}" eliminado.`, id_usuario || null]
    );

    // 2) Borrar el producto (las FKs lo pondrán en NULL donde aplique)
    await connection.query('DELETE FROM productos WHERE id_producto = ?', [id]);

    await connection.commit();
    res.json({ msg: 'Producto eliminado correctamente.' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ msg: error.message || 'Error interno al eliminar el producto.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== ARCHIVE (opcional) ===================== */
/**
 * Tu tabla `productos` NO tiene columna `activo`.
 * Se mantiene la respuesta segura para no romper nada si alguien llama esta ruta.
 */
const archiveProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [exists] = await db.query('SELECT id_producto, nombre FROM productos WHERE id_producto=?', [id]);
    if (!exists.length) return res.status(404).json({ msg: 'Producto no encontrado.' });

    return res.status(400).json({
      msg: 'Función no disponible: la tabla productos no tiene columna "activo".',
      hint: 'Si deseas archivar, agrega la columna: ALTER TABLE productos ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1;'
    });
  } catch (error) {
    console.error('Error en archiveProduct:', error);
    res.status(500).json({ msg: 'No se pudo procesar el archivado.' });
  }
};


/* ===================== AJUSTE DE STOCK ===================== */
const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { cantidad, razon } = req.body;
  const id_usuario = req.user?.id_usuario || req.user?.id;

  const cantidadNum = parseInt(cantidad, 10);
  if (isNaN(cantidadNum) || !Number.isFinite(cantidadNum)) {
    return res.status(400).json({ msg: 'La cantidad debe ser un número válido.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT existencia FROM productos WHERE id_producto = ? FOR UPDATE',
      [id]
    );
    if (!rows.length) throw new Error('Producto no encontrado.');

    const oldStock = Number(rows[0].existencia);
    const newStock = oldStock + cantidadNum;

    await connection.query(
      'UPDATE productos SET existencia = ? WHERE id_producto = ?',
      [newStock, id]
    );

    const detalles = `Ajuste: ${cantidadNum > 0 ? '+' : ''}${cantidadNum}. Razón: ${razon || 'No especificada'}. Stock ${oldStock} → ${newStock}.`;

    await connection.query(
      'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
      [id, 'AJUSTE_STOCK', detalles, id_usuario || null]
    );

    await connection.commit();
    res.json({ msg: 'Stock ajustado correctamente.', newStock });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error en adjustStock:', error);
    res.status(500).json({ msg: error.message || 'Error al ajustar stock.' });
  } finally {
    if (connection) connection.release();
  }
};


/* ===================== HISTORIAL ===================== */
const getInventoryHistory = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mi.id_movimiento,
             mi.fecha,
             mi.tipo_movimiento,
             mi.detalles,
             p.nombre         AS nombre_producto,
             p.codigo         AS codigo_producto,
             u.nombre_usuario AS nombre_usuario
        FROM movimientos_inventario mi
        LEFT JOIN productos p ON mi.id_producto = p.id_producto
        LEFT JOIN usuarios  u ON mi.id_usuario  = u.id_usuario
       ORDER BY mi.fecha DESC
       LIMIT 100
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
  deleteProduct,   // ← ahora permite eliminar aunque haya ventas/pedidos (Fks SET NULL)
  adjustStock,
  getInventoryHistory,
  archiveProduct
};
