const { pool } = require('../config/db'); // CAMBIO 1: Importamos el pool desestructurado

// Función auxiliar para manejar las transacciones sin mysql2
// PostgreSQL usa pool.connect() para transacciones
const executeTransaction = async (queries) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const results = [];
        for (const { text, values } of queries) {
            const result = await client.query(text, values);
            results.push(result);
        }
        await client.query('COMMIT');
        return results;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

const getAllClients = async (req, res) => {
    // ELIMINACIÓN: Quitamos el console.log de la operación exitosa
    // console.log("LOG: Intentando obtener todos los clientes..."); 

    try {
        // CAMBIO 2: PostgreSQL usa COALESCE
        const query = `SELECT 
            c.id_cliente,
            c.nombre,
            c.telefono,
            c.direccion,
            c.limite_credito,
            COALESCE(c.saldo_pendiente, 0) AS saldo_pendiente 
        FROM clientes c
        ORDER BY c.nombre ASC;
        `;
        
        // CAMBIO 3: Usar pool.query()
        const result = await pool.query(query);
        const clients = result.rows; // CAMBIO 4: Obtener resultados de .rows

        // PostgreSQL devuelve DECIMAL como string, la conversión a float sigue siendo útil en JS
        const clientsWithBalance = clients.map(client => ({
            ...client,
            saldo_pendiente: parseFloat(client.saldo_pendiente)
        }));

        res.json(clientsWithBalance);
    } catch (error) {
        console.error("ERROR CRÍTICO (getAllClients):", error);
        res.status(500).json({ message: 'Error en el servidor al obtener clientes' });
    }
};

const createClient = async (req, res) => {
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    }
    try {
        // CAMBIO: Usar $1, $2, $3, $4 y RETURNING id_cliente
        const result = await pool.query(
            'INSERT INTO clientes (nombre, telefono, direccion, limite_credito) VALUES ($1, $2, $3, $4) RETURNING id_cliente',
            [nombre, telefono || null, direccion || null, limite_credito]
        );
        res.status(201).json({ message: 'Cliente creado exitosamente', id: result.rows[0].id_cliente });
    } catch (error) {
        console.error("ERROR CRÍTICO (createClient):", error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    }
    try {
        // CAMBIO: Usar $1, $2, $3, $4, $5
        await pool.query(
            'UPDATE clientes SET nombre = $1, telefono = $2, direccion = $3, limite_credito = $4 WHERE id_cliente = $5',
            [nombre, telefono || null, direccion || null, limite_credito, id]
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
        // CAMBIO 1: Usar pool.query() y $1
        const result = await pool.query('SELECT saldo_pendiente as saldo FROM clientes WHERE id_cliente = $1', [id]);
        const rows = result.rows; // CAMBIO 2: Obtener filas de .rows

        if (rows.length > 0 && parseFloat(rows[0].saldo) > 0) {
            return res.status(400).json({ message: `No se puede eliminar. El cliente tiene un saldo pendiente de C$${parseFloat(rows[0].saldo).toFixed(2)}.` });
        }

        // CAMBIO 3: Usar pool.query() y $1
        await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        // En PostgreSQL, el error 23503 (FK violation) es más común que el error de MySQL
        if (error.code === '23503') {
             return res.status(500).json({ message: 'Error al eliminar cliente: El cliente tiene registros asociados (ventas, pedidos).' });
        }
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: 'Error al eliminar cliente, puede que tenga facturas asociadas.' });
    }
};

const addCreditPayment = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    // Asumimos que req.user ya está disponible por el middleware de autenticación
    const userId = req.user ? req.user.id : null; 
    
    // CAMBIO CRÍTICO: Usar la función de transacciones de PostgreSQL
    const client = await pool.connect(); 

    try {
        // Iniciar la transacción
        await client.query('BEGIN');
        
        // 1. Insertar el abono (Venta con total negativo)
        // CAMBIO 1: Usar $1, $2, $3, $4 y función NOW() de PostgreSQL
        await client.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, id_cliente, pago_detalles, tipo_venta) VALUES (NOW(), $1, 'ABONO_CREDITO', $2, $3, $4, 'CREDITO')",
            [monto * -1, userId, id, JSON.stringify(pagoDetalles)]
        );
        
        // 2. Actualizar saldo_pendiente
        // CAMBIO 2: Usar GREATEST y $1, $2
        await client.query(
            'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1) WHERE id_cliente = $2',
            [monto, id]
        );
        
        // Finalizar la transacción
        await client.query('COMMIT');
        res.status(200).json({ message: 'Abono a crédito registrado exitosamente.' });

    } catch (error) {
        // Deshacer la transacción
        await client.query('ROLLBACK');
        console.error("Error al registrar abono a crédito:", error);
        res.status(500).json({ message: 'Error al registrar el abono' });
    } finally {
        // Liberar el cliente a la piscina
        client.release(); 
    }
};

// ===================================================================
// =================== CONSULTAS DE LECTURA ==========================
// ===================================================================

const getCreditosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT v.id_venta, v.fecha, v.total_venta AS total, v.estado 
            FROM ventas v
            WHERE v.id_cliente = $1 AND v.tipo_venta = 'CREDITO'
            ORDER BY v.fecha DESC
        `;
        // CAMBIO: Usar pool.query() y $1, y obtener .rows
        const result = await pool.query(query, [id]); 
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener créditos:", error);
        res.status(500).json({ message: "Error al obtener créditos del cliente" });
    }
};

const getAbonosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT v.id_venta AS id_abono, v.fecha, ABS(v.total_venta) AS monto, u.nombre_usuario AS usuario
            FROM ventas v
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.id_cliente = $1 AND v.estado = 'ABONO_CREDITO'
            ORDER BY v.fecha DESC
        `;
        // CAMBIO: Usar pool.query() y $1, y obtener .rows
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener abonos:", error);
        res.status(500).json({ message: "Error al obtener abonos del cliente" });
    }
};

module.exports = {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    addCreditPayment,
    getCreditosByClient,
    getAbonosByClient,
};