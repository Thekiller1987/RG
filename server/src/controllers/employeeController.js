// server/src/controllers/employeeController.js
const pool = require('../config/db');
const { logUserActivity } = require('../services/permissionsService');

const safeNum = v => {
  const n = Number(v);
  return isNaN(n) || !isFinite(n) ? 0 : n;
};

// GET /api/employees
exports.getAll = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === '1';
    const [rows] = await pool.query(
      `SELECT e.*, u.nombre_usuario AS usuario_vinculado_nombre
       FROM empleados e
       LEFT JOIN usuarios u ON e.id_usuario_vinculado = u.id_usuario
       ${includeInactive ? '' : 'WHERE e.activo = 1'}
       ORDER BY e.activo DESC, e.nombre ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getAll empleados:', err);
    res.status(500).json({ message: 'Error al obtener empleados' });
  }
};

// POST /api/employees
exports.create = async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      cargo,
      id_usuario_vinculado,
      salario_base,
      frecuencia_pago,
      tipo_comision,
      porcentaje_comision_ganancia,
      porcentaje_comision_venta,
      meta_ganancia_minima,
      margen_minimo_producto,
      meta_ganancia_objetivo,
      porcentaje_nivel2_ganancia,
      bono_meta_ganancia,
      incluir_ventas_usuario,
      notas_contrato
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const [result] = await pool.query(
      `INSERT INTO empleados (
        nombre, telefono, cargo, id_usuario_vinculado,
        salario_base, frecuencia_pago, tipo_comision,
        porcentaje_comision_ganancia, porcentaje_comision_venta,
        meta_ganancia_minima, margen_minimo_producto,
        meta_ganancia_objetivo, porcentaje_nivel2_ganancia,
        bono_meta_ganancia, incluir_ventas_usuario, notas_contrato, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        nombre.trim(),
        telefono || null,
        cargo || 'Vendedor',
        id_usuario_vinculado ? Number(id_usuario_vinculado) : null,
        safeNum(salario_base),
        frecuencia_pago || 'Quincenal',
        tipo_comision || 'PORCENTAJE_GANANCIA',
        safeNum(porcentaje_comision_ganancia ?? 5),
        safeNum(porcentaje_comision_venta),
        safeNum(meta_ganancia_minima),
        safeNum(margen_minimo_producto),
        safeNum(meta_ganancia_objetivo),
        safeNum(porcentaje_nivel2_ganancia),
        safeNum(bono_meta_ganancia),
        incluir_ventas_usuario !== undefined ? (incluir_ventas_usuario ? 1 : 0) : 1,
        notas_contrato || null
      ]
    );

    const [newEmp] = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [result.insertId]);

    await logUserActivity({
      req,
      modulo: 'Planilla y Empleados',
      accion: 'EMPLEADO_CREADO',
      descripcion: `Creó empleado "${nombre.trim()}" (${cargo || 'Vendedor'}) con regla ${tipo_comision || 'PORCENTAJE_GANANCIA'}`
    });

    res.status(201).json(newEmp[0]);
  } catch (err) {
    console.error('Error create empleado:', err);
    res.status(500).json({ message: 'Error al crear empleado: ' + err.message });
  }
};

// PUT /api/employees/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      telefono,
      cargo,
      activo,
      id_usuario_vinculado,
      salario_base,
      frecuencia_pago,
      tipo_comision,
      porcentaje_comision_ganancia,
      porcentaje_comision_venta,
      meta_ganancia_minima,
      margen_minimo_producto,
      meta_ganancia_objetivo,
      porcentaje_nivel2_ganancia,
      bono_meta_ganancia,
      incluir_ventas_usuario,
      notas_contrato
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    await pool.query(
      `UPDATE empleados SET
        nombre = ?,
        telefono = ?,
        cargo = ?,
        activo = COALESCE(?, activo),
        id_usuario_vinculado = ?,
        salario_base = ?,
        frecuencia_pago = ?,
        tipo_comision = ?,
        porcentaje_comision_ganancia = ?,
        porcentaje_comision_venta = ?,
        meta_ganancia_minima = ?,
        margen_minimo_producto = ?,
        meta_ganancia_objetivo = ?,
        porcentaje_nivel2_ganancia = ?,
        bono_meta_ganancia = ?,
        incluir_ventas_usuario = ?,
        notas_contrato = ?
      WHERE id_empleado = ?`,
      [
        nombre.trim(),
        telefono || null,
        cargo || 'Vendedor',
        activo !== undefined ? (activo ? 1 : 0) : null,
        id_usuario_vinculado ? Number(id_usuario_vinculado) : null,
        safeNum(salario_base),
        frecuencia_pago || 'Quincenal',
        tipo_comision || 'PORCENTAJE_GANANCIA',
        safeNum(porcentaje_comision_ganancia),
        safeNum(porcentaje_comision_venta),
        safeNum(meta_ganancia_minima),
        safeNum(margen_minimo_producto),
        safeNum(meta_ganancia_objetivo),
        safeNum(porcentaje_nivel2_ganancia),
        safeNum(bono_meta_ganancia),
        incluir_ventas_usuario !== undefined ? (incluir_ventas_usuario ? 1 : 0) : 1,
        notas_contrato || null,
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);

    await logUserActivity({
      req,
      modulo: 'Planilla y Empleados',
      accion: 'REGLAS_COMISION_ACTUALIZADAS',
      descripcion: `Actualizó reglas de planilla/comisión de "${nombre.trim()}" (Salario: C$ ${safeNum(salario_base)}, Regla: ${tipo_comision}, % Ganancia: ${safeNum(porcentaje_comision_ganancia)}%)`
    });

    res.json(updated[0]);
  } catch (err) {
    console.error('Error update empleado:', err);
    res.status(500).json({ message: 'Error al actualizar empleado: ' + err.message });
  }
};

// DELETE /api/employees/:id (soft delete)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE empleados SET activo = 0 WHERE id_empleado = ?', [id]);
    res.json({ message: 'Empleado desactivado' });
  } catch (err) {
    console.error('Error remove empleado:', err);
    res.status(500).json({ message: 'Error al desactivar empleado' });
  }
};

// GET /api/employees/payroll-report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
exports.getPayrollReport = async (req, res) => {
  try {
    // Determinar rango de fechas en hora Managua (UTC-6)
    const nowManagua = new Date(Date.now() - 6 * 3600 * 1000);
    const yyyy = nowManagua.getUTCFullYear();
    const mm = String(nowManagua.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(nowManagua.getUTCDate()).padStart(2, '0');

    const startDate = req.query.startDate || `${yyyy}-${mm}-01`;
    const endDate = req.query.endDate || `${yyyy}-${mm}-${dd}`;

    // 1. Obtener todos los empleados activos + usuario vinculado
    const [empleados] = await pool.query(`
      SELECT e.*, u.nombre_usuario AS usuario_vinculado_nombre
      FROM empleados e
      LEFT JOIN usuarios u ON e.id_usuario_vinculado = u.id_usuario
      WHERE e.activo = 1
      ORDER BY e.nombre ASC
    `);

    // 2. Obtener todas las líneas de detalle de ventas no canceladas en el rango
    const [saleLines] = await pool.query(
      `SELECT 
         v.id_venta,
         v.fecha,
         v.id_usuario,
         v.id_empleado,
         v.total_venta,
         dv.id_producto,
         dv.cantidad,
         dv.precio_unitario,
         COALESCE(p.costo, 0) AS costo_efectivo,
         COALESCE(p.nombre, 'Producto') AS producto_nombre,
         COALESCE(p.codigo, 'S/C') AS producto_codigo
       FROM ventas v
       JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
       LEFT JOIN productos p ON dv.id_producto = p.id_producto
       WHERE v.estado != 'CANCELADA'
         AND DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) BETWEEN ? AND ?
       ORDER BY v.fecha DESC`,
      [startDate, endDate]
    );

    // 3. Movimientos de planilla (adelantos, deducciones, bonos extra) no liquidados
    const [movimientos] = await pool.query(
      `SELECT * FROM planilla_movimientos
       WHERE liquidado = 0
       ORDER BY fecha DESC`
    ).catch(() => [[]]);

    // 4. Historial reciente de pagos de planilla cerrados
    const [pagosHistorial] = await pool.query(
      `SELECT * FROM planilla_pagos
       ORDER BY fecha_pago DESC, id_pago DESC
       LIMIT 60`
    ).catch(() => [[]]);

    // Calcular planilla y comisiones por empleado aplicando sus reglas específicas sobre la ganancia
    let totalVendidoGlobal = 0;
    let totalCostoGlobal = 0;
    let gananciaTotalGlobal = 0;
    let totalSalariosBase = 0;
    let totalComisiones = 0;
    let totalBonos = 0;
    let totalDeducciones = 0;
    let totalPlanillaNeta = 0;

    const payrollEmployees = empleados.map(emp => {
      const empId = Number(emp.id_empleado);
      const linkedUserId = emp.id_usuario_vinculado ? Number(emp.id_usuario_vinculado) : null;
      const includeUserSales = Number(emp.incluir_ventas_usuario ?? 1) === 1;
      const minMarginPct = safeNum(emp.margen_minimo_producto);
      const minProfitGoal = safeNum(emp.meta_ganancia_minima);
      const targetProfitGoal = safeNum(emp.meta_ganancia_objetivo);
      const pctProfit1 = safeNum(emp.porcentaje_comision_ganancia);
      const pctProfit2 = safeNum(emp.porcentaje_nivel2_ganancia);
      const pctSale = safeNum(emp.porcentaje_comision_venta);
      const bonoMetaAmount = safeNum(emp.bono_meta_ganancia);
      const salarioBase = safeNum(emp.salario_base);
      const tipoComision = emp.tipo_comision || 'PORCENTAJE_GANANCIA';

      // Filtrar líneas que pertenecen a este empleado
      const empLines = saleLines.filter(line => {
        if (Number(line.id_empleado) === empId) return true;
        if (includeUserSales && linkedUserId && (!line.id_empleado || Number(line.id_empleado) === 0)) {
          return Number(line.id_usuario) === linkedUserId;
        }
        return false;
      });

      const ticketsSet = new Set();
      let totalUnidades = 0;
      let totalVendido = 0;
      let totalCosto = 0;
      let gananciaTotal = 0;
      let ventaComisionable = 0;
      let gananciaComisionable = 0;
      let lineasExcluidasPorMargen = 0;
      const detalleProductos = [];

      empLines.forEach(l => {
        ticketsSet.add(l.id_venta);
        const qty = safeNum(l.cantidad);
        const price = safeNum(l.precio_unitario);
        const cost = safeNum(l.costo_efectivo);

        const lineSale = qty * price;
        const lineCost = qty * cost;
        const lineProfit = lineSale - lineCost;
        const lineMarginPct = lineSale > 0 ? (lineProfit / lineSale) * 100 : 0;

        totalUnidades += qty;
        totalVendido += lineSale;
        totalCosto += lineCost;
        gananciaTotal += lineProfit;

        const cumpleMargen = lineProfit > 0 && lineMarginPct >= minMarginPct;
        if (cumpleMargen) {
          ventaComisionable += lineSale;
          gananciaComisionable += lineProfit;
        } else if (qty > 0) {
          lineasExcluidasPorMargen += 1;
        }

        if (detalleProductos.length < 40) {
          detalleProductos.push({
            id_venta: l.id_venta,
            fecha: l.fecha,
            codigo: l.producto_codigo,
            nombre: l.producto_nombre,
            cantidad: qty,
            precio_unitario: price,
            costo_unitario: cost,
            venta_linea: lineSale,
            ganancia_linea: lineProfit,
            margen_pct: Number(lineMarginPct.toFixed(1)),
            comisiona: cumpleMargen
          });
        }
      });

      // Evaluar reglas de comisión
      const cumplioMetaMinima = gananciaComisionable >= minProfitGoal;
      const cumplioMetaObjetivo = targetProfitGoal > 0 && gananciaComisionable >= targetProfitGoal;

      let pctGananciaEfectivo = pctProfit1;
      if (
        (tipoComision === 'ESCALONADA_GANANCIA' || pctProfit2 > 0) &&
        cumplioMetaObjetivo &&
        pctProfit2 > 0
      ) {
        pctGananciaEfectivo = pctProfit2;
      }

      let comisionPorGanancia = 0;
      let comisionPorVenta = 0;
      let bonoMeta = 0;
      let explicacionRegla = '';

      if (tipoComision === 'SIN_COMISION') {
        explicacionRegla = 'Salario fijo sin comisión';
      } else if (!cumplioMetaMinima) {
        explicacionRegla = `No alcanzó la ganancia mínima requerida (C$ ${minProfitGoal.toLocaleString()} vs C$ ${gananciaComisionable.toFixed(2)})`;
      } else {
        if (
          tipoComision === 'PORCENTAJE_GANANCIA' ||
          tipoComision === 'ESCALONADA_GANANCIA' ||
          tipoComision === 'MIXTA_GANANCIA_VENTA'
        ) {
          comisionPorGanancia = (Math.max(0, gananciaComisionable) * pctGananciaEfectivo) / 100;
        }
        if (tipoComision === 'PORCENTAJE_VENTA' || tipoComision === 'MIXTA_GANANCIA_VENTA') {
          comisionPorVenta = (Math.max(0, ventaComisionable) * pctSale) / 100;
        }
        if (cumplioMetaObjetivo && bonoMetaAmount > 0) {
          bonoMeta = bonoMetaAmount;
        }

        explicacionRegla = `${pctGananciaEfectivo}% sobre Ganancia Comisionable${
          pctSale > 0 && (tipoComision === 'PORCENTAJE_VENTA' || tipoComision === 'MIXTA_GANANCIA_VENTA')
            ? ` + ${pctSale}% sobre Venta`
            : ''
        }${cumplioMetaObjetivo ? ' (🌟 Meta Objetivo Superada)' : ''}${
          minMarginPct > 0 ? ` · Margen mín. ${minMarginPct}%` : ''
        }`;
      }

      // Movimientos pendientes del empleado
      const empMovs = (movimientos || []).filter(m => Number(m.id_empleado) === empId);
      const bonosExtra = empMovs
        .filter(m => m.tipo === 'BONO')
        .reduce((acc, m) => acc + safeNum(m.monto), 0);
      const deduccionesAdelantos = empMovs
        .filter(m => m.tipo === 'ADELANTO' || m.tipo === 'DEDUCCION')
        .reduce((acc, m) => acc + safeNum(m.monto), 0);

      const totalComisionEmpleado = comisionPorGanancia + comisionPorVenta + bonoMeta;
      const totalNetoPagar = Math.max(
        0,
        salarioBase + totalComisionEmpleado + bonosExtra - deduccionesAdelantos
      );

      totalVendidoGlobal += totalVendido;
      totalCostoGlobal += totalCosto;
      gananciaTotalGlobal += gananciaTotal;
      totalSalariosBase += salarioBase;
      totalComisiones += totalComisionEmpleado;
      totalBonos += bonosExtra;
      totalDeducciones += deduccionesAdelantos;
      totalPlanillaNeta += totalNetoPagar;

      return {
        ...emp,
        metricas: {
          total_facturas: ticketsSet.size,
          total_unidades: Number(totalUnidades.toFixed(2)),
          total_vendido: Number(totalVendido.toFixed(2)),
          total_costo: Number(totalCosto.toFixed(2)),
          ganancia_total: Number(gananciaTotal.toFixed(2)),
          margen_promedio_pct: totalVendido > 0 ? Number(((gananciaTotal / totalVendido) * 100).toFixed(1)) : 0,
          venta_comisionable: Number(ventaComisionable.toFixed(2)),
          ganancia_comisionable: Number(gananciaComisionable.toFixed(2)),
          lineas_excluidas_margen: lineasExcluidasPorMargen,
          cumplio_meta_minima: cumplioMetaMinima,
          cumplio_meta_objetivo: cumplioMetaObjetivo,
          pct_ganancia_aplicado: pctGananciaEfectivo,
          explicacion_regla: explicacionRegla,
          salario_base: Number(salarioBase.toFixed(2)),
          comision_ganancia: Number(comisionPorGanancia.toFixed(2)),
          comision_venta: Number(comisionPorVenta.toFixed(2)),
          bono_meta: Number(bonoMeta.toFixed(2)),
          total_comisiones: Number(totalComisionEmpleado.toFixed(2)),
          bonos_extra: Number(bonosExtra.toFixed(2)),
          deducciones_adelantos: Number(deduccionesAdelantos.toFixed(2)),
          total_neto_pagar: Number(totalNetoPagar.toFixed(2))
        },
        movimientos_pendientes: empMovs,
        detalle_productos: detalleProductos
      };
    });

    res.json({
      period: { startDate, endDate },
      summary: {
        totalEmpleados: payrollEmployees.length,
        totalVendidoGlobal: Number(totalVendidoGlobal.toFixed(2)),
        totalCostoGlobal: Number(totalCostoGlobal.toFixed(2)),
        gananciaTotalGlobal: Number(gananciaTotalGlobal.toFixed(2)),
        totalSalariosBase: Number(totalSalariosBase.toFixed(2)),
        totalComisiones: Number(totalComisiones.toFixed(2)),
        totalBonos: Number(totalBonos.toFixed(2)),
        totalDeducciones: Number(totalDeducciones.toFixed(2)),
        totalPlanillaNeta: Number(totalPlanillaNeta.toFixed(2))
      },
      employees: payrollEmployees,
      history: pagosHistorial
    });
  } catch (err) {
    console.error('Error getPayrollReport:', err);
    res.status(500).json({ message: 'Error calculando planilla y comisiones: ' + err.message });
  }
};

// POST /api/employees/payroll-movement
exports.addPayrollMovement = async (req, res) => {
  try {
    const { id_empleado, tipo, monto, concepto } = req.body;
    if (!id_empleado || !tipo || !monto || !concepto) {
      return res.status(400).json({ message: 'Completa empleado, tipo, monto y concepto.' });
    }

    const actor = req.user?.nombre_usuario || req.user?.nombre || 'Admin';
    const [result] = await pool.query(
      `INSERT INTO planilla_movimientos (id_empleado, tipo, monto, concepto, registrado_por)
       VALUES (?, ?, ?, ?, ?)`,
      [Number(id_empleado), tipo, safeNum(monto), concepto.trim(), actor]
    );

    await logUserActivity({
      req,
      modulo: 'Planilla y Comisiones',
      accion: `PLANILLA_${tipo}`,
      descripcion: `Registró ${tipo} de C$ ${safeNum(monto).toFixed(2)} para empleado #${id_empleado}: "${concepto.trim()}"`
    });

    res.status(201).json({ id_movimiento: result.insertId, message: 'Movimiento registrado en planilla.' });
  } catch (err) {
    console.error('Error addPayrollMovement:', err);
    res.status(500).json({ message: 'Error registrando movimiento de planilla.' });
  }
};

// DELETE /api/employees/payroll-movement/:id
exports.deletePayrollMovement = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM planilla_movimientos WHERE id_movimiento = ? AND liquidado = 0', [id]);
    res.json({ message: 'Movimiento eliminado.' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando movimiento.' });
  }
};

// POST /api/employees/liquidate
exports.liquidatePayroll = async (req, res) => {
  try {
    const {
      id_empleado,
      empleado_nombre,
      fecha_inicio,
      fecha_fin,
      frecuencia_pago,
      metricas,
      metodo_pago,
      notas
    } = req.body;

    if (!id_empleado || !metricas) {
      return res.status(400).json({ message: 'Datos de liquidación incompletos.' });
    }

    const actor = req.user?.nombre_usuario || req.user?.nombre || 'Admin';

    const [result] = await pool.query(
      `INSERT INTO planilla_pagos (
        id_empleado, empleado_nombre, fecha_inicio, fecha_fin, frecuencia_pago,
        total_facturas, total_vendido, total_costo, ganancia_generada, ganancia_comisionable,
        regla_aplicada, salario_base, comision_ganancia, comision_venta, bono_meta,
        bonos_extra, deducciones_adelantos, total_neto_pagado,
        metodo_pago, notas, pagado_por, detalles_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(id_empleado),
        empleado_nombre || `Empleado #${id_empleado}`,
        fecha_inicio,
        fecha_fin,
        frecuencia_pago || 'Quincenal',
        safeNum(metricas.total_facturas),
        safeNum(metricas.total_vendido),
        safeNum(metricas.total_costo),
        safeNum(metricas.ganancia_total),
        safeNum(metricas.ganancia_comisionable),
        metricas.explicacion_regla || 'Regla por Ganancia',
        safeNum(metricas.salario_base),
        safeNum(metricas.comision_ganancia),
        safeNum(metricas.comision_venta),
        safeNum(metricas.bono_meta),
        safeNum(metricas.bonos_extra),
        safeNum(metricas.deducciones_adelantos),
        safeNum(metricas.total_neto_pagar),
        metodo_pago || 'Efectivo',
        notas || null,
        actor,
        JSON.stringify(metricas)
      ]
    );

    // Marcar los vales/adelantos/bonos pendientes de ese empleado como liquidados en este pago
    await pool.query(
      `UPDATE planilla_movimientos
       SET liquidado = 1, id_pago_planilla = ?
       WHERE id_empleado = ? AND liquidado = 0`,
      [result.insertId, Number(id_empleado)]
    );

    await logUserActivity({
      req,
      modulo: 'Planilla y Comisiones',
      accion: 'PLANILLA_LIQUIDADA',
      descripcion: `Liquidó planilla y comisión de "${empleado_nombre}" (${fecha_inicio} a ${fecha_fin}) por C$ ${safeNum(metricas.total_neto_pagar).toFixed(2)} (Ganancia generada: C$ ${safeNum(metricas.ganancia_total).toFixed(2)})`
    });

    const [created] = await pool.query('SELECT * FROM planilla_pagos WHERE id_pago = ?', [result.insertId]);
    res.status(201).json({
      message: 'Pago de planilla y comisión registrado correctamente.',
      pago: created[0]
    });
  } catch (err) {
    console.error('Error liquidatePayroll:', err);
    res.status(500).json({ message: 'Error al registrar liquidación de planilla: ' + err.message });
  }
};
