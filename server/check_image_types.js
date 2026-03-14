const db = require('./src/config/db.js');

async function checkImages() {
  try {
    const [rows] = await db.query('SELECT DISTINCT LEFT(imagen, 20) as start FROM productos WHERE imagen IS NOT NULL');
    console.log('Unique image starts:', JSON.stringify(rows, null, 2));
    
    const [counts] = await db.query('SELECT COUNT(*) as total, COUNT(imagen) as with_image FROM productos');
    console.log('Stats:', counts);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkImages();
