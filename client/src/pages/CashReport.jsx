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
  bg: '#f1f5f9', // Fondo muy suave slate-100
  surface: '#ffffff',
  text: '#1e293b',
  textLight: '#64748b',
  border: '#e2e8f0',
  glass: 'rgba(255, 255, 255, 0.7)'
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: ${theme.bg};
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: ${theme.text};

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid white;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 1.5rem;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  p {
    margin: 4px 0 0 0;
    color: ${theme.textLight};
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

const DateControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid ${theme.border};

  /* Input wrapper for custom icon */
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="date"] {
    border: none;
    background: transparent;
    padding: 10px 16px;
    font-weight: 600;
    color: ${theme.text};
    font-family: inherit;
    outline: none;
    font-size: 0.95rem;
    cursor: pointer;
    
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
      &:hover { opacity: 1; }
    }
  }

  button {
    background: white;
    border: 1px solid ${theme.border};
    color: ${theme.primary};
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px -3px rgba(37, 99, 235, 0.15);
      background: ${theme.primary};
      color: white;
      border-color: ${theme.primary};
    }
    &:active { transform: translateY(0); }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.6);
  display: flex; flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.isOpen
    ? 'linear-gradient(to right, #f0fdf4, #ffffff)'
    : 'linear-gradient(to right, #f8fafc, #ffffff)'};
`;

const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex; align-items: center; gap: 6px;
  
  ${props => props.isOpen ? `
    color: #15803d;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    box-shadow: 0 2px 5px rgba(22, 163, 74, 0.1);
  ` : `
    color: #991b1b;
    background: #fee2e2;
    border: 1px solid #fecaca;
  `}
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex; flex-direction: column; gap: 12px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: ${theme.textLight};
  padding: 4px 0;

  strong {
    color: ${theme.text};
    font-weight: 700;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
  }

  &.highlight {
    background: #f0f9ff;
    padding: 1rem;
    border-radius: 12px;
    margin-top: 0.5rem;
    color: #0369a1;
    border: 1px dashed #bae6fd;
    
    strong { color: #0284c7; font-size: 1.1rem; }
  }
`;

const DifferenceBadge = styled.div`
  text-align: center;
  margin-top: auto;
  padding: 0.75rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex; justify-content: center; align-items: center; gap: 8px;
  
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
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 600;
  color: ${theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }
  
  &:active { transform: translateY(0); }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button title="Volver al Dashboard" onClick={() => navigate('/dashboard')} style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', width: '45px', height: '45px',
              display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#1e293b', boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}>
              <FaArrowLeft size={18} />
            </button>
            <HeaderTitle>
              <h1><FaFileAlt color="#3b82f6" /> Reportes de Caja</h1>
              <p>Historial de aperturas, cierres y auditoría</p>
            </HeaderTitle>
          </div>

          <DateControl>
            <div className="input-wrapper">
              <FaCalendarAlt color="#64748b" style={{ position: 'absolute', left: 16 }} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
            <button onClick={fetchData} title="Refrescar datos">
              {loading ? <FaSyncAlt className="spin" /> : <FaSyncAlt />}
            </button>
          </DateControl>
        </Header>

        {loading && <div style={{ textAlign: 'center', padding: '4rem', color: theme.textLight }}>
          <FaSyncAlt size={40} className="spin" style={{ opacity: 0.3 }} />
          <p style={{ marginTop: 20 }}>Cargando información...</p>
        </div>}

        {!loading && (
          <Grid>
            {/* CAJAS ABIERTAS AHORA */}
            {abiertasActivas.map(s => renderSessionCard(s, true))}

            {/* CAJAS CERRADAS DE LA FECHA SELECCIONADA */}
            {cerradasHoy.map(s => renderSessionCard(s, false))}

            {/* CAJAS ABIERTAS DE LA FECHA (HISTORIAL) */}
            {abiertasHoy.map(s => renderSessionCard(s, true))}
          </Grid>
        )}

        {!loading && cerradasHoy.length === 0 && abiertasHoy.length === 0 && abiertasActivas.length === 0 && (
          <div style={{
            textAlign: 'center', color: theme.textLight, marginTop: '4rem',
            background: 'white', padding: '3rem', borderRadius: '24px', border: '1px dashed #e2e8f0',
            maxWidth: '500px', marginInline: 'auto'
          }}>
            <FaExclamationTriangle size={48} style={{ marginBottom: '1.5rem', opacity: 0.3, color: theme.warning }} />
            <h3 style={{ margin: '0 0 8px 0', color: theme.text }}>Sin Movimientos</h3>
            <p style={{ margin: 0 }}>No se encontraron registros para la fecha <strong>{date}</strong>.</p>
          </div>
        )}
      </Container>
    </>
  );
};

export default CashReport;

