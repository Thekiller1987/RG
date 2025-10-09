const db = require('../config/db');
const xlsx = require('xlsx');

// Función para obtener o crear una categoría y devolver su ID
const getOrCreateCategory = async (client, name) => {
    if (!name || name.trim() === '') return null;
    let { rows } = await client.query('SELECT id_categoria FROM categorias WHERE nombre = $1', [name.trim()]);
    if (rows.length > 0) return rows[0].id_categoria;
    
    ({ rows } = await client.query('INSERT INTO categorias (nombre) VALUES ($1) RETURNING id_categoria', [name.trim()]));
    return rows[0].id_categoria;
};

// Función para obtener o crear un proveedor y devolver su ID
const getOrCreateProvider = async (client, name) => {
    if (!name || name.trim() === '') return null;
    let { rows } = await client.query('SELECT id_proveedor FROM proveedores WHERE nombre = $1', [name.trim()]);
    if (rows.length > 0) return rows[0].id_proveedor;

    ({ rows } = await client.query('INSERT INTO proveedores (nombre) VALUES ($1) RETURNING id_proveedor', [name.trim()]));
    return rows[0].id_proveedor;
};

exports.massiveUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const client = await db.getClient();
    let inserted = 0;
    let updated = 0;

    try {
        await client.query('BEGIN');

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const row of data) {
            const { codigo, nombre, costo, venta, existencia, nombre_categoria, nombre_proveedor } = row;

            if (!codigo || !nombre || costo === undefined || venta === undefined || existencia === undefined) {
                console.warn('Fila omitida por falta de datos:', row);
                continue;
            }

            const idCategoria = await getOrCreateCategory(client, nombre_categoria);
            const idProveedor = await getOrCreateProvider(client, nombre_proveedor);

            const { rows: existingProducts } = await client.query('SELECT id_producto FROM productos WHERE codigo = $1', [codigo]);

            if (existingProducts.length > 0) {
                await client.query(
                    `UPDATE productos SET 
                        nombre = $1, costo = $2, venta = $3, existencia = $4, 
                        id_categoria = $5, id_proveedor = $6 
                    WHERE codigo = $7`,
                    [nombre, costo, venta, existencia, idCategoria, idProveedor, codigo]
                );
                updated++;
            } else {
                await client.query(
                    `INSERT INTO productos 
                        (codigo, nombre, costo, venta, existencia, id_categoria, id_proveedor, stock_reservado, minimo, maximo) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, 0)`,
                    [codigo, nombre, costo, venta, existencia, idCategoria, idProveedor]
                );
                inserted++;
            }
        }

        await client.query('COMMIT');
        res.status(200).json({
            message: 'Carga masiva completada exitosamente.',
            total_records: data.length,
            inserted,
            updated,
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en la carga masiva:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el archivo.', error: error.message });
    } finally {
        client.release();
    }
};
