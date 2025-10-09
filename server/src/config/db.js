// ==========================================================
// ARCHIVO: server/src/config/db.js
// VERSIÓN CORREGIDA PARA SUPABASE (PostgreSQL)
// ==========================================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.stack);
  } else {
    console.log('Conexión exitosa a la base de datos de Supabase');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};