const db = require('../config/db.js');

// Auto-migración idempotente para campos completos de Proveedores
(async () => {
  try {
    const columnsToAdd = [
      { name: 'ruc', def: 'VARCHAR(60) NULL' },
      { name: 'telefono', def: 'VARCHAR(100) NULL' },
      { name: 'correo', def: 'VARCHAR(120) NULL' },
      { name: 'encargado_zona', def: 'VARCHAR(120) NULL' },
      { name: 'telefono_encargado', def: 'VARCHAR(80) NULL' },
      { name: 'zona', def: 'VARCHAR(120) NULL' },
      { name: 'direccion', def: 'VARCHAR(255) NULL' },
      { name: 'notas', def: 'TEXT NULL' }
    ];

    for (const col of columnsToAdd) {
      const [exists] = await db.query(`SHOW COLUMNS FROM proveedores LIKE ?`, [col.name]);
      if (exists.length === 0) {
        await db.query(`ALTER TABLE proveedores ADD COLUMN ${col.name} ${col.def}`);
      }
    }
    console.log('✅ Columnas extendidas de proveedores verificadas.');
  } catch (err) {
    console.error('⚠️ Error verificando columnas de proveedores:', err.message);
  }
})();

// Obtener todos los proveedores
exports.getAllProviders = async (req, res) => {
  try {
    const [providers] = await db.query('SELECT * FROM proveedores ORDER BY nombre');
    res.json(providers);
  } catch (error) {
    console.error('Error getAllProviders:', error);
    res.status(500).json({ msg: 'Error al obtener proveedores' });
  }
};

// Crear un nuevo proveedor con datos completos
exports.createProvider = async (req, res) => {
  const {
    nombre,
    ruc,
    telefono,
    correo,
    encargado_zona,
    telefono_encargado,
    zona,
    direccion,
    notas
  } = req.body;

  if (!nombre || !String(nombre).trim()) {
    return res.status(400).json({ msg: 'El nombre del proveedor es obligatorio.' });
  }

  try {
    const cleanName = String(nombre).trim();
    const [result] = await db.query(
      `INSERT INTO proveedores 
       (nombre, ruc, telefono, correo, encargado_zona, telefono_encargado, zona, direccion, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanName,
        ruc ? String(ruc).trim() : null,
        telefono ? String(telefono).trim() : null,
        correo ? String(correo).trim() : null,
        encargado_zona ? String(encargado_zona).trim() : null,
        telefono_encargado ? String(telefono_encargado).trim() : null,
        zona ? String(zona).trim() : null,
        direccion ? String(direccion).trim() : null,
        notas ? String(notas).trim() : null
      ]
    );
    res.status(201).json({
      id_proveedor: result.insertId,
      nombre: cleanName,
      ruc: ruc || null,
      telefono: telefono || null,
      correo: correo || null,
      encargado_zona: encargado_zona || null,
      telefono_encargado: telefono_encargado || null,
      zona: zona || null,
      direccion: direccion || null,
      notas: notas || null
    });
  } catch (error) {
    console.error('Error createProvider:', error);
    res.status(500).json({ msg: 'Error al crear el proveedor' });
  }
};

// Actualizar un proveedor existente
exports.updateProvider = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    ruc,
    telefono,
    correo,
    encargado_zona,
    telefono_encargado,
    zona,
    direccion,
    notas
  } = req.body;

  if (!nombre || !String(nombre).trim()) {
    return res.status(400).json({ msg: 'El nombre del proveedor es obligatorio.' });
  }

  try {
    const cleanName = String(nombre).trim();
    await db.query(
      `UPDATE proveedores
       SET nombre = ?, ruc = ?, telefono = ?, correo = ?, encargado_zona = ?,
           telefono_encargado = ?, zona = ?, direccion = ?, notas = ?
       WHERE id_proveedor = ?`,
      [
        cleanName,
        ruc ? String(ruc).trim() : null,
        telefono ? String(telefono).trim() : null,
        correo ? String(correo).trim() : null,
        encargado_zona ? String(encargado_zona).trim() : null,
        telefono_encargado ? String(telefono_encargado).trim() : null,
        zona ? String(zona).trim() : null,
        direccion ? String(direccion).trim() : null,
        notas ? String(notas).trim() : null,
        id
      ]
    );
    res.json({ msg: 'Proveedor actualizado correctamente', id_proveedor: Number(id) });
  } catch (error) {
    console.error('Error updateProvider:', error);
    res.status(500).json({ msg: 'Error al actualizar el proveedor' });
  }
};

// Eliminar un proveedor
exports.deleteProvider = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM proveedores WHERE id_proveedor = ?', [id]);
    res.json({ msg: 'Proveedor eliminado' });
  } catch (error) {
    res.status(400).json({ msg: 'No se puede eliminar el proveedor porque está en uso.' });
  }
};
