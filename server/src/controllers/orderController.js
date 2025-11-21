const pool = require('../config/db');

/* ───────────────────────── getOrders (ACTUALIZADO para nuevos campos) ───────────────────────── */
const getOrders = async (req, res) => {
    try {
        // Obtenemos el ID del usuario si está disponible (para filtrar por vendedor)
        const userId = req.user?.id;
        const isAdminOrCajero = req.user?.rol === 'Administrador' || req.user?.rol === 'Cajero' || req.user?.rol === 'Encargado de Finanzas';

        let whereClause = '1=1';
        const params = [];

        // Filtro por vendedor si no es un rol que ve todo
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
                o.vendedor,      /* Nuevo campo: Vendedor */
                o.id_usuario,    /* Nuevo campo: ID del Vendedor */
                o.etiqueta,      /* Nuevo campo: Etiqueta */
                o.nombre_pedido, /* Nuevo campo: Nombre del Pedido */
                o.tipo           /* Nuevo campo: Tipo (pedido/apartado) */
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

/* ───────────────────────── createOrder (CORREGIDO) ───────────────────────── */
const createOrder = async (req, res) => {
    const { 
        items, total, subtotal, pagoDetalles, 
        
        // 🔑 CORRECCIÓN CLAVE: Extraemos todos los campos que React envía
        id_cliente, cliente_nombre, id_usuario, vendedor, 
        abonado, id_caja, nombre_pedido, etiqueta,
        tipo // (pedido)
        
    } = req.body;
    
    // NOTA: req.user.id se usa en el abono, aquí usamos id_usuario (vendedor)
    const userId = id_usuario || req.user?.id; 
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // 1. Asignamos 0 si el frontend no envió el campo o si fue nulo/indefinido
        // Esto resuelve el problema 'cannot be null'.
        const montoAbonado = Number(abonado) || 0; 
        
        // El estado inicial es PENDIENTE (ya que el abono es 0)
        const estadoInicial = montoAbonado > 0 ? 'APARTADO' : 'PENDIENTE';

        // 2. Construimos la consulta con todos los campos necesarios
        const pedidoData = {
            id_cliente: id_cliente || null,
            nombre_cliente: cliente_nombre || 'Consumidor Final',
            total_pedido: total,
            subtotal: subtotal,
            
            // ✅ CORREGIDO: Abonado y nuevos campos
            abonado: montoAbonado, 
            estado: estadoInicial,
            tipo: tipo || 'pedido',
            id_caja: id_caja || null,
            nombre_pedido: nombre_pedido || null,
            etiqueta: etiqueta || null,
            id_usuario: userId,
            vendedor: vendedor || 'N/A', 
            
            fecha_creacion: new Date()
        };

        const [orderResult] = await connection.query(
            // Usamos un INSERT INTO simplificado con objeto para manejar más campos
            'INSERT INTO pedidos SET ?', pedidoData
        );
        
        const orderId = orderResult.insertId;
        
        // 3. Insertar items del pedido y actualizar stock/reservado
        for (const item of items) {
            await connection.query(
                'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [orderId, item.producto_id, item.cantidad, item.precio_unitario]
            );
            
            // Actualizar stock: Se resta de existencia y suma a stock_reservado
            await connection.query(
                'UPDATE productos SET existencia = existencia - ?, stock_reservado = stock_reservado + ? WHERE id_producto = ?',
                [item.cantidad, item.cantidad, item.producto_id]
            );
        }

        // 4. Si hay abono inicial (montoAbonado), registrar venta (se mantiene la lógica)
        if (montoAbonado > 0) {
            await connection.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), ?, 'ABONO', ?, ?, 'PEDIDO', ?)",
                [montoAbonado, req.user.id, JSON.stringify(pagoDetalles || {}), orderId]
            );
        }

        await connection.commit();
        
        // Devolvemos el ID de la orden para que React pueda abrir el TicketModal
        res.status(201).json({ 
            message: 'Pedido creado exitosamente', 
            id_pedido: orderId 
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('❌ Error al crear pedido:', error);
        
        // Devolvemos un mensaje claro al frontend sobre qué campo falló
        let msg = error.message || 'Error al crear el pedido';
        if (msg.includes('abonado') || msg.includes('abonado')) {
             msg = "Error: El servidor no pudo guardar ABONADO. Revisa la definición de la tabla 'pedidos' y el código del controlador.";
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
        // Datos generales del pedido
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
                o.vendedor
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