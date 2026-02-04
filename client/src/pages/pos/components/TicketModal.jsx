import React from 'react';
import { FaReceipt, FaWindowClose, FaFileInvoice } from 'react-icons/fa';
import styled, { css, createGlobalStyle } from 'styled-components';
import { ModalOverlay, Button, TotalsRow, ModalContent } from '../POS.styles.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

/* =================================================================
 * DATOS DEL NEGOCIO
 * ================================================================= */
const COMPANY = {
  NAME: 'Multirepuestos RG',
  RUC: '1211812770001E',
  PHONE: '84031936 / 84058142',
  ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
  SLOGAN: 'Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.',
};

// Ruta de logo estable: coloca tu archivo en client/public/icons/logo.png
const getLogoPath = () => new URL('/icons/logo.png', window.location.origin).toString();

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

  /* Encabezado: más aire y envoltura correcta */
  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 {
    margin: 6px 0 2px;
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e3a8a;
    line-height: 1.25;
  }
  .brand small {
    color: #555;
    display: block;
    margin: 3px 0;
    line-height: 1.35;
    white-space: normal;
    word-break: break-word;
  }

  .meta {
    font-size: .9rem;
    margin-bottom: 12px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;
  }
  /* Importante: que las líneas puedan “wrapear” y no se monten */
  .meta p {
    margin: 2px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 4px 8px;
    font-weight: 400;
  }
  .meta-label { font-weight: 700; }
  .meta-value { font-weight: 400; }

  table.items { width: 100%; border-collapse: collapse; font-size: .9rem; table-layout: fixed; }
  table.items th, table.items td { padding: 6px 4px; vertical-align: top; word-wrap: break-word; }
  table.items th {
    border-bottom: 2px solid #333;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #1e3a8a;
  }
  &.compact table.items th, &.compact table.items td { padding: 4px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 15%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .badge {
    display: inline-block; font-weight: 700; letter-spacing: .5px;
    padding: 6px 10px; border: 2px solid #0b72b9; border-radius: 4px;
    margin: 10px auto; text-align: center; color: #0b72b9;
  }
  .thanks {
    text-align: center; font-size: .85rem; border-top: 1px dashed #333;
    padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4;
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
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      max-height: 277mm !important;   /* 1 sola página */
      overflow: hidden !important;     /* recorta lo excedente */
    }
    &.compact { font-size: 7.5pt; }
  }
`;

const Wrapper = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const TicketLogo = styled.img`
  /* Mantengo tu tamaño de vista previa */
  width: 120px;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 6px;
  border-radius: 6px;
  image-rendering: optimizeSpeed;
  image-rendering: -webkit-optimize-contrast;
`;

const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 4px 8px; border-radius: 4px;
  font-size: 0.85rem;
  ${({ $type }) => $type === 'proforma' && css`background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;`}
  ${({ $type }) => $type === 'abono' && css`background: #fff3cd; color: #856404; border: 1px solid #ffeeba;`}
  ${({ $type }) => $type === 'venta' && css`background: #e8f7ee; color: #1c7d3a; border: 1px solid #bfe8cf;`}
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
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
  // Sumar todos los métodos de pago
  // IMPORTANTE: 'dolares' viene en monto USD, hay que convertirlo si existe tasa
  const efectivo = Number(pd.efectivo || 0);
  const tarjeta = Number(pd.tarjeta || 0);
  const transferencia = Number(pd.transferencia || 0);
  const otro = Number(pd.otro || 0);

  const dolaresMonto = Number(pd.dolares || 0);
  const tasa = Number(pd.tasaDolarAlMomento || pd.tasaObtenida || 1); // Fallback a 1 si no hay tasa (no debería pasar si hay dólares)

  const dolaresConvertido = dolaresMonto * (tasa > 1 ? tasa : 1); // Si tasa es 1 o 0, asumo que ya está convertido o es error, pero mejor multiplicar si > 1

  // NOTA: Si tasaDolarAlMomento no existe en pd, y hay dolares, podríamos tener un problema de cálculo en tickets viejos.
  // Sin embargo, el POS siempre manda tasaDolarAlMomento.

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
  const fecha = now.toISOString().slice(2, 10).replace(/-/g, ''); // 251019
  const hora = now.toTimeString().slice(0, 8).replace(/:/g, '');   // 070127
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
}) => {
  const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });

  if (!isOpen || transaction == null) return null;

  const [resolved] = React.useState(typeof transaction === 'object' ? transaction : null);
  const [loading] = React.useState(false);
  const [error] = React.useState(null);

  if (loading || error || !resolved) {
    return (
      <ModalOverlay className="no-print">
        <ModalContent className="no-print" style={{ maxWidth: 420, padding: '1rem' }}>
          {loading ? (
            <>
              <h3>Preparando impresión…</h3>
              <p style={{ color: '#6c757d' }}>Cargando datos de la transacción…</p>
            </>
          ) : (
            <>
              <h3 style={{ color: '#dc3545' }}>No se pudo imprimir</h3>
              <p style={{ color: '#6c757d' }}>{error || 'Transacción no encontrada.'}</p>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <Button onClick={onClose} $cancel><FaWindowClose /> Cerrar</Button>
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // ====== Datos listos ======
  const tx = resolved;
  const isAbono = tx.estado === 'ABONO_CREDITO';
  const isProforma = Boolean(tx.isProforma || tx.proformaFor || tx.proformaNombre);
  const isOutflow = Boolean(tx.isOutflow); // NEW FLAG
  const isDevol = tx.estado === 'DEVOLUCION';

  const ticketId = isProforma ? ensureProformaId(tx) : coalesce(tx.id, tx.saleId, tx.numero, '-');
  const fechaStr = toDateString(coalesce(tx.fecha, tx.createdAt, tx.date));

  const clientId = coalesce(tx.clientId, tx.idCliente, tx.clienteId);
  const clienteObj = clients.find(c => String(c.id_cliente ?? c.id) === String(clientId));
  const clientName = isProforma && tx.proformaNombre
    ? tx.proformaNombre
    : coalesce(clienteObj?.nombre, tx.clienteNombre, 'Consumidor Final');

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

  // ====== Persistencia de quién imprimió ======
  const persistPrintedMeta = React.useCallback(async (mode) => {
    const printedBy =
      currentUser?.id || currentUser?.uid ||
      authUser?.id || authUser?.uid ||
      userId || 'desconocido';

    const meta = {
      ticketId,
      mode,
      type: isProforma ? 'PROFORMA' : isAbono ? 'ABONO' : isOutflow ? 'SALIDA' : (isDevol ? 'VENTA_DEV' : 'VENTA'),
      printedBy,
      printedByName: printedByName,
      printedAt: new Date().toISOString(),
    };
    try {
      if (typeof onPersistPrint === 'function') {
        await onPersistPrint(meta);
      } else {
        const key = 'print_history';
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.unshift(meta);
        localStorage.setItem(key, JSON.stringify(arr.slice(0, 50)));
      }
    } catch (e) {
      console.warn('No se pudo persistir el historial de impresión:', e);
    }
  }, [currentUser, authUser, userId, ticketId, isProforma, isAbono, isOutflow, isDevol, printedByName, onPersistPrint]);

  // ====== Impresión centralizada (A4/80 mm) ======
  const doPrint = React.useCallback((mode = '80') => {
    const node = document.getElementById('print-wrapper-ticket');
    if (!node) return;

    const htmlToPrint = node.outerHTML;

    const printStyles = `
      @charset "UTF-8";
      @page {
        size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'};
        margin: ${mode === 'A4' ? '8mm' : '0'};
      }
      html, body {
        background: #fff;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color: #000 !important;
      }
      /* Fuerza negro y NEGRITA para definición térmica */
      #print-wrapper-ticket, #print-wrapper-ticket * {
        color: #000 !important;
        font-weight: 700 !important;
        text-shadow: none !important;
        box-shadow: none !important;
      }
      #print-wrapper-ticket {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        ${mode === 'A4'
        ? `width: 190mm !important; max-height: 277mm !important; overflow: hidden !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 10pt !important;`
        : `width: 80mm !important; padding: 6px 4px !important; font-family: Consolas, 'Courier New', monospace !important; font-size: 8pt !important;`
      }
      }
      .print-a4 {
        width: 190mm !important;
        max-height: 277mm !important;
        overflow: hidden !important;
        font-family: Arial, Helvetica, sans-serif !important;
        font-size: 10pt !important;
      }
      .print-80 {
        width: 80mm !important;
        padding: 6px 4px !important;
        font-family: Consolas, 'Courier New', monospace !important;
        font-size: 8pt !important;
      }
      .brand h1 { font-size: ${mode === 'A4' ? '16pt' : '12pt'}; margin: 6px 0 2px; }
      .brand small, .meta p, .thanks { font-size: ${mode === 'A4' ? '10pt' : '8pt'}; }

      table.items { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: ${mode === 'A4' ? '10pt' : '8pt'}; }
      table.items th, table.items td { padding: 4px 2px; border-bottom: 1px dashed #eee; word-wrap: break-word; vertical-align: top; }
      .col-qty { width: 12%; text-align: center; }
      .col-unit, .col-total { width: 22%; text-align: right; }
      .totals { border-top: 2px solid #333; padding-top: 5px; }
      .grand-total { font-size: ${mode === 'A4' ? '14pt' : '12pt'}; font-weight: 900 !important; }

      /* Encabezado limpio en impresión */
      #print-wrapper-ticket .brand {
        padding-bottom: 10px !important;
        margin-bottom: 10px !important;
        border-bottom: 1px dashed #333 !important;
      }
      #print-wrapper-ticket .brand h1 {
        line-height: 1.25 !important;
        margin: 6px 0 2px !important;
      }
      #print-wrapper-ticket .brand small {
        display: block !important;
        margin: 3px 0 !important;
        line-height: 1.35 !important;
        white-space: normal !important;
        word-break: break-word !important;
      }
      #print-wrapper-ticket .meta p {
        flex-wrap: wrap !important;
        gap: 4px 8px !important;
        align-items: flex-start !important;
      }

      /* Escala del LOGO por modo – mantenemos tus tamaños actuales */
      #print-wrapper-ticket .brand img {
        width: ${mode === 'A4' ? '200px' : '280px'} !important;
        height: auto !important;
      }

      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .brand, .meta, .totals, .thanks, table.items { page-break-inside: avoid; }
        table.items tr { page-break-inside: avoid; page-break-after: auto; }
      }
    `;

    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Impresión ${mode.toUpperCase()} - ${COMPANY.NAME}</title>
          <style>${printStyles}</style>
        </head>
        <body>${htmlToPrint}</body>
      </html>
    `);
    w.document.close();
    w.focus();

    w.onload = function () {
      setTimeout(async () => {
        try { await persistPrintedMeta(mode); } catch { }
        w.print();
      }, 250);
    };

    w.onafterprint = () => {
      try { w.close(); } catch { }
      try { if (typeof onClose === 'function') onClose(); } catch { }
    };

    setTimeout(async () => {
      if (!w.closed) {
        try { await persistPrintedMeta(mode); } catch { }
        w.print();
        setTimeout(() => {
          try { w.close(); } catch { }
          try { if (typeof onClose === 'function') onClose(); } catch { }
        }, 2000);
      }
    }, 1200);
  }, [persistPrintedMeta, onClose]);

  // Auto-print al abrir modal
  React.useEffect(() => {
    const autoPrint = Boolean(tx?.shouldPrintNow ?? true);
    if (!autoPrint) return;
    const key = String(ticketId || 'tmp') + printMode;
    lockPrintOnce(key, () => {
      setTimeout(() => {
        try { doPrint(printMode); } catch (e) { console.error('Error al imprimir:', e); }
      }, 180);
    });
  }, [ticketId, doPrint, printMode, tx?.shouldPrintNow]);

  const compact = items.length <= 2;

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />
      <ModalContent className="no-print" style={{ maxWidth: 520, width: '96%', padding: '1.2rem', background: '#fff' }}>
        <HeaderBar>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <FaReceipt /> Vista de Impresión ({printMode.toUpperCase()})
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => doPrint('80')}>Ticket 80mm</Button>
            <Button onClick={() => doPrint('A4')}><FaFileInvoice /> A4 (1 pág.)</Button>
            <Button $cancel onClick={onClose}><FaWindowClose /></Button>
          </div>
        </HeaderBar>

        <Wrapper>
          {/* ÁREA DE IMPRESIÓN */}
          <PrintWrapper
            id="print-wrapper-ticket"
            className={`print-area ${printMode === 'A4' ? 'print-a4' : 'print-80'} ${compact ? 'compact' : ''}`}
          >
            {/* Encabezado */}
            <div className="brand">
              <TicketLogo
                src={getLogoPath()}
                alt="Logo"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <h1>{COMPANY.NAME}</h1>
              <small>{COMPANY.SLOGAN}</small>
              <small>RUC: {COMPANY.RUC}</small>
              <small>Tel: {COMPANY.PHONE}</small>
              <small>Dir: {COMPANY.ADDRESS}</small>
              <div style={{ marginTop: 8 }}>
                {isProforma ? (
                  <Tag $type="proforma"><FaFileInvoice /> PROFORMA</Tag>
                ) : isAbono ? (
                  <Tag $type="abono">RECIBO DE ABONO</Tag>
                ) : isOutflow ? (
                  <Tag $type="outflow">COMPROBANTE DE SALIDA</Tag>
                ) : (
                  <Tag $type="venta">{isDevol ? 'FACTURA (Devolución)' : 'FACTURA DE VENTA'}</Tag>
                )}
              </div>
            </div>

            {/* Metadatos */}
            <div className="meta">
              <p><span className="meta-label">Fecha:</span><span className="meta-value">{fechaStr}</span></p>
              <p><span className="meta-label">{isProforma ? 'Proforma' : isAbono ? 'Recibo' : isOutflow ? 'Comprobante' : 'Factura'} #:</span><span className="meta-value">{ticketId}</span></p>

              {/* Reuse Client Name for Outflow Reason/Motivo if passed in that field */}
              <p><span className="meta-label">{isProforma ? 'A nombre de' : isOutflow ? 'Ref/Motivo' : 'Cliente'}:</span><span className="meta-value">{clientName}</span></p>

              <p><span className="meta-label">{isOutflow ? 'Autorizado por' : 'Atendido por'}:</span><span className="meta-value">{printedByName}</span></p>
              {!isProforma && !isOutflow && (
                <p><span className="meta-label">Tipo de pago:</span><span className="meta-value">{metodo}</span></p>
              )}
            </div>

            {/* Detalle / Abono */}
            {isAbono ? (
              <>
                <p className="badge">Resumen de Crédito</p>
                <div>
                  <TotalsRow><span>Saldo Anterior:</span><span>C${fmt(saldoAnterior)}</span></TotalsRow>
                  <TotalsRow $bold style={{ color: '#1c7d3a' }}><span>Su Abono:</span><span>C${fmt(abonoMonto)}</span></TotalsRow>
                  <TotalsRow $bold style={{ borderTop: '1px solid #333', paddingTop: '5px', marginTop: '5px' }}>
                    <span>Nuevo Saldo:</span><span>C${fmt(nuevoSaldo)}</span>
                  </TotalsRow>
                </div>
              </>
            ) : (
              <>
                <table className="items">
                  <thead>
                    <tr>
                      <th className="col-qty">Cant.</th>
                      <th>Descripción</th>
                      <th className="text-right col-unit">P. Unit.</th>
                      <th className="text-right col-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>Sin ítems</td></tr>
                    ) : (
                      items.map(it => (
                        <tr key={it.id}>
                          <td className="col-qty">{it.quantity}</td>
                          <td>{it.nombre}</td>
                          <td className="text-right col-unit">C${fmt(it.unit)}</td>
                          <td className="text-right col-total">C${fmt(it.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="totals">
                  <TotalsRow><span>Subtotal:</span><span>C${fmt(subtotal)}</span></TotalsRow>
                  {descuento > 0 && (
                    <TotalsRow style={{ color: '#dc3545' }}>
                      <span>Descuento:</span><span>- C${fmt(descuento)}</span>
                    </TotalsRow>
                  )}
                  <TotalsRow $bold className="grand-total" style={{ borderTop: '2px solid #333', paddingTop: '8px' }}>
                    <span>TOTAL:</span><span>C${fmt(total)}</span>
                  </TotalsRow>

                  {!isProforma && (
                    <>
                      <TotalsRow><span>Tipo de Pago:</span><span>{metodo}</span></TotalsRow>

                      {pd.referenciaTarjeta && (
                        <TotalsRow style={{ fontSize: '0.8rem', color: '#666' }}>
                          <span># Ref Tarjeta:</span><span>{pd.referenciaTarjeta}</span>
                        </TotalsRow>
                      )}
                      {pd.referenciaTransferencia && (
                        <TotalsRow style={{ fontSize: '0.8rem', color: '#666' }}>
                          <span># Ref Transferencia:</span><span>{pd.referenciaTransferencia}</span>
                        </TotalsRow>
                      )}

                      <TotalsRow><span>Monto Pagado:</span><span>C${fmt(pagado)}</span></TotalsRow>
                      {cambio > 0 && (
                        <TotalsRow $bold style={{ color: '#dc3545' }}>
                          <span>Su Cambio:</span><span>C${fmt(cambio)}</span>
                        </TotalsRow>
                      )}
                    </>
                  )}

                  {isProforma && (
                    <div style={{ marginTop: 6, textAlign: 'center' }}>
                      <span className="badge">DOCUMENTO INFORMATIVO. NO VÁLIDO COMO CRÉDITO FISCAL.</span>
                      <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#666' }}>
                        *Precios sujetos a cambio y disponibilidad de inventario.*
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Pie */}
            <div className="thanks">
              <p>"{COMPANY.SLOGAN}"</p>
              <p>¡Gracias por su preferencia!</p>
            </div>
          </PrintWrapper>
        </Wrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TicketModal;
