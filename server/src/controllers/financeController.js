// ==========================================================
// ARCHIVO: server/src/controllers/financeController.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const db = require('../config/db'); // CORRECCIÓN: Se importa 'db'

// Obtener todos los Ingresos
exports.getAllIngresos = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM ingresos ORDER BY fecha DESC');
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener ingresos:", error);
        res.status(500).json({ msg: "Error al obtener ingresos", error: error.message });
    }
};

// Crear un nuevo Ingreso
exports.createIngreso = async (req, res) => {
    const { monto, descripcion } = req.body;
    const id_usuario = req.user.id; // Obtenemos el ID del usuario del token

    try {
        const { rows } = await db.query(
            'INSERT INTO ingresos (fecha, monto, descripcion, id_usuario) VALUES (NOW(), $1, $2, $3) RETURNING id_ingreso', 
            [monto, descripcion, id_usuario]
        );
        res.status(201).json({ msg: "Ingreso registrado exitosamente", id: rows[0].id_ingreso });
    } catch (error) {
        console.error("Error al crear ingreso:", error);
        res.status(500).json({ msg: "Error al crear ingreso", error: error.message });
    }
};

// Obtener todos los Egresos
exports.getAllEgresos = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM egresos ORDER BY fecha DESC'); 
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener egresos:", error);
        res.status(500).json({ msg: "Error al obtener egresos", error: error.message });
    }
};

// Crear un nuevo Egreso
exports.createEgreso = async (req, res) => {
    const { monto, descripcion, tipo_egreso } = req.body;
    const id_usuario = req.user.id;

    try {
        const { rows } = await db.query(
            'INSERT INTO egresos (fecha, monto, descripcion, tipo_egreso, id_usuario) VALUES (NOW(), $1, $2, $3, $4) RETURNING id_egreso', 
            [monto, descripcion, tipo_egreso, id_usuario]
        );
        res.status(201).json({ msg: "Egreso registrado exitosamente", id: rows[0].id_egreso });
    } catch (error) {
        console.error("Error al crear egreso:", error);
        res.status(500).json({ msg: "Error al crear egreso", error: error.message });
    }
};

// Obtener resumen financiero
exports.getFinancialSummary = async (req, res) => {
    try {
        const resultIngresos = await db.query('SELECT COALESCE(SUM(monto), 0) AS total FROM ingresos');
        const resultEgresos = await db.query('SELECT COALESCE(SUM(monto), 0) AS total FROM egresos');
        
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