const pool = require('./server/src/config/db');

async function inspect() {
  try {
    console.log('--- Inspecting cierres_caja ---');
    const [rows] = await pool.query(`
      SELECT id, 
             CAST(fecha_apertura AS CHAR) as fa_char, 
             CAST(fecha_cierre AS CHAR) as fc_char,
             fecha_apertura,
             fecha_cierre
      FROM cierres_caja
      LIMIT 100
    `);
    
    console.log('Total rows found:', rows.length);
    let issues = 0;
    rows.forEach(r => {
      if (r.fa_char === '0000-00-00 00:00:00' || r.fc_char === '0000-00-00 00:00:00') {
        console.log(`ID ${r.id}: APERTURA=${r.fa_char}, CIERRE=${r.fc_char} [INVALID]`);
        issues++;
      } else {
        // console.log(`ID ${r.id}: APERTURA=${r.fa_char}, CIERRE=${r.fc_char} [OK]`);
      }
    });

    if (issues === 0) {
      console.log('No "0000-00-00" strings found in first 100 rows via CAST.');
    } else {
      console.log(`Found ${issues} rows with invalid date strings.`);
    }

    // Try a query that might crash if invalid dates exist
    try {
        console.log('Attempting SELECT * (this might crash if invalid dates exist)...');
        const [all] = await pool.query('SELECT * FROM cierres_caja LIMIT 100');
        console.log('SELECT * succeeded.');
    } catch (e) {
        console.log('SELECT * FAILED as expected:', e.message);
    }

  } catch (error) {
    console.error('Inspection failed:', error);
  } finally {
    process.exit();
  }
}

inspect();
