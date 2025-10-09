// server/netlify/functions/inventory-upload.js

const { Pool } = require('pg');
const multer = require('multer');
const xlsx = require('xlsx');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// --- 1. CONFIGURACIÓN DEL SERVIDOR (Express dentro de Lambda) ---
const app = express();
const router = express.Router();

// Usaremos un buffer en memoria para Multer
const upload = multer({ storage: multer.memoryStorage() });

// Configuración CORS 
const allowedOrigins = [
    'https://rg11.netlify.app', 
    'http://localhost:3000',
];
app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS. Dominio no autorizado.'), false);
        }
    }
}));
app.use(express.json());

// --- 2. CONFIGURACIÓN DE LA BASE DE DATOS (NEON/POSTGRESQL) ---
// La variable es inyectada por Netlify
const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL; 

if (!connectionString) {
    console.error("ERROR CRÍTICO: La cadena de conexión de Neon no está definida.");
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } 
});

// --- 3. LÓGICA DE CARGA MASIVA (ENDPOINT) ---
router.post('/inventory/upload', upload.single('file'), async (req, res) => {
    // --- Autenticación básica (Simplificada) ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Se requiere autenticación.' });
    }
    // NOTA: En un sistema real, aquí iría la validación completa del token JWT
    
    if (!req.file) {
        return res.status(400).json({ message: 'No se encontró ningún archivo para subir.' });
    }

    const client = await pool.connect();
    let insertedCount = 0;
    let updatedCount = 0;

    try {
        const buffer = req.file.buffer;
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (data.length === 0) {
            return res.status(400).json({ message: 'El archivo está vacío.' });
        }

        await client.query('BEGIN'); // Iniciar Transacción

        for (const row of data) {
            // Lógica de UPSERT (Categorías y Proveedores)
            let categoryId = null;
            if (row.nombre_categoria) {
                const categoryResult = await client.query(`
                    INSERT INTO categorias (nombre) VALUES ($1) 
                    ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre 
                    RETURNING id_categoria;
                `, [String(row.nombre_categoria).trim()]);
                categoryId = categoryResult.rows[0].id_categoria;
            }

            let supplierId = null;
            if (row.nombre_proveedor) {
                const supplierResult = await client.query(`
                    INSERT INTO proveedores (nombre) VALUES ($1) 
                    ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre 
                    RETURNING id_proveedor;
                `, [String(row.nombre_proveedor).trim()]);
                supplierId = supplierResult.rows[0].id_proveedor;
            }
            
            // Lógica de UPSERT (Productos)
            const result = await client.query(`
                INSERT INTO productos (codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                ON CONFLICT (codigo) 
                DO UPDATE SET 
                    nombre = EXCLUDED.nombre,
                    costo = EXCLUDED.costo,
                    venta = EXCLUDED.venta,
                    existencia = productos.existencia + EXCLUDED.existencia, 
                    id_categoria = COALESCE(EXCLUDED.id_categoria, productos.id_categoria),
                    id_proveedor = COALESCE(EXCLUDED.id_proveedor, productos.id_proveedor)
                RETURNING xmax;
            `, [
                String(row.codigo).trim(), 
                String(row.nombre).trim(),
                parseFloat(row.costo) || 0,
                parseFloat(row.venta) || 0,
                parseInt(row.existencia) || 0,
                categoryId,
                supplierId
            ]);

            // PostgreSQL xmax = 0 es inserción; > 0 es actualización
            if (result.rows[0].xmax === '0') {
                insertedCount++;
            } else {
                updatedCount++;
            }
        }

        await client.query('COMMIT'); // Finalizar Transacción
        res.status(200).json({ 
            message: 'Carga masiva completada.', 
            total_records: data.length, 
            inserted: insertedCount, 
            updated: updatedCount 
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Deshacer si hubo algún error
        console.error("Error FATAL durante la carga masiva:", error.message); 
        res.status(500).json({ message: 'Error en el servidor al procesar el archivo.', error: error.message });
    } finally {
        client.release();
    }
});

app.use('/.netlify/functions/inventory-upload', router);

// --- 4. EXPORTAR PARA NETLIFY ---
module.exports.handler = serverless(app, {
    // Necesario para que Multer y el manejo de archivos funcionen
    binary: ['*/*'], 
});