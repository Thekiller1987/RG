const { pool } = require('../config/db.js'); 

// 1. Obtener todos los Ingresos
const getAllIngresos = async (req, res) => {
    try {
        // CAMBIO: Usar pool.query() y obtener .rows
        const result = await pool.query('SELECT * FROM ingresos ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (error) {
        // Mantenemos el console.error para debugging en Netlify Logs
        console.error("Error al obtener ingresos:", error);
        res.status(500).json({ msg: "Error al obtener ingresos", error: error.message });
    }
};

// 2. Crear un nuevo Ingreso
const createIngreso = async (req, res) => {
    // Asegúrate de tener 'monto', 'descripcion', y el id_usuario que registra el ingreso
    // La fecha se genera en el lado de la DB con NOW() o en el backend con una fecha ISO.
    const { monto, descripcion, id_usuario } = req.body;
    
    try {
        // CAMBIO 1: Usar $1, $2, $3 y la función NOW() de PostgreSQL para la fecha.
        // CAMBIO 2: Usar RETURNING id_ingreso.
        const result = await pool.query(
            'INSERT INTO ingresos (fecha, monto, descripcion, id_usuario) VALUES (NOW(), $1, $2, $3) RETURNING id_ingreso', 
            [monto, descripcion, id_usuario || req.user.id] // Asumo que el ID del usuario está en req.user.id
        );
        
        // CAMBIO 3: Obtener el ID insertado de result.rows[0]
        res.status(201).json({ msg: "Ingreso registrado exitosamente", id: result.rows[0].id_ingreso });
        
    } catch (error) {
        console.error("Error al crear ingreso:", error);
        res.status(500).json({ msg: "Error al crear ingreso", error: error.message });
    }
};

// 3. Obtener todos los Egresos
const getAllEgresos = async (req, res) => {
    try {
        // CAMBIO: Usar pool.query() y obtener .rows
        const result = await pool.query('SELECT * FROM egresos ORDER BY fecha DESC'); 
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener egresos:", error);
        res.status(500).json({ msg: "Error al obtener egresos", error: error.message });
    }
};

// 4. Crear un nuevo Egreso
const createEgreso = async (req, res) => {
    // Asegúrate de tener el tipo_egreso (ej: Compra, Salario, Gasto Operativo) y id_usuario
    const { monto, descripcion, tipo_egreso, id_usuario } = req.body;
    
    try {
        // CAMBIO 1: Usar $1, $2, $3, $4 y NOW() de PostgreSQL.
        // CAMBIO 2: Usar RETURNING id_egreso.
        const result = await pool.query(
            'INSERT INTO egresos (fecha, monto, descripcion, tipo_egreso, id_usuario) VALUES (NOW(), $1, $2, $3, $4) RETURNING id_egreso', 
            [monto, descripcion, tipo_egreso, id_usuario || req.user.id] // Asumo que el ID del usuario está en req.user.id
        );
        
        // CAMBIO 3: Obtener el ID insertado de result.rows[0]
        res.status(201).json({ msg: "Egreso registrado exitosamente", id: result.rows[0].id_egreso });
        
    } catch (error) {
        console.error("Error al crear egreso:", error);
        res.status(500).json({ msg: "Error al crear egreso", error: error.message });
    }
};

// 5. Obtener resumen financiero (ej. total de Ingresos - total de Egresos)
const getFinancialSummary = async (req, res) => {
    try {
        // CAMBIO 1: Usar pool.query(). SUM devuelve el resultado en .rows[0].sum.
        // CAMBIO 2: Usar COALESCE para que el resultado sea 0 si la tabla está vacía.
        
        // Lógica para calcular el total de Ingresos
        const resultIngresos = await pool.query('SELECT COALESCE(SUM(monto), 0) AS total FROM ingresos');
        
        // Lógica para calcular el total de Egresos
        const resultEgresos = await pool.query('SELECT COALESCE(SUM(monto), 0) AS total FROM egresos');
        
        // CAMBIO 3: Obtener el valor de total de .rows[0].total
        const ingresos = resultIngresos.rows[0].total || 0;
        const egresos = resultEgresos.rows[0].total || 0;
        const balance = ingresos - egresos;

        res.json({ 
            balance: parseFloat(balance).toFixed(2), 
            total_ingresos: parseFloat(ingresos).toFixed(2), 
            total_egresos: parseFloat(egresos).toFixed(2) 
        });
    } catch (error) {
        console.error("Error al obtener resumen financiero:", error);
        res.status(500).json({ msg: "Error al obtener resumen financiero", error: error.message });
    }
};


// 🔑 EXPORTACIÓN CRÍTICA: Exportar todas las funciones como un objeto
module.exports = {
    getAllIngresos,
    createIngreso,
    getAllEgresos,
    createEgreso,
    getFinancialSummary,
};