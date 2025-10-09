const { pool } = require('../config/db.js'); 

const getOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id_pedido AS id, 
                c.nombre AS clienteNombre, 
                o.id_cliente AS clienteId,
                o.total_pedido AS total, 
                o.abonado, 
                o.estado, 
                o.fecha_creacion AS fecha
            FROM pedidos o
            LEFT JOIN clientes c ON o.id_cliente = c.id_cliente
            ORDER BY o.fecha_creacion DESC
        `;
        // CAMBIO: Usar pool.query() y obtener .rows
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
};

const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        // CAMBIO 1: pool.query() en lugar de connection.query, $1 en lugar de ?
        const orderResult = await pool.query(
            'SELECT o.id_pedido as id, c.nombre as cliente, o.total_pedido as total, o.abonado, o.estado, o.fecha_creacion as fecha FROM pedidos o LEFT JOIN clientes c ON o.id_cliente = c.id_cliente WHERE o.id_pedido = $1', 
            [id]
        );
        const orderQuery = orderResult.rows;

        if (orderQuery.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        
        // CAMBIO 2: pool.query() y $1
        const itemsResult = await pool.query(
            'SELECT p.nombre, p.codigo, dp.cantidad, dp.precio_unitario as precio FROM detalle_pedidos dp JOIN productos p ON dp.id_producto = p.id_producto WHERE dp.id_pedido = $1', 
            [id]
        );
        const itemsQuery = itemsResult.rows;
        
        // CAMBIO 3: pool.query() y $1
        const abonosResult = await pool.query(
            "SELECT fecha, total_venta as monto, pago_detalles FROM ventas WHERE tipo_venta = 'PEDIDO' AND referencia_pedido = $1 ORDER BY fecha ASC", 
            [id]
        );
        const abonosQuery = abonosResult.rows;
        
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

const createOrder = async (req, res) => {
    const { clienteId, items, total, abonoInicial, pagoDetalles } = req.body;
    // CAMBIO 1: Usar pool.connect() para manejar la transacción
    const client = await pool.connect(); 
    
    try {
        // Iniciar transacción
        await client.query('BEGIN');
        
        // El estado se define con las mayúsculas de PostgreSQL
        const estadoInicial = abonoInicial > 0 ? 'APARTADO' : 'PENDIENTE'; 
        
        // 1. Insertar Pedido
        // CAMBIO 2: $1, $2, $3, $4, NOW() y RETURNING id_pedido
        const orderResult = await client.query(
            'INSERT INTO pedidos (id_cliente, total_pedido, abonado, estado, fecha_creacion) VALUES ($1, $2, $3, $4, NOW()) RETURNING id_pedido',
            [clienteId, total, abonoInicial, estadoInicial]
        );
        const orderId = orderResult.rows[0].id_pedido; // Obtener el ID insertado
        
        for (const item of items) {
            // 2. Insertar Detalle de Pedido
            // CAMBIO 3: $1, $2, $3, $4
            await client.query(
                'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, item.precio]
            );
            
            // 3. Actualizar Stock
            // CAMBIO 4: $1, $2, $3
            await client.query(
                'UPDATE productos SET existencia = existencia - $1, stock_reservado = stock_reservado + $2 WHERE id_producto = $3',
                [item.quantity, item.quantity, item.id]
            );
        }
        
        // 4. Registrar Abono Inicial (si existe)
        if (abonoInicial > 0) {
            // CAMBIO 5: $1, $2, $3
            await client.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), $1, 'ABONO', $2, $3, 'PEDIDO', $4)",
                [abonoInicial, req.user.id, JSON.stringify(pagoDetalles), orderId]
            );
        }
        
        // Finalizar transacción
        await client.query('COMMIT');
        res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
    } catch (error) {
        // Deshacer transacción
        await client.query('ROLLBACK');
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: error.message || 'Error al crear el pedido' });
    } finally {
        // Liberar el cliente
        client.release();
    }
};

const addAbono = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    // CAMBIO 1: Usar pool.connect() para manejar la transacción
    const client = await pool.connect(); 

    try {
        // Iniciar transacción
        await client.query('BEGIN');
        
        // 1. Obtener y Bloquear Pedido
        // CAMBIO 2: Usar $1 y FOR UPDATE
        const orderResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1 FOR UPDATE', [id]);
        const orderRows = orderResult.rows; 

        if (orderRows.length === 0) throw new Error('Pedido no encontrado');
        const order = orderRows[0];
        
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);
        
        if(parseFloat(monto) > saldoPendiente + 0.01) {
            throw new Error('El monto del abono no puede ser mayor al saldo pendiente.');
        }
        
        const nuevoAbonado = parseFloat(order.abonado) + parseFloat(monto);
        
        // 2. Actualizar Pedido
        // CAMBIO 3: $1, $2
        await client.query('UPDATE pedidos SET abonado = $1 WHERE id_pedido = $2', [nuevoAbonado, id]);
        
        // 3. Insertar Venta (Abono)
        // CAMBIO 4: $1, $2, $3, $4
        await client.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), $1, 'ABONO', $2, $3, 'PEDIDO', $4)",
            [monto, req.user.id, JSON.stringify(pagoDetalles), id]
        );
        
        // Finalizar transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Abono registrado exitosamente' });
    } catch (error) {
        // Deshacer transacción
        await client.query('ROLLBACK');
        console.error('Error al registrar abono:', error);
        res.status(500).json({ message: error.message || 'Error al registrar abono' });
    } finally {
        // Liberar el cliente
        client.release();
    }
};

const liquidarOrder = async (req, res) => {
    const { id } = req.params;
    const { pagoDetalles } = req.body;
    // CAMBIO 1: Usar pool.connect() para manejar la transacción
    const client = await pool.connect(); 

    try {
        // Iniciar transacción
        await client.query('BEGIN');
        
        // 1. Obtener y Bloquear Pedido
        // CAMBIO 2: Usar $1 y FOR UPDATE
        const orderResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1 FOR UPDATE', [id]);
        const orderRows = orderResult.rows;

        if (orderRows.length === 0) throw new Error('Pedido no encontrado');
        const order = orderRows[0];
        
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);
        
        // 2. Actualizar Pedido a COMPLETADO
        // CAMBIO 3: En PostgreSQL, la función UPPER() se puede usar para el estado o usar la constante 'COMPLETADO'. 
        // Usaremos la constante y $1
        await client.query(
            'UPDATE pedidos SET abonado = total_pedido, estado = $1 WHERE id_pedido = $2', 
            ['COMPLETADO', id]
        ); 
        
        // 3. Insertar Venta de Liquidación
        // CAMBIO 4: $1, $2, $3, $4
        await client.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), $1, 'LIQUIDACION', $2, $3, 'PEDIDO', $4)",
            [saldoPendiente, req.user.id, JSON.stringify(pagoDetalles), id]
        );
        
        // 4. Liberar Stock Reservado
        // CAMBIO 5: SELECT y obtención de .rows
        const itemsResult = await client.query('SELECT * FROM detalle_pedidos WHERE id_pedido = $1', [id]);
        const items = itemsResult.rows;
        
        for (const item of items) {
            // CAMBIO 6: $1, $2
            await client.query(
                'UPDATE productos SET stock_reservado = stock_reservado - $1 WHERE id_producto = $2', 
                [item.cantidad, item.id_producto]
            );
        }
        
        // Finalizar transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Pedido liquidado y completado exitosamente.' });
    } catch (error) {
        // Deshacer transacción
        await client.query('ROLLBACK');
        console.error('Error al liquidar pedido:', error);
        res.status(500).json({ message: error.message || 'Error al liquidar el pedido' });
    } finally {
        // Liberar el cliente
        client.release();
    }
};

const cancelOrder = async (req, res) => {
    const { id } = req.params;
    // CAMBIO 1: Usar pool.connect() para manejar la transacción
    const client = await pool.connect(); 
    
    try {
        // Iniciar transacción
        await client.query('BEGIN');
        
        // 1. Obtener y Bloquear Pedido
        // CAMBIO 2: SELECT y obtención de .rows. Usamos 'CANCELADO' en mayúsculas (PostgreSQL enum).
        const orderResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1 AND estado != $2', [id, 'CANCELADO']);
        const orderRows = orderResult.rows;
        
        if (orderRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Pedido no encontrado o ya está cancelado' });
        }

        // 2. Obtener Detalle de Pedido
        // CAMBIO 3: SELECT y obtención de .rows
        const itemsResult = await client.query('SELECT * FROM detalle_pedidos WHERE id_pedido = $1', [id]);
        const items = itemsResult.rows;

        // 3. Revertir Stock Reservado y Sumar a Existencia
        for (const item of items) {
            // CAMBIO 4: $1, $2, $3
            await client.query(
                'UPDATE productos SET stock_reservado = stock_reservado - $1, existencia = existencia + $2 WHERE id_producto = $3', 
                [item.cantidad, item.cantidad, item.id_producto]
            );
        }
        
        // 4. Marcar Pedido como Cancelado
        // CAMBIO 5: $1, $2. Usamos 'CANCELADO' en mayúsculas.
        await client.query('UPDATE pedidos SET estado = $1 WHERE id_pedido = $2', ['CANCELADO', id]);
        
        // Finalizar transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Pedido cancelado y stock revertido.' });

    } catch (error) {
        // Deshacer transacción
        await client.query('ROLLBACK');
        console.error('Error al cancelar pedido:', error);
        res.status(500).json({ message: error.message || 'Error al cancelar el pedido' });
    } finally {
        // Liberar el cliente
        client.release();
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