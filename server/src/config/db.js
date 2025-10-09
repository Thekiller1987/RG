// ==========================================================
// ARCHIVO: server/src/config/db.js
// VERSIÓN FINAL Y LIMPIA
// ==========================================================

const { Pool } = require('pg');
require('dotenv').config();

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Dejamos esta línea por si acaso, aunque la nueva URL ya es IPv4.
  // No causa ningún problema.
  family: 4, 
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos de Supabase');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de la base de datos', err);
    process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};

