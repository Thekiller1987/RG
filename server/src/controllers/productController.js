/**
 * @file productController.js
 * @description Controladores para la lógica de negocio de los productos.
 */

const { pool } = require('../config/db.js'); // CAMBIO 1: Importamos el pool desestructurado

// Función auxiliar para obtener y liberar un cliente de la piscina
const getClient = async () => await pool.connect(); 

const createProduct = async (req, res) => {
    const { codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria, id_proveedor, tipo_venta, mayoreo } = req.body;
    // req.user.id_usuario puede ser null, pero req.user.id siempre debe existir si el middleware funciona
    const id_usuario = req.user?.id_usuario || req.user?.id; 
    
    if (!codigo || !nombre || costo === undefined || venta === undefined || existencia === undefined) {
        return res.status(400).json({ msg: 'Campos obligatorios: código, nombre, costo, venta y existencia.' });
    }
    
    let client; // CAMBIO: Usamos 'client' para la conexión transaccional
    try {
        client = await getClient();
        await client.query('BEGIN'); // Iniciar Transacción
        
        // 1. Verificar si el producto ya existe (por código o nombre)
        // CAMBIO 2: Usar $1, $2
        const existResult = await client.query('SELECT id_producto FROM productos WHERE codigo = $1 OR nombre = $2', [codigo, nombre]);
        if (existResult.rows.length > 0) throw new Error('Ya existe un producto con este código o nombre.');
        
        // 2. Insertar el nuevo producto
        // CAMBIO 3: De MySQL (SET ?) a PostgreSQL (VALUES y RETURNING)
        const productData = [codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria || null, id_proveedor || null, tipo_venta, mayoreo || null];
        const insertQuery = `
            INSERT INTO productos (codigo, nombre, costo, venta, existencia, minimo, maximo, id_categoria, id_proveedor, tipo_venta, mayoreo)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id_producto;
        `;
        const result = await client.query(insertQuery, productData);
        const id_producto = result.rows[0].id_producto; // Obtener el ID insertado
        
        // 3. Registrar Movimiento de Inventario
        // CAMBIO 4: Usar $1, $2, $3, $4 y VALUES
        await client.query(
            'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES ($1, $2, $3, $4)',
            [id_producto, 'CREACION', `Producto creado con existencia inicial de ${existencia}`, id_usuario]
        );
        
        await client.query('COMMIT'); // Finalizar Transacción
        res.status(201).json({ 
            id: id_producto, 
            codigo, nombre, costo, venta, existencia, minimo, maximo, 
            id_categoria, id_proveedor, tipo_venta, mayoreo 
        });
        
    } catch (error) {
        if (client) await client.query('ROLLBACK'); // Deshacer Transacción
        console.error('Error en createProduct:', error);
        res.status(500).json({ msg: error.message || 'Error al crear producto.' });
    } finally {
        if (client) client.release(); // Liberar Cliente
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
        // CAMBIO: Usar pool.query() y obtener .rows
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getAllProducts:', error);
        res.status(500).json({ msg: 'Error al obtener productos.' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        // CAMBIO 1: Usar pool.query() y $1
        const result = await pool.query(
            `SELECT p.*, c.nombre AS nombre_categoria, pr.nombre AS nombre_proveedor
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
            WHERE p.id_producto = $1`,
            [id]
        );
        const rows = result.rows; // CAMBIO 2: Obtener filas de .rows

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
    
    let client; // CAMBIO: Usamos 'client' para la conexión transaccional
    try {
        client = await getClient();
        await client.query('BEGIN'); // Iniciar Transacción

        // 1. Obtener producto original y bloquear fila (FOR UPDATE)
        // CAMBIO 1: Usar $1 y FOR UPDATE
        const productResult = await client.query('SELECT * FROM productos WHERE id_producto = $1 FOR UPDATE', [id]);
        const producto = productResult.rows; 
        
        if (!producto.length) throw new Error('Producto no encontrado.');

        // 2. Verificar duplicados (excluyendo el producto actual)
        // CAMBIO 2: Usar $1, $2, $3
        const existResult = await client.query(
            'SELECT id_producto FROM productos WHERE (codigo = $1 OR nombre = $2) AND id_producto != $3',
            [codigo, nombre, id]
        );
        if (existResult.rows.length > 0) throw new Error('Ya existe otro producto con este código o nombre.');

        // 3. Actualizar producto
        // CAMBIO 3: De MySQL (SET ?) a PostgreSQL (SET col1=$1, col2=$2...)
        const updateQuery = `
            UPDATE productos 
            SET codigo = $1, nombre = $2, costo = $3, venta = $4, existencia = $5, minimo = $6, 
                maximo = $7, id_categoria = $8, id_proveedor = $9, tipo_venta = $10, mayoreo = $11
            WHERE id_producto = $12
        `;
        const productData = [
            codigo, nombre, costo, venta, existencia, minimo || null, maximo || null, 
            id_categoria || null, id_proveedor || null, tipo_venta, mayoreo || null, id
        ];
        await client.query(updateQuery, productData);
        
        // 4. Registrar Movimiento
        const oldStock = producto[0].existencia;
        const newStock = parseFloat(existencia); // Aseguramos que sea número
        
        const detalles =
            oldStock !== newStock
                ? `Stock actualizado de ${oldStock} a ${newStock}.`
                : 'Detalles del producto actualizados.';
        
        // CAMBIO 4: Usar $1, $2, $3, $4 y VALUES
        await client.query(
            'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES ($1, $2, $3, $4)',
            [id, 'EDICION', detalles, id_usuario]
        );
        
        await client.query('COMMIT'); // Finalizar Transacción
        res.json({ id, ...req.body });
        
    } catch (error) {
        if (client) await client.query('ROLLBACK'); // Deshacer Transacción
        console.error('Error en updateProduct:', error);
        res.status(500).json({ msg: error.message || 'Error al actualizar producto.' });
    } finally {
        if (client) client.release(); // Liberar Cliente
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.user?.id_usuario || req.user?.id;
    
    let client; // CAMBIO: Usamos 'client' para la conexión transaccional
    try {
        client = await getClient();
        await client.query('BEGIN'); // Iniciar Transacción
        
        // 1. Obtener nombre para el log
        // CAMBIO 1: Usar $1
        const rowsResult = await client.query('SELECT nombre FROM productos WHERE id_producto = $1', [id]);
        const rows = rowsResult.rows;
        
        if (!rows.length) return res.status(404).json({ msg: 'Producto no encontrado.' });
        
        // 2. Eliminar producto
        // CAMBIO 2: Usar $1
        await client.query('DELETE FROM productos WHERE id_producto = $1', [id]);
        
        // 3. Registrar Movimiento de Inventario
        // CAMBIO 3: Usar $1, $2, $3, $4 y VALUES
        await client.query(
            'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES ($1, $2, $3, $4)',
            [id, 'ELIMINACION', `Producto "${rows[0].nombre}" eliminado.`, id_usuario]
        );
        
        await client.query('COMMIT'); // Finalizar Transacción
        res.json({ msg: 'Producto eliminado correctamente.' });
        
    } catch (error) {
        if (client) await client.query('ROLLBACK'); // Deshacer Transacción
        // En PostgreSQL, 23503 es Foreign Key Violation
        if (error.code === '23503') {
             return res.status(400).json({ msg: 'No se puede eliminar el producto porque tiene ventas o pedidos asociados.' });
        }
        console.error('Error en deleteProduct:', error);
        res.status(500).json({ msg: error.message || 'Error al eliminar producto.' });
    } finally {
        if (client) client.release(); // Liberar Cliente
    }
};

const adjustStock = async (req, res) => {
    const { id } = req.params;
    const { cantidad, razon } = req.body;
    const id_usuario = req.user?.id_usuario || req.user?.id;
    const cantidadNum = parseInt(cantidad, 10);
    
    if (isNaN(cantidadNum)) return res.status(400).json({ msg: 'La cantidad debe ser un número válido.' });
    
    let client; // CAMBIO: Usamos 'client' para la conexión transaccional
    try {
        client = await getClient();
        await client.query('BEGIN'); // Iniciar Transacción

        // 1. Obtener existencia actual y bloquear la fila (FOR UPDATE)
        // CAMBIO 1: Usar $1 y FOR UPDATE
        const rowsResult = await client.query('SELECT existencia FROM productos WHERE id_producto = $1 FOR UPDATE', [id]);
        const rows = rowsResult.rows; 
        
        if (!rows.length) throw new Error('Producto no encontrado.');
        
        const oldStock = rows[0].existencia;
        const newStock = parseFloat(oldStock) + cantidadNum; // Usamos parseFloat por si la BD devuelve string decimal
        
        // 2. Actualizar stock
        // CAMBIO 2: Usar $1, $2
        await client.query('UPDATE productos SET existencia = $1 WHERE id_producto = $2', [newStock, id]);
        
        // 3. Registrar Movimiento
        const detalles = `Ajuste: ${cantidadNum > 0 ? '+' : ''}${cantidadNum}. Razón: ${razon || 'No especificada'}. Stock ${oldStock} → ${newStock}.`;
        
        // CAMBIO 3: Usar $1, $2, $3, $4 y VALUES
        await client.query(
            'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES ($1, $2, $3, $4)',
            [id, 'AJUSTE_STOCK', detalles, id_usuario]
        );
        
        await client.query('COMMIT'); // Finalizar Transacción
        res.json({ msg: 'Stock ajustado correctamente.', newStock });
    } catch (error) {
        if (client) await client.query('ROLLBACK'); // Deshacer Transacción
        console.error('Error en adjustStock:', error);
        res.status(500).json({ msg: error.message || 'Error al ajustar stock.' });
    } finally {
        if (client) client.release(); // Liberar Cliente
    }
};

const getInventoryHistory = async (req, res) => {
    try {
        // CAMBIO 1: PostgreSQL usa LIMIT 100 OFFSET 0
        const query = `
            SELECT mi.id_movimiento, mi.fecha, mi.tipo_movimiento, mi.detalles,
                   p.nombre AS nombre_producto, p.codigo AS codigo_producto, u.nombre_usuario
            FROM movimientos_inventario mi
            LEFT JOIN productos p ON mi.id_producto = p.id_producto
            LEFT JOIN usuarios u ON mi.id_usuario = u.id_usuario
            ORDER BY mi.fecha DESC LIMIT 100
        `;
        // CAMBIO 2: Usar pool.query() y obtener .rows
        const result = await pool.query(query);
        res.json(result.rows);
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