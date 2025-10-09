// ==========================================================
// ARCHIVO: server/src/config/db.js
// VERSIÓN FINAL (FUERZA LA CONEXIÓN IPv4)
// ==========================================================

const { Pool } = require('pg');
require('dotenv').config();

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // ¡ESTA ES LA LÍNEA MÁGICA!
  // Le dice al driver que resuelva el host a una dirección IPv4.
  // Esto soluciona el error 'ENETUNREACH' en Render.
  family: 4, 
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos de Supabase (vía IPv4)');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de la base de datos', err);
    process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};

