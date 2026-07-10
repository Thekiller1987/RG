require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'appuser',
        password: process.env.DB_PASSWORD || 'AppSegura_2025!',
        database: process.env.DB_DATABASE || 'multirepuestosrg'
    });

    try {
        console.log("Ejecutando migración para comprobantes de proveedores...");
        
        // Agregar columna comprobante_url a abonos_proveedores
        try {
            await pool.query("ALTER TABLE abonos_proveedores ADD COLUMN comprobante_url TEXT DEFAULT NULL");
            console.log("Columna comprobante_url agregada correctamente a abonos_proveedores.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("La columna comprobante_url ya existe en abonos_proveedores.");
            } else {
                throw e;
            }
        }

        console.log("Migración completada con éxito.");
    } catch (err) {
        console.error("Error durante la migración:", err);
    } finally {
        await pool.end();
        process.exit(0);
    }
})();
