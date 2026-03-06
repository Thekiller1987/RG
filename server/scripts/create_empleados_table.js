const pool = require('../src/config/db');

async function createEmpleadosTable() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS empleados (
        id_empleado INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(20) DEFAULT NULL,
        cargo VARCHAR(50) DEFAULT 'Vendedor',
        activo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
        console.log('✅ Tabla "empleados" creada o ya existente.');

        // Agregar columna id_empleado a ventas si no existe
        const [cols] = await pool.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ventas' AND COLUMN_NAME = 'id_empleado'
    `);

        if (cols.length === 0) {
            await pool.query(`ALTER TABLE ventas ADD COLUMN id_empleado INT DEFAULT NULL`);
            console.log('✅ Columna "id_empleado" agregada a tabla "ventas".');
        } else {
            console.log('ℹ️  Columna "id_empleado" ya existe en "ventas".');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creando tabla empleados:', err);
        process.exit(1);
    }
}

createEmpleadosTable();
