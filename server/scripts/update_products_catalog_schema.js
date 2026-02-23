const db = require('../src/config/db.js');

async function updateSchema() {
    try {
        console.log('--- ACTUALIZANDO ESQUEMA: productos (catalogo_mayorista) ---');

        // 1. Agregar columna catalogo_mayorista
        const [columns] = await db.query('SHOW COLUMNS FROM productos LIKE "catalogo_mayorista"');

        if (columns.length === 0) {
            console.log('Agregando columna catalogo_mayorista...');
            await db.query('ALTER TABLE productos ADD COLUMN catalogo_mayorista TINYINT(1) NOT NULL DEFAULT 0');

            // Auto-activar productos que ya tienen precios mayoristas configurados para facilitar la transición
            console.log('Activando visibilidad para productos con precios de mayoreo existentes...');
            await db.query(`
        UPDATE productos 
        SET catalogo_mayorista = 1 
        WHERE mayoreo > 0 OR distribuidor > 0 OR taller > 0 OR mayorista > 0
      `);

            console.log('Columna agregada y valores iniciales actualizados.');
        } else {
            console.log('La columna catalogo_mayorista ya existe.');
        }

        console.log('Actualización completada exitosamente.');
        process.exit(0);
    } catch (error) {
        console.error('Error actualizando esquema:', error);
        process.exit(1);
    }
}

updateSchema();
