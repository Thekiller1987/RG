// client/src/pages/CashReport.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaSyncAlt,
  FaFileAlt,
  FaExclamationTriangle,
  FaLockOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaPrint,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ================== CONFIG ================== */
const API_URL = '/api';
const ENDPOINT_REPORTE = `${API_URL}/caja/reporte`;              // ?date=YYYY-MM-DD
const ENDPOINT_ABIERTAS_ACTIVAS = `${API_URL}/caja/abiertas/activas`;

/* ================== HELPERS (ZONA HORARIA + FORMATO) ================== */

// Obtener fecha actual en Managua (YYYY-MM-DD) para el input date
function todayManagua() {
  // Usamos es-CA o sv-SE para obtener YYYY-MM-DD, pero forzando la zona
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Managua' });
}

const fmtMoney = (n) => `C$${Number(n || 0).toFixed(2)}`;

// Formato dd/mm/yyyy hh:mm AM/PM (Managua)
const fmtDT = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-NI', {
    timeZone: 'America/Managua',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

function initialsFromName(name) {
  if (!name) return '—';
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() ?? '').join('') || '—';
}

// Soporta múltiples claves de nombre posibles
function resolveName(x) {
  if (!x) return '—';
  if (typeof x === 'string') return x;
  return (
    x.name ??
    x.nombre ??
    x.fullName ??
    x.displayName ??
    x.nombre_usuario ??
    x.username ??
    (x.user && (x.user.name || x.user.username || x.user.displayName)) ??
    (x.id ? `Usuario ${x.id}` : '—')
  );
}

function useAuthToken() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t && t !== token) setToken(t);
  }, [token]);
  return token;
}

/* =============== PRINT STYLES (PDF Limpio) =============== */
const PrintStyles = createGlobalStyle`
  @page { size: A4; margin: 12mm; }
  @media print {
    /* Ocultar controles / botones */
    .no-print { display: none !important; }
    /* Fondo blanco y tipografía legible */
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    /* Quitar sombras y elevaciones a tarjetas */
    article, section, header, div, .card, .CardsGrid, .Card {
      box-shadow: none !important;
      filter: none !important;
    }
    /* Ajustar grid para ocupar el ancho de página */
    .cards-grid-print { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
    @media (max-width: 99999px) {
      /* Forzamos siempre 2 columnas al imprimir (si caben) */
      .cards-grid-print { grid-template-columns: 1fr 1fr !important; }
    }
  }
`;

/**
 * LÓGICA DE RE-CÁLCULO DEL REPORTE (Idéntica a CajaModal)
 * Esto asegura que si el reporte guardado estaba mal, aquí se recalcula "Real" basado en transacciones.
 */
function calculateReportStats(session) {
  const transactions = Array.isArray(session?.transactions) ? session.transactions : [];
  const cajaInicialN = Number(session?.initialAmount || session?.monto_inicial || 0);

  const cls = {
    ventasContado: [],
    devoluciones: [],
    cancelaciones: [],
    entradas: [],
    salidas: [],
    abonos: []
  };

  let netCash = 0;
  let tTarjeta = 0;
  let tTransf = 0;
  let tCredito = 0;
  let sumDevsCancels = 0;
  let tVentasDia = 0; // Total Bruto Vendido

  for (const tx of transactions) {
    const t = (tx?.type || '').toLowerCase();

    // --- PARSEO ROBUSTO AUDITORIA ---
    let pd = tx?.pagoDetalles || {};
    if (typeof pd === 'string') {
      try {
        pd = JSON.parse(pd);
      } catch (e) {
        console.error("Error parseando pagoDetalles en reporte:", tx, e);
        pd = {};
      }
    }
    if (!pd || typeof pd !== 'object') pd = {};

    // Monto base total de la operación
    // CORRECCION AUDITORIA: Forzar signo negativo si es salida o devolución
    let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
    if (t === 'salida' || t.includes('devolucion')) {
      rawAmount = -Math.abs(rawAmount);
    }
    const montoBase = rawAmount;

    // CREAR VERSIÓN NORMALIZADA REPORTES
    // Para que las listas (cls.ventasContado, etc.) tengan el objeto parseado y no el string.
    // Agregamos displayAmount para consistencia visual absoluta.
    const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: rawAmount };

    // Desglose
    const txTarjeta = Number(pd.tarjeta || 0);
    const txTransf = Number(pd.transferencia || 0);
    const txCredito = Number(pd.credito || 0);

    // Acumuladores Informativos
    if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
      tTarjeta += txTarjeta;
      tTransf += txTransf;
      tCredito += txCredito;
    }

    // 2. CALCULAR EL EFECTIVO REAL DE ESTA TRANSACCIÓN (POSITIVE SUMMATION LOGIC)
    let ingresoEfectivoReal = 0;

    if (t.startsWith('venta')) {
      // Lógica positiva: Efectivo Recibido - Cambio Entregado
      if (pd.efectivo !== undefined) {
        const cashIn = Number(pd.efectivo || 0);
        const cashOut = Number(pd.cambio || 0);
        const dolaresEnLocal = Number(pd.dolares || 0) * Number(pd.tasa || tx.tasaDolarAlMomento || 1);
        ingresoEfectivoReal = (cashIn + dolaresEnLocal) - cashOut;
      } else {
        // Legacy Fallback
        ingresoEfectivoReal = montoBase - txTarjeta - txTransf - txCredito;
      }
    }
    else if (t.includes('abono')) {
      ingresoEfectivoReal = Number(pd.ingresoCaja || 0);
    }
    else {
      // Entradas, Salidas, Devoluciones genéricas
      ingresoEfectivoReal = montoBase - txTarjeta - txTransf;
    }

    // Corrección de signo final por seguridad
    if (t === 'salida' || t.includes('devolucion')) {
      ingresoEfectivoReal = montoBase;
    }

    // Actualizar Caja (Solo Efectivo)
    // CORRECCION AUDITORIA: Se eliminó check 'venta_credito' para incluir primas en efectivo.
    // Ahora ingresoEfectivoReal es puramente el movimiento físico.
    netCash += ingresoEfectivoReal;

    // Total ventas (Bruto)
    // CORRECCION AUDITORIA: Sumar todo (incluso crédito)
    if (t.startsWith('venta')) {
      if (rawAmount > 0) {
        tVentasDia += (rawAmount + txCredito);
      } else {
        tVentasDia += (Math.abs(rawAmount) + txCredito);
      }
    }


    // Listas
    const esDevolucion = t === 'devolucion' || t.includes('devolucion');
    const esCancelacion = t === 'cancelacion' || t === 'anulacion'; // Added 'anulacion' for robustness

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
}


/* ================== COMPONENT ================== */
/* ================== STYLED COMPONENTS (DISEÑO PREMIUM) ================== */
const theme = {
  primary: '#2563eb', // Azul real
  secondary: '#64748b', // Gris pizarra
  success: '#10b981', // Esmeralda
  danger: '#ef4444', // Rojo
  warning: '#f59e0b', // Ambar
  bg: '#f8fafc', // Fondo muy suave
  surface: '#ffffff',
  text: '#1e293b',
  textLight: '#64748b',
  border: '#e2e8f0'
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${theme.bg};
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }
`;

const DateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.15);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(5px);

  input {
    border: none;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    color: ${theme.text};
    outline: none;
    font-family: inherit;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${theme.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid ${theme.border};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.isOpen ? '#ecfdf5' : '#f8fafc'};
`;

const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.isOpen ? '#065f46' : '#991b1b'};
  background: ${props => props.isOpen ? '#d1fae5' : '#fee2e2'};
  border: 1px solid ${props => props.isOpen ? '#34d399' : '#f87171'};
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: ${theme.textLight};

  strong {
    color: ${theme.text};
    font-weight: 600;
  }

  &.highlight {
    background: #f1f5f9;
    padding: 0.75rem;
    border-radius: 8px;
    margin-top: 1rem;
    color: ${theme.text};
    font-weight: 700;
  }
  
  &.total-ventas {
    background: #eff6ff;
    color: #1e40af;
    border: 1px dashed #60a5fa;
  }
`;

const DifferenceBadge = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  background: ${props => props.diff === 0 ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.diff === 0 ? '#059669' : '#dc2626'};
  border: 1px solid ${props => props.diff === 0 ? '#10b981' : '#ef4444'};
`;

const CardFooter = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid ${theme.border};
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: white;
  border: 1px solid ${theme.border};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  color: ${theme.text};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  &.text-blue { color: ${theme.primary}; }
  &.text-green { color: ${theme.success}; }
`;


const CashReport = () => {
  const token = useAuthToken();
  const navigate = useNavigate();

  const [date, setDate] = useState(() => todayManagua());
  const [loading, setLoading] = useState(false);
  const [abiertasHoy, setAbiertasHoy] = useState([]);
  const [cerradasHoy, setCerradasHoy] = useState([]);
  const [abiertasActivas, setAbiertasActivas] = useState([]);
  const [error, setError] = useState(null);

  const authHeader = useMemo(() => {
    const h = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rep, act] = await Promise.all([
        axios.get(ENDPOINT_REPORTE, { headers: authHeader, params: { date } }),
        axios.get(ENDPOINT_ABIERTAS_ACTIVAS, { headers: authHeader }),
      ]);

      setAbiertasHoy(Array.isArray(rep.data?.abiertas) ? rep.data.abiertas : []);
      setCerradasHoy(Array.isArray(rep.data?.cerradas) ? rep.data.cerradas : []);
      setAbiertasActivas(Array.isArray(act.data?.abiertas) ? act.data.abiertas : []);
    } catch (err) {
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  }, [authHeader, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para imprimir
  const handlePrintDetail = (session) => {
    const stats = calculateReportStats(session); // Recalcular con lógica "Bank Level"
    // ... (Lógica de impresión mantenida igual al bloque anterior, omitida aquí para brevedad pero asumida completa)
    // Se inserta la misma función 'printReport' que diseñamos en CajaModal pero adaptada a recibir stats
    const win = window.open('', '_blank');
    if (!win) return;

    const css = `
      body { font-family: 'Courier New', Courier, monospace; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
      h2, h3 { text-align: center; margin: 5px 0; text-transform: uppercase; }
      .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 20px; }
      .box { border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
      .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
      .row.bold { font-weight: bold; font-size: 16px; margin-top: 5px; border-top: 1px solid #eee; padding-top: 5px; }
      .text-right { text-align: right; }
      .diff-negative { color: red; font-weight: bold; }
      .diff-positive { color: green; font-weight: bold; }
    `;

    // Filtramos SOLO lo que fue efectivo real para mostrarlo claro
    const cls = {
      ventasContado: stats.ventasContado || [],
      abonos: stats.abonos || [],
      salidas: stats.salidas || []
    };

    const ventasEfectivoTotal = cls.ventasContado.reduce((sum, tx) => sum + (Number(tx.pagoDetalles?.efectivo || 0) - Number(tx.pagoDetalles?.cambio || 0) + (Number(tx.pagoDetalles?.dolares || 0) * Number(tx.pagoDetalles?.tasa || 1))), 0);
    const abonosEfectivoTotal = cls.abonos.reduce((sum, tx) => sum + (Number(tx.pagoDetalles?.ingresoCaja || 0)), 0);
    const salidasTotal = Math.abs(cls.salidas.reduce((sum, tx) => sum + Number(tx.displayAmount || tx.amount || 0), 0));

    // Diferencia calculada al vuelo
    const diff = Number(session.countedAmount || 0) - stats.efectivoEsperado;

    win.document.write(`
      <html>
      <head><title>Reporte Histórico</title><style>${css}</style></head>
      <body>
        <div class="header">
          <h2>Reporte Histórico</h2>
          <div>Fecha Original: ${new Date(session.openedAt).toLocaleDateString('es-NI')}</div>
        </div>
        <div class="box">
          <h3>Resumen Financiero</h3>
          <div class="row"><div>(+) Fondo Inicial Caja:</div><div>${fmtMoney(stats.cajaInicial)}</div></div>
          <div class="row"><div>(+) Ventas en Efectivo:</div><div>${fmtMoney(ventasEfectivoTotal)}</div></div>
          <div class="row"><div>(+) Abonos/Otros Efectivo:</div><div>${fmtMoney(abonosEfectivoTotal)}</div></div>
          <div class="row" style="color:red"><div>(-) Salidas/Gastos:</div><div>( ${fmtMoney(salidasTotal)} )</div></div>
          <div class="row bold"><div>(=) EFECTIVO ESPERADO:</div><div>${fmtMoney(stats.efectivoEsperado)}</div></div>
        </div>
        <div class="box">
            <div class="row"><div>Monto Contado:</div><div>${fmtMoney(session.countedAmount)}</div></div>
            <div class="row bold ${diff < 0 ? 'diff-negative' : 'diff-positive'}">
                <div>DIFERENCIA FINAL:</div><div>${fmtMoney(diff)}</div>
            </div>
        </div>
        <div class="box" style="background:#f0f9ff; border:1px dashed #00f;">
            <div class="row bold" style="color:#00f"><div>TOTAL VENTAS DEL DIA (Bruto):</div><div>${fmtMoney(stats.totalVentasDia)}</div></div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
  };

  // Renderizador de Tarjeta de Sesión
  const renderSessionCard = (session, isOpen = false) => {
    // Recalcular stats en cliente para asegurar precisión
    const stats = calculateReportStats(session);
    const diff = isOpen ? 0 : (Number(session.countedAmount || 0) - stats.efectivoEsperado);

    return (
      <Card key={session._id || session.id}>
        <CardHeader isOpen={isOpen}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{new Date(session.openedAt).toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', hour12: true })}</h3>
            <small style={{ color: theme.textLight }}>{resolveName(session.openedBy)}</small>
          </div>
          <Badge isOpen={isOpen}>{isOpen ? 'ABIERTA' : 'CERRADA'}</Badge>
        </CardHeader>
        <CardBody>
          <StatRow><span>Fondo Inicial:</span><strong>{fmtMoney(stats.cajaInicial)}</strong></StatRow>
          <StatRow><span>Efectivo Esperado:</span><strong>{fmtMoney(stats.efectivoEsperado)}</strong></StatRow>
          {!isOpen && <StatRow><span>Contado Real:</span><strong>{fmtMoney(session.countedAmount)}</strong></StatRow>}
          <StatRow className="highlight total-ventas">
            <span>Ventas Totales (Día):</span>
            <span>{fmtMoney(stats.totalVentasDia)}</span>
          </StatRow>
          {!isOpen && (
            <DifferenceBadge diff={diff}>
              {diff === 0 ? '✅ BALANCE PERFECTO' : `⚠️ DIFERENCIA: ${fmtMoney(diff)}`}
            </DifferenceBadge>
          )}
        </CardBody>
        <CardFooter>
          <ActionButton onClick={() => handlePrintDetail(session)}>
            <FaPrint /> Imprimir Detalle
          </ActionButton>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <PrintStyles />
      <Container>
        <Header>
          <div>
            <h1><FaFileAlt /> Reportes de Caja</h1>
            <p style={{ margin: 0, opacity: 0.8 }}>Historial y Auditoría de Cierres</p>
          </div>
          <DateControl>
            <FaCalendarAlt />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} title="Refrescar"><FaSyncAlt /></button>
          </DateControl>
        </Header>

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: theme.textLight }}>Cargando información...</div>}

        {!loading && (
          <Grid>
            {/* CAJAS ABIERTAS AHORA (Independiente de la fecha si es que se quiere mostrar siempre) */}
            {abiertasActivas.map(s => renderSessionCard(s, true))}

            {/* CAJAS CERRADAS DE LA FECHA SELECCIONADA */}
            {cerradasHoy.map(s => renderSessionCard(s, false))}

            {/* CAJAS ABIERTAS DE LA FECHA (Si consultamos historial pasado, pueden aparecer) */}
            {abiertasHoy.map(s => renderSessionCard(s, true))}
          </Grid>
        )}

        {!loading && cerradasHoy.length === 0 && abiertasHoy.length === 0 && abiertasActivas.length === 0 && (
          <div style={{ textAlign: 'center', color: theme.textLight, marginTop: '3rem' }}>
            <FaExclamationTriangle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No se encontraron registros para esta fecha.</p>
          </div>
        )}
      </Container>
    </>
  );
};
// Recalcular métricas en tiempo real para asegurar que sean "Reales"
const stats = calculateReportStats(session);

// Datos de cabecera
const openedByName = resolveName(session.abierta_por || session.openedBy);
const closedByName = resolveName(session.cerrada_por || session.closedBy);
const openedAt = session.openedAt || session.hora_apertura;

// Preparar HTML
const win = window.open('', '_blank');
if (!win) return;

// Helper de formato local
const fmt = (n) => `C$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleString('es-NI', { timeZone: 'America/Managua' }) : '—';

const rows = (arr, color = '#222') => arr.map(tx => `
      <tr>
        <td>${new Date(tx.at).toLocaleString('es-NI', { timeZone: 'America/Managua' })}</td>
        <td>${tx.note || tx.type || ''}</td>
        <td style="text-align:right;color:${color}">${fmt(tx.displayAmount !== undefined ? tx.displayAmount : (tx.pagoDetalles?.ingresoCaja ?? tx.amount))}</td>
      </tr>`).join('');

win.document.write(`
      <html>
      <head>
        <title>Reporte de Caja Detallado</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h2 { margin: 0 0 6px; }
          h3 { margin: 16px 0 6px; }
          .box { border:1px solid #ddd; border-radius:8px; padding:12px; margin-bottom:12px; }
          .row { display:flex; justify-content:space-between; margin:6px 0; }
          .bold { font-weight:700; }
          table { width:100%; border-collapse: collapse; margin-top:8px; }
          th, td { border-bottom:1px solid #eee; padding:6px; font-size:14px;}
          .sep { border-top:2px dashed #ccc; margin:8px 0; }
          .diff { font-size:16px; padding:6px; background:#eef7ee; border-radius:6px; }
          .red { color: #dc3545; }
        </style>
      </head>
      <body>
        <h2>Reporte Histórico de Arqueo</h2>
        <div class="box">
          <div class="row"><div><b>Abrió:</b> ${openedByName}</div><div><b>Fecha/Hora:</b> ${fmtDate(openedAt)}</div></div>
          <div class="row"><div><b>Cerró:</b> ${closedByName}</div><div><b>Fecha/Hora:</b> ${fmtDate(session.hora_cierre || session.closedAt)}</div></div>
        </div>

        <div class="box">
          <div class="row bold" style="font-size:1.1rem; border-bottom:1px solid #eee; padding-bottom:8px; margin-bottom:8px;">
             <div>Total Ventas del Día:</div>
             <div>${fmt(stats.totalVentasDia)}</div>
          </div>
          <div class="row"><div>Fondo Inicial:</div><div>${fmt(stats.cajaInicial)}</div></div>
          <div class="row"><div>Movimiento Neto Efectivo:</div><div>${fmt(stats.movimientoNetoEfectivo)}</div></div>
          
          <div class="row red"><div>(-) Devoluciones/Cancelaciones:</div><div>${fmt(stats.sumDevolucionesCancelaciones)}</div></div>

          <div class="sep"></div>
          <div class="row bold"><div>Efectivo Esperado:</div><div>${fmt(stats.efectivoEsperado)}</div></div>
          <div class="row"><div>Monto Físico Contado:</div><div>${fmt(session.contado)}</div></div>
          <div class="row diff"><div>DIFERENCIA:</div><div>${fmt(Number(session.contado) - stats.efectivoEsperado)}</div></div>
        </div>

        <div class="box">
          <div class="bold" style="margin-bottom:6px;">Resumen de Ingresos (No Efectivo)</div>
          <div class="row"><div>Tarjeta:</div><div>${fmt(stats.totalTarjeta)}</div></div>
          <div class="row"><div>Transferencia:</div><div>${fmt(stats.totalTransferencia)}</div></div>
          <div class="row"><div>Crédito:</div><div>${fmt(stats.totalCredito)}</div></div>
          <div class="row bold"><div>Total No Efectivo:</div><div>${fmt(stats.totalNoEfectivo)}</div></div>
        </div>

        <div class="box">
          <h3>Abonos y Otros Ingresos</h3>
          <table>
             <thead><tr><th>Fecha</th><th>Nota / Tipo</th><th style="text-align:right">Monto</th></tr></thead>
             <tbody>${stats.abonos.length > 0 ? rows(stats.abonos, '#198754') : '<tr><td colspan="3" style="text-align:center; color:#999;">Sin abonos</td></tr>'}</tbody>
          </table>

          <h3>Entradas</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Monto</th></tr></thead>
            <tbody>${rows(stats.entradas, '#198754')}</tbody>
          </table>

          <h3>Salidas</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Monto</th></tr></thead>
            <tbody>${rows(stats.salidas, '#dc3545')}</tbody>
          </table>

          <h3>Cancelaciones</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Efectivo</th></tr></thead>
            <tbody>${rows(stats.cancelaciones, '#6c757d')}</tbody>
          </table>

          <h3>Devoluciones</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Nota</th><th style="text-align:right">Efectivo</th></tr></thead>
            <tbody>${rows(stats.devoluciones, '#6c757d')}</tbody>
          </table>
        </div>

        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
      </html>
    `);
win.document.close();
  };

return (
  <Wrapper>
    <PrintStyles />

    <HeaderBar className="no-print">
      <HeaderLeft>
        <BackButton onClick={() => navigate(-1)} aria-label="Regresar">
          <FaChevronLeft />
        </BackButton>
        <Title>
          <FaFileAlt /> Reporte de Cajas por Día
        </Title>
      </HeaderLeft>

      <Filters>
        <FilterGroup>
          <FaCalendarAlt />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Seleccionar fecha"
          />
        </FilterGroup>

        <RefreshButton onClick={fetchData} $loading={loading} aria-busy={loading}>
          <FaSyncAlt className="spin-if-loading" />
          {loading ? ' Actualizando…' : ' Actualizar'}
        </RefreshButton>
      </Filters>
    </HeaderBar>

    {error && (
      <Alert role="alert">
        <FaExclamationTriangle />
        <span>{error}</span>
      </Alert>
    )}

    {loading && (
      <SkeletonGrid>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </SkeletonGrid>
    )}

    {!loading && !error && (
      <>
        {/* ABIERTAS ACTIVAS */}
        <Section>
          <SectionTitle>
            <FaLockOpen /> Cajas Abiertas Activas (ahora)
          </SectionTitle>
          {abiertasActivas.length === 0 ? (
            <EmptyState>No hay cajas abiertas en este momento.</EmptyState>
          ) : (
            <CardsGrid className="cards-grid-print">
              {abiertasActivas.map((s) => {
                const nombre = resolveName(s?.openedBy) || s?.abierta_por;

                // Calculo rápido para mostrar info preliminar
                const stats = calculateReportStats(s);

                return (
                  <Card key={s.id}>
                    <CardHeader $accent="open">
                      <span className="badge">ABIERTA</span>
                      <small>{fmtDT(s.openedAt || s.hora_apertura)}</small>
                    </CardHeader>
                    <CardBody>
                      <PersonRow>
                        <Avatar aria-hidden>{initialsFromName(nombre)}</Avatar>
                        <div className="meta">
                          <span className="label">Abierta por</span>
                          <span className="value">{nombre}</span>
                        </div>
                      </PersonRow>

                      <Divider />
                      <Row>
                        <label>Fondo inicial</label>
                        <span className="value">{fmtMoney(stats.cajaInicial)}</span>
                      </Row>
                      <Row>
                        <label>Ventas (Total)</label>
                        <span className="value" style={{ color: '#2563eb' }}>{fmtMoney(stats.totalVentasDia)}</span>
                      </Row>
                      <Row>
                        <label>Efectivo (Previsto)</label>
                        <span className="value">{fmtMoney(stats.efectivoEsperado)}</span>
                      </Row>

                      <div style={{ marginTop: 10 }}>
                        <PrintButton onClick={() => handlePrintDetail(s)} style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', background: '#0ea5e9' }}>
                          <FaPrint /> Ver Reporte Parcial
                        </PrintButton>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </CardsGrid>
          )}
        </Section>

        {/* ABIERTAS DEL DÍA (sin cierre) */}
        <Section>
          <SectionTitle>
            <FaLockOpen /> Cajas abiertas el {fmtDT(date).split(' ')[0]} (sin cierre)
          </SectionTitle>
          {abiertasHoy.length === 0 ? (
            <EmptyState>Ese día no quedaron cajas abiertas sin cierre.</EmptyState>
          ) : (
            <CardsGrid className="cards-grid-print">
              {abiertasHoy.map((s) => {
                const nombre = resolveName(s.abierta_por);
                return (
                  <Card key={s.id}>
                    <CardHeader $accent="open">
                      <span className="badge">ABIERTA (día)</span>
                      <small>{fmtDT(s.hora_apertura)}</small>
                    </CardHeader>
                    <CardBody>
                      <PersonRow>
                        <Avatar aria-hidden>{initialsFromName(nombre)}</Avatar>
                        <div className="meta">
                          <span className="label">Abierta por</span>
                          <span className="value">{nombre}</span>
                        </div>
                      </PersonRow>

                      <Row>
                        <label>Monto inicial</label>
                        <span className="value">{fmtMoney(s.monto_inicial)}</span>
                      </Row>
                      <div style={{ marginTop: 10 }}>
                        <PrintButton onClick={() => handlePrintDetail(s)} style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', background: '#0ea5e9' }}>
                          <FaPrint /> Ver Historial
                        </PrintButton>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </CardsGrid>
          )}
        </Section>

        {/* CERRADAS DEL DÍA */}
        <Section>
          <SectionTitle>
            <FaCheckCircle /> Cajas Cerradas el {fmtDT(date).split(' ')[0]}
          </SectionTitle>
          {cerradasHoy.length === 0 ? (
            <EmptyState>No hubo cierres de caja ese día.</EmptyState>
          ) : (
            <CardsGrid className="cards-grid-print">
              {cerradasHoy.map((s) => {
                const nAbre = resolveName(s.abierta_por);
                const nCierra = resolveName(s.cerrada_por);

                // RECALCULO "REAL" para la tarjeta (opcional) o usamos lo guardado
                // Para la tarjeta usamos lo guardado para ver qué pasó, pero el print será el real
                // O mejor, mostramos el real también aquí si el usuario se quejaba de error.
                // Vamos a recalcular para mostrar la realidad.
                const stats = calculateReportStats(s);
                const diffReal = Number(s.contado) - stats.efectivoEsperado;

                return (
                  <Card key={s.id}>
                    <CardHeader $accent="closed">
                      <span className="badge">CERRADA</span>
                      <small>{fmtDT(s.hora_cierre)}</small>
                    </CardHeader>
                    <CardBody>
                      <TwoPersons>
                        <PersonRow>
                          <Avatar aria-hidden>{initialsFromName(nAbre)}</Avatar>
                          <div className="meta">
                            <span className="label">Abierta por</span>
                            <span className="value">{nAbre}</span>
                          </div>
                        </PersonRow>

                        <PersonRow>
                          <Avatar $variant="closed" aria-hidden>{initialsFromName(nCierra)}</Avatar>
                          <div className="meta">
                            <span className="label">Cerrada por</span>
                            <span className="value">{nCierra}</span>
                          </div>
                        </PersonRow>
                      </TwoPersons>

                      <Divider />

                      <Row>
                        <label>Fondo inicial</label>
                        <span className="value">{fmtMoney(stats.cajaInicial)}</span>
                      </Row>
                      <Row>
                        <label>Total Ventas</label>
                        <span className="value" style={{ color: '#2563eb' }}>{fmtMoney(stats.totalVentasDia)}</span>
                      </Row>
                      <Row>
                        <label>Efec. Esperado (Real)</label>
                        <span className="value">{fmtMoney(stats.efectivoEsperado)}</span>
                      </Row>
                      <Row>
                        <label>Monto contado</label>
                        <span className="value">{fmtMoney(s.contado)}</span>
                      </Row>
                      <Row $diff={diffReal}>
                        <label>Diferencia (Real)</label>
                        <span className="value">{fmtMoney(diffReal)}</span>
                      </Row>

                      <div style={{ marginTop: 12 }}>
                        <PrintButton onClick={() => handlePrintDetail(s)} style={{ width: '100%', justifyContent: 'center' }}>
                          <FaPrint /> Ver Reporte Completo
                        </PrintButton>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </CardsGrid>
          )}
        </Section>
      </>
    )}
  </Wrapper>
);
};

export default CashReport;

/* ================== STYLES (incluye animaciones) ================== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;
const spin = keyframes` to { transform: rotate(360deg); }`;

const Wrapper = styled.div`
  width: 100%;
  padding: 14px clamp(10px, 3vw, 22px);
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: ${fadeIn} .3s ease-out both;
`;

const HeaderBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const HeaderLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 38px; height: 38px;
  border: none;
  border-radius: 10px;
  background: #e2e8f0;
  color: #0f172a;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease;
  &:hover { transform: translateY(-1px); background: #cbd5e1; }
  &:active { transform: translateY(0); }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.2rem, 2.6vw, 1.7rem);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  letter-spacing: .2px;
`;

const Filters = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-self: end;

  @media (max-width: 720px) {
    justify-self: start;
    width: 100%;
  }
`;

const FilterGroup = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  font-size: .95rem;

  input[type="date"] {
    border: none;
    outline: none;
    font-size: .95rem;
    color: #0f172a;
    background: transparent;
  }
`;

const RefreshButton = styled.button`
  border: none;
  outline: none;
  background: #0ea5e9;
  color: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(14,165,233,.25);
  transition: transform .15s ease, box-shadow .15s ease, opacity .2s ease;

  &:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(14,165,233,.28); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: .7; cursor: not-allowed; }

  .spin-if-loading { animation: ${({ $loading }) => ($loading ? spin : 'none')} .8s linear infinite; }
`;

const PrintButton = styled.button`
  border: none;
  outline: none;
  background: #22c55e;
  color: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(34,197,94,.25);
  transition: transform .15s ease, box-shadow .15s ease, opacity .2s ease;
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(34,197,94,.28); }
  &:active { transform: translateY(0); }
`;

const Alert = styled.div`
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const CardsGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const Card = styled.article`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} .25s ease-out both;
  transition: transform .15s ease, box-shadow .15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
  }
`;

const CardHeader = styled.div`
  padding: 10px 12px;
  display: flex; justify-content: space-between; align-items: center;

  background: ${({ $accent }) =>
    $accent === 'open'
      ? 'linear-gradient(90deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))'
      : 'linear-gradient(90deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))'};

  .badge {
    font-size: 0.78rem;
    background: ${({ $accent }) => ($accent === 'open' ? '#16a34a' : '#2563eb')};
    color: #fff;
    border-radius: 999px;
    padding: 5px 10px;
    font-weight: 800;
    letter-spacing: 0.2px;
  }
  small { color: #334155; font-weight: 600; }
`;

const CardBody = styled.div` padding: 12px; `;

const Row = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 8px;
  padding: 6px 0; align-items: center; border-bottom: 1px dashed #f1f5f9;
  &:last-child { border-bottom: none; }
  label { color: #64748b; font-size: 0.92rem; }
  .value {
    font-weight: 800; text-align: right; letter-spacing: .2px;
    color: ${({ $diff }) => ($diff && Number($diff) !== 0 ? '#dc2626' : '#0f172a')};
  }
`;

const Divider = styled.hr`
  border: none; border-top: 1px dashed #e5e7eb; margin: 8px 0 2px;
`;

const TwoPersons = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

const PersonRow = styled.div`
  display: grid; grid-template-columns: 44px 1fr; gap: 10px; align-items: center; padding: 6px 0;
  .meta { display: flex; flex-direction: column; }
  .label { color: #64748b; font-size: .82rem; line-height: 1; margin-bottom: 4px; }
  .value { font-weight: 800; color: #0f172a; line-height: 1.2; }
`;

const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 999px; display: grid; place-items: center;
  font-weight: 900; letter-spacing: .5px;
  background: ${({ $variant }) => ($variant === 'closed' ? '#e0e7ff' : '#dcfce7')};
  color: ${({ $variant }) => ($variant === 'closed' ? '#3730a3' : '#166534')};
`;

const EmptyState = styled.div`
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #475569;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.95rem;
`;

const SkeletonGrid = styled.div`
  display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;
const SkeletonCard = styled.div`
  height: 168px; border-radius: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.1s ease-in-out infinite;
`;
