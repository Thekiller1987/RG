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
        console.log("Creando tabla abonos_proveedores...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS abonos_proveedores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_factura INT NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodo_pago VARCHAR(50) NOT NULL,
        referencia VARCHAR(255),
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(id_factura) REFERENCES facturas_proveedores(id) ON DELETE CASCADE
      )
    `);

        console.log("Agregando columnas a facturas_proveedores...");
        // Ignoring errors if columns already exist
        try { await pool.query("ALTER TABLE facturas_proveedores ADD COLUMN tipo_compra ENUM('CONTADO', 'CREDITO') DEFAULT 'CREDITO'"); } catch (e) { }
        try { await pool.query("ALTER TABLE facturas_proveedores ADD COLUMN metodo_pago VARCHAR(50) DEFAULT NULL"); } catch (e) { }

        console.log("Base de datos de proveedores lista.");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
})();
