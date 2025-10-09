// ==========================================================
// ARCHIVO: server/hash-password.js
// Utilidad para encriptar una contraseña
// ==========================================================

const bcrypt = require('bcryptjs');

// Toma la contraseña del tercer argumento de la línea de comandos
const password = process.argv[2];

if (!password) {
  console.error('Por favor, proporciona una contraseña como argumento.');
  console.log('Uso: node hash-password.js <tu_contraseña_a_encriptar>');
  process.exit(1);
}

// Genera el "salt" y luego el "hash"
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('--- Copia esta contraseña encriptada ---');
console.log(hash);

