import React from 'react';
import { FaReceipt, FaWindowClose, FaPrint } from 'react-icons/fa';
import { ModalOverlay, Button, TotalsRow, ModalContent } from '../POS.styles.jsx';
import styled from 'styled-components';

/* ====== RUTA DEL LOGO (en /public) ====== */
const getLogoPath = () => '/logo.jpeg';

/* ======================= ESTILOS (TU VERSIÓN) ======================= */
const PrintWrapper = styled.div`
  font-family: 'Consolas', 'Courier New', monospace;
  color: #000; background: #fff; width: 310px; margin: 0 auto; padding: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  @media print {
    body > *:not(.print-area) { display: none !important; }
    .print-area, .print-area * { visibility: visible; }
    body.print-active { margin: 0 !important; padding: 0 !important; }

    @page:not(.print-a4) { size: 80mm auto; margin: 0; }
    .print-area:not(.print-a4) { width: 80mm !important; padding: 0; margin: 0; font-size: 10pt; box-shadow: none !important; }

    @page.print-a4 { size: A4 portrait; margin: 10mm; }
    .print-area.print-a4 { width: 100% !important; max-width: 780px; font-size: 12pt; }

    .print-area { position: absolute; top: 0; left: 0; }
    .no-print { display: none !important; }
    body, .print-area { background: white; color: black; box-shadow: none; border: none; }

    table { table-layout: auto !important; width: 100% !important; }
  }
`;

const PrintHeader = styled.header`
  text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 8px;
  h2, p { margin: 2px 0; }
  h2 { font-size: 1.5em; color: #343a40; }
`;

const TicketLogo = styled.img`
  width: 100%; max-width: 150px; height: auto; display: block; margin: 0 auto 10px auto;
`;

const ItemTable = styled.table`
  width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.9em; table-layout: fixed;
  th, td { padding: 4px 2px; text-align: left; vertical-align: top; word-break: break-word; }
  th { border-bottom: 1px solid #333; font-weight: bold; }
  .text-right { text-align: right; }
  .col-qty { width: 15%; }
  .col-price { width: 25%; }
  .col-total { width: 25%; }
`;

const PrintFooter = styled.footer`
  text-align: center; font-size: 0.8em; border-top: 1px dashed #333; padding-top: 5px; margin-top: 10px;
`;

const SectionTitle = styled.p`
  font-weight: bold; text-transform: uppercase; border-bottom: 1px dashed #333;
  padding: 5px 0; margin: 10px 0; text-align: center;
`;

const CreditSummary = styled.div`
  margin-top: 15px; border-top: 1px solid #333; padding-top: 10px;
`;

const Band = styled.div`
  text-align:center; font-weight:800; letter-spacing:.5px; padding:4px 0; margin:6px 0;
  border:1px dashed #333; border-left:none; border-right:none;
`;

/* ======================= HELPERS DE DATOS ======================= */
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n || 0));

const coalesce = (...vals) => vals.find(v => v !== undefined && v !== null);

/** recibe arrays de items en diferentes formatos y los normaliza */
function normalizeItems(itemsRaw = []) {
  return itemsRaw.map((it, idx) => {
    const quantity = Number(coalesce(it.quantity, it.cantidad, it.qty, 0));
    const nombre = coalesce(it.nombre, it.descripcion, it.description, '');
    const unit = Number(coalesce(it.precio_unitario, it.precio_venta, it.precio, it.unitPrice, 0));
    const id = coalesce(it.id_producto, it.id, `it-${idx}`);
    return { id, nombre, quantity, unit, total: quantity * unit };
  });
}

function labelMetodoPago(pd = {}) {
  const eff = Number(pd.efectivo || 0);
  const tar = Number(pd.tarjeta || 0);
  const trf = Number(pd.transferencia || 0);
  const cred = Number(pd.credito || 0);
  if (cred > 0) return 'Crédito';
  const methods = [];
  if (eff > 0) methods.push('Efectivo');
  if (tar > 0) methods.push('Tarjeta');
  if (trf > 0) methods.push('Transferencia');
  if (methods.length === 0) return 'Contado';
  if (methods.length === 1) return methods[0];
  return 'Mixto';
}

function montoPagado(pd = {}, fallback = 0) {
  const sum = ['efectivo', 'tarjeta', 'transferencia', 'otro']
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
  if (!isOpen || !transaction) return null;

  // flags
  const isAbono = transaction.estado === 'ABONO_CREDITO';
  const isProforma = Boolean(transaction.isProforma);

  // ids/fecha
  const ticketId = coalesce(transaction.id, transaction.saleId, transaction.numero, '-');
  const fechaStr = toDateString(coalesce(transaction.fecha, transaction.createdAt, transaction.date));

  // cliente y usuario
  const clientId = coalesce(transaction.clientId, transaction.idCliente, transaction.clienteId);
  const clienteObj = clients.find(c => c.id_cliente === clientId);
  const clientName = isProforma && transaction.proformaNombre
    ? transaction.proformaNombre
    : coalesce(clienteObj?.nombre, transaction.clienteNombre, 'Consumidor Final');

  const userId = transaction.userId;
  const userObj = users.find(u => (u.id_usuario ?? u.id) == userId);
  const userName = coalesce(userObj?.nombre_usuario, transaction.usuarioNombre, 'N/A');

  // items + totales
  const items = normalizeItems(coalesce(transaction.items, transaction.detalle, []));
  const subtotalCalc = items.reduce((s, it) => s + it.total, 0);
  const subtotal = Number(coalesce(transaction.subtotal, subtotalCalc));
  const descuento = Number(coalesce(transaction.descuento, 0));
  const total = Number(coalesce(transaction.totalVenta, subtotal - descuento, 0));

  // pago
  const pd = transaction.pagoDetalles || {};
  const metodo = isProforma ? 'N/A' : coalesce(transaction.metodoPago, labelMetodoPago(pd));
  const pagado = isProforma ? 0 : montoPagado(pd, total);
  const cambio = isProforma ? 0 : Math.max(0, pagado - total);

  // abono / crédito
  const abonoMonto = Math.abs(Number(coalesce(transaction.totalVenta, transaction.montoAbono, 0)));
  const nuevoSaldo = Number(clienteObj?.saldo_pendiente || 0);
  const saldoAnterior = nuevoSaldo + abonoMonto;

  const handlePrintDirect = () => {
    const printArea = document.getElementById('print-wrapper-ticket');
    if (!printArea) return;
    printArea.classList.remove('print-a4');           // fuerza 80mm
    document.body.classList.add('print-active');
    printArea.classList.add('print-area');
    window.print();
    printArea.classList.remove('print-area');
    document.body.classList.remove('print-active');
  };

  return (
    <ModalOverlay className="no-print">
      <ModalContent className="no-print" style={{ maxWidth: '450px', padding: '1.5rem', background: '#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', borderBottom:'1px solid #eee', paddingBottom:'1rem' }}>
          <h2><FaReceipt /> Vista de Impresión</h2>
          <Button $cancel onClick={onClose}><FaWindowClose /></Button>
        </div>

        <PrintWrapper id="print-wrapper-ticket">
          {/* Header */}
          <PrintHeader>
            <TicketLogo src={getLogoPath()} alt="Logo de Repuestos"
              onError={(e)=>{ e.currentTarget.style.display='none'; }} />
            <h2>MultirepuestosRG</h2>

            {isProforma ? (
              <>
                <Band>PROFORMA</Band>
                <p>Fecha: {fechaStr}</p>
                <p>Proforma #{ticketId}</p>
                <p>A nombre de: {clientName}</p>
                <p>Atendido por: {userName}</p>
              </>
            ) : isAbono ? (
              <>
                <SectionTitle>RECIBO DE ABONO A CRÉDITO</SectionTitle>
                <p>Fecha: {fechaStr}</p>
                <p>Recibo #{ticketId}</p>
                <p>Cliente: {clientName}</p>
                <p>Atendido por: {userName}</p>
              </>
            ) : (
              <>
                <p>Factura de Venta {transaction.estado === 'DEVOLUCION' && '(Con Devolución)'}</p>
                <p>Fecha: {fechaStr}</p>
                <p>Factura #{ticketId}</p>
                <p>Cliente: {clientName}</p>
                <p>Atendido por: {userName}</p>
              </>
            )}
          </PrintHeader>

          {/* Cuerpo */}
          {isAbono ? (
            <CreditSummary>
              <SectionTitle>Resumen de Crédito</SectionTitle>
              <TotalsRow><span>Saldo Anterior:</span><span>C${fmt(saldoAnterior)}</span></TotalsRow>
              <TotalsRow $bold style={{ color:'#28a745' }}><span>SU ABONO:</span><span>C${fmt(abonoMonto)}</span></TotalsRow>
              <TotalsRow $bold style={{ borderTop:'1px dashed #333', paddingTop:'5px', marginTop:'5px', fontSize:'1.1em' }}>
                <span>Nuevo Saldo Pendiente:</span><span>C${fmt(nuevoSaldo)}</span>
              </TotalsRow>
            </CreditSummary>
          ) : (
            <>
              <ItemTable>
                <thead>
                  <tr>
                    <th className="col-qty">Cant.</th>
                    <th>Descripción</th>
                    <th className="text-right col-price">P. Unit.</th>
                    <th className="text-right col-total">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0
                    ? <tr><td colSpan="4" style={{textAlign:'center', color:'#777'}}>Sin ítems</td></tr>
                    : items.map(it => (
                        <tr key={it.id}>
                          <td>{it.quantity}</td>
                          <td>{it.nombre}</td>
                          <td className="text-right">C${fmt(it.unit)}</td>
                          <td className="text-right">C${fmt(it.total)}</td>
                        </tr>
                      ))
                  }
                </tbody>
              </ItemTable>

              <div style={{borderTop:'1px dashed #333', paddingTop:'.5rem'}}>
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
                  <Band>DOCUMENTO NO VÁLIDO COMO FACTURA FISCAL</Band>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <PrintFooter>
            <p>¡Gracias por su preferencia!</p>
            <p>Llámenos: 84031936 / 84058142</p>
            <p>Tienda MultirepuestosRG</p>
          </PrintFooter>
        </PrintWrapper>

        <Button pay mt="true" style={{ width: '100%', minHeight: '48px' }} onClick={handlePrintDirect}>
          <FaPrint /> Imprimir Factura (80mm)
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TicketModal;
