const db = require('./src/config/db');

async function check() {
    try {
        console.log("Checking for invalid dates in cierres_caja...");
        
        const [counts] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN CAST(fecha_apertura AS CHAR) = '0000-00-00 00:00:00' THEN 1 ELSE 0 END) as invalid_apertura,
                SUM(CASE WHEN CAST(fecha_cierre AS CHAR) = '0000-00-00 00:00:00' THEN 1 ELSE 0 END) as invalid_cierre,
                SUM(CASE WHEN fecha_apertura < '1970-01-01' AND CAST(fecha_apertura AS CHAR) != '0000-00-00 00:00:00' THEN 1 ELSE 0 END) as weird_apertura,
                SUM(CASE WHEN fecha_cierre < '1970-01-01' AND CAST(fecha_cierre AS CHAR) != '0000-00-00 00:00:00' THEN 1 ELSE 0 END) as weird_cierre
            FROM cierres_caja
        `);
        
        console.log("Results:", JSON.stringify(counts, null, 2));

        if (counts.invalid_apertura > 0 || counts.invalid_cierre > 0) {
            const [rows] = await db.query(`
                SELECT id, CAST(fecha_apertura AS CHAR) as fa, CAST(fecha_cierre AS CHAR) as fc
                FROM cierres_caja
                WHERE CAST(fecha_apertura AS CHAR) = '0000-00-00 00:00:00'
                   OR CAST(fecha_cierre AS CHAR) = '0000-00-00 00:00:00'
                LIMIT 10
            `);
            console.log("Sample invalid rows:", JSON.stringify(rows, null, 2));
        }

        process.exit(0);
    } catch (e) {
        console.error("Error during check:", e);
        process.exit(1);
    }
}

check();
