const pool = require('../config/db');

/* ───────────────────────── getOrders (ACTUALIZADO para nuevos campos) ───────────────────────── */
const getOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const isAdminOrCajero = req.user?.rol === 'Administrador' || req.user?.rol === 'Cajero' || req.user?.rol === 'Encargado de Finanzas';

        let whereClause = '1=1';
        const params = [];

        if (!isAdminOrCajero && userId) {
            whereClause += ' AND o.id_usuario = ?';
            params.push(userId);
        }

        const query = `
            SELECT 
                o.id_pedido AS id, 
                o.id_pedido,
                COALESCE(NULLIF(o.nombre_cliente, ''), 'Cliente no asignado') AS cliente_nombre,
                o.id_cliente,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.fecha_creacion AS created_at,
                o.vendedor,      
                o.id_usuario,    
                o.etiqueta,      
                o.nombre_pedido, 
                o.tipo,
                o.id_caja        /* Aseguramos que el ID de la caja se extrae */
            FROM pedidos o
            WHERE ${whereClause}
            ORDER BY o.fecha_creacion DESC
        `;
        const [orders] = await pool.query(query, params);
        res.json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
};

/* ───────────────────────── createOrder (CORREGIDO FINAL para inserción) ───────────────────────── */
const createOrder = async (req, res) => {
    const { 
        items, total, subtotal, pagoDetalles, 
        
        // 🔑 CORRECCIÓN CLAVE: Extraemos todos los campos que React envía con sus nombres
        id_cliente, cliente_nombre, id_usuario, vendedor, 
        abonado, id_caja, nombre_pedido, etiqueta,
        tipo
        
    } = req.body;
    
    // Si el usuario no está en req.body, lo tomamos del token (req.user)
    const userId = id_usuario || req.user?.id; 
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Mapeamos abonado a un número seguro (0)
        const montoAbonado = Number(abonado) || 0; 
        const estadoInicial = montoAbonado > 0 ? 'APARTADO' : 'PENDIENTE';

        // 2. Construimos el objeto de inserción para la tabla `pedidos`
        const pedidoData = {
            id_cliente: id_cliente || null,
            nombre_cliente: cliente_nombre || 'Consumidor Final',
            total_pedido: total,
            subtotal: subtotal,
            
            // ✅ CAMPOS REQUERIDOS: Abonado, ID de Caja, Nombre y Etiqueta
            abonado: montoAbonado, 
            estado: estadoInicial,
            tipo: tipo || 'pedido',
            
            id_caja: id_caja, // ¡Ahora se extrae correctamente!
            nombre_pedido: nombre_pedido || null,
            etiqueta: etiqueta || null,
            
            id_usuario: userId,
            vendedor: vendedor || 'N/A', 
            
            fecha_creacion: new Date()
        };
        
        const [orderResult] = await connection.query(
            'INSERT INTO pedidos SET ?', pedidoData
        );
        
        const orderId = orderResult.insertId;
        
        // 3. Insertar Detalle_pedidos y actualizar stock/reservado
        for (const item of items) {
            // Aseguramos que solo usamos el ID del producto y no el objeto completo
            const productoId = item.producto_id || item.id_producto; 
            
            await connection.query(
                'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [orderId, productoId, item.cantidad, item.precio_unitario]
            );
            
            // Actualizar stock: Se resta de existencia y suma a stock_reservado
            await connection.query(
                'UPDATE productos SET existencia = existencia - ?, stock_reservado = stock_reservado + ? WHERE id_producto = ?',
                [item.cantidad, item.cantidad, productoId]
            );
        }

        // 4. Registrar Abono (si aplica)
        if (montoAbonado > 0) {
            await connection.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'ABONO', ?, ?, 'PEDIDO', ?)",
                [montoAbonado, req.user.id, JSON.stringify(pagoDetalles || {}), orderId]
            );
        }

        await connection.commit();
        
        res.status(201).json({ 
            message: 'Pedido creado exitosamente', 
            id_pedido: orderId 
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('❌ ERROR CRÍTICO al crear pedido:', error);
        
        let msg = error.message || 'Error al crear el pedido';
        if (msg.includes('id_caja')) {
             msg = "Error de BD: Falta el campo 'id_caja'. Asegúrate de seleccionar una caja abierta.";
        }
        
        res.status(500).json({ 
            message: msg
        });
    } finally {
        if (connection) connection.release();
    }
};

/* ───────────────────────── getOrderDetails (ACTUALIZADO para nuevos campos) ───────────────────────── */
const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    try {
        const [orderQuery] = await pool.query(`
            SELECT 
                o.id_pedido AS id, 
                COALESCE(NULLIF(o.nombre_cliente, ''), 'Cliente no asignado') AS cliente,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.fecha_creacion AS fecha,
                o.etiqueta,
                o.nombre_pedido,
                o.vendedor,
                o.id_caja 
            FROM pedidos o
            WHERE o.id_pedido = ?
        `, [id]);

        if (orderQuery.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        
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

/* ───────────────────────── addAbono, liquidarOrder, cancelOrder (Se mantienen) ───────────────────────── */
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
        
        await connection.query(
            'UPDATE pedidos SET abonado = total_pedido, estado = "COMPLETADO" WHERE id_pedido = ?', 
            [id]
        );
        
        await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'LIQUIDACIÓN', ?, ?, 'PEDIDO', ?)",
            [saldoPendiente, req.user.id, JSON.stringify(pagoDetalles), id]
        );

        const [items] = await pool.query('SELECT * FROM detalle_pedidos WHERE id_pedido = ?', [id]);
        for (const item of items) {
            await pool.query(
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

        const [items] = await pool.query('SELECT * FROM detalle_pedidos WHERE id_pedido = ?', [id]);
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

module.exports = {
    getOrders,
    getOrderDetails,
    createOrder,
    addAbono,
    liquidarOrder,
    cancelOrder,
};