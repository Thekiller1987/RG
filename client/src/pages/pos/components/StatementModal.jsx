import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaPrint, FaTimes, FaFileInvoiceDollar, FaCreditCard, FaMoneyBillWave,
  FaBoxOpen, FaFilePdf, FaWhatsapp, FaReceipt, FaHistory, FaCheckCircle,
  FaCalendarAlt, FaExclamationCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useSettings } from '../../../context/SettingsContext.jsx';
import { generateAccountStatementPDF } from '../../../utils/clientPdfGenerator.js';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9500;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(7px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalCard = styled(motion.div)`
  background: #ffffff;
  width: 920px;
  max-width: 100%;
  max-height: 94vh;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 28px 65px -15px rgba(15, 23, 42, 0.45);
  border: 1px solid #e2e8f0;
`;

const TopBar = styled.div`
  padding: 1.05rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

const ControlsBar = styled.div`
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex-shrink: 0;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const ModeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const ModeBtn = styled.button`
  padding: 0.48rem 0.9rem;
  border-radius: 99px;
  border: 1px solid ${p => p.$active ? (p.$color || '#2563eb') : '#cbd5e1'};
  background: ${p => p.$active ? (p.$color || '#2563eb') : '#ffffff'};
  color: ${p => p.$active ? '#ffffff' : '#475569'};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.16s ease;
  outline: none;
  &:hover {
    border-color: ${p => p.$color || '#2563eb'};
  }
`;

const DateInput = styled.input`
  padding: 0.4rem 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  background: #ffffff;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const PreviewCanvas = styled.div`
  padding: 1.4rem;
  overflow-y: auto;
  flex: 1;
  background: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  @media (max-width: 640px) {
    padding: 0.75rem;
  }
`;

const DocumentSheet = styled.div`
  width: 100%;
  max-width: 790px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0f172a;

  .top-stripe {
    height: 6px;
    background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%);
  }

  .sheet-inner {
    padding: 1.65rem 1.85rem;
    @media (max-width: 640px) {
      padding: 1.1rem;
    }
  }
`;

const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.25rem;
  padding-bottom: 1.1rem;
  border-bottom: 2px solid #e2e8f0;
  flex-wrap: wrap;
`;

const CompanyBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  img {
    max-width: 64px;
    max-height: 64px;
    object-fit: contain;
    border-radius: 8px;
  }
  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.02em;
  }
  p {
    margin: 2px 0 0;
    font-size: 0.78rem;
    color: #475569;
    line-height: 1.35;
  }
`;

const DocBadgeBox = styled.div`
  text-align: right;
  .title-pill {
    display: inline-block;
    padding: 0.42rem 0.95rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    color: #ffffff;
    background: ${p => p.$bg || '#1e3a8a'};
  }
  .meta-lines {
    margin-top: 0.45rem;
    font-size: 0.76rem;
    color: #64748b;
    line-height: 1.45;
    strong { color: #1e293b; }
  }
`;

const InfoSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 1rem;
  margin: 1.15rem 0 1.25rem;
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.95rem 1.1rem;
  .eyebrow {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 0.35rem;
  }
  .client-name {
    font-size: 1.08rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.35rem;
  }
  .detail-line {
    font-size: 0.8rem;
    color: #475569;
    margin: 2px 0;
    strong { color: #1e293b; }
  }
  .sum-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    padding: 3px 0;
    color: #475569;
    strong { font-variant-numeric: tabular-nums; }
  }
  .highlight-balance {
    margin-top: 0.5rem;
    padding: 0.55rem 0.75rem;
    border-radius: 9px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${p => p.$hasDebt ? '#fef2f2' : '#ecfdf5'};
    border: 1px solid ${p => p.$hasDebt ? '#fecaca' : '#a7f3d0'};
    color: ${p => p.$hasDebt ? '#b91c1c' : '#047857'};
    span { font-size: 0.76rem; font-weight: 800; text-transform: uppercase; }
    strong { font-size: 1.15rem; font-weight: 900; font-variant-numeric: tabular-nums; }
  }
`;

const StatementTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  th {
    background: #0f172a;
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.65rem 0.7rem;
    text-align: left;
  }
  td {
    padding: 0.6rem 0.7rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
    font-variant-numeric: tabular-nums;
  }
  th.right, td.right { text-align: right; white-space: nowrap; }
  th.center, td.center { text-align: center; }
  tr.prod-subrow td {
    background: #f8fafc;
    padding: 0.34rem 0.7rem;
    font-size: 0.76rem;
    color: #475569;
    border-bottom: 1px dashed #e2e8f0;
  }
  tr.opening-row td {
    background: #f1f5f9;
    font-weight: 700;
    color: #1e293b;
  }
  tr.total-row td {
    background: #f1f5f9;
    font-weight: 800;
    color: #0f172a;
    border-top: 2px solid #cbd5e1;
    border-bottom: none;
    font-size: 0.86rem;
  }
`;

const ReconcileBox = styled.div`
  margin-top: 1.1rem;
  padding: 0.85rem 1.05rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  .rec-title {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #1e3a8a;
  }
  .rec-eq {
    font-size: 0.84rem;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-items: center;
  }
`;

const FooterBar = styled.div`
  padding: 0.95rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  padding: 0.58rem 1.05rem;
  border-radius: 10px;
  border: 1px solid ${p => p.$border || 'transparent'};
  background: ${p => p.$bg || '#f1f5f9'};
  color: ${p => p.$color || '#334155'};
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: all 0.16s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(0.97);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const fmt = (n) =>
  new Intl.NumberFormat('es-NI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-NI', {
    timeZone: 'America/Managua',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const StatementModal = ({
  statementData,
  filterType: initialFilter = 'ALL',
  onClose,
}) => {
  const { settings } = useSettings();
  const {
    cliente = {},
    facturas_pendientes = [],
    ciclo_actual = [],
    historial = [],
  } = statementData || {};

  // Map initial filter cleanly to our 4 reconciled modes
  const resolveInitialMode = () => {
    if (initialFilter === 'DEBT') return 'PENDING';
    if (initialFilter === 'PAID') return 'PAID';
    // Para 'ALL': si el cliente tiene un ciclo actual claro, iniciar en Estado Actual (mucho más limpio e intuitivo que 80 líneas viejas)
    if (Array.isArray(ciclo_actual) && ciclo_actual.length > 0 && ciclo_actual.length < historial.length) {
      return 'CYCLE';
    }
    return 'HISTORY';
  };

  const [mode, setMode] = useState(resolveInitialMode);
  const [showProducts, setShowProducts] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportingPdf, setExportingPdf] = useState(false);

  const logoUrl = useMemo(() => {
    if (!settings?.empresa_logo_url) return null;
    if (settings.empresa_logo_url.startsWith('http')) return settings.empresa_logo_url;
    let cleanUrl = settings.empresa_logo_url;
    if (cleanUrl.startsWith('/uploads')) cleanUrl = '/api' + cleanUrl;
    else if (cleanUrl.startsWith('uploads')) cleanUrl = '/api/' + cleanUrl;
    const base = (import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com/api').replace(/\/api$/, '');
    return `${base}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  }, [settings?.empresa_logo_url]);

  const companyInfo = useMemo(() => ({
    name: settings?.empresa_nombre || 'Multirepuestos RG',
    ruc: settings?.empresa_ruc || '1211812770001E',
    phone: settings?.empresa_telefono || '84031936 / 84058142',
    address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    logo: logoUrl || new URL('/icons/logo.png', window.location.origin).toString(),
  }), [settings, logoUrl]);

  const saldoFinalReal = Number(
    cliente.saldo_pendiente_db !== undefined ? cliente.saldo_pendiente_db : (cliente.saldo_calculado || 0)
  );

  // Construir filas y resumen perfectamente cuadrado según el modo activo y filtro de fechas
  const { displayRows, summary, periodLabel } = useMemo(() => {
    const toDateKey = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    if (mode === 'PENDING') {
      const rows = Array.isArray(facturas_pendientes) ? facturas_pendientes : [];
      const pendingOriginal = rows.reduce((s, f) => s + Number(f.monto_original || 0), 0);
      const pendingAbonado = rows.reduce((s, f) => s + Number(f.abonado || 0), 0);
      const pendingRestante = rows.reduce((s, f) => s + Number(f.saldo_pendiente || 0), 0);
      return {
        displayRows: rows,
        periodLabel: 'Corte al ' + fmtDate(new Date().toISOString()),
        summary: {
          pendingCount: rows.length,
          pendingOriginal,
          pendingAbonado,
          saldoFinal: rows.length > 0 ? pendingRestante : saldoFinalReal,
        },
      };
    }

    if (mode === 'PAID') {
      let abonos = (historial || []).filter(tx => tx.impacto < 0);
      if (startDate) abonos = abonos.filter(tx => toDateKey(tx.fecha) >= startDate);
      if (endDate) abonos = abonos.filter(tx => toDateKey(tx.fecha) <= endDate);

      let abonosEfectivo = 0;
      let abonosTransf = 0;
      let abonosTarjeta = 0;
      abonos.forEach(a => {
        const m = String(a.metodo || 'Efectivo').toLowerCase();
        if (m.includes('transfer')) abonosTransf += a.monto;
        else if (m.includes('tarjeta')) abonosTarjeta += a.monto;
        else abonosEfectivo += a.monto;
      });

      const totalAbonos = abonos.reduce((s, a) => s + a.monto, 0);
      const pLabel = (startDate || endDate)
        ? `Período: ${startDate || 'Inicio'} al ${endDate || 'Hoy'}`
        : 'Todos los abonos históricos';

      return {
        displayRows: abonos,
        periodLabel: pLabel,
        summary: {
          totalAbonos,
          abonosEfectivo,
          abonosTransf,
          abonosTarjeta,
          saldoFinal: saldoFinalReal,
        },
      };
    }

    // CYCLE or HISTORY
    if (mode === 'CYCLE') {
      const rows = Array.isArray(ciclo_actual) ? ciclo_actual : [];
      const periodCargos = rows.filter(r => r.impacto > 0).reduce((s, r) => s + r.monto, 0);
      const periodAbonos = rows.filter(r => r.impacto < 0).reduce((s, r) => s + r.monto, 0);
      const isFullHistory = rows.length === historial.length;
      const ajuste = Number(cliente.ajuste_conciliacion || 0);

      return {
        displayRows: rows,
        periodLabel: isFullHistory ? 'Historial Activo Completo' : 'Ciclo Activo (Desde último saldo C$ 0.00)',
        summary: {
          showOpeningRow: true,
          openingLabel: isFullHistory ? 'Saldo Inicial de Cuenta' : 'Saldo Anterior (Cuenta liquidada en C$ 0.00)',
          openingBalance: 0,
          periodCargos,
          periodAbonos,
          ajusteConciliacion: ajuste,
          saldoFinal: saldoFinalReal,
        },
      };
    }

    // HISTORY con soporte de filtro Desde / Hasta + Saldo Anterior exacto
    let openingBalance = 0;
    const filtered = [];
    const hasCustomRange = Boolean(startDate || endDate);

    (historial || []).forEach(tx => {
      const key = toDateKey(tx.fecha);
      if (startDate && key < startDate) {
        openingBalance = Number(tx.saldo || 0);
        return;
      }
      if (endDate && key > endDate) {
        return;
      }
      filtered.push(tx);
    });

    const periodCargos = filtered.filter(r => r.impacto > 0).reduce((s, r) => s + r.monto, 0);
    const periodAbonos = filtered.filter(r => r.impacto < 0).reduce((s, r) => s + r.monto, 0);
    const endOfRangeBalance = filtered.length > 0
      ? Number(filtered[filtered.length - 1].saldo || 0)
      : openingBalance;
    const isUpToPresent = !endDate;
    const ajuste = isUpToPresent ? Number(cliente.ajuste_conciliacion || 0) : 0;

    return {
      displayRows: filtered,
      periodLabel: hasCustomRange
        ? `Período: ${startDate || 'Inicio'} al ${endDate || 'Hoy'}`
        : 'Historial Completo de Cuenta',
      summary: {
        showOpeningRow: Boolean(startDate),
        openingLabel: `Saldo Anterior al ${startDate}`,
        openingBalance,
        periodCargos,
        periodAbonos,
        ajusteConciliacion: ajuste,
        saldoFinal: isUpToPresent ? saldoFinalReal : endOfRangeBalance,
      },
    };
  }, [mode, facturas_pendientes, ciclo_actual, historial, startDate, endDate, saldoFinalReal, cliente.ajuste_conciliacion]);

  const docMeta = useMemo(() => {
    const todayTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const folio = `EC-${cliente.id || '0'}-${todayTag}`;
    if (mode === 'PENDING') return { title: 'FACTURAS PENDIENTES DE PAGO', color: '#b91c1c', folio };
    if (mode === 'PAID') return { title: 'HISTORIAL DE PAGOS Y ABONOS', color: '#059669', folio };
    if (mode === 'CYCLE') return { title: 'ESTADO DE CUENTA ACTUAL', color: '#1e3a8a', folio };
    return { title: 'ESTADO DE CUENTA HISTÓRICO', color: '#0f172a', folio };
  }, [mode, cliente.id]);

  // 1. Descargar PDF Vectorial Ejecutivo (jsPDF + autoTable)
  const handleDownloadPDF = useCallback(async () => {
    setExportingPdf(true);
    const tId = toast.loading('Generando documento PDF...');
    try {
      const fileName = await generateAccountStatementPDF({
        companyInfo,
        cliente,
        mode,
        rows: displayRows,
        summary,
        showProducts,
        periodLabel,
      });
      toast.dismiss(tId);
      toast.success(`PDF descargado: ${fileName}`);
    } catch (err) {
      toast.dismiss(tId);
      console.error('Error generando PDF:', err);
      toast.error('No se pudo generar el PDF.');
    } finally {
      setExportingPdf(false);
    }
  }, [companyInfo, cliente, mode, displayRows, summary, showProducts, periodLabel]);

  // 2. Copiar Resumen listo para WhatsApp
  const handleCopyWhatsApp = useCallback(() => {
    const lines = [];
    lines.push(`*${companyInfo.name.toUpperCase()}*`);
    lines.push(`📄 *${docMeta.title}*`);
    lines.push(`👤 Cliente: *${cliente.nombre}*`);
    lines.push(`📅 Fecha: ${fmtDate(new Date().toISOString())}`);
    lines.push('────────────────────');

    if (mode === 'PENDING') {
      if (displayRows.length === 0) {
        lines.push('✅ *Cuenta al día — Sin saldo pendiente (C$ 0.00)*');
      } else {
        displayRows.forEach(f => {
          lines.push(`• Factura *#${f.id_venta}* (${fmtDate(f.fecha)}) — Pendiente: *C$ ${fmt(f.saldo_pendiente)}*`);
          if (showProducts && f.productos?.length > 0) {
            f.productos.forEach(p => {
              lines.push(`   ↳ ${p.cantidad}x ${p.nombre} (C$ ${fmt(p.subtotal)})`);
            });
          }
        });
      }
    } else if (mode === 'PAID') {
      lines.push(`💵 Total Abonado (${displayRows.length} pagos): *C$ ${fmt(summary.totalAbonos)}*`);
    } else {
      lines.push(`• Saldo Anterior: C$ ${fmt(summary.openingBalance)}`);
      lines.push(`• (+) Créditos: C$ ${fmt(summary.periodCargos)}`);
      lines.push(`• (-) Abonos: C$ ${fmt(summary.periodAbonos)}`);
    }

    lines.push('────────────────────');
    lines.push(`💰 *SALDO PENDIENTE ACTUAL: C$ ${fmt(summary.saldoFinal)}*`);
    if (companyInfo.phone) lines.push(`📞 Consultas: ${companyInfo.phone}`);

    navigator.clipboard.writeText(lines.join('\n'))
      .then(() => toast.success('Resumen copiado para pegar en WhatsApp'))
      .catch(() => toast.error('No se pudo copiar al portapapeles'));
  }, [companyInfo, docMeta.title, cliente.nombre, mode, displayRows, summary, showProducts]);

  // 3. Imprimir A4 limpio
  const handlePrintA4 = useCallback(() => {
    const node = document.getElementById('executive-statement-sheet');
    if (!node) return;
    const html = node.outerHTML;
    const styles = `
      @page { size: A4 portrait; margin: 10mm; }
      body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; color: #0f172a; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #executive-statement-sheet { max-width: 100% !important; box-shadow: none !important; border-radius: 0 !important; }
      .top-stripe { height: 6px; background: #1e3a8a !important; }
      .sheet-inner { padding: 12px 4px !important; }
      table { width: 100%; border-collapse: collapse; font-size: 9pt; border: 1px solid #cbd5e1; }
      th { background: #0f172a !important; color: #fff !important; padding: 6px; text-align: left; font-size: 8pt; }
      td { padding: 5px 6px; border-bottom: 1px solid #e2e8f0; }
      .right { text-align: right !important; white-space: nowrap; }
      tr.prod-subrow td { background: #f8fafc !important; font-size: 8pt; color: #475569; padding: 3px 6px; }
      tr.total-row td { background: #f1f5f9 !important; font-weight: 800; border-top: 2px solid #94a3b8; }
      img { max-width: 60px; max-height: 60px; object-fit: contain; }
    `;
    const w = window.open('', '_blank', 'width=900,height=720');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${docMeta.title} - ${cliente.nombre}</title><style>${styles}</style></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); setTimeout(() => w.close(), 400); }, 350);
  }, [docMeta.title, cliente.nombre]);

  // 4. Imprimir Ticket Térmico 80mm optimizado
  const handlePrintThermal80 = useCallback(() => {
    let rowsHtml = '';
    if (mode === 'PENDING') {
      rowsHtml = displayRows.length === 0
        ? '<p style="text-align:center;margin:10px 0;">SIN FACTURAS PENDIENTES</p>'
        : displayRows.map(f => {
            const prods = showProducts && f.productos?.length
              ? f.productos.map(p => `<div style="font-size:8pt;padding-left:6px;">- ${p.cantidad}x ${p.nombre} (C$${fmt(p.subtotal)})</div>`).join('')
              : '';
            return `
              <div style="border-bottom:1px dashed #000;padding:5px 0;">
                <div style="display:flex;justify-content:space-between;">
                  <span><strong>Fact #${f.id_venta}</strong> (${fmtDate(f.fecha)})</span>
                  <span><strong>C$${fmt(f.saldo_pendiente)}</strong></span>
                </div>
                ${f.abonado > 0 ? `<div style="font-size:8pt;">Orig: C$${fmt(f.monto_original)} | Abonado: C$${fmt(f.abonado)}</div>` : ''}
                ${prods}
              </div>
            `;
          }).join('');
    } else if (mode === 'PAID') {
      rowsHtml = displayRows.map(tx => `
        <div style="border-bottom:1px dashed #000;padding:4px 0;">
          <div style="display:flex;justify-content:space-between;">
            <span>#${tx.id_venta} ${fmtDate(tx.fecha)}</span>
            <span><strong>C$${fmt(tx.monto)}</strong></span>
          </div>
          <div style="font-size:8pt;">${tx.metodo === 'Efectivo' ? 'Contado/Efec.' : tx.metodo} · ${tx.destino || 'Cuenta Gral'}</div>
        </div>
      `).join('');
    } else {
      rowsHtml = displayRows.map(tx => `
        <div style="border-bottom:1px dashed #000;padding:4px 0;">
          <div style="display:flex;justify-content:space-between;">
            <span>${fmtDate(tx.fecha)} ${tx.tipo === 'CREDITO' ? 'CRED' : 'ABONO'} #${tx.id_venta}</span>
            <span>${tx.impacto > 0 ? '+' : '-'}C$${fmt(tx.monto)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:8pt;">
            <span>${tx.tipo === 'ABONO' ? (tx.metodo || 'Efectivo') : 'Factura crédito'}</span>
            <span>Saldo: C$${fmt(tx.saldo)}</span>
          </div>
        </div>
      `).join('');
    }

    const html = `
      <div style="font-family:'League Spartan','Inter',monospace;width:76mm;padding:4px;font-size:9pt;color:#000;font-weight:700;">
        <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px;">
          <div style="font-size:13pt;font-weight:900;">${companyInfo.name}</div>
          <div style="font-size:8pt;">RUC: ${companyInfo.ruc} · Tel: ${companyInfo.phone}</div>
          <div style="font-size:10pt;font-weight:900;margin-top:4px;">${docMeta.title}</div>
        </div>
        <div style="border-bottom:1px dashed #000;padding-bottom:6px;margin-bottom:6px;font-size:8.5pt;">
          <div><strong>Cliente:</strong> ${cliente.nombre} (#${cliente.id})</div>
          ${cliente.telefono ? `<div><strong>Tel:</strong> ${cliente.telefono}</div>` : ''}
          <div><strong>Fecha:</strong> ${new Date().toLocaleString('es-NI')}</div>
        </div>
        ${rowsHtml}
        <div style="border-top:2px solid #000;margin-top:8px;padding-top:6px;">
          <div style="display:flex;justify-content:space-between;font-size:12pt;font-weight:900;">
            <span>SALDO ACTUAL:</span>
            <span>C$${fmt(summary.saldoFinal)}</span>
          </div>
        </div>
        <div style="text-align:center;margin-top:10px;font-size:8pt;border-top:1px dashed #000;padding-top:6px;">
          Documento informativo · Gracias por su preferencia
        </div>
      </div>
    `;

    const w = window.open('', '_blank', 'width=380,height=620');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Ticket 80mm</title><style>@page{size:80mm auto;margin:0;}body{margin:0;padding:0;}</style></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); setTimeout(() => w.close(), 400); }, 350);
  }, [mode, displayRows, showProducts, companyInfo, docMeta.title, cliente, summary.saldoFinal]);

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalCard
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 14 }}
        transition={{ duration: 0.18 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <TopBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem' }}>
              <FaFileInvoiceDollar />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Generador de Estado de Cuenta
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Vista previa lista para enviar en PDF, WhatsApp o imprimir
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <FaTimes />
          </button>
        </TopBar>

        {/* Barra de Modos + Opciones */}
        <ControlsBar>
          <ControlsRow>
            <ModeGroup>
              <ModeBtn $active={mode === 'PENDING'} $color="#dc2626" onClick={() => setMode('PENDING')}>
                <FaCreditCard /> Facturas Pendientes ({facturas_pendientes.length})
              </ModeBtn>
              <ModeBtn $active={mode === 'CYCLE'} $color="#2563eb" onClick={() => setMode('CYCLE')}>
                <FaFileInvoiceDollar /> Estado Actual
              </ModeBtn>
              <ModeBtn $active={mode === 'HISTORY'} $color="#0f172a" onClick={() => setMode('HISTORY')}>
                <FaHistory /> Historial Completo
              </ModeBtn>
              <ModeBtn $active={mode === 'PAID'} $color="#059669" onClick={() => setMode('PAID')}>
                <FaMoneyBillWave /> Solo Abonos
              </ModeBtn>
            </ModeGroup>

            {mode !== 'PAID' && (
              <ModeBtn $active={showProducts} $color="#475569" onClick={() => setShowProducts(v => !v)}>
                <FaBoxOpen /> {showProducts ? 'Con Productos' : 'Sin Productos'}
              </ModeBtn>
            )}
          </ControlsRow>

          {(mode === 'HISTORY' || mode === 'PAID') && (
            <ControlsRow style={{ paddingTop: '0.35rem', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <FaCalendarAlt style={{ color: '#2563eb' }} /> Filtrar rango de fechas:
                </span>
                <DateInput type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>al</span>
                <DateInput type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                {(startDate || endDate) && (
                  <ModeBtn onClick={() => { setStartDate(''); setEndDate(''); }}>
                    Limpiar fechas
                  </ModeBtn>
                )}
              </div>
            </ControlsRow>
          )}
        </ControlsBar>

        {/* Vista Previa Tipo Hoja A4 Ejecutiva */}
        <PreviewCanvas>
          <DocumentSheet id="executive-statement-sheet">
            <div className="top-stripe" />
            <div className="sheet-inner">
              {/* Encabezado Corporativo */}
              <SheetHeader>
                <CompanyBlock>
                  <img src={companyInfo.logo} alt="Logo" />
                  <div>
                    <h1>{companyInfo.name}</h1>
                    <p><strong>RUC:</strong> {companyInfo.ruc} · <strong>Tel:</strong> {companyInfo.phone}</p>
                    <p>{companyInfo.address}</p>
                  </div>
                </CompanyBlock>

                <DocBadgeBox $bg={docMeta.color}>
                  <div className="title-pill">{docMeta.title}</div>
                  <div className="meta-lines">
                    <div>Folio: <strong>{docMeta.folio}</strong></div>
                    <div>Emitido: <strong>{new Date().toLocaleString('es-NI')}</strong></div>
                    <div style={{ color: '#2563eb', fontWeight: 700 }}>{periodLabel}</div>
                  </div>
                </DocBadgeBox>
              </SheetHeader>

              {/* Tarjetas de Cliente + Resumen Financiero */}
              <InfoSummaryGrid>
                <InfoCard>
                  <div className="eyebrow">Datos del Cliente</div>
                  <div className="client-name">{cliente.nombre}</div>
                  <div className="detail-line">
                    <strong>ID:</strong> #{cliente.id}
                    {cliente.cedula ? <> · <strong>Cédula/RUC:</strong> {cliente.cedula}</> : null}
                  </div>
                  <div className="detail-line">
                    <strong>Teléfono:</strong> {cliente.telefono || 'No registrado'}
                  </div>
                  {cliente.direccion && (
                    <div className="detail-line"><strong>Dirección:</strong> {cliente.direccion}</div>
                  )}
                  <div className="detail-line">
                    <strong>Límite de Crédito:</strong>{' '}
                    {cliente.limite_credito === null || cliente.limite_credito === undefined
                      ? 'Sin Límite (∞)'
                      : `C$ ${fmt(cliente.limite_credito)}`}
                  </div>
                </InfoCard>

                <InfoCard $hasDebt={summary.saldoFinal > 0}>
                  <div className="eyebrow">Resumen Financiero</div>
                  {mode === 'PENDING' ? (
                    <>
                      <div className="sum-row">
                        <span>Facturas Pendientes:</span>
                        <strong>{summary.pendingCount} factura(s)</strong>
                      </div>
                      <div className="sum-row">
                        <span>Total Original Facturas:</span>
                        <strong>C$ {fmt(summary.pendingOriginal)}</strong>
                      </div>
                      <div className="sum-row">
                        <span>Abonos Aplicados:</span>
                        <strong style={{ color: '#059669' }}>- C$ {fmt(summary.pendingAbonado)}</strong>
                      </div>
                    </>
                  ) : mode === 'PAID' ? (
                    <>
                      <div className="sum-row">
                        <span>Total Abonado ({displayRows.length}):</span>
                        <strong style={{ color: '#059669' }}>C$ {fmt(summary.totalAbonos)}</strong>
                      </div>
                      <div className="sum-row">
                        <span>Contado / Efectivo:</span>
                        <strong>C$ {fmt(summary.abonosEfectivo)}</strong>
                      </div>
                      <div className="sum-row">
                        <span>Transferencia / Tarjeta:</span>
                        <strong>C$ {fmt(summary.abonosTransf + summary.abonosTarjeta)}</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sum-row">
                        <span>Saldo Anterior:</span>
                        <strong>C$ {fmt(summary.openingBalance)}</strong>
                      </div>
                      <div className="sum-row">
                        <span>(+) Créditos del Período:</span>
                        <strong style={{ color: '#dc2626' }}>+ C$ {fmt(summary.periodCargos)}</strong>
                      </div>
                      <div className="sum-row">
                        <span>(-) Abonos / Devoluciones:</span>
                        <strong style={{ color: '#059669' }}>- C$ {fmt(summary.periodAbonos)}</strong>
                      </div>
                    </>
                  )}

                  <div className="highlight-balance">
                    <span>{summary.saldoFinal > 0 ? 'Saldo Pendiente:' : 'Estado de Cuenta:'}</span>
                    <strong>{summary.saldoFinal > 0 ? `C$ ${fmt(summary.saldoFinal)}` : 'AL DÍA (C$ 0.00)'}</strong>
                  </div>
                </InfoCard>
              </InfoSummaryGrid>

              {/* TABLA SEGÚN MODO ACTIVO */}
              {mode === 'PENDING' && (
                displayRows.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, color: '#047857' }}>
                    <FaCheckCircle size={32} style={{ marginBottom: 6 }} />
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Cuenta al Día — Sin facturas pendientes</div>
                    <div style={{ fontSize: '0.84rem', marginTop: 2 }}>Este cliente no presenta saldos pendientes a la fecha.</div>
                  </div>
                ) : (
                  <StatementTable>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Factura</th>
                        <th>Estado / Detalle</th>
                        <th className="right">Total Fact.</th>
                        <th className="right">Abonado</th>
                        <th className="right">Pendiente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map((f) => (
                        <React.Fragment key={f.id_venta}>
                          <tr>
                            <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(f.fecha)}</td>
                            <td style={{ fontWeight: 800, color: '#1e3a8a' }}>#{f.id_venta}</td>
                            <td>
                              <span style={{
                                fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                                background: f.abonado > 0 ? '#fef3c7' : '#fee2e2',
                                color: f.abonado > 0 ? '#b45309' : '#b91c1c'
                              }}>
                                {f.estado}
                              </span>
                              {f.usuario && <span style={{ marginLeft: 6, fontSize: '0.75rem', color: '#64748b' }}>· {f.usuario}</span>}
                            </td>
                            <td className="right">C$ {fmt(f.monto_original)}</td>
                            <td className="right" style={{ color: '#059669' }}>C$ {fmt(f.abonado)}</td>
                            <td className="right" style={{ fontWeight: 800, color: '#b91c1c' }}>C$ {fmt(f.saldo_pendiente)}</td>
                          </tr>
                          {showProducts && f.productos && f.productos.length > 0 && f.productos.map((p, idx) => (
                            <tr key={`${f.id_venta}-p-${idx}`} className="prod-subrow">
                              <td></td>
                              <td colSpan={3} style={{ paddingLeft: '1rem' }}>
                                ↳ <strong>{p.cantidad} ×</strong> {p.nombre} {p.codigo ? `(${p.codigo})` : ''}
                              </td>
                              <td className="right">@ C$ {fmt(p.precioUnitario)}</td>
                              <td className="right" style={{ fontWeight: 700, color: '#334155' }}>C$ {fmt(p.subtotal)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                      <tr className="total-row">
                        <td colSpan={3}>TOTAL PENDIENTE DE PAGO ({displayRows.length} factura{displayRows.length === 1 ? '' : 's'})</td>
                        <td className="right">C$ {fmt(summary.pendingOriginal)}</td>
                        <td className="right" style={{ color: '#059669' }}>C$ {fmt(summary.pendingAbonado)}</td>
                        <td className="right" style={{ color: '#b91c1c', fontSize: '0.95rem' }}>C$ {fmt(summary.saldoFinal)}</td>
                      </tr>
                    </tbody>
                  </StatementTable>
                )
              )}

              {mode === 'PAID' && (
                <StatementTable>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Recibo</th>
                      <th>Método de Pago</th>
                      <th>Aplicado a / Referencia</th>
                      <th>Usuario</th>
                      <th className="right">Abonado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="center" style={{ padding: '1.5rem', color: '#64748b' }}>
                          No se encontraron abonos en este período.
                        </td>
                      </tr>
                    ) : (
                      <>
                        {displayRows.map((tx, idx) => (
                          <tr key={`${tx.id_venta}-${idx}`}>
                            <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(tx.fecha)}</td>
                            <td style={{ fontWeight: 800 }}>#{tx.id_venta}</td>
                            <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                              {tx.metodo === 'Efectivo' ? 'Contado / Efectivo' : (tx.metodo || 'Contado / Efectivo')}
                            </td>
                            <td>
                              {tx.destino || 'Cuenta General'}
                              {tx.referencia ? <span style={{ color: '#64748b' }}> · Ref: {tx.referencia}</span> : null}
                            </td>
                            <td style={{ color: '#64748b' }}>{tx.usuario || 'Sistema'}</td>
                            <td className="right" style={{ fontWeight: 800, color: '#059669' }}>C$ {fmt(tx.monto)}</td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td colSpan={5}>TOTAL ABONADO ({displayRows.length} pago{displayRows.length === 1 ? '' : 's'})</td>
                          <td className="right" style={{ color: '#059669', fontSize: '0.95rem' }}>C$ {fmt(summary.totalAbonos)}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </StatementTable>
              )}

              {(mode === 'CYCLE' || mode === 'HISTORY') && (
                <StatementTable>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Concepto / Documento</th>
                      <th className="right">Cargo (+)</th>
                      <th className="right">Abono (-)</th>
                      <th className="right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.showOpeningRow && (
                      <tr className="opening-row">
                        <td>—</td>
                        <td>{summary.openingLabel}</td>
                        <td className="right">—</td>
                        <td className="right">—</td>
                        <td className="right">C$ {fmt(summary.openingBalance)}</td>
                      </tr>
                    )}

                    {displayRows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="center" style={{ padding: '1.5rem', color: '#64748b' }}>
                          No hay movimientos en el período seleccionado.
                        </td>
                      </tr>
                    ) : (
                      displayRows.map((tx, idx) => (
                        <React.Fragment key={`${tx.id_venta}-${idx}`}>
                          <tr>
                            <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(tx.fecha)}</td>
                            <td style={{ fontWeight: 700, color: '#0f172a' }}>{tx.descripcion}</td>
                            <td className="right" style={{ color: '#dc2626', fontWeight: tx.impacto > 0 ? 700 : 400 }}>
                              {tx.impacto > 0 ? `C$ ${fmt(tx.monto)}` : '—'}
                            </td>
                            <td className="right" style={{ color: '#059669', fontWeight: tx.impacto < 0 ? 700 : 400 }}>
                              {tx.impacto < 0 ? `C$ ${fmt(tx.monto)}` : '—'}
                            </td>
                            <td className="right" style={{ fontWeight: 800 }}>C$ {fmt(tx.saldo)}</td>
                          </tr>
                          {showProducts && tx.productos && tx.productos.length > 0 && tx.productos.map((p, pIdx) => (
                            <tr key={`${idx}-p-${pIdx}`} className="prod-subrow">
                              <td></td>
                              <td colSpan={2} style={{ paddingLeft: '1rem' }}>
                                ↳ <strong>{p.cantidad} ×</strong> {p.nombre} {p.codigo ? `(${p.codigo})` : ''}
                              </td>
                              <td className="right">@ C$ {fmt(p.precioUnitario)}</td>
                              <td className="right" style={{ fontWeight: 700, color: '#334155' }}>C$ {fmt(p.subtotal)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    )}

                    {summary.ajusteConciliacion && Math.abs(summary.ajusteConciliacion) >= 0.01 && (
                      <tr>
                        <td>—</td>
                        <td style={{ fontStyle: 'italic', color: '#475569' }}>
                          <FaExclamationCircle style={{ marginRight: 5 }} /> Ajuste / Conciliación Histórica de Cuenta
                        </td>
                        <td className="right" style={{ color: '#dc2626' }}>
                          {summary.ajusteConciliacion > 0 ? `C$ ${fmt(summary.ajusteConciliacion)}` : '—'}
                        </td>
                        <td className="right" style={{ color: '#059669' }}>
                          {summary.ajusteConciliacion < 0 ? `C$ ${fmt(Math.abs(summary.ajusteConciliacion))}` : '—'}
                        </td>
                        <td className="right" style={{ fontWeight: 800 }}>C$ {fmt(summary.saldoFinal)}</td>
                      </tr>
                    )}

                    <tr className="total-row">
                      <td colSpan={2}>TOTALES DEL PERÍODO / SALDO FINAL</td>
                      <td className="right" style={{ color: '#dc2626' }}>C$ {fmt(summary.periodCargos)}</td>
                      <td className="right" style={{ color: '#059669' }}>C$ {fmt(summary.periodAbonos)}</td>
                      <td className="right" style={{ color: summary.saldoFinal > 0 ? '#b91c1c' : '#059669', fontSize: '0.95rem' }}>
                        C$ {fmt(summary.saldoFinal)}
                      </td>
                    </tr>
                  </tbody>
                </StatementTable>
              )}

              {/* Cuadro de Cuadre Matemático */}
              <ReconcileBox>
                <div className="rec-title">Resumen de Cuadre</div>
                <div className="rec-eq">
                  {mode === 'PENDING' ? (
                    <>
                      <span>Facturas Pendientes (<strong>C$ {fmt(summary.pendingOriginal)}</strong>)</span>
                      <span>−</span>
                      <span>Abonos Parciales (<strong style={{ color: '#059669' }}>C$ {fmt(summary.pendingAbonado)}</strong>)</span>
                      <span>=</span>
                      <span style={{ color: summary.saldoFinal > 0 ? '#b91c1c' : '#059669', fontWeight: 900 }}>
                        SALDO A PAGAR: C$ {fmt(summary.saldoFinal)}
                      </span>
                    </>
                  ) : mode === 'PAID' ? (
                    <>
                      <span>Total Abonado en Periodo (<strong style={{ color: '#059669' }}>C$ {fmt(summary.totalAbonos)}</strong>)</span>
                      <span>·</span>
                      <span style={{ color: summary.saldoFinal > 0 ? '#b91c1c' : '#059669', fontWeight: 900 }}>
                        SALDO PENDIENTE ACTUAL: C$ {fmt(summary.saldoFinal)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Saldo Anterior (<strong>C$ {fmt(summary.openingBalance)}</strong>)</span>
                      <span>+</span>
                      <span>Cargos (<strong style={{ color: '#dc2626' }}>C$ {fmt(summary.periodCargos)}</strong>)</span>
                      <span>−</span>
                      <span>Abonos (<strong style={{ color: '#059669' }}>C$ {fmt(summary.periodAbonos)}</strong>)</span>
                      {summary.ajusteConciliacion && Math.abs(summary.ajusteConciliacion) >= 0.01 && (
                        <>
                          <span>{summary.ajusteConciliacion > 0 ? '+' : '−'}</span>
                          <span>Ajuste (<strong>C$ {fmt(Math.abs(summary.ajusteConciliacion))}</strong>)</span>
                        </>
                      )}
                      <span>=</span>
                      <span style={{ color: summary.saldoFinal > 0 ? '#b91c1c' : '#059669', fontWeight: 900 }}>
                        SALDO FINAL: C$ {fmt(summary.saldoFinal)}
                      </span>
                    </>
                  )}
                </div>
              </ReconcileBox>

              <div style={{ textAlign: 'center', marginTop: '1.15rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.75rem', color: '#64748b' }}>
                Documento informativo generado por <strong>{companyInfo.name}</strong> · Gracias por su preferencia.
              </div>
            </div>
          </DocumentSheet>
        </PreviewCanvas>

        {/* Barra de Acciones: PDF, WhatsApp, Imprimir A4 y Ticket 80mm */}
        <FooterBar>
          <ActionBtn onClick={onClose} $bg="#f1f5f9" $color="#475569" $border="#cbd5e1">
            Cerrar
          </ActionBtn>

          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
            <ActionBtn
              onClick={handleCopyWhatsApp}
              $bg="#ecfdf5"
              $color="#047857"
              $border="#a7f3d0"
              title="Copiar texto formateado para enviar por WhatsApp"
            >
              <FaWhatsapp size={15} /> Copiar WhatsApp
            </ActionBtn>

            <ActionBtn
              onClick={handlePrintThermal80}
              $bg="#f8fafc"
              $color="#1e293b"
              $border="#cbd5e1"
            >
              <FaReceipt /> Ticket 80mm
            </ActionBtn>

            <ActionBtn
              onClick={handlePrintA4}
              $bg="#eff6ff"
              $color="#1d4ed8"
              $border="#bfdbfe"
            >
              <FaPrint /> Imprimir A4
            </ActionBtn>

            <ActionBtn
              onClick={handleDownloadPDF}
              disabled={exportingPdf}
              $bg="linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
              $color="#ffffff"
            >
              <FaFilePdf size={15} /> {exportingPdf ? 'Generando PDF...' : 'Descargar PDF'}
            </ActionBtn>
          </div>
        </FooterBar>
      </ModalCard>
    </Overlay>
  );
};

export default StatementModal;
