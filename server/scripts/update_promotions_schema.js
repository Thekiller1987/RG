const mysql = require('mysql2/promise');

async function updatePromotionsTable() {
    try {
        // Use explicit credentials from db.js fallback
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'appuser',
            password: 'AppSegura_2025!',
            database: 'multirepuestosrg'
        });

        console.log('🔌 Conectado a la base de datos.');

        // Add tipo_cliente column
        try {
            await connection.query(`
                ALTER TABLE promociones_mayorista
                ADD COLUMN tipo_cliente VARCHAR(50) DEFAULT NULL AFTER id_categoria
            `);
            console.log('✅ Columna "tipo_cliente" agregada a "promociones_mayorista".');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ La columna "tipo_cliente" ya existe.');
            } else {
                throw err;
            }
        }

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error actualizando la tabla:', error);
        process.exit(1);
    }
}

updatePromotionsTable();
