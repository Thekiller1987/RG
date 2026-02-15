const pool = require('../config/db');

// AUTO-MIGRACIÓN: Tabla business_config
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS business_config (
                id INT PRIMARY KEY DEFAULT 1,
                empresa_nombre VARCHAR(255) DEFAULT 'Multirepuestos RG',
                empresa_ruc VARCHAR(50) DEFAULT '1211812770001E',
                empresa_telefono VARCHAR(100) DEFAULT '84031936 / 84058142',
                empresa_direccion TEXT,
                empresa_eslogan TEXT,
                empresa_logo_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Insertar registro por defecto si no existe
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM business_config');
        if (rows[0].count === 0) {
            await pool.query(`
                INSERT INTO business_config (id, empresa_nombre, empresa_direccion, empresa_eslogan)
                VALUES (1, 'Multirepuestos RG', 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.', 'Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.')
            `);
            console.log('✅ Configuración inicial de empresa creada.');
        } else {
            console.log('✅ Tabla business_config verificada.');
        }
    } catch (err) {
        console.error('⚠️ Error en migración business_config:', err.message);
    }
})();

const getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Configuración no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener configuración' });
    }
};

const updateSettings = async (req, res) => {
    const { empresa_nombre, empresa_ruc, empresa_telefono, empresa_direccion, empresa_eslogan, empresa_logo_url } = req.body;
    try {
        await pool.query(`
            UPDATE business_config 
            SET empresa_nombre = ?, empresa_ruc = ?, empresa_telefono = ?, empresa_direccion = ?, empresa_eslogan = ?, empresa_logo_url = ?
            WHERE id = 1
        `, [empresa_nombre, empresa_ruc, empresa_telefono, empresa_direccion, empresa_eslogan, empresa_logo_url]);

        const [updated] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar configuración' });
    }
};

module.exports = { getSettings, updateSettings };
