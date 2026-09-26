import React, { useState, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { FaPrint, FaWindowClose, FaTruck, FaFileInvoice, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../../context/SettingsContext.jsx';

// ==========================================
// MODAL STYLES
// ==========================================
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: ${props => props.$mode === 'A4' ? '880px' : '460px'};
  width: 98%;
  max-height: 92vh;
  transition: max-width 0.25s ease;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #0f172a;
  color: #ffffff;
  border-bottom: 1px solid #1e293b;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.$active ? '#38bdf8' : '#334155'};
  background: ${props => props.$active ? '#0369a1' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#cbd5e1'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${props => props.$active ? '#0284c7' : '#1e293b'};
    color: #ffffff;
  }
`;

const ActionBtn = styled.button`
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  transition: all 0.15s ease;

  ${props => props.$variant === '80' && `
    background: #2563eb;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
    &:hover { background: #1d4ed8; transform: translateY(-1px); }
  `}

  ${props => props.$variant === 'a4' && `
    background: #0f766e;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(15, 118, 110, 0.35);
    &:hover { background: #115e59; transform: translateY(-1px); }
  `}

  ${props => props.$close && `
    background: #334155;
    color: #cbd5e1;
    &:hover { background: #ef4444; color: #ffffff; }
  `}
`;

const PreviewScrollArea = styled.div`
  padding: 1.25rem;
  background: #e2e8f0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  flex: 1;
`;

// ==========================================
// PREVIEW WRAPPER (SCREEN)
// ==========================================
const ScreenPreviewWrapper = styled.div`
  background: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  color: #000;
  margin: 0 auto;

  ${props => props.$mode === '80' ? css`
    width: 310px;
    padding: 12px 10px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
  ` : css`
    width: 100%;
    max-width: 800px;
    padding: 24px 30px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9.5pt;
  `}
`;

// ==========================================
// HELPER FORMATTERS
// ==========================================
const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

const formatDateTime = (val) => {
  if (!val) return 'N/A';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const datePart = d.toLocaleDateString('es-NI', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timePart = d.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return `${datePart} ${timePart}`;
  } catch {
    return String(val);
  }
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const OutflowTicketModal = ({ isOpen, onClose, transaction }) => {
  const { settings } = useSettings();
  const [previewMode, setPreviewMode] = useState('A4'); // 'A4' o '80'

  // Resolver URL del logo
  const logoUrl = useMemo(() => {
    if (!settings?.empresa_logo_url) return null;
    let cleanUrl = settings.empresa_logo_url;
    if (cleanUrl.startsWith('/uploads')) {
      cleanUrl = '/api' + cleanUrl;
    } else if (cleanUrl.startsWith('uploads')) {
      cleanUrl = '/api/' + cleanUrl;
    }
    const base = (import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com/api').replace(/\/api$/, '');
    let finalUrl = cleanUrl.startsWith('http') ? cleanUrl : `${base}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
    if (!finalUrl.includes('?t=')) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + `t=${Date.now()}`;
    }
    return finalUrl;
  }, [settings?.empresa_logo_url]);

  const companyInfo = useMemo(() => ({
    name: settings?.empresa_nombre || 'Multirepuestos RG',
    ruc: settings?.empresa_ruc || '1211812770001E',
    phone: settings?.empresa_telefono || '84031936 / 84058142',
    address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    slogan: settings?.empresa_eslogan || 'Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.',
    logo: logoUrl || new URL('/icons/logo.png', window.location.origin).toString()
  }), [settings, logoUrl]);

  if (!isOpen || !transaction) return null;

  const isQuote = Boolean(transaction.isQuote || transaction.tipo === 'COTIZACION');
  const items = Array.isArray(transaction.items) ? transaction.items : [];
  const totalItemsCount = transaction.totalItems ?? transaction.total_items ?? items.reduce((acc, it) => acc + Number(it.quantity || it.cantidad || 0), 0);
  const totalCosto = Number(transaction.totalCosto ?? transaction.total_costo ?? items.reduce((acc, it) => acc + (Number(it.cost || it.costo || 0) * Number(it.quantity || it.cantidad || 0)), 0));
  const totalVenta = Number(transaction.totalVenta ?? transaction.total_venta ?? items.reduce((acc, it) => acc + (Number(it.unit || it.precio || 0) * Number(it.quantity || it.cantidad || 0)), 0));
  const operatorName = transaction.usuarioNombre || transaction.usuario_nombre || 'Personal';
  const motivoDestino = transaction.clienteNombre?.replace('MOTIVO: ', '') || transaction.motivo || 'Traslado de Inventario';
  const documentNumber = transaction.id || (transaction.outflowId ? `TR-${transaction.outflowId}` : 'TR-00');
  const formattedDate = formatDateTime(transaction.fecha || transaction.created_at || new Date());
  const footerNote = settings?.ticket_transfer_footer || 'Salida de Inventario autorizada debidamente en sistema.';

  // ==========================================
  // FUNCIÓN DE IMPRESIÓN PROFESIONAL
  // ==========================================
  const doPrint = (mode = 'A4') => {
    const isModeA4 = mode === 'A4';

    // Generación limpia de HTML independiente para evitar cualquier choque de estilos
    const printHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${isQuote ? 'Cotización' : 'Comprobante de Traslado'} - ${documentNumber}</title>
  <style>
    @charset "UTF-8";
    @page {
      size: ${isModeA4 ? 'letter portrait' : '80mm auto'};
      margin: ${isModeA4 ? '12mm 14mm' : '3mm 2mm'};
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #000000;
      font-family: ${isModeA4 ? "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" : "'Consolas', 'Courier New', monospace"};
    }

    /* ===================================================
       ESTILOS PARA FORMATO A4 / CARTA (DOCUMENTO OFICIAL)
       =================================================== */
    ${isModeA4 ? `
      .doc-container {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0;
        font-size: 9pt;
        color: #1e293b;
      }
      
      /* Header Oficial */
      .header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
        border-bottom: 2.5px solid #0f172a;
        padding-bottom: 12px;
      }
      .header-table td {
        vertical-align: middle;
      }
      .logo-cell {
        width: 150px;
      }
      .logo-img {
        max-width: 140px;
        max-height: 80px;
        object-fit: contain;
        display: block;
      }
      .company-cell {
        text-align: right;
      }
      .company-title {
        font-size: 19pt;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 3px 0;
        letter-spacing: -0.5px;
      }
      .company-slogan {
        font-size: 8.5pt;
        color: #475569;
        font-style: italic;
        margin: 0 0 4px 0;
      }
      .company-meta {
        font-size: 8.5pt;
        color: #334155;
        line-height: 1.35;
      }
      .company-meta strong {
        color: #0f172a;
      }

      /* Barra de Título del Documento */
      .doc-title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 8px 14px;
        margin-bottom: 16px;
      }
      .doc-title-badge {
        font-size: 11pt;
        font-weight: 800;
        color: #0f172a;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .doc-folio {
        font-size: 12pt;
        font-weight: 900;
        color: #0369a1;
        font-family: 'Consolas', monospace;
      }

      /* Datos Generales (Card 2 columnas) */
      .meta-grid {
        display: table;
        width: 100%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        margin-bottom: 18px;
        border-collapse: separate;
        border-spacing: 0;
      }
      .meta-row {
        display: table-row;
      }
      .meta-col {
        display: table-cell;
        width: 50%;
        padding: 10px 14px;
        vertical-align: top;
      }
      .meta-col:first-child {
        border-right: 1px solid #e2e8f0;
      }
      .meta-item {
        margin: 4px 0;
        font-size: 9pt;
        display: flex;
        align-items: baseline;
      }
      .meta-label {
        font-weight: 700;
        color: #475569;
        width: 125px;
        flex-shrink: 0;
      }
      .meta-value {
        color: #0f172a;
        font-weight: 600;
        flex: 1;
      }

      /* Tabla de Productos */
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        page-break-inside: auto;
      }
      .items-table th {
        background: #0f172a;
        color: #ffffff;
        padding: 8px 10px;
        font-size: 8pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: 1px solid #0f172a;
      }
      .items-table td {
        padding: 7px 10px;
        font-size: 9pt;
        border-bottom: 1px solid #e2e8f0;
        border-left: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
        color: #1e293b;
      }
      .items-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      .items-table tbody tr:nth-child(even) {
        background-color: #f8fafc;
      }
      .col-qty { width: 8%; text-align: center; font-weight: 800; color: #0f172a; }
      .col-code { width: 14%; font-family: 'Consolas', monospace; font-size: 8.5pt; color: #475569; }
      .col-desc { width: ${isQuote ? '50%' : '38%'}; font-weight: 600; color: #0f172a; }
      .col-cost { width: 13%; text-align: right; font-variant-numeric: tabular-nums; }
      .col-price { width: 13%; text-align: right; font-variant-numeric: tabular-nums; }
      .col-subtotal { width: 14%; text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f172a; }

      /* Resumen y Totales */
      .summary-section {
        display: table;
        width: 100%;
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      .summary-left {
        display: table-cell;
        vertical-align: top;
        width: 55%;
        padding-right: 20px;
      }
      .items-count-box {
        background: #f1f5f9;
        border-left: 4px solid #0284c7;
        padding: 10px 14px;
        border-radius: 0 6px 6px 0;
        font-size: 9pt;
        color: #334155;
      }
      .items-count-box strong {
        color: #0f172a;
        font-size: 10pt;
      }
      .summary-right {
        display: table-cell;
        vertical-align: top;
        width: 45%;
      }
      .totals-box {
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        padding: 12px 16px;
      }
      .totals-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4px 0;
        font-size: 9pt;
        color: #475569;
      }
      .totals-line.highlight {
        border-top: 1.5px solid #0f172a;
        margin-top: 8px;
        padding-top: 8px;
        font-size: 12pt;
        font-weight: 900;
        color: #0f172a;
      }
      .totals-line.highlight .val {
        color: #0284c7;
      }

      /* Firmas de Autorización */
      .signatures-container {
        width: 100%;
        margin-top: 50px;
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .signatures-table {
        width: 100%;
        border-collapse: collapse;
      }
      .signatures-table td {
        width: 50%;
        text-align: center;
        vertical-align: top;
        padding: 0 35px;
      }
      .sig-line {
        border-top: 1.5px solid #475569;
        padding-top: 6px;
      }
      .sig-name {
        font-size: 9.5pt;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
      }
      .sig-title {
        font-size: 8pt;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        margin-top: 2px;
      }
      .sig-sub {
        font-size: 7.5pt;
        color: #94a3b8;
      }

      /* Footer */
      .doc-footer {
        border-top: 1px dashed #cbd5e1;
        margin-top: 20px;
        padding-top: 10px;
        text-align: center;
        font-size: 8pt;
        color: #64748b;
        page-break-inside: avoid;
      }
    ` : `
      /* ===================================================
         ESTILOS PARA TICKET TÉRMICO 80MM (PUNTO DE VENTA)
         =================================================== */
      .doc-container {
        width: 74mm;
        margin: 0 auto;
        padding: 2mm 0;
        font-size: 8pt;
        line-height: 1.25;
      }
      .center { text-align: center; }
      .bold { font-weight: bold; }
      .dashed-sep {
        border-top: 1px dashed #000;
        margin: 6px 0;
      }
      .double-sep {
        border-top: 2px solid #000;
        margin: 6px 0;
      }

      .ticket-logo {
        max-width: 48mm;
        max-height: 25mm;
        margin: 0 auto 4px;
        display: block;
        object-fit: contain;
      }
      .ticket-header h1 {
        font-size: 11pt;
        margin: 2px 0;
        font-weight: 900;
      }
      .ticket-header p {
        margin: 1px 0;
        font-size: 7pt;
      }
      .ticket-badge {
        display: inline-block;
        border: 1.5px solid #000;
        padding: 3px 6px;
        font-weight: 900;
        font-size: 8pt;
        margin: 4px 0;
      }

      /* Meta Info 80mm */
      .t-meta-row {
        display: flex;
        justify-content: space-between;
        margin: 2px 0;
        font-size: 7.5pt;
      }
      .t-meta-label { font-weight: bold; }
      .t-meta-val { text-align: right; max-width: 62%; word-break: break-word; }

      /* Tabla Items 80mm */
      .t-items-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 7.5pt;
        margin: 4px 0;
      }
      .t-items-table th {
        border-bottom: 1.5px solid #000;
        padding: 3px 1px;
        text-align: left;
        font-weight: 900;
        font-size: 7pt;
      }
      .t-items-table td {
        padding: 3px 1px;
        vertical-align: top;
      }
      .t-col-qty { width: 12%; text-align: center; font-weight: bold; }
      .t-col-desc { width: 50%; }
      .t-col-price { width: 18%; text-align: right; }
      .t-col-total { width: 20%; text-align: right; font-weight: bold; }
      .t-subcode { font-size: 6.5pt; color: #222; display: block; }

      /* Totales 80mm */
      .t-totals-row {
        display: flex;
        justify-content: space-between;
        margin: 3px 0;
        font-size: 8pt;
      }
      .t-totals-grand {
        display: flex;
        justify-content: space-between;
        font-size: 10pt;
        font-weight: 900;
        border-top: 1.5px solid #000;
        border-bottom: 1.5px solid #000;
        padding: 4px 0;
        margin: 4px 0;
      }

      /* Firmas 80mm */
      .t-sign-area {
        margin-top: 16px;
        text-align: center;
        font-size: 7pt;
      }
      .t-sign-line {
        border-top: 1px solid #000;
        width: 80%;
        margin: 18px auto 2px;
      }
      .t-footer {
        text-align: center;
        font-size: 6.8pt;
        margin-top: 10px;
        color: #333;
      }
    `}
  </style>
</head>
<body>
  <div class="doc-container">
    ${isModeA4 ? `
      <!-- ENCABEZADO A4 -->
      <table class="header-table">
        <tr>
          <td class="logo-cell">
            <img src="${companyInfo.logo}" alt="Logo" class="logo-img" onerror="this.src='/icons/logo.png';" />
          </td>
          <td class="company-cell">
            <h1 class="company-title">${companyInfo.name}</h1>
            <p class="company-slogan">${companyInfo.slogan}</p>
            <div class="company-meta">
              <strong>RUC:</strong> ${companyInfo.ruc} &nbsp;|&nbsp; <strong>Tel:</strong> ${companyInfo.phone}<br/>
              ${companyInfo.address}
            </div>
          </td>
        </tr>
      </table>

      <!-- BARRA TÍTULO -->
      <div class="doc-title-bar">
        <span class="doc-title-badge">
          ${isQuote ? 'COTIZACIÓN DE PRODUCTOS' : 'COMPROBANTE DE TRASLADO / SALIDA DE INVENTARIO'}
        </span>
        <span class="doc-folio">N° ${documentNumber}</span>
      </div>

      <!-- METADATOS -->
      <div class="meta-grid">
        <div class="meta-row">
          <div class="meta-col">
            <div class="meta-item">
              <span class="meta-label">Fecha y Hora:</span>
              <span class="meta-value">${formattedDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">N° Documento:</span>
              <span class="meta-value" style="font-family: monospace; font-weight: 800;">${documentNumber}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Tipo Operación:</span>
              <span class="meta-value">${isQuote ? 'Cotización Formal' : 'Salida de Bodega / Traslado'}</span>
            </div>
          </div>
          <div class="meta-col">
            <div class="meta-item">
              <span class="meta-label">${isQuote ? 'Cliente Solicitante:' : 'Motivo / Destino:'}</span>
              <span class="meta-value" style="color: #0369a1;">${motivoDestino}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isQuote ? 'Cotizado por:' : 'Responsable / Emisor:'}</span>
              <span class="meta-value">${operatorName}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Estado:</span>
              <span class="meta-value" style="color: #16a34a;">Registrado</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLA DE PRODUCTOS A4 -->
      <table class="items-table">
        <thead>
          <tr>
            <th class="col-qty">CANT</th>
            <th class="col-code">CÓDIGO</th>
            <th class="col-desc">DESCRIPCIÓN DEL ARTÍCULO</th>
            ${!isQuote ? '<th class="col-cost">COSTO U.</th>' : ''}
            <th class="col-price">P. VENTA</th>
            <th class="col-subtotal">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((it, idx) => `
            <tr>
              <td class="col-qty">${it.quantity || it.cantidad || 1}</td>
              <td class="col-code">${it.codigo || it.code || '-'}</td>
              <td class="col-desc">${it.nombre || it.descripcion || 'Producto'}</td>
              ${!isQuote ? `<td class="col-cost">C$ ${fmt(it.cost || it.costo || 0)}</td>` : ''}
              <td class="col-price">C$ ${fmt(it.unit || it.precio || 0)}</td>
              <td class="col-subtotal">C$ ${fmt((it.quantity || it.cantidad || 1) * (it.unit || it.precio || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- TOTALES A4 -->
      <div class="summary-section">
        <div class="summary-left">
          <div class="items-count-box">
            <strong>Artículos en Documento:</strong> ${totalItemsCount} ${totalItemsCount === 1 ? 'unidad' : 'unidades'}<br/>
            <span style="font-size: 8pt; color: #64748b;">Verifique el detalle físico con las cantidades plasmadas.</span>
          </div>
        </div>
        <div class="summary-right">
          <div class="totals-box">
            ${!isQuote ? `
              <div class="totals-line">
                <span>COSTO TOTAL (INTERNO):</span>
                <span style="font-weight: 700; font-family: monospace;">C$ ${fmt(totalCosto)}</span>
              </div>
            ` : ''}
            <div class="totals-line highlight">
              <span>${isQuote ? 'TOTAL COTIZADO:' : 'TOTAL VALORIZADO:'}</span>
              <span class="val">C$ ${fmt(totalVenta)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FIRMAS A4 -->
      <div class="signatures-container">
        <table class="signatures-table">
          <tr>
            <td>
              <div class="sig-line">
                <p class="sig-name">${operatorName}</p>
                <div class="sig-title">Entregado Por (Emisor)</div>
                <div class="sig-sub">Firma y Sello Autorizado</div>
              </div>
            </td>
            <td>
              <div class="sig-line">
                <p class="sig-name">Firma / Sello Recipiente</p>
                <div class="sig-title">Recibido Por (Destino)</div>
                <div class="sig-sub">Nombre, Cédula y Conformidad</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- FOOTER A4 -->
      <div class="doc-footer">
        <p style="margin: 2px 0; font-weight: 600;">${footerNote}</p>
        <p style="margin: 2px 0; font-size: 7.5pt; color: #94a3b8;">
          Documento administrativo generado por Multirepuestos RG POS &bull; Fecha de impresión: ${new Date().toLocaleString('es-NI')}
        </p>
      </div>
    ` : `
      <!-- ENCABEZADO 80MM -->
      <div class="ticket-header center">
        <img src="${companyInfo.logo}" alt="Logo" class="ticket-logo" onerror="this.src='/icons/logo.png';" />
        <h1>${companyInfo.name}</h1>
        <p class="bold">${companyInfo.slogan}</p>
        <p>RUC: ${companyInfo.ruc}</p>
        <p>Tel: ${companyInfo.phone}</p>
        <p>${companyInfo.address}</p>
        <div>
          <span class="ticket-badge">${isQuote ? 'COTIZACIÓN' : 'TRASLADO / SALIDA'}</span>
        </div>
      </div>

      <div class="dashed-sep"></div>

      <!-- METADATOS 80MM -->
      <div class="t-meta-row">
        <span class="t-meta-label">No. Doc:</span>
        <span class="t-meta-val bold">${documentNumber}</span>
      </div>
      <div class="t-meta-row">
        <span class="t-meta-label">Fecha:</span>
        <span class="t-meta-val">${formattedDate}</span>
      </div>
      <div class="t-meta-row">
        <span class="t-meta-label">${isQuote ? 'Cliente:' : 'Motivo:'}</span>
        <span class="t-meta-val">${motivoDestino}</span>
      </div>
      <div class="t-meta-row">
        <span class="t-meta-label">Por:</span>
        <span class="t-meta-val">${operatorName}</span>
      </div>

      <div class="dashed-sep"></div>

      <!-- TABLA ITEMS 80MM -->
      <table class="t-items-table">
        <thead>
          <tr>
            <th class="t-col-qty">CANT</th>
            <th class="t-col-desc">DESCRIPCIÓN</th>
            <th class="t-col-price">P.UNIT</th>
            <th class="t-col-total">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((it) => `
            <tr>
              <td class="t-col-qty">${it.quantity || it.cantidad || 1}</td>
              <td class="t-col-desc">
                ${it.nombre || it.descripcion || 'Producto'}
                <span class="t-subcode">Cód: ${it.codigo || '-'} ${!isQuote ? `| Costo: C$${fmt(it.cost || it.costo || 0)}` : ''}</span>
              </td>
              <td class="t-col-price">${fmt(it.unit || it.precio || 0)}</td>
              <td class="t-col-total">${fmt((it.quantity || it.cantidad || 1) * (it.unit || it.precio || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="dashed-sep"></div>

      <!-- TOTALES 80MM -->
      <div class="t-totals-row">
        <span>Items Totales:</span>
        <span class="bold">${totalItemsCount}</span>
      </div>
      ${!isQuote ? `
        <div class="t-totals-row">
          <span>COSTO TOTAL:</span>
          <span class="bold">C$ ${fmt(totalCosto)}</span>
        </div>
      ` : ''}
      <div class="t-totals-grand">
        <span>${isQuote ? 'TOTAL COTIZADO:' : 'TOTAL VALORIZADO:'}</span>
        <span>C$ ${fmt(totalVenta)}</span>
      </div>

      <!-- FIRMAS 80MM -->
      <div class="t-sign-area">
        <div class="t-sign-line"></div>
        <p style="margin: 0; font-weight: bold;">${operatorName}</p>
        <p style="margin: 0; color: #555;">Entregado Por (Emisor)</p>

        <div class="t-sign-line" style="margin-top: 22px;"></div>
        <p style="margin: 0; font-weight: bold;">Firma / Sello</p>
        <p style="margin: 0; color: #555;">Recibido Por (Destino)</p>
      </div>

      <div class="t-footer">
        <p style="margin: 2px 0;">${footerNote}</p>
        <p style="margin: 2px 0;">Multirepuestos RG POS</p>
      </div>
    `}
  </div>
</body>
</html>
    `;

    const printWin = window.open('', '_blank', `width=${isModeA4 ? 960 : 440},height=750`);
    if (!printWin) {
      alert('Por favor habilite las ventanas emergentes (pop-ups) en su navegador para poder imprimir.');
      return;
    }

    printWin.document.open();
    printWin.document.write(printHtml);
    printWin.document.close();
    printWin.focus();

    // Trigger de impresión confiable
    setTimeout(() => {
      try {
        printWin.print();
      } catch (err) {
        console.error('Error al imprimir comprobante:', err);
      }
      setTimeout(() => {
        try {
          printWin.close();
        } catch {
          // ignore
        }
      }, 1200);
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContainer
            $mode={previewMode}
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            {/* BARRA SUPERIOR */}
            <HeaderBar>
              <h3>
                {isQuote ? <FaFileInvoice /> : <FaTruck />}
                <span>{isQuote ? 'Cotización Formal' : 'Comprobante de Traslado'}</span>
              </h3>

              <HeaderActions>
                {/* Selector de vista previa */}
                <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '8px' }}>
                  <TabButton
                    type="button"
                    $active={previewMode === 'A4'}
                    onClick={() => setPreviewMode('A4')}
                    title="Vista formato Carta / A4"
                  >
                    <FaFileInvoice size={12} /> Carta A4
                  </TabButton>
                  <TabButton
                    type="button"
                    $active={previewMode === '80'}
                    onClick={() => setPreviewMode('80')}
                    title="Vista ticket térmico 80mm"
                  >
                    <FaPrint size={12} /> Ticket 80mm
                  </TabButton>
                </div>

                {/* Botones de acción directa */}
                <ActionBtn
                  type="button"
                  $variant="a4"
                  onClick={() => doPrint('A4')}
                  title="Imprimir en hoja A4 / Carta"
                >
                  <FaPrint /> Imprimir A4
                </ActionBtn>

                <ActionBtn
                  type="button"
                  $variant="80"
                  onClick={() => doPrint('80')}
                  title="Imprimir en impresora térmica 80mm"
                >
                  <FaPrint /> Imprimir 80mm
                </ActionBtn>

                <ActionBtn type="button" $close onClick={onClose} title="Cerrar ventana">
                  <FaWindowClose size={14} />
                </ActionBtn>
              </HeaderActions>
            </HeaderBar>

            {/* ÁREA DE PREVISUALIZACIÓN */}
            <PreviewScrollArea>
              <ScreenPreviewWrapper $mode={previewMode}>
                {previewMode === 'A4' ? (
                  /* ================= VISTA PREVIA A4 ================= */
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #0f172a', paddingBottom: '12px', marginBottom: '14px' }}>
                      <div style={{ width: '140px' }}>
                        <img
                          src={companyInfo.logo}
                          alt="Logo"
                          style={{ maxWidth: '135px', maxHeight: '75px', objectFit: 'contain', display: 'block' }}
                          onError={(e) => { e.currentTarget.src = '/icons/logo.png'; }}
                        />
                      </div>
                      <div style={{ textAlign: 'right', flex: 1, paddingLeft: '20px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>{companyInfo.name}</h2>
                        <p style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', margin: '0 0 3px 0' }}>{companyInfo.slogan}</p>
                        <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                          <strong>RUC:</strong> {companyInfo.ruc} &nbsp;|&nbsp; <strong>Tel:</strong> {companyInfo.phone}<br />
                          {companyInfo.address}
                        </div>
                      </div>
                    </div>

                    {/* Barra de título */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 14px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                        {isQuote ? 'COTIZACIÓN DE PRODUCTOS' : 'COMPROBANTE DE TRASLADO / SALIDA DE INVENTARIO'}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0369a1', fontFamily: 'monospace' }}>
                        N° {documentNumber}
                      </span>
                    </div>

                    {/* Metadata Card */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.86rem' }}>
                      <div>
                        <div style={{ margin: '3px 0' }}><span style={{ fontWeight: 700, color: '#475569', width: '115px', display: 'inline-block' }}>Fecha y Hora:</span> <span style={{ fontWeight: 600, color: '#0f172a' }}>{formattedDate}</span></div>
                        <div style={{ margin: '3px 0' }}><span style={{ fontWeight: 700, color: '#475569', width: '115px', display: 'inline-block' }}>N° Documento:</span> <span style={{ fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>{documentNumber}</span></div>
                        <div style={{ margin: '3px 0' }}><span style={{ fontWeight: 700, color: '#475569', width: '115px', display: 'inline-block' }}>Operación:</span> <span style={{ fontWeight: 600, color: '#0f172a' }}>{isQuote ? 'Cotización' : 'Traslado / Salida'}</span></div>
                      </div>
                      <div>
                        <div style={{ margin: '3px 0' }}><span style={{ fontWeight: 700, color: '#475569', width: '115px', display: 'inline-block' }}>{isQuote ? 'Cliente:' : 'Motivo/Destino:'}</span> <span style={{ fontWeight: 700, color: '#0284c7' }}>{motivoDestino}</span></div>
                        <div style={{ margin: '3px 0' }}><span style={{ fontWeight: 700, color: '#475569', width: '115px', display: 'inline-block' }}>Responsable:</span> <span style={{ fontWeight: 700, color: '#0f172a' }}>{operatorName}</span></div>
                        <div style={{ margin: '3px 0' }}><span style={{ fontWeight: 700, color: '#475569', width: '115px', display: 'inline-block' }}>Estado:</span> <span style={{ fontWeight: 700, color: '#16a34a' }}>Registrado</span></div>
                      </div>
                    </div>

                    {/* Tabla de Productos */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                          <th style={{ padding: '8px', textAlign: 'center', width: '8%', fontSize: '0.78rem' }}>CANT</th>
                          <th style={{ padding: '8px', textAlign: 'left', width: '14%', fontSize: '0.78rem' }}>CÓDIGO</th>
                          <th style={{ padding: '8px', textAlign: 'left', width: isQuote ? '50%' : '38%', fontSize: '0.78rem' }}>DESCRIPCIÓN</th>
                          {!isQuote && <th style={{ padding: '8px', textAlign: 'right', width: '13%', fontSize: '0.78rem' }}>COSTO U.</th>}
                          <th style={{ padding: '8px', textAlign: 'right', width: '13%', fontSize: '0.78rem' }}>P. VENTA</th>
                          <th style={{ padding: '8px', textAlign: 'right', width: '14%', fontSize: '0.78rem' }}>SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700 }}>{it.quantity || it.cantidad || 1}</td>
                            <td style={{ padding: '7px 8px', fontFamily: 'monospace', color: '#475569' }}>{it.codigo || it.code || '-'}</td>
                            <td style={{ padding: '7px 8px', fontWeight: 600, color: '#0f172a' }}>{it.nombre || it.descripcion}</td>
                            {!isQuote && <td style={{ padding: '7px 8px', textAlign: 'right' }}>C$ {fmt(it.cost || it.costo || 0)}</td>}
                            <td style={{ padding: '7px 8px', textAlign: 'right' }}>C$ {fmt(it.unit || it.precio || 0)}</td>
                            <td style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                              C$ {fmt((it.quantity || it.cantidad || 1) * (it.unit || it.precio || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Resumen & Totales */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px', gap: '20px' }}>
                      <div style={{ background: '#f1f5f9', borderLeft: '4px solid #0284c7', padding: '10px 14px', borderRadius: '0 6px 6px 0', fontSize: '0.85rem', color: '#334155' }}>
                        <strong>Artículos en Documento:</strong> {totalItemsCount} {totalItemsCount === 1 ? 'unidad' : 'unidades'}<br />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Verifique el detalle físico con las cantidades plasmadas.</span>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px 18px', minWidth: '280px' }}>
                        {!isQuote && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#475569', marginBottom: '6px' }}>
                            <span>COSTO TOTAL (INTERNO):</span>
                            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>C$ {fmt(totalCosto)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', borderTop: !isQuote ? '1.5px solid #0f172a' : 'none', paddingTop: !isQuote ? '6px' : 0 }}>
                          <span>{isQuote ? 'TOTAL COTIZADO:' : 'TOTAL VALORIZADO:'}</span>
                          <span style={{ color: '#0284c7' }}>C$ {fmt(totalVenta)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Firmas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '45px', marginBottom: '20px', textAlign: 'center' }}>
                      <div>
                        <div style={{ borderTop: '1.5px solid #475569', paddingTop: '6px' }}>
                          <p style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>{operatorName}</p>
                          <small style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Entregado Por (Emisor)</small><br />
                          <small style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Firma y Sello Autorizado</small>
                        </div>
                      </div>
                      <div>
                        <div style={{ borderTop: '1.5px solid #475569', paddingTop: '6px' }}>
                          <p style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>Firma / Sello Recipiente</p>
                          <small style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Recibido Por (Destino)</small><br />
                          <small style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Nombre, Cédula y Conformidad</small>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', textAlign: 'center', fontSize: '0.76rem', color: '#64748b' }}>
                      <p style={{ margin: '2px 0', fontWeight: 600 }}>{footerNote}</p>
                      <p style={{ margin: '2px 0', color: '#94a3b8' }}>Documento administrativo generado por Multirepuestos RG POS</p>
                    </div>
                  </div>
                ) : (
                  /* ================= VISTA PREVIA 80MM ================= */
                  <div style={{ textAlign: 'center' }}>
                    {/* Header */}
                    <img
                      src={companyInfo.logo}
                      alt="Logo"
                      style={{ maxWidth: '140px', maxHeight: '65px', margin: '0 auto 4px', display: 'block', objectFit: 'contain' }}
                      onError={(e) => { e.currentTarget.src = '/icons/logo.png'; }}
                    />
                    <h2 style={{ fontSize: '1rem', fontWeight: 900, margin: '2px 0' }}>{companyInfo.name}</h2>
                    <p style={{ fontSize: '0.7rem', margin: '2px 0', fontWeight: 600 }}>{companyInfo.slogan}</p>
                    <p style={{ fontSize: '0.7rem', margin: '1px 0' }}>RUC: {companyInfo.ruc}</p>
                    <p style={{ fontSize: '0.7rem', margin: '1px 0' }}>Tel: {companyInfo.phone}</p>
                    <p style={{ fontSize: '0.7rem', margin: '1px 0' }}>{companyInfo.address}</p>

                    <div style={{ margin: '6px 0' }}>
                      <span style={{ border: '1.5px solid #000', padding: '2px 8px', fontWeight: 900, fontSize: '0.78rem' }}>
                        {isQuote ? 'COTIZACIÓN' : 'TRASLADO / SALIDA'}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>

                    {/* Meta */}
                    <div style={{ textAlign: 'left', fontSize: '0.75rem', lineHeight: '1.3' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>No. Doc:</span>
                        <span style={{ fontWeight: 800 }}>{documentNumber}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>Fecha:</span>
                        <span>{formattedDate}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>{isQuote ? 'Cliente:' : 'Motivo:'}</span>
                        <span style={{ maxWidth: '65%', textAlign: 'right' }}>{motivoDestino}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>Por:</span>
                        <span>{operatorName}</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>

                    {/* Items */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #000' }}>
                          <th style={{ width: '12%', textAlign: 'center', padding: '2px 0' }}>CANT</th>
                          <th style={{ width: '50%', padding: '2px 0' }}>DESCRIPCIÓN</th>
                          <th style={{ width: '18%', textAlign: 'right', padding: '2px 0' }}>P.U.</th>
                          <th style={{ width: '20%', textAlign: 'right', padding: '2px 0' }}>TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, idx) => (
                          <tr key={idx} style={{ verticalAlign: 'top' }}>
                            <td style={{ textAlign: 'center', fontWeight: 700, padding: '3px 0' }}>{it.quantity || it.cantidad || 1}</td>
                            <td style={{ padding: '3px 0' }}>
                              {it.nombre || it.descripcion}
                              <div style={{ fontSize: '0.65rem', color: '#444' }}>
                                Cód: {it.codigo || '-'} {!isQuote && `| C: C$${fmt(it.cost || it.costo || 0)}`}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', padding: '3px 0' }}>{fmt(it.unit || it.precio || 0)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700, padding: '3px 0' }}>
                              {fmt((it.quantity || it.cantidad || 1) * (it.unit || it.precio || 0))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>

                    {/* Totales */}
                    <div style={{ fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                        <span>Items Totales:</span>
                        <span style={{ fontWeight: 800 }}>{totalItemsCount}</span>
                      </div>
                      {!isQuote && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                          <span>COSTO TOTAL:</span>
                          <span style={{ fontWeight: 800 }}>C$ {fmt(totalCosto)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000', padding: '4px 0', fontSize: '0.95rem', fontWeight: 900 }}>
                        <span>{isQuote ? 'TOTAL COTIZADO:' : 'TOTAL VALORIZADO:'}</span>
                        <span>C$ {fmt(totalVenta)}</span>
                      </div>
                    </div>

                    {/* Firmas 80mm */}
                    <div style={{ marginTop: '16px', fontSize: '0.72rem' }}>
                      <div style={{ borderTop: '1px solid #000', width: '80%', margin: '16px auto 2px' }}></div>
                      <p style={{ margin: 0, fontWeight: 700 }}>{operatorName}</p>
                      <small style={{ color: '#555' }}>Entregado Por (Emisor)</small>

                      <div style={{ borderTop: '1px solid #000', width: '80%', margin: '20px auto 2px' }}></div>
                      <p style={{ margin: 0, fontWeight: 700 }}>Firma / Sello</p>
                      <small style={{ color: '#555' }}>Recibido Por (Destino)</small>
                    </div>

                    <div style={{ marginTop: '12px', fontSize: '0.68rem', color: '#555' }}>
                      <p style={{ margin: '2px 0' }}>{footerNote}</p>
                      <p style={{ margin: '2px 0' }}>Multirepuestos RG POS</p>
                    </div>
                  </div>
                )}
              </ScreenPreviewWrapper>
            </PreviewScrollArea>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default OutflowTicketModal;
