const pool = require('../config/db');

// ✅ Obtener pedidos (CON FILTRO POR USUARIO)
const getOrders = async (req, res) => {
    try {
        const { usuario } = req.query; // Nuevo parámetro para filtrar por usuario
        
        let query = `
            SELECT 
                o.id_pedido AS id, 
                COALESCE(NULLIF(o.nombre_cliente, ''), 'Cliente no asignado') AS clienteNombre,
                o.id_cliente AS clienteId,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.id_usuario,
                u.nombre AS usuarioNombre,
                o.fecha_creacion AS fecha,
                o.fecha_actualizacion AS fechaActualizacion
            FROM pedidos o
            LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario
        `;

        const params = [];
        
        // Filtrar por usuario si se especifica
        if (usuario && usuario !== 'todos') {
            query += ` WHERE o.id_usuario = ?`;
            params.push(usuario);
        }

        query += ` ORDER BY o.fecha_creacion DESC`;

        const [orders] = await pool.query(query, params);
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
};

// ✅ Obtener detalles del pedido
const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    try {
        // Datos generales del pedido
        const [orderQuery] = await pool.query(`
            SELECT 
                o.id_pedido AS id, 
                COALESCE(NULLIF(o.nombre_cliente, ''), 'Cliente no asignado') AS cliente,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.fecha_creacion AS fecha
            FROM pedidos o
            WHERE o.id_pedido = ?
        `, [id]);

        if (orderQuery.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Consulta base para los productos del pedido
        let productQuery = `
            SELECT 
                p.nombre, 
                p.codigo, 
                dp.cantidad, 
                dp.precio_unitario AS precio
            FROM detalle_pedidos dp
            JOIN productos p ON dp.id_producto = p.id_producto
            WHERE dp.id_pedido = ?
        `;
        const params = [id];

        if (search && search.trim() !== '') {
            productQuery += ` AND (p.nombre LIKE ? OR p.codigo LIKE ?)`;
            const likeSearch = `%${search}%`;
            params.push(likeSearch, likeSearch);
        }

        const [itemsQuery] = await pool.query(productQuery, params);

        // Abonos del pedido
        const [abonosQuery] = await pool.query(`
            SELECT fecha, total_venta AS monto, pago_detalles 
            FROM ventas 
            WHERE tipo_venta = 'PEDIDO' AND referencia_pedido = ?
            ORDER BY fecha ASC
        `, [id]);

        res.json({
            ...orderQuery[0],
            items: itemsQuery,
            abonos: abonosQuery
        });
    } catch (error) {
        console.error(`Error al obtener detalles del pedido ${id}:`, error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// ✅ CREAR PEDIDO - CON USUARIO
const createOrder = async (req, res) => {
    const { clienteNombre, items, total, abonoInicial, pagoDetalles } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const estadoInicial = abonoInicial > 0 ? 'APARTADO' : 'PENDIENTE';
        
        console.log('=== CREANDO PEDIDO ===');
        console.log('Cliente Nombre:', clienteNombre);
        console.log('Usuario ID:', req.user.id);
        console.log('Estado inicial:', estadoInicial);
        
        // ✅ GUARDAMOS EL ID DEL USUARIO QUE CREA EL PEDIDO
        const [orderResult] = await connection.query(
            'INSERT INTO pedidos (id_cliente, nombre_cliente, total_pedido, abonado, estado, id_usuario, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [null, clienteNombre, total, abonoInicial, estadoInicial, req.user.id]
        );
        
        const orderId = orderResult.insertId;
        console.log('Pedido creado con ID:', orderId);

        // Insertar items del pedido
        for (const item of items) {
            await connection.query(
                'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.precio]
            );
            
            await connection.query(
                'UPDATE productos SET existencia = existencia - ?, stock_reservado = stock_reservado + ? WHERE id_producto = ?',
                [item.quantity, item.quantity, item.id]
            );
        }

        // Si hay abono inicial, registrar venta
        if (abonoInicial > 0) {
            await connection.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'ABONO', ?, ?, 'PEDIDO', ?)",
                [abonoInicial, req.user.id, JSON.stringify(pagoDetalles), orderId]
            );
        }

        await connection.commit();
        
        res.status(201).json({ 
            message: 'Pedido creado exitosamente', 
            orderId 
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('❌ Error al crear pedido:', error);
        res.status(500).json({ 
            message: error.message || 'Error al crear el pedido' 
        });
    } finally {
        if (connection) connection.release();
    }
};

// ✅ AGREGAR ABONO
const addAbono = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        const [orderRows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ? FOR UPDATE', [id]);
        
        if (orderRows.length === 0) {
            throw new Error('Pedido no encontrado');
        }
        
        const order = orderRows[0];
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);
        
        if(parseFloat(monto) > saldoPendiente + 0.01) {
            throw new Error('El monto del abono no puede ser mayor al saldo pendiente.');
        }
        
        const nuevoAbonado = parseFloat(order.abonado) + parseFloat(monto);
        await connection.query('UPDATE pedidos SET abonado = ? WHERE id_pedido = ?', [nuevoAbonado, id]);
        
        await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'ABONO', ?, ?, 'PEDIDO', ?)",
            [monto, req.user.id, JSON.stringify(pagoDetalles), id]
        );
        
        await connection.commit();
        res.status(200).json({ message: 'Abono registrado exitosamente' });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error al registrar abono:', error);
        res.status(500).json({ message: error.message || 'Error al registrar abono' });
    } finally {
        if (connection) connection.release();
    }
};

// ✅ LIQUIDAR PEDIDO
const liquidarOrder = async (req, res) => {
    const { id } = req.params;
    const { pagoDetalles } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        const [orderRows] = await connection.query('SELECT * FROM pedidos WHERE id_pedido = ? FOR UPDATE', [id]);
        
        if (orderRows.length === 0) {
            throw new Error('Pedido no encontrado');
        }
        
        const order = orderRows[0];
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);
        
        // ✅ CORRECCIÓN: Estado en MAYÚSCULAS
        await connection.query(
            'UPDATE pedidos SET abonado = total_pedido, estado = "COMPLETADO" WHERE id_pedido = ?', 
            [id]
        );
        
        await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'LIQUIDACIÓN', ?, ?, 'PEDIDO', ?)",
            [saldoPendiente, req.user.id, JSON.stringify(pagoDetalles), id]
        );

        // Liberar stock reservado
        const [items] = await connection.query('SELECT * FROM detalle_pedidos WHERE id_pedido = ?', [id]);
        for (const item of items) {
            await connection.query(
                'UPDATE productos SET stock_reservado = stock_reservado - ? WHERE id_producto = ?', 
                [item.cantidad, item.id_producto]
            );
        }
        
        await connection.commit();
        res.status(200).json({ message: 'Pedido liquidado y completado exitosamente.' });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error al liquidar pedido:', error);
        res.status(500).json({ message: error.message || 'Error al liquidar el pedido' });
    } finally {
        if (connection) connection.release();
    }
};

// ✅ CANCELAR PEDIDO - CON REGISTRO EN VENTAS DEL DÍA
const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        const [orderRows] = await connection.query(
            'SELECT * FROM pedidos WHERE id_pedido = ? AND estado != "CANCELADO"', 
            [id]
        );
        
        if (orderRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ 
                message: 'Pedido no encontrado o ya está cancelado' 
            });
        }

        const order = orderRows[0];

        // ✅ REGISTRAR VENTA POR CANCELACIÓN (si había abono)
        if (order.abonado > 0) {
            await connection.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'CANCELACIÓN', ?, ?, 'PEDIDO', ?)",
                [order.abonado, req.user.id, JSON.stringify({ motivo: 'Cancelación de pedido' }), id]
            );
        }

        // Revertir stock
        const [items] = await connection.query('SELECT * FROM detalle_pedidos WHERE id_pedido = ?', [id]);
        for (const item of items) {
            await connection.query(
                'UPDATE productos SET stock_reservado = stock_reservado - ?, existencia = existencia + ? WHERE id_producto = ?', 
                [item.cantidad, item.cantidad, item.id_producto]
            );
        }
        
        await connection.query(
            'UPDATE pedidos SET estado = "CANCELADO" WHERE id_pedido = ?', 
            [id]
        );
        
        await connection.commit();
        res.status(200).json({ 
            message: 'Pedido cancelado y stock revertido.' 
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error al cancelar pedido:', error);
        res.status(500).json({ 
            message: error.message || 'Error al cancelar el pedido' 
        });
    } finally {
        if (connection) connection.release();
    }
};

// ✅ Obtener usuarios para el filtro
const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query(`
            SELECT id_usuario AS id, nombre 
            FROM usuarios 
            WHERE activo = 1 
            ORDER BY nombre
        `);
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// ✅ Obtener reporte de pedidos por día
const getReportePedidos = async (req, res) => {
    try {
        const { fecha, usuario } = req.query;
        
        let query = `
            SELECT 
                DATE(o.fecha_creacion) as fecha,
                o.estado,
                COUNT(*) as total_pedidos,
                SUM(o.total_pedido) as total_ventas,
                SUM(o.abonado) as total_abonado,
                u.nombre as usuario_nombre
            FROM pedidos o
            LEFT JOIN usuarios u ON o.id_usuario = u.id_usuario
            WHERE DATE(o.fecha_creacion) = ?
        `;

        const params = [fecha];

        if (usuario && usuario !== 'todos') {
            query += ` AND o.id_usuario = ?`;
            params.push(usuario);
        }

        query += ` GROUP BY DATE(o.fecha_creacion), o.estado, u.nombre 
                   ORDER BY fecha DESC, o.estado`;

        const [reporte] = await pool.query(query, params);
        res.json(reporte);
    } catch (error) {
        console.error('Error al obtener reporte de pedidos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    getOrders,
    getOrderDetails,
    createOrder,
    addAbono,
    liquidarOrder,
    cancelOrder,
    getUsuarios,
    getReportePedidos
};