const db = require('../src/config/db');

async function updateInventoryOutflowsTable() {
    try {
        const connection = await db.getConnection();
        console.log('🔌 Conectado a la base de datos.');

        // Alter table to add columns if they don't exist
        // MySQL doesn't have "ADD COLUMN IF NOT EXISTS" directly in all versions, 
        // but we can try-catch or query information_schema. 
        // For simplicity in this environment, we'll try to add them one by one and ignore "Duplicate column" errors.

        const columnsToAdd = [
            "ADD COLUMN tipo VARCHAR(50) DEFAULT 'SALIDA'",
            "ADD COLUMN id_cliente INT",
            "ADD COLUMN cliente_nombre VARCHAR(255)"
        ];

        for (const col of columnsToAdd) {
            try {
                await connection.query(`ALTER TABLE inventory_outflows ${col}`);
                console.log(`✅ ${col} ejecutado.`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`ℹ️ Columna ya existe (saltado): ${col}`);
                } else {
                    console.error(`❌ Error agregando columna: ${col}`, err);
                }
            }
        }

        console.log('✅ Esquema de "inventory_outflows" actualizado.');
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error general:', error);
        process.exit(1);
    }
}

updateInventoryOutflowsTable();
