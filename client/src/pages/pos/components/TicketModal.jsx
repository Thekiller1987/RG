// client/src/pages/POS/components/TicketModal.jsx
import React from 'react';
import { FaReceipt, FaWindowClose, FaPrint, FaFileInvoice } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { ModalOverlay, Button, TotalsRow, ModalContent } from '../POS.styles.jsx';

/* ========= DATOS DE TU NEGOCIO =========
   Cambia aquí cuando quieras:
*/
const COMPANY = {
  NAME: 'MultirepuestosRG',
  RUC: '—', // ← PON TU RUC CUANDO LO TENGAS
  PHONE: '84031936 / 84058142',
  ADDRESS: 'Juigalpa, Chontales. Del portón de la Normal 75 varas al Este',
};

const getLogoPath = () => '/logo.jpeg';

/* ======================= ESTILOS ======================= */
const Wrapper = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px; /* ~80mm */
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 8px; margin-bottom: 8px;
  }
  .brand h1 { margin: 6px 0 2px; font-size: 1.2rem; letter-spacing: .5px; }
  .brand small { color: #555; display: block; margin-top: 2px; }

  .meta { font-size: .9rem; margin-bottom: 8px; }
  .meta p { margin: 2px 0; }

  table.items {
    width: 100%;
    border-collapse: collapse;
    font-size: .92rem;
    table-layout: fixed;
  }
  table.items th, table.items td { padding: 4px 2px; vertical-align: top; word-break: break-word; }
  table.items th { border-bottom: 1px solid #333; font-weight: 700; }
  .text-right { text-align: right; }
  .col-qty { width: 16%; }
  .col-price { width: 27%; }
  .col-total { width: 27%; }

  .totals { border-top: 1px dashed #333; padding-top: 6px; margin-top: 6px; }
  .badge {
    display: inline-block; font-weight: 800; letter-spacing: .5px;
    padding: 4px 8px; border: 1px dashed #333; border-left: none; border-right: none;
    margin: 6px 0; text-align: center;
  }
  .thanks { text-align: center; font-size: .85rem; border-top: 1px dashed #333; padding-top: 6px; margin-top: 8px; color: #444; }

  /* ======== PRINT RULES ======== */
  @media print {
    html, body { height: auto !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
    body * { visibility: hidden !important; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area { position: absolute !important; left: 0 !important; top: 0 !important; }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page { size: 80mm auto; margin: 0; }
    .print-area { width: 80mm !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; }
    table, tr, td, th { page-break-inside: avoid; }
  }

  /* Variante A4 */
  &.print-a4 { width: 100%; max-width: 780px; font-size: 12pt; }
  @media print {
    @page.print-a4 { size: A4 portrait; margin: 10mm; }
    .print-area.print-a4 { width: 100% !important; max-width: 780px !important; padding: 0 !important; }
  }
`;

const TicketLogo = styled.img`
  width: 120px; height: auto; display: block; margin: 0 auto 6px auto; border-radius: 6px;
`;

const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 800; letter-spacing: .4px; padding: 4px 8px; border-radius: 9999px;
  ${({ $type }) => $type === 'proforma' && css`background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;`}
  ${({ $type }) => $type === 'abono' && css`background: #fff3cd; color: #856404; border: 1px solid #ffeeba;`}
  ${({ $type }) => $type === 'venta' && css`background: #e8f7ee; color: #1c7d3a; border: 1px solid #bfe8cf;`}
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`;

const ActionRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
`;

/* ======================= HELPERS ======================= */
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n || 0));

const coalesce = (...vals) => vals.find(v => v !== undefined && v !== null);

function normalizeItems(itemsRaw = []) {
  return itemsRaw.map((it, idx) => {
    const quantity = Number(coalesce(it.quantity, it.cantidad, it.qty, 0));
    const nombre = coalesce(it.nombre, it.descripcion, it.description, it.producto, `Item ${idx+1}`);
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
  const sum = ['efectivo', 'tarjeta', 'transferencia', 'otro', 'dolares']
    .map(k => Number(pd[k] || 0))
    .reduce((a, b) => a + b, 0);
  return sum > 0 ? sum : Number(pd.montoRecibido || fallback || 0);
}

function toDateString(maybeDate) {
  const src = coalesce(maybeDate?.fecha, maybeDate?.createdAt, maybeDate?.created_at, maybeDate?.date, maybeDate);
  try {
    const d = new Date(src);
    return isNaN(d) ? 'Fecha Inválida' : d.toLocaleString('es-NI', { hour12: true });
  } catch { return 'Fecha Inválida'; }
}

/* ======================= COMPONENTE ======================= */
const TicketModal = ({ transaction, onClose, clients = [], users = [], isOpen = true }) => {
  if (!isOpen || transaction == null) return null;

  /* ====== Resolución por ID o por objeto ====== */
  const [resolved, setResolved] = React.useState(
    typeof transaction === 'object' ? transaction : null
  );
  const [loading, setLoading] = React.useState(typeof transaction !== 'object');
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let alive = true;

    const isObjectLike = typeof transaction === 'object' && transaction !== null;
    if (isObjectLike) {
      setResolved(transaction);
      setLoading(false);
      setError(null);
      return () => { alive = false; };
    }

    const id = String(transaction || '').trim();
    if (!id) {
      setError('ID de venta inválido');
      setLoading(false);
      return () => { alive = false; };
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/sales/${encodeURIComponent(id)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!alive) return;
        setResolved(data);
      } catch (e) {
        if (!alive) return;
        console.error('No se pudo cargar la venta', id, e);
        setError('No se pudo cargar la venta para imprimir.');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [transaction]);

  /* ====== Loaders/Errores ====== */
  if (loading) {
    return (
      <ModalOverlay className="no-print">
        <ModalContent className="no-print" style={{ maxWidth: 420, padding: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Preparando impresión…</h3>
          <p style={{ color: '#6c757d' }}>Cargando datos de la venta…</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <Button onClick={onClose} $cancel><FaWindowClose /> Cancelar</Button>
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (error || !resolved) {
    return (
      <ModalOverlay className="no-print">
        <ModalContent className="no-print" style={{ maxWidth: 420, padding: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#dc3545' }}>No se pudo imprimir</h3>
          <p style={{ color: '#6c757d' }}>{error || 'Venta no encontrada.'}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
            <Button onClick={onClose} $cancel><FaWindowClose /> Cerrar</Button>
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  /* ====== Desde aquí usamos "tx" ya resuelto ====== */
  const tx = resolved;

  // Flags
  const isAbono = tx.estado === 'ABONO_CREDITO';
  const isProforma = Boolean(tx.isProforma);
  const isDevol = tx.estado === 'DEVOLUCION';

  // IDs / Fecha
  const ticketId = coalesce(tx.id, tx.saleId, tx.numero, '-');
  const fechaStr = toDateString(coalesce(tx.fecha, tx.createdAt, tx.date));

  // Cliente y usuario
  const clientId = coalesce(tx.clientId, tx.idCliente, tx.clienteId);
  const clienteObj = clients.find(c => c.id_cliente === clientId);
  const clientName = isProforma && tx.proformaNombre
    ? tx.proformaNombre
    : coalesce(clienteObj?.nombre, tx.clienteNombre, 'Consumidor Final');

  const userId = tx.userId;
  const userObj = users.find(u => (u.id_usuario ?? u.id) == userId);
  const userName = coalesce(userObj?.nombre_usuario, tx.usuarioNombre, 'N/A');

  // Items + Totales
  const items = normalizeItems(coalesce(tx.items, tx.detalle, []));
  const subtotalCalc = items.reduce((s, it) => s + it.total, 0);
  const subtotal = Number(coalesce(tx.subtotal, subtotalCalc));
  const descuento = Number(coalesce(tx.descuento, 0));
  const total = Number(coalesce(tx.totalVenta, tx.total_venta, subtotal - descuento, 0));

  // Pago
  const pd = tx.pagoDetalles || {};
  const metodo = isProforma ? 'N/A' : coalesce(tx.metodoPago, labelMetodoPago(pd));
  const pagado = isProforma ? 0 : montoPagado(pd, total);
  const cambio = isProforma ? 0 : Math.max(0, pagado - total);

  // Abono / crédito
  const abonoMonto = Math.abs(Number(coalesce(tx.totalVenta, tx.montoAbono, 0)));
  const nuevoSaldo = Number(clienteObj?.saldo_pendiente || 0);
  const saldoAnterior = nuevoSaldo + abonoMonto;

  /* ====== PRINT ====== */
  const printedRef = React.useRef(false);

  const doPrint = (mode = '80') => {
    const el = document.getElementById('print-wrapper-ticket');
    if (!el) return;
    el.classList.remove('print-a4');
    if (mode === 'A4') el.classList.add('print-a4');

    document.body.classList.add('print-active');
    el.classList.add('print-area');
    window.print();
    el.classList.remove('print-area');
    document.body.classList.remove('print-active');
  };

  // Auto-print si venía la bandera (por ejemplo desde PaymentModal)
  React.useEffect(() => {
    const auto = Boolean(tx?.pagoDetalles?.shouldPrintNow ?? tx?.shouldPrintNow);
    if (!auto || printedRef.current) return;
    printedRef.current = true;
    const t = setTimeout(() => { try { doPrint('80'); } catch {} }, 180);
    return () => clearTimeout(t);
  }, [tx]);

  /* ====== RENDER ====== */
  return (
    <ModalOverlay className="no-print">
      <ModalContent className="no-print" style={{ maxWidth: 480, width: '96%', padding: '1.2rem', background: '#fff' }}>
        <HeaderBar>
          <h2 style={{ display:'flex', alignItems:'center', gap:8, margin:0 }}>
            <FaReceipt /> Vista de Impresión
          </h2>
          <Button $cancel onClick={onClose}><FaWindowClose /></Button>
        </HeaderBar>

        <Wrapper>
          <PrintWrapper id="print-wrapper-ticket">
            {/* Encabezado */}
            <div className="brand">
              <TicketLogo src={getLogoPath()} alt="Logo" onError={(e)=>{ e.currentTarget.style.display='none'; }} />
              <h1>{COMPANY.NAME}</h1>
              <small>RUC: {COMPANY.RUC} • Tel: {COMPANY.PHONE}</small>
              <small>Dirección: {COMPANY.ADDRESS}</small>

              <div style={{ marginTop: 6 }}>
                {isProforma ? (
                  <Tag $type="proforma"><FaFileInvoice /> PROFORMA</Tag>
                ) : isAbono ? (
                  <Tag $type="abono">RECIBO DE ABONO</Tag>
                ) : (
                  <Tag $type="venta">{isDevol ? 'FACTURA (con Devolución)' : 'FACTURA DE VENTA'}</Tag>
                )}
              </div>
            </div>

            {/* Metadatos */}
            <div className="meta">
              {isProforma ? (
                <>
                  <p><strong>Fecha:</strong> {fechaStr}</p>
                  <p><strong>Proforma #</strong> {ticketId}</p>
                  <p><strong>A nombre de:</strong> {clientName || '—'}</p>
                  <p><strong>Atendido por:</strong> {userName}</p>
                </>
              ) : isAbono ? (
                <>
                  <p><strong>Fecha:</strong> {fechaStr}</p>
                  <p><strong>Recibo #</strong> {ticketId}</p>
                  <p><strong>Cliente:</strong> {clientName}</p>
                  <p><strong>Atendido por:</strong> {userName}</p>
                </>
              ) : (
                <>
                  <p><strong>Fecha:</strong> {fechaStr}</p>
                  <p><strong>Factura #</strong> {ticketId}</p>
                  <p><strong>Cliente:</strong> {clientName}</p>
                  <p><strong>Atendido por:</strong> {userName}</p>
                </>
              )}
            </div>

            {/* Cuerpo */}
            {isAbono ? (
              <>
                <p className="badge">Resumen de Crédito</p>
                <div>
                  <TotalsRow><span>Saldo Anterior:</span><span>C${fmt(saldoAnterior)}</span></TotalsRow>
                  <TotalsRow $bold style={{ color:'#1c7d3a' }}><span>Su Abono:</span><span>C${fmt(abonoMonto)}</span></TotalsRow>
                  <TotalsRow $bold style={{ borderTop:'1px dashed #333', paddingTop:'5px', marginTop:'5px' }}>
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
                      <th className="text-right col-price">P. Unit.</th>
                      <th className="text-right col-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign:'center', color:'#777' }}>Sin ítems</td></tr>
                    ) : items.map(it => (
                      <tr key={it.id}>
                        <td>{it.quantity}</td>
                        <td>{it.nombre}</td>
                        <td className="text-right">C${fmt(it.unit)}</td>
                        <td className="text-right">C${fmt(it.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="totals">
                  <TotalsRow><span>Subtotal:</span><span>C${fmt(subtotal)}</span></TotalsRow>
                  {descuento > 0 && <TotalsRow><span>Descuento:</span><span>- C${fmt(descuento)}</span></TotalsRow>}
                  <TotalsRow $bold className="grand-total" style={{ borderTop: '1px solid #333' }}>
                    <span>TOTAL:</span><span>C${fmt(total)}</span>
                  </TotalsRow>

                  {!isProforma && (
                    <>
                      <TotalsRow><span>Tipo de Pago:</span><span>{metodo}</span></TotalsRow>
                      <TotalsRow><span>Monto Pagado:</span><span>C${fmt(pagado)}</span></TotalsRow>
                      {cambio > 0 && (
                        <TotalsRow $bold style={{ color:'#dc3545' }}>
                          <span>Su Cambio:</span><span>C${fmt(cambio)}</span>
                        </TotalsRow>
                      )}
                    </>
                  )}

                  {isProforma && (
                    <div style={{ marginTop: 6 }}>
                      <span className="badge">DOCUMENTO NO VÁLIDO COMO FACTURA FISCAL</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Pie */}
            <div className="thanks">
              <p>¡Gracias por su preferencia!</p>
              <p>Tel: {COMPANY.PHONE}</p>
              <p>{COMPANY.NAME}</p>
            </div>
          </PrintWrapper>

          {/* Acciones (no se imprimen) */}
          <ActionRow className="no-print">
            <Button onClick={() => doPrint('80')} pay style={{ width: '100%', minHeight: 44 }}>
              <FaPrint /> Imprimir 80mm
            </Button>
            <Button onClick={() => doPrint('A4')} style={{ width: '100%', minHeight: 44 }}>
              <FaPrint /> Imprimir A4
            </Button>
          </ActionRow>
        </Wrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TicketModal;
