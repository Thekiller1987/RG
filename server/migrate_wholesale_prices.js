const pool = require('./src/config/db.js');

async function migrate() {
    try {
        console.log('--- STARTING MIGRATION: ADDING TIERED PRICES ---');

        // Add distribuidor
        await pool.query('ALTER TABLE productos ADD COLUMN distribuidor DECIMAL(10,2) NULL DEFAULT 0 AFTER mayoreo');
        console.log('✓ Added column: distribuidor');

        // Add taller
        await pool.query('ALTER TABLE productos ADD COLUMN taller DECIMAL(10,2) NULL DEFAULT 0 AFTER distribuidor');
        console.log('✓ Added column: taller');

        // Add mayorista (distinct from mayoreo)
        await pool.query('ALTER TABLE productos ADD COLUMN mayorista DECIMAL(10,2) NULL DEFAULT 0 AFTER taller');
        console.log('✓ Added column: mayorista');

        console.log('--- MIGRATION COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
