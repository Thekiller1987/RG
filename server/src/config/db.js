// api/src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'db',       // servicio del compose
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'appuser',
  password: process.env.MYSQL_PASSWORD || 'AppSegura_2025!',
  database: process.env.MYSQL_DATABASE || 'multirepuestosrg',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// justo después del createPool
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
