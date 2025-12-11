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
    const pd = tx?.pagoDetalles || {};

    // Monto base total de la operación
    // CORRECCION AUDITORIA: Forzar signo negativo si es salida o devolución
    let rawAmount = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
    if (t === 'salida' || t.includes('devolucion')) {
      rawAmount = -Math.abs(rawAmount);
    }
    const montoBase = rawAmount;

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

    // Efectivo Real = Total - Digital
    // Nota: Si es salida (montoBase negativo), esto restará al efectivo al final.
    const ingresoEfectivoReal = montoBase - txTarjeta - txTransf - txCredito;

    // Actualizar Caja (Solo Efectivo)
    // CORRECCION AUDITORIA: Se eliminó check 'venta_credito' para incluir primas en efectivo.
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
    const esCancelacion = t === 'cancelacion' || t.includes('cancelacion');

    if (t === 'venta_contado' || t === 'venta_mixta' || t === 'venta_credito') {
      cls.ventasContado.push(tx);
    }
    else if (esDevolucion) {
      cls.devoluciones.push(tx);
      sumDevsCancels += Math.abs(montoBase);
    }
    else if (esCancelacion) {
      cls.cancelaciones.push(tx);
      sumDevsCancels += Math.abs(montoBase);
    }
    else if (t === 'entrada') {
      cls.entradas.push(tx);
    }
    else if (t === 'salida') {
      cls.salidas.push(tx);
    }
    else if (t.includes('abono') || t.includes('pedido') || t.includes('apartado')) {
      cls.abonos.push(tx);
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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Error al cargar el reporte de caja.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [authHeader, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // Función para imprimir el reporte DETALLADO (Mismo formato que POS)
  const handlePrintDetail = (session) => {
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
        <td style="text-align:right;color:${color}">${fmt(tx.pagoDetalles?.ingresoCaja ?? tx.amount)}</td>
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
