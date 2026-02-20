import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { FaReceipt, FaWindowClose, FaFileInvoice, FaPrint, FaCheckCircle } from 'react-icons/fa';
import styled, { css, createGlobalStyle } from 'styled-components';
import { ModalOverlay, Button, TotalsRow, ModalContent } from '../POS.styles.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useSettings } from '../../../context/SettingsContext.jsx';

/* ========= CANDADO GLOBAL DE IMPRESIÓN ========= */
let __PRINT_LOCK = false;
let __PRINT_KEY = null;
const lockPrintOnce = (key, fn) => {
  if (__PRINT_LOCK && __PRINT_KEY === key) return;
  __PRINT_LOCK = true;
  __PRINT_KEY = key;
  try { fn(); } finally {
    setTimeout(() => { __PRINT_LOCK = false; }, 1500);
  }
};

/* ========= ESTILO GLOBAL (NO usa @import) ========= */
const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 999999 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .no-print { display: none !important; }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;

/* ======================= ESTILOS BASE (vista previa) ======================= */
const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.compact { padding: 8px 6px; }

  /* --- BRAND --- */
  .brand {
    text-align: center;
    border-bottom: 2px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 6px;
  }
  .brand h1 { margin: 6px 0 2px; font-size: 1.4rem; font-weight: 900; color: #000; line-height: 1.25; letter-spacing: 0.5px; }
  .brand small { color: #333; display: block; margin: 2px 0; line-height: 1.35; white-space: normal; word-break: break-word; font-weight: 500; }

  /* --- META --- */
  .meta { font-size: .85rem; margin-bottom: 12px; border-bottom: 1px dashed #ccc; padding-bottom: 8px; }
  .meta p { margin: 3px 0; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2px 8px; font-weight: 400; }
  .meta-label { font-weight: 800; color: #000; }
  .meta-value { font-weight: 500; text-align: right; }

  /* --- ITEMS --- */
  table.items { width: 100%; border-collapse: collapse; font-size: .85rem; table-layout: fixed; }
  table.items th, table.items td { padding: 5px 3px; vertical-align: top; word-wrap: break-word; }
  table.items th { border-bottom: 2px solid #000; font-weight: 900; text-transform: uppercase; font-size: 0.7rem; color: #000; }
  table.items td { font-weight: 500; border-bottom: 1px dotted #ccc; }
  &.compact table.items th, &.compact table.items td { padding: 3px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 12%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  /* --- TOTALS --- */
  .totals { border-top: 2px solid #000; padding-top: 8px; margin-top: 12px; }
  .badge { display: inline-block; font-weight: 900; letter-spacing: .5px; padding: 6px 10px; border: 2px solid #000; border-radius: 4px; margin: 10px auto; text-align: center; color: #000; }
  .thanks { text-align: center; font-size: .8rem; border-top: 1px dashed #333; padding-top: 8px; margin-top: 10px; color: #333; line-height: 1.4; font-weight: 600; }

  /* ====== A4 SPECIFIC LAYOUT ====== */
  &.print-a4 {
    width: 100%;
    max-width: 700px;
    font-family: 'Inter', Helvetica, Arial, sans-serif;
    padding: 30px;
    border-radius: 0;

    .brand {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        border-bottom: 3px solid #1e3a8a;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }
    .brand-logo-container { width: 150px; justify-content: flex-start; }
    .brand-info { text-align: right; max-width: 60%; }
    .brand h1 { font-size: 20pt; color: #1e3a8a; margin-bottom: 5px; font-weight: 900; }
    .brand small { font-size: 9pt; color: #444; margin: 1px 0; font-weight: 500; }
    
    .meta { 
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        border: 1px solid #ddd;
        padding: 15px;
        background: #f8fafc;
        border-radius: 6px;
        margin-bottom: 25px;
    }
    .meta-col { display: flex; flex-direction: column; gap: 5px; }
    .meta-title { font-weight: 900; text-transform: uppercase; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 6px; font-size: 9pt; }
    .meta p { justify-content: flex-start; gap: 8px; border-bottom: none; width: 100%; display: grid; grid-template-columns: 120px 1fr; }
    .meta-label { text-align: left; color: #64748b; font-weight: 600; }
    .meta-value { text-align: left; color: #0f172a; font-weight: 700; }

    table.items th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 9pt; font-weight: 800; }
    table.items td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 10pt; color: #334155; font-weight: 500; }
    .col-qty { width: 10%; }
    .col-unit { width: 15%; }
    .col-total { width: 15%; }
    
    .totals { border-top: none; margin-top: 0; display: flex; justify-content: flex-end; padding-top: 20px; }
    .totals-box { width: 250px; }
    
    .thanks { border-top: none; margin-top: 50px; font-style: italic; color: #94a3b8; }
    
    .footer-sign {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
    }
    .sign-box {
        border-top: 1px solid #94a3b8;
        width: 40%;
        text-align: center;
        padding-top: 10px;
        color: #64748b;
        font-size: 9pt;
    }
  }

  @media print {
    &.print-80 {
      width: 80mm !important;
      font-family: 'Consolas', monospace !important;
      padding: 6px 4px !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 8pt;
    }
    &.print-a4 {
      width: 190mm !important;
      font-size: 10pt !important;
      padding: 10mm !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      max-height: 277mm !important;
      overflow: hidden !important;
      font-family: 'Inter', Helvetica, Arial, sans-serif !important;
    }
    &.compact { font-size: 7.5pt; }
  }
`;

const Wrapper = styled.div`
  display: flex; flex-direction: column; gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 65vh;
  }
`;

const TicketLogo = styled.img`
  max-width: 140px;
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  object-fit: contain;

  &.logo-80mm {
    max-width: 120px;
    margin: 0 auto;
  }
  &.logo-a4 {
    max-width: 130px;
    margin: 0;
  }
`;

const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 900; letter-spacing: .5px; padding: 5px 10px; border-radius: 4px;
  font-size: 0.85rem;
  ${({ $type }) => $type === 'proforma' && css`background: #e8f4ff; color: #0b72b9; border: 2px solid #0b72b9;`}
  ${({ $type }) => $type === 'abono' && css`background: #fff3cd; color: #856404; border: 2px solid #856404;`}
  ${({ $type }) => $type === 'venta' && css`background: #e8f7ee; color: #1c7d3a; border: 2px solid #1c7d3a;`}
  ${({ $type }) => $type === 'outflow' && css`background: #fee2e2; color: #991b1b; border: 2px solid #991b1b;`}
  ${({ $type }) => $type === 'pro' && css`background: #f3e8ff; color: #8b5cf6; border: 2px solid #8b5cf6;`}
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: .75rem;
  flex-wrap: wrap; gap: 8px;

  h2 { font-size: 1.1rem; }

  @media (max-width: 600px) {
    flex-direction: column; align-items: stretch;
    h2 { font-size: 1rem; }
  }
`;

const ActionButtons = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
  
  @media (max-width: 600px) {
    justify-content: stretch;
    button { flex: 1; font-size: 0.85rem; padding: 10px 8px; }
  }
`;

const ResponsiveModalContent = styled(ModalContent)`
  max-width: 540px;
  width: 96%;
  padding: 1.2rem;
  background: #fff;
  max-height: 95vh;
  overflow-y: auto;

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    border-radius: 12px 12px 0 0;
    padding: 1rem;
    max-height: 92vh;
  }
`;

/* ======================= HELPERS ======================= */
const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));
const coalesce = (...vals) => vals.find(v => v !== undefined && v !== null);

const extractName = (u) =>
  coalesce(
    u?.usuarioNombre,
    u?.nombre_usuario,
    u?.nombre,
    u?.name,
    u?.displayName,
    u?.fullName,
    u?.username,
    null
  );

function normalizeItems(itemsRaw = []) {
  return itemsRaw.map((it, idx) => {
    const quantity = Number(coalesce(it.quantity, it.cantidad, it.qty, 0));
    const nombre = coalesce(it.nombre, it.descripcion, it.description, it.producto, `Item ${idx + 1}`);
    const unit = Number(coalesce(it.precio_unitario, it.precio_venta, it.precio, it.unitPrice, 0));
    const id = coalesce(it.id_producto, it.id, `it-${idx}`);
    return { id, nombre, quantity, unit, total: quantity * unit };
  });
}

function labelMetodoPago(pd = {}) {
  const eff = Number(pd.efectivo || 0);
  const tar = Number(pd.tarjeta || 0);
  const trf = Number(pd.transferencia || 0);
  const usd = Number(pd.dolares || 0);
  const cred = Number(pd.credito || 0);
  if (cred > 0) return 'Crédito';
  const methods = [];
  if (eff > 0) methods.push('Efectivo');
  if (tar > 0) methods.push('Tarjeta');
  if (trf > 0) methods.push('Transferencia');
  if (usd > 0) methods.push('Dólares');
  if (methods.length === 0) return 'Contado';
  if (methods.length === 1) return methods[0];
  return 'Mixto';
}

function montoPagado(pd = {}, fallback = 0) {
  const efectivo = Number(pd.efectivo || 0);
  const tarjeta = Number(pd.tarjeta || 0);
  const transferencia = Number(pd.transferencia || 0);
  const otro = Number(pd.otro || 0);
  const dolaresMonto = Number(pd.dolares || 0);
  const tasa = Number(pd.tasaDolarAlMomento || pd.tasaObtenida || 1);
  const dolaresConvertido = dolaresMonto * (tasa > 1 ? tasa : 1);
  const totalCalculado = efectivo + tarjeta + transferencia + otro + dolaresConvertido;
  return totalCalculado > 0 ? totalCalculado : Number(pd.montoRecibido || fallback || 0);
}

function toDateString(maybeDate) {
  const src = coalesce(maybeDate?.fecha, maybeDate?.createdAt, maybeDate?.created_at, maybeDate?.date, maybeDate);
  try {
    const d = new Date(src);
    return isNaN(d) ? 'Fecha inválida' : d.toLocaleString('es-NI', { hour12: true });
  } catch { return 'Fecha inválida'; }
}

function ensureProformaId(tx) {
  const n = coalesce(tx.proformaId, tx.proformaNumero, tx.numeroProforma, tx.id);
  if (n) return n;
  const now = new Date();
  const fecha = now.toISOString().slice(2, 10).replace(/-/g, '');
  const hora = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return `PF-${fecha}-${hora}`;
}

/* ======================= COMPONENTE ======================= */
const TicketModal = ({
  transaction,
  onClose,
  clients = [],
  users = [],
  isOpen = true,
  printMode = '80',
  currentUser = null,
  onPersistPrint = null,
  autoTriggerPrint = false,
  showAlert = null,
}) => {
  const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });
  const { settings } = useSettings();

  if (!isOpen || transaction == null) return null;

  const [resolved] = React.useState(typeof transaction === 'object' ? transaction : null);
  const [loading] = React.useState(false);
  const [error] = React.useState(null);

  if (loading || error || !resolved) {
    return (
      <ModalOverlay className="no-print">
        <ResponsiveModalContent className="no-print" style={{ maxWidth: 420, padding: '1rem' }}>
          <h3 style={{ color: '#dc3545' }}>No se pudo imprimir</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <Button onClick={onClose} $cancel><FaWindowClose /> Cerrar</Button>
          </div>
        </ResponsiveModalContent>
      </ModalOverlay>
    );
  }

  // ====== Datos listos ======
  const tx = resolved;
  const isAbono = tx.estado === 'ABONO_CREDITO';
  const isProforma = Boolean(tx.isProforma || tx.proformaFor || tx.proformaNombre);
  const isOutflow = Boolean(tx.isOutflow);
  const isDevol = tx.estado === 'DEVOLUCION';

  const ticketId = isProforma ? ensureProformaId(tx) : coalesce(tx.id, tx.saleId, tx.numero, '-');
  const fechaStr = toDateString(coalesce(tx.fecha, tx.createdAt, tx.date));

  const clientId = coalesce(tx.clientId, tx.idCliente, tx.clienteId);
  const clienteObj = clients.find(c => String(c.id_cliente ?? c.id) === String(clientId));
  const clientName = isProforma && tx.proformaNombre
    ? tx.proformaNombre
    : coalesce(clienteObj?.nombre, tx.clienteNombre, 'Consumidor Final');

  const clienteCedula = clienteObj?.cedula || tx.clienteCedula;

  const userId =
    coalesce(tx.userId, tx.idUsuario, tx.openedBy?.id) ??
    currentUser?.id_usuario ?? currentUser?.id ?? currentUser?.uid ??
    authUser?.id_usuario ?? authUser?.id ?? authUser?.uid;

  const fromLS = (() => {
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); }
    catch { return null; }
  })();

  const userObj = users.find(u =>
    String(u.id_usuario || u.id || u.uid) === String(userId)
  );

  const resolvedUserName = coalesce(
    tx.usuarioNombre,
    extractName(userObj),
    extractName(currentUser),
    extractName(authUser),
    extractName(fromLS),
    'Cajero POS'
  );

  const printedByName = isProforma
    ? coalesce(tx.usuarioNombre, extractName(currentUser), extractName(authUser), extractName(fromLS), resolvedUserName)
    : resolvedUserName;

  const items = normalizeItems(coalesce(tx.items, tx.detalle, []));
  const subtotalCalc = items.reduce((s, it) => s + Number(it.unit) * Number(it.quantity), 0);
  const subtotal = Number(coalesce(tx.subtotal, subtotalCalc));
  const descuento = Number(coalesce(tx.descuento, 0));
  const total = Number(coalesce(tx.totalVenta, tx.total_venta, subtotal - descuento, 0));

  const pd = tx.pagoDetalles || {};
  const metodo = (isProforma || isOutflow) ? 'N/A' : coalesce(tx.metodoPago, labelMetodoPago(pd));
  const pagado = (isProforma || isOutflow) ? 0 : montoPagado(pd, total);
  const cambio = (isProforma || isOutflow) ? 0 : Math.max(0, pagado - total);

  const abonoMonto = Math.abs(Number(coalesce(tx.totalVenta, tx.montoAbono, 0)));
  const nuevoSaldo = Number(clienteObj?.saldo_pendiente || 0);
  const saldoAnterior = nuevoSaldo + abonoMonto;
  const compact = items.length <= 2;

  // ====== Uso de Configuración Dinámica ======
  const companyInfo = {
    name: settings?.empresa_nombre || 'Multirepuestos RG',
    ruc: settings?.empresa_ruc || '1211812770001E',
    phone: settings?.empresa_telefono || '84031936 / 84058142',
    address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    slogan: settings?.empresa_eslogan || 'Repuestos de confianza al mejor precio',
    logo: logoUrl || new URL('/icons/logo.png', window.location.origin).toString()
  };

  // ====== Persistencia de quién imprimió ======
  const persistPrintedMeta = React.useCallback(async (mode) => {
    /* ...same as before... */
  }, []);

  // ====== Impresión centralizada (A4/80 mm) ======
  const doPrint = React.useCallback((mode = '80', autoCloseAfter = false) => {
    const node = document.getElementById('print-wrapper-ticket');
    if (!node) return;
    const htmlToPrint = node.outerHTML;

    const printStyles = `
      @charset "UTF-8";
      @page { size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'}; margin: ${mode === 'A4' ? '12mm' : '0'}; }
      html, body { background: #fff; margin: 0 !important; padding: 0 !important; font-family: ${mode === 'A4' ? "'Inter', Helvetica, Arial, sans-serif" : "'Consolas', monospace"}; color: #000 !important; }
      
      #print-wrapper-ticket {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        ${mode === 'A4'
        ? `width: 100% !important; padding: 0 !important; font-size: 10pt !important;`
        : `width: 80mm !important; padding: 6px 4px !important; font-size: 8pt !important;`
      }
      }

      /* === ESTILOS 80mm MEJORADOS === */
      ${mode !== 'A4' ? `
        #print-wrapper-ticket { font-family: 'Consolas', monospace !important; }
        #print-wrapper-ticket .brand { text-align: center !important; border-bottom: 2px dashed #000 !important; padding-bottom: 8px !important; margin-bottom: 8px !important; }
        #print-wrapper-ticket .brand-logo-container { display: flex !important; justify-content: center !important; margin-bottom: 6px !important; }
        #print-wrapper-ticket .brand-logo-container img { max-width: 50mm !important; height: auto !important; display: block !important; margin: 0 auto !important; }
        #print-wrapper-ticket .brand h1 { font-size: 14pt !important; font-weight: 900 !important; color: #000 !important; margin: 4px 0 2px !important; letter-spacing: 0.5px !important; }
        #print-wrapper-ticket .brand small { font-size: 7pt !important; color: #000 !important; font-weight: 600 !important; margin: 1px 0 !important; }
        #print-wrapper-ticket .brand-info { text-align: center !important; }
        
        #print-wrapper-ticket .meta { font-size: 8pt !important; border-bottom: 1px dashed #000 !important; }
        #print-wrapper-ticket .meta-label { font-weight: 900 !important; }
        #print-wrapper-ticket .meta-value { font-weight: 600 !important; }
        #print-wrapper-ticket .meta-title { font-weight: 900 !important; font-size: 8pt !important; border-bottom: 1px solid #000 !important; color: #000 !important; }
        
        #print-wrapper-ticket table.items th { border-bottom: 2px solid #000 !important; font-weight: 900 !important; font-size: 7pt !important; color: #000 !important; }
        #print-wrapper-ticket table.items td { font-weight: 600 !important; font-size: 7.5pt !important; border-bottom: 1px dotted #999 !important; }
        
        #print-wrapper-ticket .totals { border-top: 2px solid #000 !important; }
        #print-wrapper-ticket .grand-total { font-size: 13pt !important; font-weight: 900 !important; }
        #print-wrapper-ticket .thanks { font-size: 7pt !important; font-weight: 700 !important; border-top: 1px dashed #000 !important; }
        
        #print-wrapper-ticket .ticket-tag { font-weight: 900 !important; font-size: 9pt !important; border: 2px solid #000 !important; padding: 3px 8px !important; }
        #print-wrapper-ticket .footer-sign { display: none !important; }
      ` : `
        /* === ESTILOS A4 MEJORADOS === */
        #print-wrapper-ticket .brand { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; text-align: left !important; }
        #print-wrapper-ticket .brand-logo-container { order: 1 !important; width: 140px !important; justify-content: flex-start !important; }
        #print-wrapper-ticket .brand-logo-container img { max-width: 130px !important; height: auto !important; }
        #print-wrapper-ticket .brand-info { order: 2 !important; text-align: right !important; flex: 1 !important; }
        #print-wrapper-ticket .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; font-weight: 900 !important; }
        #print-wrapper-ticket .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #334155 !important; font-weight: 500 !important; }
        
        #print-wrapper-ticket .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; padding: 15px !important; border-radius: 8px !important; margin-bottom: 30px !important; }
        #print-wrapper-ticket .meta p { display: grid !important; grid-template-columns: 140px 1fr !important; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; padding-bottom: 4px !important; margin-bottom: 4px !important; }
        #print-wrapper-ticket .meta-title { font-weight: 900 !important; text-transform: uppercase !important; color: #1e3a8a !important; border-bottom: 2px solid #cbd5e1 !important; margin-bottom: 10px !important; padding-bottom: 5px !important; display: block !important; width: 100% !important; }
        
        #print-wrapper-ticket table.items { width: 100% !important; border-collapse: collapse !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket table.items th { background: #f1f5f9 !important; color: #334155 !important; padding: 12px 8px !important; font-weight: 800 !important; text-transform: uppercase !important; font-size: 8pt !important; border-bottom: 2px solid #cbd5e1 !important; text-align: left !important; }
        #print-wrapper-ticket table.items td { padding: 10px 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 9.5pt !important; color: #334155 !important; vertical-align: top !important; font-weight: 500 !important; }
        #print-wrapper-ticket .col-qty { text-align: center !important; }
        #print-wrapper-ticket .col-unit, #print-wrapper-ticket .col-total { text-align: right !important; }
        
        #print-wrapper-ticket .totals { display: flex !important; justify-content: flex-end !important; margin-top: 20px !important; border-top: none !important; }
        #print-wrapper-ticket .totals-box { width: 300px !important; background: #f8fafc !important; padding: 15px !important; border-radius: 8px !important; border: 1px solid #e2e8f0 !important; }
        #print-wrapper-ticket .footer-sign { display: flex !important; justify-content: space-between !important; margin-top: 80px !important; padding: 0 50px !important; }
        #print-wrapper-ticket .sign-box { border-top: 1px solid #94a3b8 !important; width: 40% !important; text-align: center !important; padding-top: 5px !important; font-size: 9pt !important; color: #64748b !important; }
      `}
    `;

    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;

    w.document.write(`<html><head><title>Impresión ${mode.toUpperCase()} - ${companyInfo.name}</title><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
    w.document.close();
    w.focus();

    // Usar setTimeout directo (más confiable que w.onload con document.write)
    setTimeout(() => {
      try { w.print(); } catch (e) { console.error('Print error:', e); }
      // Auto-cerrar ventana de impresión después
      setTimeout(() => {
        try { w.close(); } catch (e) { /* ignore */ }
      }, 1000);
    }, 400);

    // Si autoCloseAfter, cerrar el modal y mostrar éxito
    if (autoCloseAfter) {
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    }
  }, [companyInfo, onClose]);

  // === Auto-trigger print for "Pagar e Imprimir" ===
  const hasAutoTriggered = useRef(false);
  useEffect(() => {
    if (autoTriggerPrint && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      const timer = setTimeout(() => doPrint('80', true), 500);
      return () => clearTimeout(timer);
    }
  }, [autoTriggerPrint, doPrint]);

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />
      <ResponsiveModalContent className="no-print">
        <HeaderBar>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <FaReceipt color="#2563eb" /> Vista de Impresión
          </h2>
          <ActionButtons>
            <Button onClick={() => doPrint('80')} style={{ background: '#2563eb', color: '#fff', fontWeight: 700 }}>
              <FaPrint /> 80mm
            </Button>
            <Button onClick={() => doPrint('A4')} style={{ background: '#0f766e', color: '#fff', fontWeight: 700 }}>
              <FaFileInvoice /> A4
            </Button>
            <Button $cancel onClick={onClose} style={{ background: '#fee2e2', color: '#ef4444' }}>
              <FaWindowClose />
            </Button>
          </ActionButtons>
        </HeaderBar>

        <Wrapper>
          <PrintWrapper id="print-wrapper-ticket" className={`print-area ${printMode === 'A4' ? 'print-a4' : 'print-80'} ${compact ? 'compact' : ''}`}>

            {/* BRAND HEADER */}
            <div className="brand">
              <div className="brand-logo-container">
                <TicketLogo
                  className={printMode === 'A4' ? 'logo-a4' : 'logo-80mm'}
                  src={companyInfo.logo}
                  alt="Logo"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="brand-info">
                <h1>{companyInfo.name}</h1>
                <small><strong>{companyInfo.slogan}</strong></small>
                <small><strong>RUC:</strong> {companyInfo.ruc}</small>
                <small><strong>Tel:</strong> {companyInfo.phone}</small>
                <small>{companyInfo.address}</small>
                <div style={{ marginTop: 8 }}>
                  {isProforma ? <Tag $type="proforma" className="ticket-tag">PROFORMA</Tag> : isAbono ? <Tag $type="abono" className="ticket-tag">RECIBO</Tag> : isOutflow ? <Tag $type="outflow" className="ticket-tag">SALIDA</Tag> : (tx.isProReceipt || tx.isWholesale) ? <Tag $type="pro" className="ticket-tag">RECIBO PRO</Tag> : <Tag $type="venta" className="ticket-tag">{isDevol ? 'DEVOLUCIÓN' : 'FACTURA'}</Tag>}
                </div>
              </div>
            </div>

            {/* META INFO */}
            <div className="meta">
              <div className="meta-col">
                <span className="meta-title">Detalles del Documento</span>
                <p><span className="meta-label">Fecha:</span><span className="meta-value">{fechaStr}</span></p>
                <p><span className="meta-label">No. Documento:</span><span className="meta-value">{ticketId}</span></p>
                <p><span className="meta-label">Atendido por:</span><span className="meta-value">{printedByName}</span></p>
              </div>
              <div className="meta-col">
                <span className="meta-title">Datos del Cliente</span>
                <p><span className="meta-label">Cliente:</span><span className="meta-value">{clientName}</span></p>
                {clienteCedula && <p><span className="meta-label">Cédula/RUC:</span><span className="meta-value">{clienteCedula}</span></p>}
                {!isProforma && !isOutflow && <p><span className="meta-label">Pago:</span><span className="meta-value">{metodo}</span></p>}
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table className="items">
              <thead>
                <tr>
                  <th className="col-qty">Cant.</th>
                  <th>Descripción</th>
                  <th className="text-right col-unit">P. Unit</th>
                  <th className="text-right col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center' }}>Sin ítems</td></tr> :
                  items.map(it => (
                    <tr key={it.id}>
                      <td className="col-qty" style={{ fontWeight: 800 }}>{it.quantity}</td>
                      <td style={{ fontWeight: 600 }}>{it.nombre}</td>
                      <td className="text-right col-unit">C${fmt(it.unit)}</td>
                      <td className="text-right col-total" style={{ fontWeight: 700 }}>C${fmt(it.total)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="totals">
              <div className="totals-box">
                <TotalsRow><span style={{ fontWeight: 700 }}>Subtotal:</span><span style={{ fontWeight: 700 }}>C${fmt(subtotal)}</span></TotalsRow>
                {descuento > 0 && <TotalsRow style={{ color: '#dc3545' }}><span style={{ fontWeight: 700 }}>Descuento:</span><span style={{ fontWeight: 700 }}>- C${fmt(descuento)}</span></TotalsRow>}
                <TotalsRow className="grand-total" $bold style={{ fontSize: '1.3em', borderTop: '2px solid #000', marginTop: 5, paddingTop: 5 }}>
                  <span style={{ fontWeight: 900 }}>TOTAL:</span><span style={{ fontWeight: 900 }}>C${fmt(total)}</span>
                </TotalsRow>
                {!isProforma && (
                  <>
                    <TotalsRow style={{ marginTop: 10, fontSize: '0.9em' }}><span style={{ fontWeight: 700 }}>Pagado:</span><span style={{ fontWeight: 700 }}>C${fmt(pagado)}</span></TotalsRow>
                    {cambio > 0 && <TotalsRow $bold style={{ color: '#dc3545', fontWeight: 900 }}><span>Cambio:</span><span>C${fmt(cambio)}</span></TotalsRow>}
                  </>
                )}
              </div>
            </div>

            {/* A4 FOOTER SIGNATURES */}
            <div className="footer-sign no-show-80">
              <div className="sign-box">Entregado por</div>
              <div className="sign-box">Recibido por</div>
            </div>

            <div className="thanks">
              <p><strong>"{companyInfo.slogan}"</strong></p>
              <p style={{ whiteSpace: 'pre-line', marginTop: '5px' }}>
                {(() => {
                  if (isProforma) return settings?.ticket_proforma_footer || 'Cotización válida por 15 días.';
                  if (isOutflow) return settings?.ticket_transfer_footer || 'Salida de Inventario.';
                  return settings?.ticket_sales_footer || '¡Gracias por su compra!';
                })()}
              </p>
            </div>

          </PrintWrapper>
        </Wrapper>
      </ResponsiveModalContent>
    </ModalOverlay>
  );
};

export default TicketModal;
