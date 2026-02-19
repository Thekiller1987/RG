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
                ticket_sales_footer TEXT,
                ticket_proforma_footer TEXT,
                ticket_transfer_footer TEXT,
                mayorista_pin VARCHAR(10) DEFAULT '0000'
            )
        `);
        // Insert default if not exists
        await pool.query(`INSERT IGNORE INTO business_config (id) VALUES (1)`);

        // Migration for existing tables: Add columns if they don't exist
        const columns = ['ticket_sales_footer', 'ticket_proforma_footer', 'ticket_transfer_footer', 'mayorista_pin'];
        for (const col of columns) {
            try {
                // Determine type based on column
                let type = 'TEXT';
                if (col === 'mayorista_pin') type = "VARCHAR(10) DEFAULT '0000'";

                await pool.query(`ALTER TABLE business_config ADD COLUMN ${col} ${type}`);
            } catch (e) {
                // Ignore "Column already exists" (Error 1060 for MySQL)
                if (e.code !== 'ER_DUP_FIELDNAME') console.error(`Error adding column ${col}:`, e.message);
            }
        }
    } catch (error) {
        console.error('Error inicializando business_config:', error);
    }
})();

/* ===================== READ ===================== */
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

/* ===================== UPDATE ===================== */
const updateSettings = async (req, res) => {
    const {
        empresa_nombre, empresa_ruc, empresa_telefono,
        empresa_direccion, empresa_eslogan, empresa_logo_url,
        ticket_sales_footer, ticket_proforma_footer, ticket_transfer_footer,
        mayorista_pin
    } = req.body;

    console.log('[DEBUG] updateSettings payload:', req.body);


    // Build dynamic query to avoid overwriting with undefined
    let fields = [];
    let values = [];

    if (empresa_nombre !== undefined) { fields.push('empresa_nombre = ?'); values.push(empresa_nombre); }
    if (empresa_ruc !== undefined) { fields.push('empresa_ruc = ?'); values.push(empresa_ruc); }
    if (empresa_telefono !== undefined) { fields.push('empresa_telefono = ?'); values.push(empresa_telefono); }
    if (empresa_direccion !== undefined) { fields.push('empresa_direccion = ?'); values.push(empresa_direccion); }
    if (empresa_eslogan !== undefined) { fields.push('empresa_eslogan = ?'); values.push(empresa_eslogan); }
    if (empresa_logo_url !== undefined) { fields.push('empresa_logo_url = ?'); values.push(empresa_logo_url); }
    if (ticket_sales_footer !== undefined) { fields.push('ticket_sales_footer = ?'); values.push(ticket_sales_footer); }
    if (ticket_proforma_footer !== undefined) { fields.push('ticket_proforma_footer = ?'); values.push(ticket_proforma_footer); }
    if (ticket_transfer_footer !== undefined) { fields.push('ticket_transfer_footer = ?'); values.push(ticket_transfer_footer); }
    if (mayorista_pin !== undefined) { fields.push('mayorista_pin = ?'); values.push(mayorista_pin); }

    if (fields.length === 0) return res.status(400).json({ message: 'No hay campos para actualizar' });

    values.push(1); // ID

    try {
        await pool.query(`UPDATE business_config SET ${fields.join(', ')} WHERE id = ?`, values);
        const [updated] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar configuración' });
    }
};

module.exports = { getSettings, updateSettings };
