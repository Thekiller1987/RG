const db = require('./src/config/db.js');

async function checkImages() {
  try {
    const [rows] = await db.query('SELECT id_producto, nombre, CHAR_LENGTH(imagen) as len, LEFT(imagen, 50) as start FROM productos WHERE imagen IS NOT NULL LIMIT 5');
    console.log('Sample images:', JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkImages();
