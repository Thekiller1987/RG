// ==========================================================
// ARCHIVO: server/src/controllers/orderController.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const db = require('../config/db.js'); // CORRECCIÓN: Se importa 'db'

exports.getOrders = async (req, res) => {
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
        const { rows } = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener pedidos' });
    }
};

exports.getOrderDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const orderResult = await db.query(
            'SELECT o.id_pedido as id, c.nombre as cliente, o.total_pedido as total, o.abonado, o.estado, o.fecha_creacion as fecha FROM pedidos o LEFT JOIN clientes c ON o.id_cliente = c.id_cliente WHERE o.id_pedido = $1', 
            [id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        
        const itemsResult = await db.query(
            'SELECT p.nombre, p.codigo, dp.cantidad, dp.precio_unitario as precio FROM detalle_pedidos dp JOIN productos p ON dp.id_producto = p.id_producto WHERE dp.id_pedido = $1', 
            [id]
        );
        
        const abonosResult = await db.query(
            "SELECT fecha, total_venta as monto, pago_detalles FROM ventas WHERE tipo_venta = 'PEDIDO' AND referencia_pedido = $1 ORDER BY fecha ASC", 
            [id]
        );
        
        res.json({
            ...orderResult.rows[0],
            items: itemsResult.rows,
            abonos: abonosResult.rows
        });
    } catch (error) {
        console.error(`Error al obtener detalles del pedido ${id}:`, error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.createOrder = async (req, res) => {
    const { clienteId, items, total, abonoInicial, pagoDetalles } = req.body;
    const client = await db.getClient(); 
    
    try {
        await client.query('BEGIN');
        
        const estadoInicial = abonoInicial > 0 ? 'APARTADO' : 'PENDIENTE'; 
        
        const orderResult = await client.query(
            'INSERT INTO pedidos (id_cliente, total_pedido, abonado, estado, fecha_creacion) VALUES ($1, $2, $3, $4, NOW()) RETURNING id_pedido',
            [clienteId, total, abonoInicial, estadoInicial]
        );
        const orderId = orderResult.rows[0].id_pedido;
        
        for (const item of items) {
            await client.query(
                'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, item.precio]
            );
            await client.query(
                'UPDATE productos SET existencia = existencia - $1, stock_reservado = stock_reservado + $2 WHERE id_producto = $3',
                [item.quantity, item.quantity, item.id]
            );
        }
        
        if (abonoInicial > 0) {
            await client.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), $1, 'ABONO', $2, $3, 'PEDIDO', $4)",
                [abonoInicial, req.user.id, JSON.stringify(pagoDetalles), orderId]
            );
        }
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear pedido:', error);
        res.status(500).json({ message: error.message || 'Error al crear el pedido' });
    } finally {
        client.release();
    }
};

exports.addAbono = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    const client = await db.getClient(); 

    try {
        await client.query('BEGIN');
        
        const orderResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1 FOR UPDATE', [id]);
        if (orderResult.rows.length === 0) throw new Error('Pedido no encontrado');
        const order = orderResult.rows[0];
        
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);
        if(parseFloat(monto) > saldoPendiente + 0.01) {
            throw new Error('El monto del abono no puede ser mayor al saldo pendiente.');
        }
        
        const nuevoAbonado = parseFloat(order.abonado) + parseFloat(monto);
        
        await client.query('UPDATE pedidos SET abonado = $1, estado = \'APARTADO\' WHERE id_pedido = $2', [nuevoAbonado, id]);
        
        await client.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), $1, 'ABONO', $2, $3, 'PEDIDO', $4)",
            [monto, req.user.id, JSON.stringify(pagoDetalles), id]
        );
        
        await client.query('COMMIT');
        res.status(200).json({ message: 'Abono registrado exitosamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al registrar abono:', error);
        res.status(500).json({ message: error.message || 'Error al registrar abono' });
    } finally {
        client.release();
    }
};

exports.liquidarOrder = async (req, res) => {
    const { id } = req.params;
    const { pagoDetalles } = req.body;
    const client = await db.getClient(); 

    try {
        await client.query('BEGIN');
        
        const orderResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1 FOR UPDATE', [id]);
        if (orderResult.rows.length === 0) throw new Error('Pedido no encontrado');
        const order = orderResult.rows[0];
        
        const saldoPendiente = parseFloat(order.total_pedido) - parseFloat(order.abonado);
        
        await client.query(
            'UPDATE pedidos SET abonado = total_pedido, estado = $1 WHERE id_pedido = $2', 
            ['COMPLETADO', id]
        ); 
        
        if (saldoPendiente > 0) {
            await client.query(
                "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta, referencia_pedido) VALUES (NOW(), $1, 'LIQUIDACION', $2, $3, 'PEDIDO', $4)",
                [saldoPendiente, req.user.id, JSON.stringify(pagoDetalles), id]
            );
        }
        
        const itemsResult = await client.query('SELECT * FROM detalle_pedidos WHERE id_pedido = $1', [id]);
        
        for (const item of itemsResult.rows) {
            await client.query(
                'UPDATE productos SET stock_reservado = stock_reservado - $1 WHERE id_producto = $2', 
                [item.cantidad, item.id_producto]
            );
        }
        
        await client.query('COMMIT');
        res.status(200).json({ message: 'Pedido liquidado y completado exitosamente.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al liquidar pedido:', error);
        res.status(500).json({ message: error.message || 'Error al liquidar el pedido' });
    } finally {
        client.release();
    }
};

exports.cancelOrder = async (req, res) => {
    const { id } = req.params;
    const client = await db.getClient(); 
    
    try {
        await client.query('BEGIN');
        
        const orderResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1 AND estado != $2 FOR UPDATE', [id, 'CANCELADO']);
        
        if (orderResult.rows.length === 0) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(404).json({ message: 'Pedido no encontrado o ya está cancelado' });
        }

        const itemsResult = await client.query('SELECT * FROM detalle_pedidos WHERE id_pedido = $1', [id]);
        
        for (const item of itemsResult.rows) {
            await client.query(
                'UPDATE productos SET stock_reservado = stock_reservado - $1, existencia = existencia + $2 WHERE id_producto = $3', 
                [item.cantidad, item.cantidad, item.id_producto]
            );
        }
        
        await client.query('UPDATE pedidos SET estado = $1 WHERE id_pedido = $2', ['CANCELADO', id]);
        
        await client.query('COMMIT');
        res.status(200).json({ message: 'Pedido cancelado y stock revertido.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al cancelar pedido:', error);
        res.status(500).json({ message: error.message || 'Error al cancelar el pedido' });
    } finally {
        client.release();
    }
};