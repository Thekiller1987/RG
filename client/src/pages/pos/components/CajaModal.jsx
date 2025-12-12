import React, { useMemo, useState } from 'react';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles.jsx';
import {
  FaLockOpen, FaFileInvoiceDollar, FaRegCreditCard,
  FaMoneyBillWave, FaExchangeAlt, FaUserClock, FaPrint, FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Props esperadas:
 * - currentUser
 * - isCajaOpen (bool)
 * - session (obj persistido en utils/caja)
 * - onOpenCaja(montoInicial, tasaDolar)
 * - onCloseCaja(montoContado)
 * - onClose()  -> cerrar modal
 * - isAdmin
 * - showConfirmation({title, message, onConfirm})
 * - showAlert({title, message})
 * - initialTasaDolar (number)
 */
const CajaModal = ({
  currentUser, isCajaOpen, session, onOpenCaja, onCloseCaja,
  onClose, isAdmin, showConfirmation, showAlert, initialTasaDolar
}) => {
  const [montoApertura, setMontoApertura] = useState('');
  const [tasaDolar, setTasaDolar] = useState(initialTasaDolar || 36.60);
  const [montoContado, setMontoContado] = useState('');
  const [viewingReport, setViewingReport] = useState(false);
  const navigate = useNavigate();

  const transactions = useMemo(
    () => Array.isArray(session?.transactions) ? session.transactions : [],
    [session]
  );

  // --------- Clasificación y totales ----------
  // --------- Clasificación y totales (Cálculo corregido) ----------
  const {
    cajaInicial,
    movimientoNetoEfectivo,
    efectivoEsperado,
    ventasContado,
    devoluciones,
    cancelaciones,
    entradas,
    salidas,
    abonos,
    totalTarjeta,
    totalTransferencia,
    totalCredito,
    totalNoEfectivo, // Suma de Tarjeta + Transferencia + Crédito
    sumDevolucionesCancelaciones,
    totalVentasDia // Nueva métrica: Total vendido (sin importar método de pago)
  } = useMemo(() => {
    const cajaInicialN = Number(session?.initialAmount || 0);

    const cls = {
      ventasContado: [],
      devoluciones: [],
      cancelaciones: [],
      entradas: [],
      salidas: [],
      abonos: []
    };

    let netCash = 0;      // Acumulador de efectivo físico real
    let tTarjeta = 0;     // Total cobrado con tarjeta
    let tTransf = 0;      // Total cobrado con transferencia
    let tCredito = 0;     // Total fiado / crédito
    let tVentasDia = 0;   // Suma total de todas las ventas del día (bruto)

    let sumDevsCancels = 0;

    for (const tx of transactions) {
      const t = (tx?.type || '').toLowerCase();
      // const txId = String(tx?.id || '').toLowerCase(); 

      // --- PARSEO ROBUSTO DE PAGO DETALLES ---
      // Si el backend devuelve un string JSON (común en ciertos DB adapters), lo parseamos.
      let pd = tx?.pagoDetalles || {};
      if (typeof pd === 'string') {
        try {
          pd = JSON.parse(pd);
        } catch (e) {
          console.error("Error parseando pagoDetalles en transacción:", tx, e);
          pd = {};
        }
      }
      // Aseguramos que sea objeto
      if (!pd || typeof pd !== 'object') pd = {};

      // 1. Obtener el monto TOTAL que afectó la caja (Ventas, Abonos, Devoluciones, etc.)
      // Este valor incluye Efectivo + Tarjeta + Transferencia
      // CORRECCION CRÍTICA: Asegurar signo correcto para salidas y devoluciones
      let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));

      if (t === 'salida' || t.includes('devolucion')) {
        // Si es una salida, forzamos negativo para que reste matemáticamente
        rawAmount = -Math.abs(rawAmount);
      }

      const montoBase = rawAmount;

      // CREAR VERSIÓN NORMALIZADA PARA VISUALIZACIÓN
      // Esto asegura que al imprimir el reporte, se use el 'pd' ya parseado y no el string original.
      // Ademas, agregamos displayAmount para que el reporte impreso coincida con el signo (negativo) forzado si aplica.
      const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: rawAmount };

      // 1. DESGLOSE DE PAGOS NO EFECTIVO
      // Estos montos son parte del montoBase pero NO son dinero físico en caja.
      const txTarjeta = Number(pd.tarjeta || 0);
      const txTransf = Number(pd.transferencia || 0);
      const txCredito = Number(pd.credito || 0);

      // Acumuladores globales de "No Efectivo"
      // Se suman solo si es una operación de ingreso (venta, abono, etc) para no restar si es devolucion (aunque raramente se devuelve a tarjeta directo aquí)
      if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
        tTarjeta += txTarjeta;
        tTransf += txTransf;
        tCredito += txCredito;
      }

      // 2. CALCULAR EL EFECTIVO REAL DE ESTA TRANSACCIÓN (POSITIVE SUMMATION LOGIC)
      // En lugar de (Total - Tarjeta), sumamos directamente lo que entró en efectivo.
      // Esto desacopla el reporte de "Ventas Totales" del "Arqueo de Efectivo".

      let ingresoEfectivoReal = 0;

      if (t.startsWith('venta')) {
        // Lógica positiva: Efectivo Recibido - Cambio Entregado
        // Fallback seguro: Si por alguna razón es una venta legacy sin detalles, usamos la lógica anterior (Total - Digital)
        if (pd.efectivo !== undefined) {
          const cashIn = Number(pd.efectivo || 0);
          const cashOut = Number(pd.cambio || 0);
          const dolaresEnLocal = Number(pd.dolares || 0) * Number(pd.tasa || tx.tasaDolarAlMomento || 1); // Si aceptan dólares
          // ingresoEfectivoReal = (cashIn + dolaresEnLocal) - cashOut; 
          // Simplificación: Asumimos efectivo neto ya calculado o raw inputs. 
          // En POS.jsx 'efectivo' es lo recibido. 'cambio' es lo devuelto.
          ingresoEfectivoReal = (cashIn + dolaresEnLocal) - cashOut;
        } else {
          // Legacy Fallback (si no hay desglose de pago)
          ingresoEfectivoReal = montoBase - txTarjeta - txTransf - txCredito;
        }
      }
      else if (t.includes('abono')) {
        // Para abonos, ya corregimos AbonoModal para que 'ingresoCaja' sea solo la parte efectiva.
        // Si es tarjeta, ingresoCaja es 0.
        ingresoEfectivoReal = Number(pd.ingresoCaja || 0);
      }
      else {
        // Entradas, Salidas, Devoluciones genéricas:
        // Usamos el montoBase (que ya tiene el signo negativo si es salida).
        // Asumimos que estas operaciones son CAJA por defecto salvo que se diga lo contrario.
        ingresoEfectivoReal = montoBase - txTarjeta - txTransf;
      }

      // Corrección de signo final por seguridad (ej: salidas)
      // Si es salida, montoBase era negativo. ingresoEfectivoReal debe ser negativo.
      // (cashIn - cashOut) usualmente es positivo. 
      // Si es devolucion y usabamos lógica POS, pd.efectivo suele ser 0.
      if (t === 'salida' || t.includes('devolucion')) {
        // En devoluciones, rawAmount es negativo.
        // Si usamos lógica positiva en venta (devolucion de venta?), pd.efectivo quizas no exista.
        // fallback a montoBase para devoluciones.
        ingresoEfectivoReal = montoBase;
      }

      // 3. ACTUALIZAR CAJA (Solo Efectivo)
      // Ahora ingresoEfectivoReal es puramente el movimiento físico de dinero.
      netCash += ingresoEfectivoReal;

      // 4. TOTAL VENTAS DEL DIA
      // Este se mantiene igual: Suma del valor de la transacción (bruto).
      if (t.startsWith('venta')) {
        if (rawAmount > 0) {
          tVentasDia += (rawAmount + txCredito);
        } else {
          tVentasDia += (Math.abs(rawAmount) + txCredito);
        }
      }

      // --- Clasificación en Listas para visualización ---
      const esDevolucion = t === 'devolucion' || t.includes('devolucion');
      const esCancelacion = t === 'cancelacion' || t.includes('cancelacion');

      if (t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito') {
        // Incluimos venta_credito en la lista si queremos verla, pero su efectivo fue 0 arriba si fue total
        cls.ventasContado.push(normalizedTx);
      }
      else if (esDevolucion) {
        cls.devoluciones.push(normalizedTx);
        sumDevsCancels += Math.abs(montoBase);
      }
      else if (esCancelacion) {
        cls.cancelaciones.push(normalizedTx);
        sumDevsCancels += Math.abs(montoBase);
      }
      else if (t === 'entrada') {
        cls.entradas.push(normalizedTx);
      }
      else if (t === 'salida') {
        cls.salidas.push(normalizedTx);
      }
      else if (t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
        cls.abonos.push(normalizedTx);
      }
    }

    return {
      cajaInicial: cajaInicialN,
      movimientoNetoEfectivo: netCash,
      efectivoEsperado: cajaInicialN + netCash,
      ventasContado: cls.ventasContado,
      devoluciones: cls.devoluciones,
      cancelaciones: cls.cancelaciones,
      entradas: cls.entradas,
      salidas: cls.salidas,
      abonos: cls.abonos,
      totalTarjeta: tTarjeta,
      totalTransferencia: tTransf,
      totalCredito: tCredito,
      totalNoEfectivo: tTarjeta + tTransf + tCredito,
      sumDevolucionesCancelaciones: sumDevsCancels,
      totalVentasDia: tVentasDia
    };
  }, [transactions, session]);

  const diferencia = (Number(montoContado || 0) - efectivoEsperado);

  const openedAt = session?.openedAt ? new Date(session.openedAt) : null;
  const openedByName = session?.openedBy?.name || '—';
  const closedAt = session?.closedAt ? new Date(session.closedAt) : null;
  const closedByName = session?.closedBy?.name || '';

  // --------- Handlers ----------
  const handleOpen = () => {
    const monto = parseFloat(montoApertura || 0);
    if (isNaN(monto) || monto < 0) {
      showAlert({ title: 'Monto inválido', message: 'Ingrese un monto inicial válido (>= 0).' });
      return;
    }
    onOpenCaja(monto, Number(tasaDolar || 36.60));
  };

  const handlePrepareClose = () => {
    if (isNaN(parseFloat(montoContado))) {
      showAlert({ title: 'Dato requerido', message: 'Ingrese el monto contado para generar el arqueo.' });
      return;
    }
    setViewingReport(true);
  };

  const handleConfirmClose = () => {
    const proceedClose = () => onCloseCaja(Number(montoContado));
    if (Math.abs(diferencia) > 0.01) {
      showConfirmation({
        title: 'Diferencia en Arqueo',
        message: `Hay una diferencia de C$${diferencia.toFixed(2)}. ¿Cerrar caja de todos modos?`,
        onConfirm: proceedClose
      });
    } else {
      proceedClose();
    }
  };

  const printReport = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const fmt = (n) => `C$${Number(n || 0).toFixed(2)}`;
    const fmtDate = (d) => d ? d.toLocaleString('es-NI', { timeZone: 'America/Managua' }) : '—';

    // Usamos tx.displayAmount si existe (calculado arriba), o fallback al viejo
    // Estilos amigables (tipo ticket pero ancho)
    const css = `
      body { font-family: 'Courier New', Courier, monospace; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
      h2, h3 { text-align: center; margin: 5px 0; text-transform: uppercase; }
      .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 20px; }
      .box { border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
      .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
      .row.bold { font-weight: bold; font-size: 16px; margin-top: 5px; border-top: 1px solid #eee; padding-top: 5px; }
      .big-total { font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0; background: #eee; padding: 10px; border-radius: 5px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
      th { border-bottom: 1px solid #333; text-align: left; padding: 5px; }
      td { border-bottom: 1px solid #eee; padding: 5px; }
      .text-right { text-align: right; }
      .section-title { font-weight: bold; font-size: 16px; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
      .diff-negative { color: red; font-weight: bold; }
      .diff-positive { color: green; font-weight: bold; }
    `;

    // Calculamos totales detallados para el desglose visual
    // Filtramos SOLO lo que fue efectivo real para mostrarlo claro
    const ventasEfectivoTotal = cls.ventasContado.reduce((sum, tx) => sum + (Number(tx.pagoDetalles?.efectivo || 0) - Number(tx.pagoDetalles?.cambio || 0) + (Number(tx.pagoDetalles?.dolares || 0) * Number(tx.pagoDetalles?.tasa || 1))), 0);
    const abonosEfectivoTotal = cls.abonos.reduce((sum, tx) => sum + (Number(tx.pagoDetalles?.ingresoCaja || 0)), 0);
    const salidasTotal = Math.abs(cls.salidas.reduce((sum, tx) => sum + Number(tx.displayAmount || tx.amount || 0), 0));

    // Generar filas de tabla
    const rowsHTML = (arr, color = '#333') => arr.map(tx => `
      <tr>
        <td>${tx.at ? new Date(tx.at).toLocaleTimeString() : ''}</td>
        <td>${tx.note || tx.type || ''}</td>
        <td class="text-right" style="color:${color}">${fmt(tx.displayAmount)}</td>
      </tr>`).join('');

    win.document.write(`
      <html>
      <head>
        <title>Arqueo de Caja - ${new Date().toLocaleDateString()}</title>
        <style>${css}</style>
      </head>
      <body>
             <div>Total Ventas del Día:</div>
             <div>${fmt(totalVentasDia)}</div>
          </div>
          <div class="row"><div>Fondo Inicial:</div><div>${fmt(cajaInicial)}</div></div>
          <div class="row"><div>Movimiento Neto Efectivo:</div><div>${fmt(movimientoNetoEfectivo)}</div></div>
          
          <div class="row red"><div>(-) Devoluciones/Cancelaciones:</div><div>${fmt(sumDevolucionesCancelaciones)}</div></div>

          <div class="sep"></div>
          <div class="row bold"><div>Efectivo Esperado:</div><div>${fmt(efectivoEsperado)}</div></div>
          <div class="row"><div>Monto Físico Contado:</div><div>${fmt(montoContado)}</div></div>
          <div class="row diff"><div>DIFERENCIA:</div><div>${fmt(diferencia)}</div></div>
        </div>

        <div class="box">
          <div class="bold" style="margin-bottom:6px;">Resumen de Ingresos (No Efectivo)</div>
          <div class="row"><div>Tarjeta:</div><div>${fmt(totalTarjeta)}</div></div>
          <div class="row"><div>Transferencia:</div><div>${fmt(totalTransferencia)}</div></div>
          <div class="row"><div>Crédito:</div><div>${fmt(totalCredito)}</div></div>
          <div class="row bold"><div>Total No Efectivo:</div><div>${fmt(totalNoEfectivo)}</div></div>
        </div>

        <div class="box">
          <h3>Abonos y Otros Ingresos</h3>
          <table>
             <thead><tr><th>Fecha</th><th>Nota / Tipo</th><th style="text-align:right">Monto</th></tr></thead>
             <tbody>${abonos.length > 0 ? rows(abonos, '#198754') : '<tr><td colspan="3" style="text-align:center; color:#999;">Sin abonos</td></tr>'}</tbody>
          </table>

          <h3>Entradas</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Monto</th></tr></thead>
            <tbody>${rows(entradas, '#198754')}</tbody>
          </table>

          <h3>Salidas</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Monto</th></tr></thead>
            <tbody>${rows(salidas, '#dc3545')}</tbody>
          </table>

          <h3>Cancelaciones</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Efectivo</th></tr></thead>
            <tbody>${rows(cancelaciones, '#6c757d')}</tbody>
          </table>

          <h3>Devoluciones</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Efectivo</th></tr></thead>
            <tbody>${rows(devoluciones, '#6c757d')}</tbody>
          </table>
        </div>

        <script>
          window.onload = () => { window.print(); setTimeout(() => window.close(), 300); }
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  // --------- UI ----------
  return (
    <ModalOverlay>
      <ModalContent style={{ maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Gestión de Caja</h2>
          <Button $cancel onClick={onClose} style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}>✕</Button>
        </div>

        {!isCajaOpen ? (
          <>
            <h3 style={{ color: '#28a745', marginTop: '1rem', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
              <FaLockOpen /> Abrir Caja
            </h3>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Monto Inicial (C$)</label>
                <SearchInput type="number" step="0.01" placeholder="Ej: 100.00" value={montoApertura} onChange={e => setMontoApertura(e.target.value)} autoFocus />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Tasa del Dólar</label>
                <SearchInput type="number" step="0.01" value={tasaDolar} onChange={e => setTasaDolar(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <Button primary onClick={handleOpen} style={{ flex: 1, padding: '10px' }}>Abrir Caja</Button>
              <Button onClick={() => navigate('/dashboard')} style={{ flex: 0.7, padding: '10px', fontWeight: 700 }}>
                ← Ir al Dashboard
              </Button>
            </div>
          </>
        ) : viewingReport ? (
          <>
            <h3 style={{ color: '#007bff', borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaFileInvoiceDollar /> Reporte de Arqueo
            </h3>

            <div className="info" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: 12 }}>
              <TotalsRow>
                <span><FaUserClock /> Abrió:</span>
                <span>{openedByName} — {openedAt?.toLocaleString('es-NI', { timeZone: 'America/Managua' }) || '—'}</span>
              </TotalsRow>
              <TotalsRow>
                <span><FaUserClock /> Cierra:</span>
                <span>{(currentUser?.nombre_usuario || closedByName || '—')} — {new Date().toLocaleString('es-NI', { timeZone: 'America/Managua' })}</span>
              </TotalsRow>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', backgroundColor: '#f9f9f9' }}>
              <TotalsRow $bold style={{ fontSize: '1.1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                <span>Total Ventas del Día:</span>
                <span>C${totalVentasDia.toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow>
                <span><FaMoneyBillWave /> Fondo Inicial:</span>
                <span>C${cajaInicial.toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow>
                <span>Movimiento Neto Efectivo:</span>
                <span>C${movimientoNetoEfectivo.toFixed(2)}</span>
              </TotalsRow>

              <TotalsRow style={{ color: '#dc3545', fontSize: '0.9rem' }}>
                <span><FaExclamationCircle /> Salidas por Dev/Cancel:</span>
                <span>C${sumDevolucionesCancelaciones.toFixed(2)}</span>
              </TotalsRow>

              <hr style={{ margin: '6px 0', border: 'none', borderTop: '2px dashed #ccc' }} />

              <TotalsRow $bold>
                <span>Efectivo Esperado:</span>
                <span>C${efectivoEsperado.toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow>
                <span>Monto Físico Contado:</span>
                <span>C${Number(montoContado).toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow $bold style={{ color: diferencia !== 0 ? '#dc3545' : '#28a745', fontSize: '1.1rem', padding: '6px', backgroundColor: '#eef7ee', borderRadius: '6px' }}>
                <span>DIFERENCIA:</span>
                <span>C${diferencia.toFixed(2)}</span>
              </TotalsRow>

              <hr style={{ margin: '6px 0', border: 'none', borderTop: '1px solid #eee' }} />

              <p style={{ fontWeight: 'bold', color: '#6c757d', margin: '6px 0 0' }}>Resumen de Ingresos (No Efectivo):</p>
              <TotalsRow>
                <span><FaRegCreditCard /> Total Tarjeta:</span>
                <span>C${totalTarjeta.toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow>
                <span><FaExchangeAlt /> Total Transferencia:</span>
                <span>C${totalTransferencia.toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow style={{ color: totalCredito > 0 ? '#dc3545' : 'inherit' }}>
                <span>Total al Crédito:</span>
                <span>C${totalCredito.toFixed(2)}</span>
              </TotalsRow>
              <TotalsRow $bold>
                <span>Total No Efectivo:</span>
                <span>C${totalNoEfectivo.toFixed(2)}</span>
              </TotalsRow>
            </div>

            <SectionList title="Abonos y Otros Pagos" items={abonos} positive />
            <SectionList title="Entradas" items={entradas} positive />
            <SectionList title="Salidas" items={salidas} />
            {cancelaciones?.length > 0 && <SectionList title="Cancelaciones" items={cancelaciones} neutral />}
            {devoluciones?.length > 0 && <SectionList title="Devoluciones" items={devoluciones} neutral />}

            <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
              <Button primary onClick={handleConfirmClose} style={{ flex: 1 }} disabled={!isAdmin}>
                Confirmar y Cerrar Caja
              </Button>
              <Button onClick={() => setViewingReport(false)} style={{ flex: 0.6 }}>Volver</Button>
              <Button onClick={printReport} style={{ flex: 0.6, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <FaPrint /> Imprimir
              </Button>
            </div>
            {!isAdmin && <p style={{ color: '#dc3545', marginTop: 8, textAlign: 'center', fontSize: '0.9rem' }}>Solo un Administrador puede cerrar la caja.</p>}
          </>
        ) : (
          <>
            <h3 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>
              Arqueo y Cierre de Caja
            </h3>

            <div className="info" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', marginBottom: 12 }}>
              <TotalsRow>
                <span><FaUserClock /> Abrió:</span>
                <span>{openedByName} — {openedAt?.toLocaleString('es-NI', { timeZone: 'America/Managua' }) || '—'}</span>
              </TotalsRow>
            </div>

            <TotalsRow $bold style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
              <span><FaMoneyBillWave /> Efectivo Esperado:</span>
              <span>C${efectivoEsperado.toFixed(2)}</span>
            </TotalsRow>

            <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>Monto Contado Físico (C$)</label>
            <SearchInput
              type="number"
              step="0.01"
              placeholder="Ingrese el total contado"
              value={montoContado}
              onChange={e => setMontoContado(e.target.value)}
            />
            {montoContado && (
              <TotalsRow $bold style={{ color: diferencia !== 0 ? '#dc3545' : '#28a745', fontSize: '1.05rem' }}>
                <span>Diferencia:</span>
                <span>C${diferencia.toFixed(2)}</span>
              </TotalsRow>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
              <Button primary onClick={handlePrepareClose} disabled={!isAdmin} style={{ flex: 1, padding: '12px' }}>
                Generar Reporte y Cerrar
              </Button>
              <Button onClick={onClose} style={{ flex: 0.6 }}>Cancelar</Button>
            </div>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CajaModal;

function SectionList({ title, items, positive = false, neutral = false }) {
  if (!items?.length) return null;
  const color = neutral ? '#6c757d' : (positive ? '#198754' : '#dc3545');
  const fmt = (n) => `C$${Number(n || 0).toFixed(2)}`;

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 10 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ maxHeight: 220, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thS}>Fecha</th>
              <th style={thS}>Nota / Tipo</th>
              <th style={{ ...thS, textAlign: 'right' }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {items.map(tx => (
              <tr key={tx.id || Math.random()}>
                <td style={tdS}>{new Date(tx.at).toLocaleString('es-NI', { timeZone: 'America/Managua' })}</td>
                <td style={tdS}>{tx.note || tx.type || ''}</td>
                <td style={{ ...tdS, textAlign: 'right', color }}>{fmt(tx.pagoDetalles?.ingresoCaja ?? tx.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thS = { borderBottom: '1px solid #eee', padding: '6px', textAlign: 'left', fontSize: 13, color: '#555' };
const tdS = { borderBottom: '1px solid #f3f3f3', padding: '6px', fontSize: 14 };