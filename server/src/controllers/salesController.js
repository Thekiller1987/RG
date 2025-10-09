// ==========================================================
// ARCHIVO: server/src/controllers/salesController.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const db = require('../config/db'); // CORRECCIÓN: Se importa 'db'

// Crear una Venta
exports.createSale = async (req, res) => {
    const { totalVenta, items, pagoDetalles, userId, clientId } = req.body;
    const client = await db.getClient();
    
    try {
        await client.query('BEGIN');
        
        if (!totalVenta && totalVenta !== 0 || !items || items.length === 0 || !pagoDetalles || !userId) {
            throw new Error('Faltan datos o no hay productos en la venta.');
        }
        
        const montoCredito = pagoDetalles.credito || 0; 
        
        // 1. Insertar la venta principal
        const saleData = [
            totalVenta,
            req.body.subtotal || totalVenta,
            req.body.descuento || 0,
            'COMPLETADA',
            userId,
            clientId,
            JSON.stringify({ ...pagoDetalles, tasaDolarAlMomento: req.body.tasaDolarAlMomento }),
            montoCredito > 0 ? 'CREDITO' : 'CONTADO',
            req.body.referencia_pedido 
        ];

        const saleQuery = `
            INSERT INTO ventas (fecha, total_venta, subtotal, descuento, estado, id_usuario, id_cliente, pago_detalles, tipo_venta, referencia_pedido) 
            VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_venta;
        `;
        const saleResult = await client.query(saleQuery, saleData);
        const saleId = saleResult.rows[0].id_venta;
        
        // 2. Sumar crédito si aplica
        if (montoCredito > 0 && clientId) {
            await client.query(
                'UPDATE clientes SET saldo_pendiente = saldo_pendiente + $1 WHERE id_cliente = $2', 
                [montoCredito, clientId]
            );
        }
        
        // 3. Descontar Stock y registrar detalles
        for (const item of items) {
            const itemId = item.id || item.id_producto;
            
            await client.query(
                'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [saleId, itemId, item.quantity, item.precio]
            );
            
            const productResult = await client.query('SELECT existencia, nombre FROM productos WHERE id_producto = $1 FOR UPDATE', [itemId]);
            if (productResult.rows.length === 0 || productResult.rows[0].existencia < item.quantity) {
                throw new Error(`Stock insuficiente para el producto: ${productResult.rows[0]?.nombre || item.nombre}`);
            }
            
            await client.query('UPDATE productos SET existencia = existencia - $1 WHERE id_producto = $2', [item.quantity, itemId]);
        }

        await client.query('COMMIT');
        
        const newSaleResult = await client.query('SELECT * FROM ventas WHERE id_venta = $1', [saleId]);
        
        res.status(201).json({ 
            message: 'Venta creada exitosamente', 
            saleId,
            saleData: { ...newSaleResult.rows[0], items, pagoDetalles } 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('ERROR CRÍTICO en transacción de venta:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al crear la venta' });
    } finally {
        client.release();
    }
};

// Cancelar una Venta
exports.cancelSale = async (req, res) => {
    const { id } = req.params;
    const client = await db.getClient();
    
    try {
        await client.query('BEGIN');
        
        const saleResult = await client.query("SELECT id_cliente, estado, pago_detalles FROM ventas WHERE id_venta = $1 FOR UPDATE", [id]);
        if (saleResult.rows.length === 0) throw new Error('La venta no existe.');
        if (saleResult.rows[0].estado === 'CANCELADA') throw new Error('Esta venta ya fue cancelada.'); 
        
        const saleData = saleResult.rows[0];
        const clientId = saleData.id_cliente;
        let detalles = {};
        try {
            detalles = typeof saleData.pago_detalles === 'string' ? JSON.parse(saleData.pago_detalles) : saleData.pago_detalles || {};
        } catch (e) {
            console.warn(`Advertencia: No se pudo parsear pago_detalles para Venta #${id}.`);
        }
        
        const montoCredito = detalles.credito || 0;
        
        const itemsResult = await client.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = $1', [id]);
        
        for (const item of itemsResult.rows) {
            await client.query('UPDATE productos SET existencia = existencia + $1 WHERE id_producto = $2', [item.cantidad, item.id_producto]);
        }
        
        if (montoCredito > 0 && clientId) {
            await client.query(
                'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1) WHERE id_cliente = $2', 
                [montoCredito, clientId]
            );
        }
        
        await client.query('UPDATE ventas SET estado = $1 WHERE id_venta = $2', ['CANCELADA', id]);
        
        await client.query('COMMIT');
        res.status(200).json({ message: 'Venta cancelada exitosamente, stock y crédito revertidos.' });
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('ERROR CRÍTICO en la cancelación de venta:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al cancelar la venta' });
    } finally {
        client.release();
    }
};

// Crear una Devolución
exports.createReturn = async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        const { originalSaleId, item, quantity, userId } = req.body;
        
        if (!originalSaleId || !item || !quantity || !userId) {
            return res.status(400).json({ message: 'Faltan datos para la devolución.' });
        }
        
        const returnAmount = item.precio * quantity;
        const pagoDetalles = { efectivo: returnAmount, ingresoCaja: returnAmount * -1, devueltoDeVenta: originalSaleId };
        
        const insertSaleQuery = `
            INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta) 
            VALUES (NOW(), $1, $2, $3, $4, 'DEVOLUCION')
            RETURNING id_venta;
        `;
        const insertSaleResult = await client.query(insertSaleQuery, 
            [returnAmount * -1, 'DEVOLUCION', userId, JSON.stringify(pagoDetalles)]
        );
        const returnId = insertSaleResult.rows[0].id_venta;
        
        await client.query(
            'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
            [returnId, item.id || item.id_producto, quantity, item.precio]
        );
        
        await client.query('UPDATE productos SET existencia = existencia + $1 WHERE id_producto = $2', [quantity, item.id || item.id_producto]);
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Devolución procesada exitosamente', returnId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en transacción de devolución:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al procesar la devolución' });
    } finally {
        client.release();
    }
};

// Obtener Ventas del Día
exports.getSales = async (req, res) => {
    try {
        const salesResult = await db.query(`
            SELECT 
                v.id_venta AS id, v.fecha, v.total_venta AS totalVenta, v.subtotal, v.descuento,
                v.estado, v.pago_detalles AS pagoDetalles, v.id_usuario AS userId, v.id_cliente AS clientId,
                c.nombre AS clienteNombre, v.tipo_venta, v.referencia_pedido
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            WHERE v.fecha::date = CURRENT_DATE 
            ORDER BY v.fecha DESC
        `);

        if (salesResult.rows.length === 0) {
            return res.json([]);
        }

        const saleIds = salesResult.rows.map(s => s.id);
        
        const detailsResult = await db.query(`
            SELECT 
                dv.id_venta, p.id_producto AS id, p.nombre,
                dv.cantidad AS quantity, dv.precio_unitario AS precio
            FROM detalle_ventas dv
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = ANY($1::int[])
        `, [saleIds]);
        
        const salesWithDetails = salesResult.rows.map(sale => {
            let parsedPagoDetalles = {};
            try {
                parsedPagoDetalles = typeof sale.pagoDetalles === 'string' && sale.pagoDetalles ? JSON.parse(sale.pagoDetalles) : sale.pagoDetalles || {};
            } catch (e) {
                console.warn(`Advertencia: Error al parsear pagoDetalles de Venta #${sale.id}.`);
            }
            return {
                ...sale,
                pagoDetalles: parsedPagoDetalles,
                items: detailsResult.rows.filter(d => d.id_venta === sale.id)
            };
        });

        res.json(salesWithDetails);
    } catch (error) {
        console.error('ERROR CRÍTICO al obtener las ventas:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener las ventas' });
    }
};