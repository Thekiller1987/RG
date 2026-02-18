const mysql = require('mysql2/promise');

async function checkColumns() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'appuser',
            password: 'AppSegura_2025!',
            database: 'multirepuestosrg'
        });

        console.log('🔌 Conectado.');

        const [clientCols] = await connection.query("SHOW COLUMNS FROM clientes LIKE 'tipo_cliente'");
        console.log('Cliente Columns:', clientCols);

        const [promoCols] = await connection.query("SHOW COLUMNS FROM promociones_mayorista LIKE 'tipo_cliente'");
        console.log('Promo Columns:', promoCols);

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkColumns();
