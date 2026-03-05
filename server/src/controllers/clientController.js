const pool = require('../config/db');

/* ═══════════════════════════════════════════════════════════════
   AUTO-MIGRACIÓN: Tabla creditos_cliente
   Se ejecuta al importar este módulo — idempotente.
   ═══════════════════════════════════════════════════════════════ */
(async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS creditos_cliente (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_venta INT NOT NULL,
        id_cliente INT NOT NULL,
        monto_original DECIMAL(12,2) NOT NULL,
        saldo_restante DECIMAL(12,2) NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('PENDIENTE','PAGADO','DEVUELTO') DEFAULT 'PENDIENTE',
        INDEX idx_cliente (id_cliente),
        INDEX idx_venta (id_venta)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

        // Migrar datos históricos: ventas a crédito que aún no tienen registro
        const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM creditos_cliente');
        if (existing[0].cnt === 0) {
            // Solo migrar si la tabla está vacía (primera vez)
            const [creditSales] = await pool.query(`
        SELECT v.id_venta, v.id_cliente, v.total_venta, v.pago_detalles, v.fecha, v.estado
        FROM ventas v
        WHERE v.tipo_venta = 'CREDITO'
          AND v.estado = 'COMPLETADA'
          AND v.id_cliente IS NOT NULL
      `);

            for (const sale of creditSales) {
                let pd = sale.pago_detalles;
                if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
                const montoCredito = Number(pd?.credito || sale.total_venta || 0);
                if (montoCredito <= 0) continue;

                // Calcular cuánto se ha abonado a este cliente después de esta venta
                // Nota: los abonos no tienen id_venta de referencia en el sistema viejo
                // Así que insertamos el crédito con el saldo_restante = monto_original
                // y el saldo real del cliente queda controlado por clientes.saldo_pendiente
                await pool.query(
                    `INSERT IGNORE INTO creditos_cliente (id_venta, id_cliente, monto_original, saldo_restante, fecha, estado)
           VALUES (?, ?, ?, ?, ?, 'PENDIENTE')`,
                    [sale.id_venta, sale.id_cliente, montoCredito, montoCredito, sale.fecha]
                );
            }

            // Ahora recalcular saldo_restante basado en abonos existentes
            // Obtener total abonado por cada cliente
            const [abonos] = await pool.query(`
        SELECT v.id_cliente, SUM(ABS(v.total_venta)) as total_abonado
        FROM ventas v
        WHERE v.estado = 'ABONO_CREDITO' AND v.id_cliente IS NOT NULL
        GROUP BY v.id_cliente
      `);

            for (const abono of abonos) {
                let remaining = Number(abono.total_abonado);
                // Aplicar FIFO: pagar las facturas más antiguas primero
                const [tickets] = await pool.query(
                    `SELECT id, saldo_restante FROM creditos_cliente
           WHERE id_cliente = ? AND saldo_restante > 0
           ORDER BY fecha ASC`,
                    [abono.id_cliente]
                );

                for (const ticket of tickets) {
                    if (remaining <= 0) break;
                    const aplicar = Math.min(remaining, Number(ticket.saldo_restante));
                    const nuevoSaldo = Number(ticket.saldo_restante) - aplicar;
                    await pool.query(
                        `UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?`,
                        [nuevoSaldo, nuevoSaldo <= 0 ? 'PAGADO' : 'PENDIENTE', ticket.id]
                    );
                    remaining -= aplicar;
                }
            }

            console.log(`✅ Migración creditos_cliente: ${creditSales.length} registros procesados.`);
        }

        console.log('✅ Tabla creditos_cliente verificada.');
    } catch (err) {
        console.error('⚠️ Error creando tabla creditos_cliente:', err.message);
    }
})();

/* ═══════════════════════════════════════════════════════════════
   CRUD CLIENTES
   ═══════════════════════════════════════════════════════════════ */

const getAllClients = async (req, res) => {
    try {
        const [clients] = await pool.query(`
      SELECT c.id_cliente, c.nombre, c.telefono, c.direccion, c.limite_credito, c.tipo_cliente,
             COALESCE(c.saldo_pendiente, 0) as saldo_pendiente
      FROM clientes c ORDER BY c.nombre ASC
    `);
        res.json(clients.map(c => ({ ...c, saldo_pendiente: parseFloat(c.saldo_pendiente) })));
    } catch (error) {
        console.error("ERROR (getAllClients):", error);
        res.status(500).json({ message: 'Error en el servidor al obtener clientes' });
    }
};

const createClient = async (req, res) => {
    const { nombre, telefono, direccion, limite_credito, tipo_cliente } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, telefono, direccion, limite_credito, tipo_cliente) VALUES (?, ?, ?, ?, ?)',
            [nombre, telefono || null, direccion || null, limite_credito, tipo_cliente || 'General']
        );
        res.status(201).json({ message: 'Cliente creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error("ERROR (createClient):", error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, limite_credito, tipo_cliente } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    try {
        await pool.query(
            'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ?, limite_credito = ?, tipo_cliente = ? WHERE id_cliente = ?',
            [nombre, telefono || null, direccion || null, limite_credito, tipo_cliente || 'General', id]
        );
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT saldo_pendiente as saldo FROM clientes WHERE id_cliente = ?', [id]);
        if (rows.length > 0 && parseFloat(rows[0].saldo) > 0) {
            return res.status(400).json({ message: `No se puede eliminar. Saldo pendiente: C$${parseFloat(rows[0].saldo).toFixed(2)}.` });
        }
        await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: 'Error al eliminar cliente, puede que tenga facturas asociadas.' });
    }
};

/* ═══════════════════════════════════════════════════════════════
   CRÉDITOS: Abono con soporte por ticket (FIFO si no especifica)
   ═══════════════════════════════════════════════════════════════ */
const addCreditPayment = async (req, res) => {
    const { id } = req.params;           // id_cliente
    const { monto, pagoDetalles, id_venta } = req.body; // id_venta = ticket específico (opcional)
    const { id: userId } = req.user;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Registrar abono en tabla ventas (igual que antes)
        const [abonoResult] = await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, id_cliente, pago_detalles, tipo_venta) VALUES (NOW(), ?, 'ABONO_CREDITO', ?, ?, ?, 'CREDITO')",
            [monto * -1, userId, id, JSON.stringify(pagoDetalles)]
        );
        const abonoId = abonoResult.insertId;

        // 2. Reducir saldo_pendiente del cliente
        await connection.query(
            'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
            [monto, id]
        );

        // 3. Aplicar a ticket(s) en creditos_cliente
        let remaining = Number(monto);

        if (id_venta) {
            // Abono dirigido a ticket específico
            const [ticket] = await connection.query(
                'SELECT id, saldo_restante FROM creditos_cliente WHERE id_venta = ? AND id_cliente = ? AND saldo_restante > 0 FOR UPDATE',
                [id_venta, id]
            );
            if (ticket.length > 0) {
                const aplicar = Math.min(remaining, Number(ticket[0].saldo_restante));
                const nuevoSaldo = Number(ticket[0].saldo_restante) - aplicar;
                await connection.query(
                    'UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?',
                    [nuevoSaldo, nuevoSaldo <= 0 ? 'PAGADO' : 'PENDIENTE', ticket[0].id]
                );
                remaining -= aplicar;
            }
        }

        // Si sobra monto (o no se especificó ticket), aplicar FIFO
        if (remaining > 0) {
            const [pendientes] = await connection.query(
                'SELECT id, saldo_restante FROM creditos_cliente WHERE id_cliente = ? AND saldo_restante > 0 ORDER BY fecha ASC FOR UPDATE',
                [id]
            );
            for (const t of pendientes) {
                if (remaining <= 0) break;
                const aplicar = Math.min(remaining, Number(t.saldo_restante));
                const nuevoSaldo = Number(t.saldo_restante) - aplicar;
                await connection.query(
                    'UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?',
                    [nuevoSaldo, nuevoSaldo <= 0 ? 'PAGADO' : 'PENDIENTE', t.id]
                );
                remaining -= aplicar;
            }
        }

        await connection.commit();

        // ─── SOCKET.IO EMIT ───
        const io = req.app.get('io');
        if (io) io.emit('clients:update');

        res.status(200).json({ message: 'Abono registrado exitosamente.', abonoId });
    } catch (error) {
        await connection.rollback();
        console.error("ERROR en addCreditPayment:", error);
        res.status(500).json({ message: 'Error al registrar el abono.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

/* ═══════════════════════════════════════════════════════════════
   CONSULTAS DE CRÉDITO
   ═══════════════════════════════════════════════════════════════ */

// Obtener ventas a crédito del cliente (historial)
const getCreditosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
      SELECT v.id_venta, v.fecha, v.total_venta AS total, v.estado, v.pago_detalles AS pagoDetalles
      FROM ventas v
      WHERE v.id_cliente = ? AND v.tipo_venta = 'CREDITO' AND v.estado = 'COMPLETADA'
      ORDER BY v.fecha DESC
    `, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener créditos:", error);
        res.status(500).json({ message: "Error al obtener créditos del cliente" });
    }
};

// Obtener abonos del cliente
const getAbonosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
      SELECT v.id_venta AS id_abono, v.fecha, ABS(v.total_venta) AS monto, 
             u.nombre_usuario AS usuario, v.pago_detalles AS pagoDetalles
      FROM ventas v
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.id_cliente = ? AND v.estado = 'ABONO_CREDITO'
      ORDER BY v.fecha DESC
    `, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener abonos:", error);
        res.status(500).json({ message: "Error al obtener abonos del cliente" });
    }
};

// NUEVO: Facturas pendientes (con saldo_restante > 0) para el modal de abono
const getCreditosPendientes = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
      SELECT cc.id, cc.id_venta, cc.monto_original, cc.saldo_restante, cc.fecha, cc.estado,
             v.total_venta, v.pago_detalles AS pagoDetalles
      FROM creditos_cliente cc
      LEFT JOIN ventas v ON cc.id_venta = v.id_venta
      WHERE cc.id_cliente = ? 
      ORDER BY cc.fecha ASC
    `, [id]);

        const parsed = rows.map(r => {
            let pd = r.pagoDetalles;
            if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
            return {
                id: r.id,
                idVenta: r.id_venta,
                montoOriginal: Number(r.monto_original),
                saldoRestante: Number(r.saldo_restante),
                fecha: r.fecha,
                estado: r.estado,
                totalVenta: Number(r.total_venta),
                pagoDetalles: pd
            };
        });

        res.json(parsed);
    } catch (error) {
        console.error("Error al obtener créditos pendientes:", error);
        res.status(500).json({ message: "Error al obtener créditos pendientes" });
    }
};

// NUEVO: Estado de Cuenta (Account Statement) — CON PRODUCTOS
const getAccountStatement = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Get Client Info
        const [clientRows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        if (clientRows.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
        const client = clientRows[0];

        // 2. Get All relevant transactions (Créditos, Abonos, Devoluciones de Crédito)
        const [sales] = await pool.query(`
            SELECT id_venta, fecha, total_venta, estado, tipo_venta, pago_detalles, referencia_pedido 
            FROM ventas 
            WHERE id_cliente = ? 
              AND estado != 'CANCELADA'
              AND (tipo_venta = 'CREDITO' OR estado = 'ABONO_CREDITO' OR estado = 'DEVOLUCION')
            ORDER BY fecha ASC, id_venta ASC
        `, [id]);

        // 3. Get product details for ALL credit sales in one query
        const creditSaleIds = sales
            .filter(s => s.tipo_venta === 'CREDITO' && s.estado !== 'ABONO_CREDITO')
            .map(s => s.id_venta);

        let productsMap = {};
        if (creditSaleIds.length > 0) {
            const [productRows] = await pool.query(`
                SELECT dv.id_venta, dv.cantidad, dv.precio_unitario,
                       COALESCE(p.nombre, CONCAT('Producto #', dv.id_producto)) AS nombre_producto,
                       p.codigo
                FROM detalle_ventas dv
                LEFT JOIN productos p ON dv.id_producto = p.id_producto
                WHERE dv.id_venta IN (?)
                ORDER BY dv.id_venta, dv.id_producto
            `, [creditSaleIds]);

            productRows.forEach(row => {
                if (!productsMap[row.id_venta]) productsMap[row.id_venta] = [];
                productsMap[row.id_venta].push({
                    nombre: row.nombre_producto,
                    codigo: row.codigo || '',
                    cantidad: Number(row.cantidad),
                    precioUnitario: Number(row.precio_unitario),
                    subtotal: Number(row.cantidad) * Number(row.precio_unitario)
                });
            });
        }

        let runningBalance = 0;
        const ledger = [];

        sales.forEach(sale => {
            let pd = {};
            if (typeof sale.pago_detalles === 'string') {
                try { pd = JSON.parse(sale.pago_detalles); } catch { pd = {}; }
            } else if (sale.pago_detalles) {
                pd = sale.pago_detalles;
            }

            let creditImpact = 0;
            let type = '';
            let description = '';

            if (sale.estado === 'ABONO_CREDITO') {
                creditImpact = Number(sale.total_venta);
                type = 'ABONO';
                description = pd.referencia ? `Abono (${pd.referencia})` : 'Abono a cuenta';
            } else if (sale.estado === 'DEVOLUCION') {
                const creditoDevuelto = Number(pd.credito || 0);
                if (creditoDevuelto < 0) {
                    creditImpact = creditoDevuelto;
                    type = 'DEVOLUCION';
                    description = pd.nota || `Devolución Ticket #${pd.originalSaleId || ''}`;
                } else {
                    return;
                }
            } else if (sale.tipo_venta === 'CREDITO') {
                const creditoOtorgado = Number(pd.credito || sale.total_venta || 0);
                if (creditoOtorgado > 0) {
                    creditImpact = creditoOtorgado;
                    type = 'CREDITO';
                    description = `Venta a crédito Ticket #${sale.id_venta}`;
                } else {
                    return;
                }
            }

            if (creditImpact !== 0) {
                runningBalance += creditImpact;
                ledger.push({
                    id_venta: sale.id_venta,
                    fecha: sale.fecha,
                    tipo: type,
                    descripcion: description,
                    monto: Math.abs(creditImpact),
                    impacto: creditImpact,
                    saldo: runningBalance,
                    pagoDetalles: pd,
                    productos: productsMap[sale.id_venta] || null
                });
            }
        });

        const response = {
            cliente: {
                id: client.id_cliente,
                nombre: client.nombre,
                telefono: client.telefono,
                direccion: client.direccion,
                limite_credito: client.limite_credito,
                saldo_pendiente_db: Number(client.saldo_pendiente),
                saldo_calculado: parseFloat(runningBalance.toFixed(2))
            },
            historial: ledger
        };

        res.json(response);
    } catch (error) {
        console.error("Error al obtener estado de cuenta:", error);
        res.status(500).json({ message: "Error al obtener estado de cuenta del cliente" });
    }
};

/* ═══════════════════════════════════════════════════════════════
   CANCELAR ABONO — Revierte un abono erróneo
   ═══════════════════════════════════════════════════════════════ */
const cancelCreditPayment = async (req, res) => {
    const { id, abonoId } = req.params; // id = id_cliente, abonoId = id_venta del abono
    const { id: userId } = req.user;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Verificar que el abono existe y pertenece a este cliente
        const [abonoRows] = await connection.query(
            `SELECT id_venta, total_venta, pago_detalles, id_usuario FROM ventas 
             WHERE id_venta = ? AND id_cliente = ? AND estado = 'ABONO_CREDITO' FOR UPDATE`,
            [abonoId, id]
        );

        if (abonoRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Abono no encontrado o ya fue cancelado.' });
        }

        const abono = abonoRows[0];
        const montoAbono = Math.abs(Number(abono.total_venta)); // total_venta es negativo
        let pd = {};
        if (typeof abono.pago_detalles === 'string') { try { pd = JSON.parse(abono.pago_detalles); } catch { pd = {}; } }
        else if (abono.pago_detalles) { pd = abono.pago_detalles; }

        // 2. Restaurar saldo_pendiente del cliente
        await connection.query(
            'UPDATE clientes SET saldo_pendiente = saldo_pendiente + ? WHERE id_cliente = ?',
            [montoAbono, id]
        );

        // 3. Restaurar saldo en creditos_cliente (FIFO inverso: del m\u00e1s reciente al m\u00e1s antiguo)
        let remaining = montoAbono;
        const [creditosYaPagados] = await connection.query(
            `SELECT id, monto_original, saldo_restante FROM creditos_cliente 
             WHERE id_cliente = ? ORDER BY fecha DESC FOR UPDATE`,
            [id]
        );

        for (const ticket of creditosYaPagados) {
            if (remaining <= 0) break;
            const pagado = Number(ticket.monto_original) - Number(ticket.saldo_restante);
            if (pagado <= 0) continue;

            const restaurar = Math.min(remaining, pagado);
            const nuevoSaldo = Number(ticket.saldo_restante) + restaurar;
            await connection.query(
                'UPDATE creditos_cliente SET saldo_restante = ?, estado = ? WHERE id = ?',
                [nuevoSaldo, nuevoSaldo > 0 ? 'PENDIENTE' : 'PAGADO', ticket.id]
            );
            remaining -= restaurar;
        }

        // 4. Marcar el abono como cancelado
        await connection.query(
            `UPDATE ventas SET estado = 'CANCELADA' WHERE id_venta = ?`,
            [abonoId]
        );

        // 5. Revertir la transacci\u00f3n de caja — agregar tx de reversa a la sesi\u00f3n abierta
        const cajaUserId = abono.id_usuario || userId;
        const [cajaRows] = await connection.query(
            `SELECT id, detalles_json, monto_inicial FROM cierres_caja 
             WHERE usuario_id = ? AND fecha_cierre IS NULL LIMIT 1`,
            [cajaUserId]
        );

        // Obtener nombre del cliente
        const [clienteRows] = await connection.query(
            'SELECT nombre FROM clientes WHERE id_cliente = ?', [id]
        );
        const clienteNombre = clienteRows[0]?.nombre || 'Desconocido';

        if (cajaRows.length > 0) {
            const cajaRow = cajaRows[0];
            let details = {};
            if (typeof cajaRow.detalles_json === 'string') { try { details = JSON.parse(cajaRow.detalles_json); } catch { details = {}; } }
            else if (cajaRow.detalles_json) { details = cajaRow.detalles_json; }

            if (!details.transactions) details.transactions = [];

            const metodo = pd.metodo || 'Efectivo';
            const esEfectivo = metodo === 'Efectivo';

            // Agregar transacci\u00f3n de reversa (resta de caja)
            details.transactions.push({
                id: `cancel-abono-${abonoId}-${Date.now()}`,
                type: 'cancel_abono',
                amount: montoAbono * -1,
                note: `Cancelaci\u00f3n de Abono #${abonoId} - Cliente: ${clienteNombre}`,
                at: new Date().toISOString(),
                pagoDetalles: {
                    clienteId: Number(id),
                    clienteNombre: clienteNombre,
                    metodo: metodo,
                    referencia: pd.referencia || '',
                    ingresoCaja: esEfectivo ? (montoAbono * -1) : 0,
                    efectivo: esEfectivo ? (montoAbono * -1) : 0,
                    tarjeta: metodo === 'Tarjeta' ? (montoAbono * -1) : 0,
                    transferencia: metodo === 'Transferencia' ? (montoAbono * -1) : 0,
                    credito: 0
                }
            });

            // Recalcular totales
            let totalEfectivo = 0, totalTarjeta = 0, totalTransferencia = 0, movNeto = 0;
            for (const tx of details.transactions) {
                const amt = Number(tx.amount || 0);
                const txPd = tx.pagoDetalles || {};
                totalEfectivo += Number(txPd.efectivo || 0);
                totalTarjeta += Number(txPd.tarjeta || 0);
                totalTransferencia += Number(txPd.transferencia || 0);
                movNeto += Number(txPd.ingresoCaja ?? (txPd.efectivo || 0));
            }

            const finalEsperado = Number(cajaRow.monto_inicial || 0) + movNeto;

            await connection.query(`
                UPDATE cierres_caja 
                SET detalles_json = ?,
                    total_efectivo = ?,
                    total_tarjeta = ?,
                    total_transferencia = ?,
                    efectivo_esperado = ?
                WHERE id = ?
            `, [JSON.stringify(details), totalEfectivo, totalTarjeta, totalTransferencia, finalEsperado, cajaRow.id]);
        }

        await connection.commit();

        // 6. Emitir eventos de actualizaci\u00f3n
        const io = req.app.get('io');
        if (io) {
            io.emit('clients:update');
            io.emit('caja:session_update', { userId: cajaUserId });
        }

        res.json({ message: 'Abono cancelado exitosamente.', montoCancelado: montoAbono });
    } catch (error) {
        await connection.rollback();
        console.error('ERROR en cancelCreditPayment:', error);
        res.status(500).json({ message: 'Error al cancelar el abono.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    addCreditPayment,
    cancelCreditPayment,
    getCreditosByClient,
    getAbonosByClient,
    getCreditosPendientes,
    getAccountStatement,
};