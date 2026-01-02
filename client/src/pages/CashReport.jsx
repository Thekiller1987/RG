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
  FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ================== CONFIG ================== */
const API_URL = '/api';
const ENDPOINT_REPORTE = `${API_URL}/caja/reporte`;              // ?date=YYYY-MM-DD
const ENDPOINT_ABIERTAS_ACTIVAS = `${API_URL}/caja/abiertas/activas`;

/* ================== HELPERS (ZONA HORARIA + FORMATO) ================== */

// Obtener fecha actual en Managua (YYYY-MM-DD) para el input date
// Obtener fecha actual en Managua (YYYY-MM-DD) Manualmente para evitar errores de locale
function todayManagua() {
  const d = new Date();
  // Ajustar a UTC-6 (Managua) manualmente si es necesario, o confiar en que el sistema tiene hora correcta.
  // Mejor opción: Crear fecha local y formatear ISO
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  // Sin embargo, si el usuario está en Managua, new Date() ya es local. 
  // Para asegurar YYYY-MM-DD:
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  // 1. Extraer transacciones (Soporte para SQL Snapshot)
  let transactions = [];
  if (Array.isArray(session?.transactions)) {
    transactions = session.transactions;
  } else if (session?.detalles_json) {
    try {
      const json = typeof session.detalles_json === 'string' ? JSON.parse(session.detalles_json) : session.detalles_json;
      transactions = json.transactions || [];
    } catch (e) {
      console.error("Error parseando snapshot en calculateReportStats", e);
    }
  }

  const cajaInicialN = Number(session?.initialAmount || session?.monto_inicial || 0);

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

  let sumDevsCancels = 0;
  let tVentasDia = 0; // Total Bruto Vendido (incluye todo)

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

    // Monto base total de la operación (para referencias generales)
    let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
    // Corrección de signo para salidas/devoluciones en contabilidad general
    if (t === 'salida' || t.includes('devolucion')) {
      rawAmount = -Math.abs(rawAmount);
    }
    const montoBase = rawAmount;

    // CREAR VERSIÓN NORMALIZADA REPORTES
    const normalizedTx = { ...tx, pagoDetalles: pd, displayAmount: rawAmount };

    // Desglose NO EFECTIVO
    const txTarjeta = Number(pd.tarjeta || 0);
    const txTransf = Number(pd.transferencia || 0);
    const txCredito = Number(pd.credito || 0);

    // Acumuladores Informativos de No Efectivo
    // Solo sumamos si es ingreso positivo.
    if (t.startsWith('venta') || t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
      tTarjeta += txTarjeta;
      tTransf += txTransf;
      tCredito += txCredito;
    }

    // 2. CALCULO DE EFECTIVO FÍSICO (Separado por moneda)
    // ----------------------------------------------------

    if (t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito' || t.startsWith('venta')) {
      // Lógica Venta:
      // Entra: efectivo (C$) + dolares ($)
      // Sale: cambio (C$)

      if (pd.efectivo !== undefined || pd.dolares !== undefined) {
        const cashInCordobas = Number(pd.efectivo || 0);
        const cashInDolares = Number(pd.dolares || 0);
        const cashOutCordobas = Number(pd.cambio || 0);

        // Asumimos cambio siempre en córdobas.
        netCordobas += (cashInCordobas - cashOutCordobas);
        netDolares += cashInDolares;
      } else {
        // Legacy Fallback: asume todo es C$ neto
        const neto = montoBase - txTarjeta - txTransf - txCredito;
        netCordobas += neto;
      }
    }
    else if (t.includes('abono')) {
      // Abonos: pd.ingresoCaja suele ser el total neto. 
      // Si hubiera dólares en abonos, necesitaríamos pd.dolares. 
      // Por ahora asumimos C$ salvo que se especifique.
      if (pd.dolares !== undefined) {
        netDolares += Number(pd.dolares || 0);
        netCordobas += Number(pd.efectivo || 0); // Si hay vuelto en abono, restar cambio
        // Si pd.ingresoCaja es el total convertido, debemos tener cuidado.
        // Usualmente en abonos sencillos: ingresoCaja = efectivo.
      } else {
        netCordobas += Number(pd.ingresoCaja || 0);
      }
    }
    else if (t === 'entrada') {
      // Entrada de efectivo manual
      const montoEntrada = Math.abs(montoBase);
      // Podríamos agregar campo 'moneda' a la entrada manual en el futuro. Por defecto C$.
      netCordobas += montoEntrada;
    }
    else if (t === 'salida') {
      // Salida de efectivo manual
      const montoSalida = Math.abs(montoBase);
      netCordobas -= montoSalida;
    }
    else if (t.includes('devolucion')) {
      // Devolución de dinero al cliente (Sale dinero de caja)
      // Si devolvemos efectivo, restamos.
      // OJO: rawAmount es negativo.
      // Asumimos se devuelve en C$ salvo indicación.
      // Si pd.efectivo existe, es lo que devolvimos?
      // Simplificación: usaremos montoBase (negativo) como impacto en C$.
      netCordobas += montoBase; // se resta porque montoBase es negativo
    }
    else {
      // Default fallback (entradas/salidas genéricas sin tipo claro)
      netCordobas += montoBase - txTarjeta - txTransf;
    }


    // Total Ventas Bruto (Estadístico)
    if (t.startsWith('venta')) {
      tVentasDia += (Math.abs(rawAmount) + txCredito);
    }

    // Listas
    const esDevolucion = t === 'devolucion' || t.includes('devolucion');
    const esCancelacion = t === 'cancelacion' || t === 'anulacion';

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

  // Tasa de cambio de la sesión (o actual de referencia)
  const tasaRef = Number(session?.tasaDolar || 36.60);

  // Total físico en caja expresado en C$ (para comparar con arqueo si se mete todo junto)
  // Pero el usuario quiere ver "Lo que debe haber en dolares y en cordobas".


  return {
    cajaInicial: cajaInicialN,

    // Desglose neto físico
    netCordobas,
    netDolares,

    // Convertido para totales
    movimientoNetoEfectivo: netCordobas + (netDolares * tasaRef),

    // Esperado total en C$ (Fondo inicial + neto)
    // Asumimos fondo inicial es C$.
    efectivoEsperado: cajaInicialN + netCordobas + (netDolares * tasaRef),

    // Data para desglose UI
    efectivoEsperadoCordobas: cajaInicialN + netCordobas,
    efectivoEsperadoDolares: netDolares,

    // Listas
    ventasContado: cls.ventasContado,
    devoluciones: cls.devoluciones,
    cancelaciones: cls.cancelaciones,
    entradas: cls.entradas,
    salidas: cls.salidas,
    abonos: cls.abonos,

    // No efectivo
    totalTarjeta: tTarjeta,
    totalTransferencia: tTransf,
    totalCredito: tCredito,
    totalNoEfectivo: tTarjeta + tTransf + tCredito,

    sumDevolucionesCancelaciones: sumDevsCancels,
    totalVentasDia: tVentasDia,
    tasaRef
  };
}


/* ================== COMPONENT ================== */
/* ================== STYLED COMPONENTS (DISEÑO PREMIUM) ================== */
const theme = {
  primary: '#0f172a',    // Navy Corporate
  secondary: '#475569',  // Slate
  success: '#16a34a',    // Green Banking
  danger: '#dc2626',     // Red Banking
  warning: '#d97706',    // Amber
  bg: '#f8fafc',         // Light Gray Background
  surface: '#ffffff',    // Plain White
  border: '#e2e8f0',     // Light Gray Border
  text: '#1e293b',       // Dark Slate Text
  textLight: '#64748b'   // Muted Text
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${theme.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${theme.text};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: ${theme.primary};
    display: flex;
    align-items: center;
    gap: 12px;
  }
  p {
    margin: 4px 0 0 0;
    color: ${theme.textLight};
    font-size: 0.9rem;
  }
`;

const DateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="date"] {
    border: none;
    background: transparent;
    padding: 8px 12px 8px 36px;
    font-weight: 500;
    color: ${theme.text};
    font-family: inherit;
    outline: none;
    font-size: 0.9rem;
    cursor: pointer;
  }

  button {
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    color: ${theme.secondary};
    width: 36px; height: 36px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${theme.primary};
      color: white;
      border-color: ${theme.primary};
    }
  }
`;


const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${theme.border};
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.isOpen ? '#f0fdf4' : '#f8fafc'};
`;

const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => props.isOpen ? `
    color: #166534; background: #dcfce7; border: 1px solid #bbf7d0;
  ` : `
    color: #1e293b; background: #f1f5f9; border: 1px solid #e2e8f0;
  `}
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex; flex-direction: column; gap: 1rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${theme.textLight};
  padding: 4px 0;
  align-items: center;

  strong {
    color: ${theme.text};
    font-weight: 600;
    font-family: 'Roboto Mono', monospace; // Banking feel for numbers
    font-size: 1rem;
  }

  &.highlight {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid ${theme.border};
    margin: 0.5rem 0;
    
    strong { color: ${theme.primary}; font-weight: 700; font-size: 1.1rem; }
  }
`;

const DifferenceBadge = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto;
  
  ${props => props.diff === 0 ? `
    background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;
  ` : `
    background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca;
  `}
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid ${theme.border};
`;

const ActionButton = styled.button`
  width: 100%;
  background: white;
  border: 1px solid ${theme.border};
  padding: 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  color: ${theme.secondary};
  cursor: pointer;
  display: flex;
  align-items: center; justify-content: center; gap: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${theme.primary};
    color: white;
    border-color: ${theme.primary};
  }
`;

const BackButton = styled.button`
  background: white;
  border: 1px solid ${theme.border};
  width: 40px; height: 40px;
  border-radius: 8px;
  display: grid; place-items: center;
  cursor: pointer;
  color: ${theme.text};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    background: ${theme.bg};
    border-color: ${theme.secondary};
    color: ${theme.primary};
  }
`;

// New Component: Data Table for Product Breakdown
const BreakdownTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-top: 1rem;
  
  th {
    text-align: left;
    padding: 8px;
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    border-bottom: 1px solid #e2e8f0;
  }
  td {
    padding: 8px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
  }
  tr:last-child td { border-bottom: none; }
  .num { text-align: right; font-family: 'Roboto Mono', monospace; }
  .center { text-align: center; }
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

    // Configurar ventana de impresión
    const win = window.open('', '_blank');
    if (!win) return;

    const css = `
      body { font-family: 'Courier New', Courier, monospace; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
      h2, h3 { text-align: center; margin: 5px 0; text-transform: uppercase; }
      .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 20px; }
      .box { border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
      .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
      .row.bold { font-weight: bold; font-size: 16px; margin-top: 5px; padding-top: 5px; }
      .text-right { text-align: right; }
      .diff-negative { color: red; font-weight: bold; }
      .diff-positive { color: green; font-weight: bold; }
      .sub-row { margin-left: 20px; font-size: 0.9em; font-style: italic; color: #555; }
    `;

    // Diferencia calculada al vuelo
    const diff = Number(session.contado || session.countedAmount || 0) - stats.efectivoEsperado;

    // Layout HTML del Ticket
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Caja - ${fmtDT(session.closedAt || session.hora_cierre)}</title>
        <style>${css}</style>
      </head>
      <body>
        <div class="header">
          <h2>Reporte de Caja</h2>
          <p>${fmtDT(session.closedAt || session.hora_cierre)}</p>
          <p>Cajero: ${resolveName(session.closedBy || session.cerrada_por) || resolveName(session.openedBy || session.abierta_por)}</p>
        </div>

        <div class="box">
          <div class="row bold">
            <span>Monto Inicial:</span>
            <span>${fmtMoney(session.monto_inicial || session.initialAmount)}</span>
          </div>

          <div style="margin: 10px 0; border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 10px 0;">
             <div class="row bold"><span>MOVIMIENTOS DE CAJA</span></div>
             
             <div class="row"><span>(+) Efectivo C$:</span><span>${fmtMoney(stats.netCordobas)}</span></div>
             <div class="row"><span>(+) Efectivo USD:</span><span>$${Number(stats.netDolares).toFixed(2)}</span></div>
             <div class="row"><span>(Tasa: ${stats.tasaRef})</span><span>= ${fmtMoney(stats.netDolares * stats.tasaRef)}</span></div>
          </div>

          <div class="row bold">
            <span>= Efectivo Esperado Total:</span>
            <span>${fmtMoney(stats.efectivoEsperado)}</span>
          </div>
          <div class="sub-row"> (C$${Number(stats.efectivoEsperadoCordobas).toFixed(2)} + $${Number(stats.efectivoEsperadoDolares).toFixed(2)}) </div>

          <div class="row bold" style="margin-top: 15px;">
            <span>Efectivo Contado (Real):</span>
            <span>${fmtMoney(session.contado || session.countedAmount)}</span>
          </div>
          <div class="row bold text-right ${diff < -0.5 ? 'diff-negative' : diff > 0.5 ? 'diff-positive' : ''}">
            <span>Diferencia: ${fmtMoney(diff)}</span>
          </div>
        </div>

        <div class="box">
          <h3>Detalle No Efectivo</h3>
          <div class="row"><span>Tarjeta:</span><span>${fmtMoney(stats.totalTarjeta)}</span></div>
          <div class="row"><span>Transferencia:</span><span>${fmtMoney(stats.totalTransferencia)}</span></div>
          <div class="row"><span>Crédito:</span><span>${fmtMoney(stats.totalCredito)}</span></div>
        </div>
      </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
    win.print();
  };

  // ... (RenderProductBreakdown se mantiene igual) ...

  return (
    <Container>
      {/* ... Headers y otros componentes previos ... */}
      <PrintStyles />
      <Header className="no-print">
        {/* ... Header content ... */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <BackButton title="Volver al Dashboard" onClick={() => navigate('/dashboard')} >
            <FaArrowLeft />
          </BackButton>
          <HeaderTitle>
            <h1>Reportes de Caja</h1>
            <p>Historial de aperturas, cierres y auditoría</p>
          </HeaderTitle>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {loading && <span style={{ color: theme.textLight }}><FaSyncAlt className="icon-spin" /> Cargando...</span>}
          <DateControl>
            <div className="input-wrapper">
              <FaCalendarAlt style={{ position: 'absolute', left: 12, color: theme.primary, pointerEvents: 'none' }} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button onClick={fetchData} title="Refrescar"><FaSyncAlt /></button>
          </DateControl>
        </div>
      </Header>

      {error && <div style={{ textAlign: 'center', margin: '2rem', color: theme.danger }}><FaExclamationTriangle /> {error}</div>}

      {/* Grid ABIERTAS */}
      <h3 style={{ marginLeft: '0.5rem', marginBottom: '1rem', color: theme.text }}>
        <FaLockOpen /> Cajas Abiertas ({abiertasHoy.length})
      </h3>
      {!loading && !abiertasHoy.length && (
        <p style={{ marginLeft: '1rem', color: theme.textLight, fontStyle: 'italic' }}>No hay cajas abiertas para esta fecha.</p>
      )}

      <Grid className="cards-grid-print" style={{ marginBottom: '3rem' }}>
        {abiertasHoy.map(session => (
          <Card key={session.id} className="Card">
            {/* ... Card Content Abierta (Simplificado para no repetir todo el bloque, se asume igual) ... */}
            <CardHeader isOpen>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '1.1rem' }}>{resolveName(session.abierta_por)}</strong>
                <span style={{ fontSize: '0.85rem', color: '#15803d' }}>
                  Abierta: {new Date(session.hora_apertura).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <Badge isOpen>Abierta</Badge>
            </CardHeader>
            <CardBody>
              <StatRow>
                <span>Monto Inicial:</span>
                <strong>{fmtMoney(session.monto_inicial)}</strong>
              </StatRow>
              <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '12px', color: '#166534', marginTop: 'auto' }}>
                <FaCheckCircle /> Caja activa actualmente
              </div>
            </CardBody>
          </Card>
        ))}
      </Grid>


      {/* Grid CERRADAS */}
      <h3 style={{ marginLeft: '0.5rem', marginBottom: '1rem', color: theme.text }}>
        <FaCheckCircle /> Cierres Completados ({cerradasHoy.length})
      </h3>

      {!loading && !cerradasHoy.length && (
        <p style={{ marginLeft: '1rem', color: theme.textLight, fontStyle: 'italic' }}>No hay cierres registrados en esta fecha.</p>
      )}

      <Grid className="cards-grid-print">
        {cerradasHoy.map(session => {
          // SIEMPRE RECALCULAMOS para tener el desglose rico de USD/Cordobas
          // Si es SQL, calculateReportStats sacará la info de detalles_json
          const stats = calculateReportStats(session);

          const diff = Number(session.diferencia);
          const totalVendido = stats.totalVentasDia || (
            (stats.totalVentaContado || stats.total_efectivo || 0) +
            (stats.totalTarjeta || 0) +
            (stats.totalTransferencia || 0) +
            (stats.totalCredito || 0)
          );

          return (
            <Card key={session.id} className="Card">
              <CardHeader>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{resolveName(session.abierta_por)}</strong>
                  <span style={{ fontSize: '0.85rem', color: theme.textLight }}>
                    📅 {new Date(session.hora_apertura).toLocaleDateString('es-NI')} |
                    🕒 {new Date(session.hora_apertura).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' ➜ '}
                    {new Date(session.hora_cierre).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Badge>Cerrada</Badge>
              </CardHeader>

              <CardBody>
                {/* TOTAL VENTAS GLOBAL */}
                <div style={{
                  background: '#f1f5f9', padding: '1rem', borderRadius: '8px', border: `1px solid ${theme.border}`, marginBottom: '1rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '600', color: theme.secondary, textTransform: 'uppercase', fontSize: '0.85rem' }}>💰 Ventas Totales</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: theme.primary, fontFamily: 'Roboto Mono' }}>
                    {fmtMoney(totalVendido)}
                  </span>
                </div>

                {/* RESUMEN FINANCIERO DETALLADO */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: theme.secondary, fontSize: '0.85rem' }}>💵 Arqueo Físico (Efectivo)</h5>
                    <StatRow><span>Monto Inicial:</span><strong>{fmtMoney(session.monto_inicial || session.initialAmount)}</strong></StatRow>

                    <div style={{ margin: '4px 0', padding: '4px 0', borderTop: '1px dashed #eee', borderBottom: '1px dashed #eee' }}>
                      <StatRow><span>(+) C$ Netos:</span><strong>{fmtMoney(stats.netCordobas)}</strong></StatRow>
                      <StatRow><span>(+) USD Netos:</span><strong>${Number(stats.netDolares).toFixed(2)}</strong></StatRow>
                    </div>

                    <StatRow className="highlight">
                      <span>Total Esperado:</span>
                      <strong>{fmtMoney(stats.efectivoEsperado)}</strong>
                    </StatRow>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right', marginTop: '-4px' }}>
                      (C${stats.efectivoEsperadoCordobas.toFixed(2)} + ${stats.efectivoEsperadoDolares.toFixed(2)})
                    </div>
                  </div>

                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: theme.secondary, fontSize: '0.85rem' }}>💳 No Efectivo</h5>
                    <StatRow><span>Tarjeta:</span><span style={{ fontFamily: 'Roboto Mono' }}>{fmtMoney(stats.totalTarjeta)}</span></StatRow>
                    <StatRow><span>Transferencia:</span><span style={{ fontFamily: 'Roboto Mono' }}>{fmtMoney(stats.totalTransferencia)}</span></StatRow>
                    <StatRow><span>Crédito:</span><span style={{ fontFamily: 'Roboto Mono' }}>{fmtMoney(stats.totalCredito)}</span></StatRow>
                    {stats.sumDevolucionesCancelaciones > 0 && (
                      <StatRow style={{ color: theme.danger }}><span>Dev/Cancel:</span><span>-{fmtMoney(stats.sumDevolucionesCancelaciones)}</span></StatRow>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: theme.textLight }}>Contado Real</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{fmtMoney(session.contado || session.countedAmount)}</div>
                  </div>
                  <DifferenceBadge diff={diff}>
                    {Math.abs(diff) < 0.5 ? 'Cuadre Perfecto' : `${diff > 0 ? '+' : ''}${fmtMoney(diff)}`}
                  </DifferenceBadge>
                </div>

                {/* TABLA DE PRODUCTOS */}
                <RenderProductBreakdown session={session} />

              </CardBody>

              <CardFooter className="no-print">
                <ActionButton onClick={() => handlePrintDetail(session)}>
                  <FaPrint /> Imprimir Reporte
                </ActionButton>
              </CardFooter>
            </Card>
          );
        })}
      </Grid>
    </Container>
  );
};

export default CashReport;

