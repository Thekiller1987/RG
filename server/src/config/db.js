// ==========================================================
// ARCHIVO: server/src/config/db.js
// VERSIÓN FINAL Y COMPLETA (CON SOPORTE PARA TRANSACCIONES)
// ==========================================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Este evento se dispara cada vez que un cliente se conecta exitosamente.
// Es una buena forma de saber que la configuración es correcta.
pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos de Supabase');
});

// Manejador de errores global para la piscina de conexiones.
pool.on('error', (err, client) => {
    console.error('Error inesperado en el cliente de la base de datos', err);
    process.exit(-1); // Salir si hay un error grave de BD
});

module.exports = {
  // Para consultas simples y rápidas
  query: (text, params) => pool.query(text, params),
  
  // Para obtener un cliente dedicado del pool y manejar transacciones
  getClient: () => pool.connect(),
};