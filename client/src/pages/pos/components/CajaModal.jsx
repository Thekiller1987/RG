import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, Button, SearchInput, TotalsRow } from '../POS.styles.jsx';
import {
  FaLockOpen, FaFileInvoiceDollar, FaRegCreditCard,
  FaMoneyBillWave, FaExchangeAlt, FaUserClock, FaPrint, FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* =================================================================
 * ESTILOS DE IMPRESIÓN (Robusto, igual que TicketModal)
 * ================================================================= */
const GlobalPrintStyle = React.memo(() => (
  <style>{`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important; left: 0 !important; top: 0 !important;
      z-index: 999999 !important; margin: 0 !important; padding: 0 !important;
    }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
  `}</style>
));

const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace; color: #000; background: #fff;
  width: 310px; margin: 0 auto; padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08); border: 1px solid #eee; border-radius: 8px;

  /* Encabezado */
  .brand { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
  .brand h2 { margin: 0 0 5px; font-size: 1.1rem; font-weight: 900; text-transform: uppercase; }
  .brand p { margin: 2px 0; font-size: 0.85rem; }

  /* Secciones y Filas */
  .section { margin-bottom: 15px; border-bottom: 1px dashed #444; padding-bottom: 10px; }
  .section:last-child { border-bottom: none; }
  .section-title { font-weight: 900; text-align: center; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 8px; text-decoration: underline; }
  
  .row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; }
  .row.big { font-size: 1.1rem; font-weight: 900; margin-top: 8px; border-top: 2px solid #000; padding-top: 6px; }
  .row.sub { font-size: 0.75rem; color: #444; font-style: italic; padding-left: 10px; }
  .row.alert { background: #eee; padding: 6px; font-weight: 900; text-align: center; justify-content: center; gap: 10px; border: 2px solid #000; margin-top: 8px; }

  /* Tablas simples */
  table { width: 100%; border-collapse: collapse; font-size: 0.8rem; margin-top: 6px; }
  th { border-bottom: 2px solid #000; text-align: left; font-weight: 900; padding: 2px; }
  td { border-bottom: 1px dashed #ccc; padding: 2px; }
  .text-right { text-align: right; }

  /* Firma */
  .signature { margin-top: 40px; text-align: center; page-break-inside: avoid; }
  .signature-line { border-top: 2px solid #000; width: 80%; margin: 0 auto 5px; }

  @media print {
    &.print-80 {
      width: 80mm !important; font-family: 'Consolas', monospace !important; padding: 5px !important; border: none !important; box-shadow: none !important;
    }
  }
`;

/**
 * Props esperadas:
 * - currentUser, isCajaOpen, session, onOpenCaja, onCloseCaja, onClose, isAdmin, etc.
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
  const canClose = isAdmin || (String(userId) === String(openedById));

  const transactions = useMemo(() => Array.isArray(session?.transactions) ? session.transactions : [], [session]);

  // --------- Clasificación y totales (Cálculo corregido) ----------
  const {
    cajaInicial, netCordobas, netDolares, efectivoEsperado, efectivoEsperadoCordobas, efectivoEsperadoDolares,
    ventasContado, devoluciones, cancelaciones, entradas, salidas, abonos,
    totalTarjeta, totalTransferencia, totalCredito, totalNoEfectivo,
    sumDevolucionesCancelaciones, totalVentasDia, tasaRef
  } = useMemo(() => {
    const cajaInicialN = Number(session?.initialAmount || 0);
    const tasaRef = Number(session?.tasaDolar || initialTasaDolar || 36.60);

    const cls = { ventasContado: [], devoluciones: [], cancelaciones: [], entradas: [], salidas: [], abonos: [] };
    let netCordobas = 0, netDolares = 0, tTarjeta = 0, tTransf = 0, tCredito = 0, tVentasDia = 0, sumDevsCancels = 0;

    for (const tx of transactions) {
      const t = (tx?.type || '').toLowerCase();
      let pd = tx?.pagoDetalles || {};
      if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
      if (!pd || typeof pd !== 'object') pd = {};

      let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
      if (t === 'salida' || t.includes('devolucion')) rawAmount = -Math.abs(rawAmount); // Salidas son negativas para caja
      const montoBase = rawAmount;
      const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: rawAmount };

      const txTarjeta = Number(pd.tarjeta || 0);
      const txTransf = Number(pd.transferencia || 0);
      const txCredito = Number(pd.credito || 0);

      // 1. ACUMULAR NO EFECTIVO
      if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido')) {
        tTarjeta += txTarjeta; tTransf += txTransf; tCredito += txCredito;
      }

      // 2. ACUMULAR EFECTIVO FÍSICO
      if (t.startsWith('venta') || t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito') {
        if (pd.efectivo !== undefined || pd.dolares !== undefined) {
          netCordobas += (Number(pd.efectivo || 0) - Number(pd.cambio || 0));
          netDolares += Number(pd.dolares || 0);
        } else {
          netCordobas += (montoBase - txTarjeta - txTransf - txCredito);
        }
      } else if (t.includes('abono')) {
        if (pd.dolares !== undefined) { netDolares += Number(pd.dolares || 0); netCordobas += Number(pd.efectivo || 0); }
        else { netCordobas += Number(pd.ingresoCaja || 0); }
      } else if (t === 'entrada') { netCordobas += Math.abs(montoBase); }
      else if (t === 'salida') { netCordobas -= Math.abs(montoBase); }
      else if (t.includes('devolucion')) { netCordobas += montoBase; } // montoBase es negativo
      else { netCordobas += montoBase - txTarjeta - txTransf; }

      // 4. TOTAL VENTAS DEL DIA (CORREGIDO)
      if (t.startsWith('venta')) {
        if (pd.totalVenta) tVentasDia += Number(pd.totalVenta);
        else tVentasDia += (Math.abs(rawAmount) + txTarjeta + txTransf + txCredito);
      }

      // Clasificar
      if (t.startsWith('venta')) cls.ventasContado.push(normalizedTx);
      else if (t.includes('devolucion')) { cls.devoluciones.push(normalizedTx); sumDevsCancels += Math.abs(montoBase); }
      else if (t.includes('cancelacion')) { cls.cancelaciones.push(normalizedTx); sumDevsCancels += Math.abs(montoBase); }
      else if (t === 'entrada') cls.entradas.push(normalizedTx);
      else if (t === 'salida') cls.salidas.push(normalizedTx);
      else if (t.includes('abono')) cls.abonos.push(normalizedTx);
    }

    return {
      cajaInicial: cajaInicialN,
      netCordobas, netDolares,
      efectivoEsperado: cajaInicialN + netCordobas + (netDolares * tasaRef),
      efectivoEsperadoCordobas: cajaInicialN + netCordobas,
      efectivoEsperadoDolares: netDolares,
      ventasContado: cls.ventasContado, devoluciones: cls.devoluciones, cancelaciones: cls.cancelaciones, entradas: cls.entradas, salidas: cls.salidas, abonos: cls.abonos,
      totalTarjeta: tTarjeta, totalTransferencia: tTransf, totalCredito: tCredito, totalNoEfectivo: tTarjeta + tTransf + tCredito,
      sumDevolucionesCancelaciones: sumDevsCancels, totalVentasDia: tVentasDia, tasaRef
    };
  }, [transactions, session, initialTasaDolar]);

  const diferencia = (Number(montoContado || 0) - efectivoEsperado);
  const openedAt = session?.openedAt ? new Date(session.openedAt) : null;
  const openedByName = session?.openedBy?.name || '—';

  // --------- HANDLERS ----------
  const handleOpen = () => {
    const monto = parseFloat(montoApertura || 0);
    if (isNaN(monto) || monto < 0) return showAlert({ title: 'Inválido', message: 'Monto inicial >= 0' });
    onOpenCaja(monto, Number(tasaDolar || 36.60));
  };

  const handlePrepareClose = () => {
    if (isNaN(parseFloat(montoContado))) return showAlert({ title: 'Requerido', message: 'Ingrese el monto contado físico.' });
    setViewingReport(true);
  };

  /* IMPRESIÓN ROBUSTA: Usa el DOM renderizado (tipo TicketModal) */
  const doPrint = React.useCallback(() => {
    const node = document.getElementById('print-wrapper-caja');
    if (!node) return;
    const htmlToPrint = node.outerHTML;

    // Estilos críticos para impresora térmica: Negro, Negrita, 80mm
    const printStyles = `
      @charset "UTF-8";
      @page { size: 80mm auto; margin: 0; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
        color: #000 !important; font-family: Consolas, 'Courier New', monospace !important;
      }
      #print-wrapper-caja, #print-wrapper-caja * {
        color: #000 !important; font-weight: 700 !important;
        text-shadow: none !important; box-shadow: none !important;
        visibility: visible !important;
      }
      #print-wrapper-caja {
        width: 80mm !important; padding: 5px !important; border: none !important;
      }
      .brand h2 { font-size: 14pt !important; }
      .row.big { font-size: 11pt !important; border-top: 2px solid #000 !important; }
      .text-right { text-align: right !important; }
      
      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `;

    const w = window.open('', '_blank', 'width=500,height=600');
    if (!w) return;

    w.document.write(`<html><head><title>Cierre Caja</title><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
    w.document.close();
    w.focus();

    // Auto-imprimir y luego (opcional) cerrar ventana
    w.onload = function () {
      setTimeout(() => { w.print(); }, 300);
    };
    w.onafterprint = () => {
      try { w.close(); } catch { }
    };
  }, []);

  const handleConfirmClose = () => {
    // 1. Lanzar impresión
    doPrint();
    // 2. Cerrar caja en sistema tras breve delay (para que dé tiempo al popup de impresión de aparecer)
    setTimeout(() => {
      onCloseCaja(Number(montoContado));
    }, 800);
  };

  // Helpers display
  const money = (n) => `C$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />

      {/* --- PREVIEW O CONTENIDO PRINCIPAL --- */}
      <ModalContent style={{ maxWidth: viewingReport ? 450 : 760, padding: viewingReport ? 0 : '1.5rem', background: '#f8f9fa' }}>

        {/* ENCABEZADO MODAL (Solo si no estamos en reporte full screen o queremos que se vea arriba) */}
        {!viewingReport && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Gestión de Caja</h2>
            <Button $cancel onClick={onClose} style={{ borderRadius: '50%', width: 32, height: 32, padding: 0 }}>✕</Button>
          </div>
        )}

        {!isCajaOpen ? (
          /* --- ABRIR CAJA --- */
          <div style={{ padding: viewingReport ? '1rem' : 0 }}>
            <h3 style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: 10 }}>
              <FaLockOpen /> Abrir Caja
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ fontWeight: 600 }}>Monto Inicial (C$)</label>
              <SearchInput type="number" step="0.01" value={montoApertura} onChange={e => setMontoApertura(e.target.value)} autoFocus />
              <label style={{ fontWeight: 600 }}>Tasa del Dólar</label>
              <SearchInput type="number" step="0.01" value={tasaDolar} onChange={e => setTasaDolar(e.target.value)} />
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <Button primary style={{ flex: 1 }} onClick={handleOpen}>Abrir Caja</Button>
              <Button onClick={() => navigate('/dashboard')}>Ir al Dashboard</Button>
            </div>
          </div>
        ) : viewingReport ? (
          /* --- REPORTE (PREVIEW + IMPRESIÓN) --- */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh' }}>
            {/* Header del Preview */}
            <div style={{ padding: '10px 15px', background: '#e9ecef', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#495057' }}>Vista Previa de Cierre</h3>
              <Button $cancel onClick={() => setViewingReport(false)} style={{ padding: '5px 10px', fontSize: '0.85rem' }}>Volver / Editar</Button>
            </div>

            {/* Contenedor Scrollable del Ticket */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#555', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
              {/* ESTE ES EL COMPONENTE QUE SE IMPRIME */}
              <PrintWrapper id="print-wrapper-caja" className="print-80">
                <div className="brand">
                  <h2>CIERRE DE CAJA</h2>
                  <p>Multirepuestos RG</p>
                  <p>{new Date().toLocaleString('es-NI')}</p>
                  <p>Cajero: {currentUser?.nombre_usuario || 'Uso General'}</p>
                </div>

                <div className="section">
                  <div className="section-title">1. TOTAL VENTAS DÍA</div>
                  <div className="row big"><span>TOTAL GLOBAL:</span><span>{money(totalVentasDia)}</span></div>
                  <div className="row sub">(Efectivo + Tarj. + Transf + Crédito)</div>
                </div>

                <div className="section">
                  <div className="section-title">2. DESGLOSE INGRESOS</div>
                  <div className="row"><span>(+) Efec. C$:</span><span>{money(netCordobas)}</span></div>
                  <div className="row"><span>(+) Efec. USD:</span><span>{usd(netDolares)}</span></div>
                  <div className="row sub">-> Equiv: {money(netDolares * tasaRef)}</div>
                  <div className="row" style={{ marginTop: 6 }}><span>(+) Tarjetas:</span><span>{money(totalTarjeta)}</span></div>
                  <div className="row"><span>(+) Transf.:</span><span>{money(totalTransferencia)}</span></div>
                  <div className="row"><span>(+) Créditos:</span><span>{money(totalCredito)}</span></div>
                </div>

                <div className="section">
                  <div className="section-title">3. FLUJO CAJA</div>
                  <div className="row"><span>Fondo Inicial:</span><span>{money(cajaInicial)}</span></div>
                  {abonos.length > 0 && <div className="row"><span>(+) Abonos:</span><span>{money(abonos.reduce((s, t) => s + (t.amount || 0), 0))}</span></div>}
                  {entradas.length > 0 && <div className="row"><span>(+) Entradas:</span><span>{money(entradas.reduce((s, t) => s + (t.amount || 0), 0))}</span></div>}
                  <div className="row"><span>(-) Salidas/Dev:</span><span>{money(sumDevolucionesCancelaciones + Math.abs(salidas.reduce((s, t) => s + (t.amount || 0), 0)))}</span></div>
                </div>

                <div className="section">
                  <div className="section-title">4. ARQUEO FINAL</div>
                  <div className="row big"><span>EFECTIVO ESPERADO:</span><span>{money(efectivoEsperado)}</span></div>
                  <div className="row sub">({money(efectivoEsperadoCordobas)} + {usd(efectivoEsperadoDolares)})</div>

                  <div className="row" style={{ marginTop: 8, paddingTop: 4, borderTop: '1px dashed #ccc' }}>
                    <span>EFECTIVO REAL:</span><span>{money(montoContado)}</span>
                  </div>

                  <div className={`row alert`} style={{ color: diferencia !== 0 ? '#000' : '#000', borderColor: diferencia !== 0 ? '#000' : '#000' }}>
                    <span>DIFERENCIA:</span><span>{diferencia > 0 ? '+' : ''}{money(diferencia)}</span>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', marginTop: 2 }}>
                    {Math.abs(diferencia) < 0.5 ? '(CAJA CUADRADA)' : (diferencia > 0 ? '(SOBRANTE)' : '(FALTANTE)')}
                  </div>
                </div>

                {(entradas.length > 0 || salidas.length > 0) && (
                  <div className="section">
                    <div className="section-title" style={{ fontSize: '0.8rem' }}>DETALLE MOVIMIENTOS</div>
                    {entradas.map((x, i) => <div className="row" key={'e' + i}><span>(+) {x.note || 'Entrada'}</span><span>{money(x.amount)}</span></div>)}
                    {salidas.map((x, i) => <div className="row" key={'s' + i}><span>(-) {x.note || 'Salida'}</span><span>{money(x.amount)}</span></div>)}
                  </div>
                )}

                <div className="signature">
                  <div className="signature-line"></div>
                  <p>Firma Responsable</p>
                </div>
              </PrintWrapper>
            </div>

            {/* Footer con Botones de Acción */}
            <div style={{ padding: '15px', background: '#fff', borderTop: '1px solid #ccc', display: 'flex', gap: 10 }}>
              <Button primary style={{ flex: 1, padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: 8 }} onClick={handleConfirmClose} disabled={!canClose}>
                <FaPrint /> CONFIRMAR Y CERRAR
              </Button>
            </div>
            {!canClose && <div style={{ padding: 5, textAlign: 'center', color: 'red', fontSize: '0.8rem' }}>Solo el Admin o quien abrió puede cerrar.</div>}
          </div>
        ) : (
          /* --- CONFIRMAR CIERRE (Input Conteo) --- */
          <div>
            <h3 style={{ color: '#dc3545', borderBottom: '2px solid #dc3545', paddingBottom: 10 }}>
              Arqueo y Cierre
            </h3>
            <div style={{ background: '#e9ecef', padding: 10, borderRadius: 6, marginBottom: 15 }}>
              <TotalsRow style={{ fontSize: '1.1rem' }}><span><FaUserClock /> Abrió:</span><strong>{openedByName}</strong></TotalsRow>
            </div>

            <div style={{ marginTop: 8, padding: '10px', backgroundColor: '#f8f9fa', borderRadius: 4, border: '1px dashed #ced4da' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 5 }}>Efectivo a Tener:</div>
              <TotalsRow><span>Córdobas:</span><strong style={{ color: '#198754' }}>C$ {Number(efectivoEsperadoCordobas).toLocaleString()}</strong></TotalsRow>
              <TotalsRow><span>Dólares:</span><strong style={{ color: '#198754' }}>$ {Number(efectivoEsperadoDolares).toLocaleString()}</strong></TotalsRow>
              <TotalsRow $bold style={{ marginTop: 5, borderTop: '1px solid #ccc', paddingTop: 5 }}><span>TOTAL (C$):</span><span>{money(efectivoEsperado)}</span></TotalsRow>
            </div>

            <label style={{ display: 'block', marginTop: 15, fontWeight: 700 }}>Monto Contado Físico (C$)</label>
            <SearchInput type="number" step="0.01" value={montoContado} onChange={e => setMontoContado(e.target.value)} autoFocus placeholder="Total Billetes + Monedas" />

            {montoContado && (
              <TotalsRow $bold style={{ marginTop: 10, color: diferencia !== 0 ? '#dc3545' : '#28a745', fontSize: '1.1rem' }}>
                <span>Diferencia:</span><span>{money(diferencia)}</span>
              </TotalsRow>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button primary style={{ flex: 1 }} onClick={handlePrepareClose} disabled={!canClose || !montoContado}>Ver Reporte</Button>
              <Button $cancel onClick={onClose}>Cancelar</Button>
            </div>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default CajaModal;

// Helpers de sección para listas (usados si se restaura la vista detallada en preview, o borrar si no se usan)
function SectionList({ title, items, positive = false, neutral = false }) {
  if (!items?.length) return null;
  const color = neutral ? '#6c757d' : (positive ? '#198754' : '#dc3545');
  const fmt = (n) => `C$${Number(n || 0).toFixed(2)}`;
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 10 }}>
      {/* ... (Implementación opcional, simplificada arriba en el PrintWrapper) ... */}
    </div>
  );
}
const thS = { borderBottom: '1px solid #eee', padding: '6px', textAlign: 'left', fontSize: 13, color: '#555' };
const tdS = { borderBottom: '1px solid #f3f3f3', padding: '6px', fontSize: 14 };