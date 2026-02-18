
const db = require('./src/config/db');

async function migrate() {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        console.log("Adding 'tipo_cliente' column to 'clientes' table if not exists...");
        // Check if column exists
        const [cols] = await connection.query("SHOW COLUMNS FROM clientes LIKE 'tipo_cliente'");
        if (cols.length === 0) {
            await connection.query("ALTER TABLE clientes ADD COLUMN tipo_cliente VARCHAR(50) DEFAULT 'Minorista'");
            console.log("Column 'tipo_cliente' added.");
        } else {
            console.log("Column 'tipo_cliente' already exists.");
        }

        console.log("Creating 'promociones_mayorista' table...");
        await connection.query(`
      CREATE TABLE IF NOT EXISTS promociones_mayorista (
        id_promocion INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tipo ENUM('porcentaje', 'monto_fijo', 'volumen') NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        cantidad_minima INT DEFAULT 1,
        id_producto INT NULL,
        id_categoria INT NULL,
        fecha_inicio DATETIME,
        fecha_fin DATETIME,
        activa BOOLEAN DEFAULT 1,
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE SET NULL,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL
      )
    `);
        console.log("Table 'promociones_mayorista' created/verified.");

        await connection.commit();
        console.log("Migration completed successfully.");
        process.exit(0);

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        if (connection) connection.release();
    }
}

migrate();
