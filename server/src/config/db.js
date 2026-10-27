// server/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const isWindows = process.platform === 'win32';
const host = process.env.DB_HOST || 'localhost';
let password = process.env.DB_PASSWORD;

if (!password) {
  password = isWindows ? 'AppSegura_2025!' : 'Multirepuestos_RG_2026_SecurePass!';
} else if (isWindows && password === 'Multirepuestos_RG_2026_SecurePass!') {
  // Entorno de desarrollo local en Windows
  password = 'AppSegura_2025!';
}

// Crear pool de conexiones usando variables del .env
const pool = mysql.createPool({
  host: host,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'appuser',
  password: password,
  database: process.env.DB_DATABASE || 'multirepuestosrg',
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 0, // Sin límite de cola para evitar Queue limit reached bajo concurrencia
});

// Test rápido de conexión
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('¡Conexión a la base de datos exitosa! 🎉');
    conn.release();
  } catch (e) {
    console.error('Error al conectar con la base de datos (DB.JS):', e.message);
  }
})();

module.exports = pool;
