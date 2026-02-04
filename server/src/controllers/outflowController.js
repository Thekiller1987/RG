const db = require('../config/db.js');

/* ===================== PROCESS OUTFLOW (TRASLADO/SALIDA) ===================== */
const processOutflow = async (req, res) => {
    const { motivo, items } = req.body;
    const userId = req.user?.id_usuario || req.user?.id;
    const userName = req.user?.nombre_usuario || req.user?.nombre || 'Admin';

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: 'El carrito de salida está vacío.' });
    }

    if (!motivo) {
        return res.status(400).json({ msg: 'Debe especificar un motivo para la salida.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        let totalCosto = 0;
        let totalVenta = 0;
        let totalItems = 0;
        const processedItems = [];

        // 1. Validate & Deduct Stock
        for (const item of items) {
            const pid = item.id_producto || item.id;
            const qty = parseInt(item.cantidad || item.quantity, 10);

            if (qty <= 0) continue;

            // Lock row
            const [rows] = await connection.query(
                'SELECT existencia, nombre, costo, venta, codigo FROM productos WHERE id_producto = ? FOR UPDATE',
                [pid]
            );

            if (rows.length === 0) {
                throw new Error(`Producto ID ${pid} no encontrado.`);
            }

            const product = rows[0];
            if (product.existencia < qty) {
                throw new Error(`Stock insuficiente para "${product.nombre}". Disponible: ${product.existencia}, Solicitado: ${qty}.`);
            }

            // Deduct
            const newStock = product.existencia - qty;
            await connection.query('UPDATE productos SET existencia = ? WHERE id_producto = ?', [newStock, pid]);

            // Calculate totals
            const costoLine = Number(product.costo) * qty;
            const ventaLine = Number(product.venta) * qty;

            totalCosto += costoLine;
            totalVenta += ventaLine;
            totalItems += qty;

            processedItems.push({
                id: pid,
                codigo: product.codigo, // Added code
                nombre: product.nombre,
                quantity: qty,
                unit: Number(product.venta), // For ticket display
                cost: Number(product.costo), // For internal record
                total: ventaLine
            });

            // Log individual movement
            await connection.query(
                'INSERT INTO movimientos_inventario (id_producto, tipo_movimiento, detalles, id_usuario) VALUES (?, ?, ?, ?)',
                [pid, 'SALIDA_LOTE', `Salida (Traslado): ${qty} un. Motivo: ${motivo}`, userId]
            );
        }

        // 2. Create Master Ticket Record
        const detallesJson = JSON.stringify({ items: processedItems }); // Save full details for reprinting

        const [result] = await connection.query(`
      INSERT INTO inventory_outflows 
      (usuario_id, usuario_nombre, motivo, total_items, total_costo, total_venta, detalles_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, userName, motivo, totalItems, totalCosto, totalVenta, detallesJson]);

        const outflowId = result.insertId;

        await connection.commit();

        // 3. Socket Emit (Update frontend inventory)
        const io = req.app.get('io');
        if (io) {
            io.emit('inventory_update', { action: 'bulk_outflow' });
        }

        // 4. Return Ticket Data
        // Construct a transaction-like object compatible with TicketModal
        const ticketData = {
            id: `TR-${outflowId}`,
            outflowId: outflowId,
            type: 'outflow',
            fecha: new Date().toISOString(),
            usuarioNombre: userName,
            clienteNombre: `MOTIVO: ${motivo}`, // Start of clever reuse: Display Motivo where Client Name usually goes
            items: processedItems,
            totalVenta: totalVenta,
            totalCosto: totalCosto, // Extra field
            totalItems: totalItems,
            isOutflow: true // Flag for TicketModal customization
        };

        res.status(201).json({ msg: 'Salida procesada correctamente.', ticket: ticketData });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error processing outflow:', error);
        res.status(500).json({ msg: error.message || 'Error al procesar la salida.' });
    } finally {
        if (connection) connection.release();
    }
};

/* ===================== GET HISTORY ===================== */
const getOutflowHistory = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT * FROM inventory_outflows 
      ORDER BY fecha DESC 
      LIMIT 100
    `);

        // Parse JSON details for frontend
        const history = rows.map(row => {
            let items = [];
            try {
                const parsed = typeof row.detalles_json === 'string' ? JSON.parse(row.detalles_json) : row.detalles_json;
                items = parsed.items || [];
            } catch (e) { items = []; }

            return {
                ...row,
                items // Expand items for viewing
            };
        });

        res.json(history);
    } catch (error) {
        console.error('Error fetching outflow history:', error);
        res.status(500).json({ msg: 'Error al obtener el historial.' });
    }
};

module.exports = {
    processOutflow,
    getOutflowHistory
};
