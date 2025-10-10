// Importamos la librería de MySQL y dotenv
const mysql = require('mysql2');
// 🌟 ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ LO MÁS ALTO POSIBLE EN TU APP
require('dotenv').config(); 

// Creamos un "pool" de conexiones. Es más eficiente que una conexión única.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificamos si la conexión es exitosa
pool.getConnection((err, connection) => {
  if (err) {
    // 🛑 Muestra el error de CONEXIÓN
    console.error('Error al conectar con la base de datos (DB.JS):', err.message);
    return;
  }
  console.log('¡Conexión a la base de datos exitosa! 🎉');
  connection.release(); // Liberamos la conexión
});

// Exportamos el pool para poder usarlo en otras partes de la aplicación
module.exports = pool.promise();