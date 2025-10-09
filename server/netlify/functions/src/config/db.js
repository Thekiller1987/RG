// src/config/db.js (Adaptado para Neon/PostgreSQL)

const { Pool } = require('pg');
require('dotenv').config();

// La variable de entorno de Neon es NETLIFY_DATABASE_URL.
// Usamos un fallback a DATABASE_URL por si lo configuras manualmente.
const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL; 

if (!connectionString) {
    // Mantenemos el log de error de conexión en la consola de Netlify para debugging
    console.error('CRITICAL ERROR: La variable de entorno de conexión a la base de datos no está definida.');
    // No salimos de la ejecución aquí, ya que el entorno serverless lo maneja diferente.
}

const pool = new Pool({
    connectionString: connectionString,
    // La configuración SSL es necesaria para conectar con servicios Cloud como Neon
    ssl: { 
        rejectUnauthorized: false 
    },
    // Opcional: Aumentamos el máximo para manejar picos en serverless
    max: 15, 
});

// Verificación de conexión (sin detener la ejecución)
pool.connect()
    .then(client => {
        // Este log se mantiene solo para verificar que la conexión es exitosa en el inicio de la función
        console.log('Conexión a Neon/PostgreSQL exitosa. Cliente liberado.'); 
        client.release();
    })
    .catch(err => {
        // Este log es crucial para saber por qué fallan las funciones
        console.error('ERROR FATAL al conectar a la base de datos:', err.message);
    });


// Exportamos el pool para que sea usado en tus controladores
module.exports = {
    pool,
};