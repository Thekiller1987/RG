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

  const userId = currentUser?.id_usuario || currentUser?.id;
  const openedById = session?.openedBy?.id || session?.openedBy;
  // Allow close if Admin OR if current user opened the box
  const canClose = isAdmin || (String(userId) === String(openedById));

  const transactions = useMemo(
    () => Array.isArray(session?.transactions) ? session.transactions : [],
    [session]
  );

  // --------- Clasificación y totales ----------
  // --------- Clasificación y totales (Cálculo corregido) ----------
  const {
    cajaInicial,
    netCordobas,
    netDolares,
    movimientoNetoEfectivo,
    efectivoEsperado,
    efectivoEsperadoCordobas,
    efectivoEsperadoDolares,
    ventasContado,
    devoluciones,
    cancelaciones,
    entradas,
    salidas,
    abonos,
    totalTarjeta,
    totalTransferencia,
    totalCredito,
    totalNoEfectivo,
    sumDevolucionesCancelaciones,
    totalVentasDia,
    tasaRef
  } = useMemo(() => {
    const cajaInicialN = Number(session?.initialAmount || 0);
    const tasaRef = Number(session?.tasaDolar || initialTasaDolar || 36.60);

    const cls = {
      ventasContado: [],
      devoluciones: [],
      cancelaciones: [],
      entradas: [],
      salidas: [],
      abonos: []
    };

    // Acumuladores de Caja Física
    let netCordobas = 0; // Efectivo C$
    let netDolares = 0;  // Efectivo $

    // Acumuladores de Flujo (No efectivo)
    let tTarjeta = 0;
    let tTransf = 0;
    let tCredito = 0;

    let tVentasDia = 0;   // Suma total bruto
    let sumDevsCancels = 0;

    for (const tx of transactions) {
      const t = (tx?.type || '').toLowerCase();

      // --- PARSEO ROBUSTO ---
      let pd = tx?.pagoDetalles || {};
      if (typeof pd === 'string') {
        try { pd = JSON.parse(pd); } catch (e) { pd = {}; }
      }
      if (!pd || typeof pd !== 'object') pd = {};

      // Monto base total
      let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));

      if (t === 'salida' || t.includes('devolucion')) {
        rawAmount = -Math.abs(rawAmount);
      }
      const montoBase = rawAmount;
      const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: rawAmount };

      // 1. DESGLOSE DE PAGOS NO EFECTIVO
      const txTarjeta = Number(pd.tarjeta || 0);
      const txTransf = Number(pd.transferencia || 0);
      const txCredito = Number(pd.credito || 0);

      if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
        tTarjeta += txTarjeta;
        tTransf += txTransf;
        tCredito += txCredito;
      }

      // 2. CALCULO DE EFECTIVO FÍSICO (Separado por moneda)
      if (t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito' || t.startsWith('venta')) {
        if (pd.efectivo !== undefined || pd.dolares !== undefined) {
          const cashInCordobas = Number(pd.efectivo || 0);
          const cashInDolares = Number(pd.dolares || 0);
          const cashOutCordobas = Number(pd.cambio || 0);

          netCordobas += (cashInCordobas - cashOutCordobas);
          netDolares += cashInDolares;
        } else {
          // Legacy Fallback
          const neto = montoBase - txTarjeta - txTransf - txCredito;
          netCordobas += neto;
        }
      }
      else if (t.includes('abono')) {
        if (pd.dolares !== undefined) {
          netDolares += Number(pd.dolares || 0);
          netCordobas += Number(pd.efectivo || 0);
        } else {
          netCordobas += Number(pd.ingresoCaja || 0);
        }
      }
      else if (t === 'entrada') {
        const montoEntrada = Math.abs(montoBase);
        netCordobas += montoEntrada;
      }
      else if (t === 'salida') {
        const montoSalida = Math.abs(montoBase);
        netCordobas -= montoSalida;
      }
      else if (t.includes('devolucion')) {
        // Devolución resta dinero de caja
        netCordobas += montoBase; // montoBase es negativo
      }
      else {
        // Fallback genérico
        netCordobas += montoBase - txTarjeta - txTransf;
      }

      // 4. TOTAL VENTAS DEL DIA
      if (t.startsWith('venta')) {
        // Corrección: Usar el Total Venta guardado si existe, o sumar todos los componentes
        if (pd.totalVenta) {
          tVentasDia += Number(pd.totalVenta);
        } else {
          // Fallback para datos viejos: Sumar Cash + Tarjeta + Transf + Credito
          tVentasDia += (Math.abs(rawAmount) + txTarjeta + txTransf + txCredito);
        }
      }

      // --- Clasificación en Listas ---
      const esDevolucion = t === 'devolucion' || t.includes('devolucion');
      const esCancelacion = t === 'cancelacion' || t.includes('cancelacion');

      if (t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito') {
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
      netCordobas,
      netDolares,
      movimientoNetoEfectivo: netCordobas + (netDolares * tasaRef),
      efectivoEsperado: cajaInicialN + netCordobas + (netDolares * tasaRef),
      efectivoEsperadoCordobas: cajaInicialN + netCordobas,
      efectivoEsperadoDolares: netDolares,
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
      totalVentasDia: tVentasDia,
      tasaRef
    };
  }, [transactions, session, initialTasaDolar]);

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
    const proceedClose = () => {
      printReport();
      setTimeout(() => onCloseCaja(Number(montoContado)), 500);
    };

    if (Math.abs(diferencia) > 0.01) {
      const tipo = diferencia < 0 ? 'FALTANTE' : 'SOBRANTE';
      const msg = diferencia < 0
        ? `⚠️ Hay un FALTANTE de C$${Math.abs(diferencia).toFixed(2)}.\n¿Está seguro de cerrar con este faltante?`
        : `⚠️ Hay un SOBRANTE de C$${diferencia.toFixed(2)}.\n¿Está seguro de cerrar con este sobrante?`;

      showConfirmation({
        title: `Diferencia: ${tipo}`,
        message: msg,
        onConfirm: proceedClose
      });
    } else {
      proceedClose();
    }
  };

  /* -----------------------------------------------------------------------------------------------
   * REPORTE DE CIERRE (DISEÑO MEJORADO)
   * ----------------------------------------------------------------------------------------------- */
  const printReport = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    // Helpers formato
    const money = (n) => `C$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Totales calculados (asegurarnos de que totalVentasDia incluye todo)
    // Nota: El useMemo ya calcula totalVentasDia sumando (rawAmount + credito) para todas las 'venta%'. 
    // Debería ser correcto, pero lo mostraremos desglosado para claridad total.

    // Preparar HTML
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CORTE DE CAJA - ${new Date().toLocaleDateString()}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; padding: 10px; 
            width: 78mm; /* Ajuste para impresora térmica */
            color: #000;
          }
          * { box-sizing: border-box; }
          h1, h2, h3, h4 { margin: 0; text-align: center; text-transform: uppercase; }
          h2 { font-size: 14pt; font-weight: 900; margin-bottom: 5px; }
          h3 { font-size: 11pt; font-weight: 700; margin-bottom: 5px; border-bottom: 2px solid #000; padding-bottom: 2px; }
          p { margin: 2px 0; font-size: 9pt; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-bold { font-weight: 800; }
          
          .section { margin-bottom: 12px; border-bottom: 1px dashed #444; padding-bottom: 8px; }
          .section:last-child { border-bottom: none; }
          
          .row { display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 3px; }
          .row.big { font-size: 11pt; font-weight: 800; margin-top: 5px; }
          .row.sub { font-size: 8.5pt; color: #333; font-style: italic; padding-left: 10px; }
          
          .box { border: 1px solid #000; padding: 6px; margin: 8px 0; border-radius: 4px; background: #fdfdfd; }
          .box-title { font-weight: 900; text-align: center; margin-bottom: 4px; font-size: 10pt; text-decoration: underline; }
          
          table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 5px; }
          th { border-bottom: 1px solid #000; text-align: left; font-weight: 800; }
          td { padding: 2px 0; }
          tr:nth-child(even) { background-color: #f8f8f8; }
          
          .alert { color: #000; font-weight: bold; }
        </style>
      </head>
      <body>
        <!-- ENCABEZADO -->
        <div class="section text-center">
          <h2>CIERRE DE CAJA</h2>
          <p><strong>Multirepuestos RG</strong></p>
          <p>Fecha: ${new Date().toLocaleDateString('es-NI')} - Hora: ${new Date().toLocaleTimeString('es-NI')}</p>
          <p>Cajero: ${currentUser?.nombre_usuario || 'Sistema'}</p>
        </div>

        <!-- 1. TOTAL VENTAS GLOBAL -->
        <div class="section">
          <h3>1. TOTAL VENTAS DEL DÍA</h3>
          <div class="row big">
             <span>TOTAL GLOBAL VENTAS:</span>
             <span>${money(totalVentasDia)}</span>
          </div>
          <div class="row sub">
             (Suma de Contado, Tarjeta, Transf. y Crédito)
          </div>
        </div>

        <!-- 2. DESGLOSE DE INGRESOS (VENTAS) -->
        <div class="section">
          <h3>2. DESGLOSE POR MÉTODO</h3>
          <div class="row"><span>(+) Efectivo (Córdobas):</span> <span>${money(netCordobas)}</span></div>
          <div class="row"><span>(+) Efectivo (Dólares):</span> <span>${usd(netDolares)}</span></div>
             <div class="row sub"> -> Conv. a C$: ${money(netDolares * tasaRef)}</div>
          
          <div class="row" style="margin-top:5px"><span>(+) Tarjetas:</span> <span>${money(totalTarjeta)}</span></div>
          <div class="row"><span>(+) Transferencias:</span> <span>${money(totalTransferencia)}</span></div>
          <div class="row"><span>(+) Créditos Otorgados:</span> <span>${money(totalCredito)}</span></div>
        </div>

        <!-- 3. FLUJO DE CAJA (ENTRADAS/SALIDAS) -->
        <div class="section">
          <h3>3. MOVIMIENTOS DE CAJA</h3>
          <div class="row"><span>Fondo Inicial (Apertura):</span> <span>${money(cajaInicial)}</span></div>
          ${abonos.length > 0 ? `<div class="row"><span>(+) Abonos Recibidos:</span> <span>${money(abonos.reduce((s, t) => s + (t.amount || 0), 0))}</span></div>` : ''}
          ${entradas.length > 0 ? `<div class="row"><span>(+) Entradas Manuales:</span> <span>${money(entradas.reduce((s, t) => s + (t.amount || 0), 0))}</span></div>` : ''}
          <div class="row"><span>(-) Salidas/Gastos:</span> <span>-${money(Math.abs(salidas.reduce((s, t) => s + (t.amount || 0), 0)))}</span></div>
          <div class="row"><span>(-) Devoluciones (Efec):</span> <span>-${money(Math.abs(sumDevolucionesCancelaciones))}</span></div>
        </div>

        <!-- 4. ARQUEO FINAL (LO IMPORTANTE) -->
        <div class="box">
          <div class="box-title">ARQUEO DE EFECTIVO</div>
          
          <div class="row big">
            <span>EFECTIVO ESPERADO:</span>
            <span>${money(efectivoEsperado)}</span>
          </div>
          <div class="row text-center" style="font-size:8pt; margin-bottom:5px;">
             (Debe haber: C$${Number(efectivoEsperadoCordobas).toFixed(2)} + $${Number(efectivoEsperadoDolares).toFixed(2)})
          </div>

          <div class="row" style="border-top:1px dashed #000; padding-top:4px;">
            <span>Efectivo Contado (Real):</span>
            <span>${money(montoContado)}</span>
          </div>

          <div class="row big alert">
            <span>DIFERENCIA:</span>
            <span>${diferencia > 0 ? '+' : ''}${money(diferencia)}</span>
          </div>
          <div class="text-center" style="font-size:8pt; font-weight:bold;">
             ${Math.abs(diferencia) < 0.5 ? '(CAJA CUADRADA)' : (diferencia > 0 ? '(SOBRANTE)' : '(FALTANTE)')}
          </div>
        </div>

        <!-- FIRMA -->
        <div style="margin-top: 30px; text-align: center;">
          <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto 5px;"></div>
          <p>Firma Cajero / Responsable</p>
        </div>
      </body>
      </html>
    `;

    win.document.write(reportHTML);
    win.document.close();

    // Auto print
    setTimeout(() => {
      win.focus();
      win.print();
      // Opcional: Cerrar después de imprimir si el usuario lo prefiere
      // setTimeout(() => win.close(), 100); 
    }, 500);
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
              <div style={{ margin: '4px 0', padding: '4px 0', borderTop: '1px dashed #eee', borderBottom: '1px dashed #eee' }}>
                <TotalsRow><span>(+) C$ Netos:</span><span>C${netCordobas.toFixed(2)}</span></TotalsRow>
                <TotalsRow><span>(+) USD Netos:</span><span>${Number(netDolares).toFixed(2)}</span></TotalsRow>
                <div style={{ fontSize: '0.8rem', textAlign: 'right', color: '#666' }}>
                  * Tasa: {Number(tasaRef).toFixed(2)} &rarr; = C${(netDolares * tasaRef).toFixed(2)}
                </div>
              </div>

              <TotalsRow style={{ color: '#dc3545', fontSize: '0.9rem' }}>
                <span><FaExclamationCircle /> Salidas por Dev/Cancel:</span>
                <span>C${sumDevolucionesCancelaciones.toFixed(2)}</span>
              </TotalsRow>

              <hr style={{ margin: '6px 0', border: 'none', borderTop: '2px dashed #ccc' }} />

              <TotalsRow $bold>
                <span>Efectivo Esperado:</span>
                <span>C${efectivoEsperado.toFixed(2)}</span>
              </TotalsRow>
              <div style={{ fontSize: '0.85rem', color: '#15803d', textAlign: 'right', marginTop: '-4px', marginBottom: '8px' }}>
                (C${Number(efectivoEsperadoCordobas).toFixed(2)} + ${Number(efectivoEsperadoDolares).toFixed(2)})
              </div>
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
              <Button primary onClick={handleConfirmClose} style={{ flex: 1 }} disabled={!canClose}>
                Confirmar y Cerrar Caja
              </Button>
              <Button onClick={() => setViewingReport(false)} style={{ flex: 0.6 }}>Volver</Button>
              <Button onClick={printReport} style={{ flex: 0.6, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <FaPrint /> Imprimir
              </Button>
            </div>
            {!canClose && <p style={{ color: '#dc3545', marginTop: 8, textAlign: 'center', fontSize: '0.9rem' }}>Solo el Administrador o quien abrió la caja puede cerrarla.</p>}
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

            <TotalsRow $bold style={{ backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px', border: '1px solid #90caf9' }}>
              <span><FaMoneyBillWave /> Efectivo Esperado TOTAL:</span>
              <span style={{ fontSize: '1.2rem' }}>C${efectivoEsperado.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </TotalsRow>

            <div style={{ marginTop: 8, padding: '10px', backgroundColor: '#f8f9fa', borderRadius: 4, border: '1px dashed #ced4da' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 5, color: '#495057' }}>Desglose de Efectivo a Tener:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Córdobas (C$):</span>
                <span style={{ fontWeight: 'bold', color: '#198754' }}>C$ {Number(efectivoEsperadoCordobas).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dólares ($):</span>
                <span style={{ fontWeight: 'bold', color: '#198754' }}>$ {Number(efectivoEsperadoDolares).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <label style={{ display: 'block', marginTop: 15, fontWeight: 600 }}>Monto Contado Físico (C$)</label>
            <SearchInput
              type="number"
              step="0.01"
              placeholder="Total en C$ (Billetes + Monedas)"
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
              <Button primary onClick={handlePrepareClose} disabled={!canClose || !montoContado || isNaN(parseFloat(montoContado))} style={{ flex: 1, padding: '12px' }}>
                Generar Reporte y Cerrar
              </Button>
              <Button onClick={onClose} style={{ flex: 0.6 }}>Cancelar</Button>
            </div>
            {!canClose && <p style={{ color: '#dc3545', marginTop: 8, textAlign: 'center', fontSize: '0.9rem' }}>Solo el Administrador o quien abrió la caja puede cerrarla.</p>}
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