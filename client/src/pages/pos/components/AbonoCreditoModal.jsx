// AbonoCreditoModal.jsx — Sistema de abono a Cuenta General (FIFO) o por Factura Individual con Iconos por Método
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  FaTimes, FaSave, FaSpinner, FaMoneyBillWave, FaFileInvoiceDollar,
  FaCheckCircle, FaUniversity, FaCreditCard, FaLandmark, FaReceipt
} from 'react-icons/fa';
import * as api from '../../../service/api';
import { useAuth } from '../../../context/AuthContext.jsx';

// ===================== Styled Components =====================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(6px);
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 620px;
  max-width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.28);
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.22s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #0f766e 100%);
  color: white;
  padding: 1.35rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.14);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(239, 68, 68, 0.85);
    transform: rotate(90deg);
  }
`;

const Body = styled.div`
  padding: 1.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const ClientBanner = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Label = styled.label`
  font-weight: 700;
  color: #334155;
  font-size: 0.84rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.2s;
  &:focus {
    border-color: #0d9488;
    background: #ffffff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  }
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const MethodCard = styled.button`
  type: button;
  padding: 0.85rem 0.75rem;
  border-radius: 12px;
  border: 2px solid ${p => p.$active ? p.$color : '#e2e8f0'};
  background: ${p => p.$active ? p.$bg : '#ffffff'};
  color: ${p => p.$active ? p.$color : '#475569'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${p => p.$active ? `0 8px 18px -4px ${p.$shadow}` : '0 2px 5px rgba(0,0,0,0.02)'};

  .icon-badge {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    background: ${p => p.$active ? p.$color : '#f1f5f9'};
    color: ${p => p.$active ? '#ffffff' : p.$color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    transition: all 0.2s;
  }
  .method-title {
    font-size: 0.88rem;
    font-weight: 800;
  }
  .method-sub {
    font-size: 0.7rem;
    opacity: 0.8;
    font-weight: 600;
  }
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: ${p => p.$color};
  }
`;

const Button = styled.button`
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.04);
  }
  &:disabled {
    background: #94a3b8;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  margin: -0.25rem 0 0;
  padding: 0.55rem 0.85rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.86rem;
  font-weight: 700;
  text-align: center;
`;

const SpinAnimation = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

// ===================== Ticket & Cuenta General Cards =====================
const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  max-height: 230px;
  overflow-y: auto;
  padding: 0.2rem;
`;

const TicketCard = styled.div`
  padding: 0.8rem 1rem;
  border: 2px solid ${p => p.$selected ? '#0d9488' : '#e2e8f0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.18s;
  background: ${p => p.$selected ? '#f0fdfa' : (p.$paid ? '#f8fafc' : '#ffffff')};
  opacity: ${p => p.$paid ? 0.65 : 1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  &:hover {
    border-color: ${p => p.$paid ? '#e2e8f0' : '#0d9488'};
  }

  .left-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .dest-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    background: ${p => p.$selected ? '#0d9488' : (p.$isGeneral ? '#dbeafe' : '#f1f5f9')};
    color: ${p => p.$selected ? '#ffffff' : (p.$isGeneral ? '#1d4ed8' : '#475569')};
    flex-shrink: 0;
  }
  .ticket-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    .ticket-id {
      font-weight: 800;
      color: #0f172a;
      font-size: 0.92rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .ticket-date {
      font-size: 0.78rem;
      color: #64748b;
    }
  }
  .ticket-amounts {
    text-align: right;
    .original {
      font-size: 0.78rem;
      color: #94a3b8;
      text-decoration: line-through;
    }
    .remaining {
      font-weight: 800;
      color: ${p => p.$paid ? '#10b981' : '#ef4444'};
      font-size: 1rem;
    }
  }
`;

const PreviewBox = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  text-align: center;
  .item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    span.lbl { font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
    span.val { font-size: 1rem; font-weight: 800; }
  }
`;

const formatCurrency = (amount) => `C$${Number(amount || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-NI', {
    timeZone: 'America/Managua', day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

const PAYMENT_METHODS = [
  {
    id: 'Efectivo',
    title: 'Normal / Contado',
    sub: 'Efectivo en Caja',
    icon: FaMoneyBillWave,
    color: '#059669',
    bg: '#ecfdf5',
    shadow: 'rgba(16, 185, 129, 0.28)'
  },
  {
    id: 'Transferencia',
    title: 'Transferencia',
    sub: 'Bancaria / Móvil',
    icon: FaUniversity,
    color: '#2563eb',
    bg: '#eff6ff',
    shadow: 'rgba(37, 99, 235, 0.28)'
  },
  {
    id: 'Tarjeta',
    title: 'Tarjeta / POS',
    sub: 'Débito o Crédito',
    icon: FaCreditCard,
    color: '#7c3aed',
    bg: '#f5f3ff',
    shadow: 'rgba(124, 58, 237, 0.28)'
  }
];

const AbonoCreditoModal = ({ client, onClose, onAbonoSuccess, showAlert }) => {
  const { addCajaTransaction, user } = useAuth();

  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [referencia, setReferencia] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMonto, setErrorMonto] = useState('');

  // Per-ticket state (null = Cuenta General / FIFO automático)
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const saldoPendiente = useMemo(() => Number(client?.saldo_pendiente) || 0, [client]);

  useEffect(() => {
    const loadTickets = async () => {
      setLoadingTickets(true);
      try {
        const token = localStorage.getItem('token');
        const data = await api.getCreditosPendientes(client.id_cliente, token);
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando tickets:', err);
        setTickets([]);
      } finally {
        setLoadingTickets(false);
      }
    };
    if (client?.id_cliente) loadTickets();
  }, [client]);

  const pendingTickets = useMemo(() => tickets.filter(t => t.saldoRestante > 0), [tickets]);
  const paidTickets = useMemo(() => tickets.filter(t => t.saldoRestante <= 0), [tickets]);

  const maxMonto = selectedTicket
    ? Math.min(saldoPendiente, selectedTicket.saldoRestante)
    : saldoPendiente;

  useEffect(() => {
    if (!monto) { setErrorMonto(''); return; }
    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setErrorMonto('Ingrese un monto válido mayor a cero.');
    } else if (montoNum > maxMonto + 0.009) {
      setErrorMonto(`El máximo permitido es ${formatCurrency(maxMonto)}.`);
    } else {
      setErrorMonto('');
    }
  }, [monto, maxMonto]);

  const handleSelectTicket = (ticket) => {
    if (!ticket) {
      setSelectedTicket(null);
      setMonto('');
      return;
    }
    if (ticket.saldoRestante <= 0) return;
    setSelectedTicket(prev => prev?.idVenta === ticket.idVenta ? null : ticket);
    setMonto('');
  };

  const handlePayFull = () => {
    if (selectedTicket) {
      setMonto(selectedTicket.saldoRestante.toFixed(2));
    } else {
      setMonto(saldoPendiente.toFixed(2));
    }
  };

  const handlePayHalf = () => {
    const base = selectedTicket ? selectedTicket.saldoRestante : saldoPendiente;
    setMonto((base / 2).toFixed(2));
  };

  const printAbonoReceipt = useCallback((montoNum, metodo, ref, saldoAntes) => {
    const saldoDespues = Math.max(0, saldoAntes - montoNum);
    const now = new Date().toLocaleString('es-NI', { timeZone: 'America/Managua' });
    const ticketRef = selectedTicket ? `Venta #${selectedTicket.idVenta}` : 'Cuenta General';

    const html = `
      <div style="font-family:'League Spartan','Inter',system-ui,sans-serif;width:80mm;padding:6px 4px;font-size:9pt;color:#000;">
        <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:6px;">
          <h1 style="margin:4px 0;font-size:14pt;font-weight:900;">COMPROBANTE DE ABONO</h1>
        </div>
        <div style="margin-bottom:8px;border-bottom:1px dashed #000;padding-bottom:6px;">
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Cliente:</strong><span>${client?.nombre || 'N/A'}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Fecha:</strong><span>${now}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Aplicado a:</strong><span>${ticketRef}</span></p>
          <p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Método:</strong><span>${metodo === 'Efectivo' ? 'Contado / Efectivo' : metodo}</span></p>
          ${ref ? `<p style="margin:2px 0;display:flex;justify-content:space-between;"><strong>Ref:</strong><span>${ref}</span></p>` : ''}
        </div>
        <div style="border-top:2px solid #000;padding-top:8px;margin-top:8px;">
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:11pt;"><strong>Saldo Anterior:</strong><span>C$${saldoAntes.toFixed(2)}</span></p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;color:#28a745;"><strong>ABONO:</strong><span>C$${montoNum.toFixed(2)}</span></p>
          <p style="display:flex;justify-content:space-between;margin:4px 0;font-size:14pt;font-weight:900;color:#dc3545;border-top:2px solid #000;padding-top:6px;"><strong>SALDO RESTANTE:</strong><span>C$${saldoDespues.toFixed(2)}</span></p>
        </div>
        <div style="text-align:center;margin-top:12px;font-size:8pt;font-style:italic;color:#555;border-top:1px dashed #000;padding-top:8px;">
          Documento no válido como factura.<br/>Gracias por su pago.
        </div>
      </div>
    `;

    const w = window.open('', '_blank', 'width=400,height=600');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Comprobante Abono</title><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700;900&display=swap" rel="stylesheet"><style>@page{size:80mm auto;margin:0;}body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}*{font-weight:800!important;color:#000!important;}</style></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    w.onload = function () { setTimeout(() => { w.print(); setTimeout(() => w.close(), 500); }, 400); };
  }, [client, selectedTicket]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const montoNum = parseFloat(monto);
    const token = localStorage.getItem('token');

    if (errorMonto || !montoNum || montoNum <= 0) {
      showAlert?.({ title: "Monto Inválido", message: errorMonto || "Revise el monto ingresado." });
      return;
    }

    if (metodoPago !== 'Efectivo' && !referencia.trim()) {
      showAlert?.({ title: "Referencia Requerida", message: "Ingrese el número de referencia, transferencia o voucher." });
      return;
    }

    setIsLoading(true);
    try {
      const destinoLabel = selectedTicket ? `Venta #${selectedTicket.idVenta}` : 'Cuenta General';

      // 1. Registrar abono en backend (con ticket específico o Cuenta General FIFO)
      await api.addCreditPayment(client.id_cliente, {
        monto: montoNum,
        id_venta: selectedTicket?.idVenta || null,
        pagoDetalles: {
          metodo: metodoPago,
          usuario: user?.nombre_usuario || 'Desconocido',
          referencia: referencia || '',
          ticketRef: destinoLabel,
          esCuentaGeneral: !selectedTicket
        }
      }, token);

      // 2. Registrar la transacción en la caja (intacto para POS y Reportes)
      const esIngresoEnCaja = metodoPago === 'Efectivo';
      const txCaja = {
        id: `abono-${Date.now()}`,
        type: 'abono',
        amount: montoNum,
        note: `Abono Cliente: ${client.nombre} (${metodoPago}) - ${destinoLabel}${referencia ? ' - Ref: ' + referencia : ''}`,
        at: new Date().toISOString(),
        pagoDetalles: {
          clienteId: client.id_cliente,
          clienteNombre: client.nombre,
          metodo: metodoPago,
          referencia: referencia,
          ticketRef: destinoLabel,
          ingresoCaja: esIngresoEnCaja ? montoNum : 0,
          efectivo: esIngresoEnCaja ? montoNum : 0,
          tarjeta: metodoPago === 'Tarjeta' ? montoNum : 0,
          transferencia: metodoPago === 'Transferencia' ? montoNum : 0,
          credito: 0
        }
      };

      await addCajaTransaction(txCaja);

      // 3. Imprimir comprobante de abono
      printAbonoReceipt(montoNum, metodoPago, referencia, saldoPendiente);

      onAbonoSuccess?.(txCaja);
      onClose?.();
    } catch (err) {
      console.error("Error al registrar abono:", err);
      showAlert?.({ title: "Error", message: `No se pudo registrar el abono. ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, [monto, metodoPago, referencia, errorMonto, client, user, selectedTicket, addCajaTransaction, onAbonoSuccess, onClose, showAlert, printAbonoReceipt, saldoPendiente]);

  const isSubmitDisabled = isLoading || saldoPendiente <= 0 || !!errorMonto || !monto;
  const montoNumPreview = parseFloat(monto) || 0;
  const nuevoSaldoPreview = Math.max(0, maxMonto - montoNumPreview);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Header>
          <Title><FaMoneyBillWave /> Registrar Abono de Cliente</Title>
          <CloseButton onClick={onClose} disabled={isLoading} type="button"><FaTimes /></CloseButton>
        </Header>

        <Body>
          <ClientBanner>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Cliente</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{client?.nombre || 'Desconocido'}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ID #{client?.id_cliente} {client?.telefono ? `• Tel: ${client.telefono}` : ''}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Deuda Total Actual</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#dc2626' }}>{formatCurrency(saldoPendiente)}</div>
            </div>
          </ClientBanner>

          {/* ─── DESTINO DEL ABONO: CUENTA GENERAL O FACTURA ESPECÍFICA ─── */}
          <div>
            <Label style={{ marginBottom: '0.5rem' }}>
              <FaLandmark style={{ color: '#0d9488' }} /> Destino del Abono (Cuenta General o Factura Específica)
            </Label>

            {loadingTickets ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                <SpinAnimation /> Cargando estado de cuenta...
              </div>
            ) : (
              <TicketList>
                {/* Opción 1: Cuenta General (FIFO) con su propio icono */}
                <TicketCard
                  $selected={!selectedTicket}
                  $isGeneral
                  onClick={() => handleSelectTicket(null)}
                >
                  <div className="left-wrap">
                    <div className="dest-icon">
                      <FaLandmark />
                    </div>
                    <div className="ticket-info">
                      <span className="ticket-id">
                        Cuenta General (Abono General Automático)
                      </span>
                      <span className="ticket-date">
                        Se abona a la deuda general liquidando primero las facturas más antiguas
                      </span>
                    </div>
                  </div>
                  <div className="ticket-amounts">
                    <div className="remaining">{formatCurrency(saldoPendiente)}</div>
                  </div>
                </TicketCard>

                {/* Opción 2: Facturas individuales pendientes */}
                {pendingTickets.map(t => (
                  <TicketCard
                    key={t.idVenta}
                    $selected={selectedTicket?.idVenta === t.idVenta}
                    onClick={() => handleSelectTicket(t)}
                  >
                    <div className="left-wrap">
                      <div className="dest-icon">
                        <FaReceipt />
                      </div>
                      <div className="ticket-info">
                        <span className="ticket-id">Factura / Venta #{t.idVenta}</span>
                        <span className="ticket-date">Fecha: {fmtDate(t.fecha)}</span>
                      </div>
                    </div>
                    <div className="ticket-amounts">
                      {t.montoOriginal !== t.saldoRestante && (
                        <div className="original">Orig: {formatCurrency(t.montoOriginal)}</div>
                      )}
                      <div className="remaining">{formatCurrency(t.saldoRestante)}</div>
                    </div>
                  </TicketCard>
                ))}
              </TicketList>
            )}

            {paidTickets.length > 0 && (
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                  <FaCheckCircle style={{ color: '#10b981' }} /> Ver {paidTickets.length} factura(s) ya cancelada(s)
                </summary>
                <TicketList style={{ marginTop: '0.45rem' }}>
                  {paidTickets.map(t => (
                    <TicketCard key={t.idVenta} $paid>
                      <div className="left-wrap">
                        <div className="dest-icon"><FaCheckCircle /></div>
                        <div className="ticket-info">
                          <span className="ticket-id">Venta #{t.idVenta}</span>
                          <span className="ticket-date">{fmtDate(t.fecha)}</span>
                        </div>
                      </div>
                      <div className="ticket-amounts">
                        <div className="remaining" style={{ color: '#10b981' }}>Pagada ✔</div>
                      </div>
                    </TicketCard>
                  ))}
                </TicketList>
              </details>
            )}
          </div>

          {/* ─── FORMULARIO DE PAGO ─── */}
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>
                Método de Pago del Abono (Con su icono en el registro)
              </Label>
              <MethodGrid>
                {PAYMENT_METHODS.map(m => {
                  const IconComp = m.icon;
                  const active = metodoPago === m.id;
                  return (
                    <MethodCard
                      key={m.id}
                      type="button"
                      $active={active}
                      $color={m.color}
                      $bg={m.bg}
                      $shadow={m.shadow}
                      onClick={() => setMetodoPago(m.id)}
                      disabled={isLoading}
                    >
                      <div className="icon-badge"><IconComp /></div>
                      <span className="method-title">{m.title}</span>
                      <span className="method-sub">{m.sub}</span>
                    </MethodCard>
                  );
                })}
              </MethodGrid>
            </InputGroup>

            {metodoPago !== 'Efectivo' && (
              <InputGroup>
                <Label htmlFor="referencia">
                  {metodoPago === 'Transferencia' ? 'N° de Referencia / Banco de Transferencia *' : 'N° de Voucher / Autorización POS *'}
                </Label>
                <Input
                  id="referencia"
                  type="text"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                  placeholder={metodoPago === 'Transferencia' ? 'Ej: BAC-984512 / Lafise-3321' : 'Ej: Voucher #4589'}
                  required
                />
              </InputGroup>
            )}

            <InputGroup>
              <Label htmlFor="montoAbono">
                Monto a Abonar (C$) — Aplicado a:{' '}
                <span style={{ color: '#0d9488' }}>
                  {selectedTicket ? `Venta #${selectedTicket.idVenta}` : 'Cuenta General'}
                </span>
              </Label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input
                  id="montoAbono"
                  type="number"
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                  placeholder="0.00"
                  required
                  autoFocus
                  step="0.01"
                  min="0.01"
                  max={maxMonto ? maxMonto.toFixed(2) : undefined}
                  disabled={isLoading || saldoPendiente <= 0}
                  style={{ flex: 1 }}
                />
                <Button
                  type="button"
                  onClick={handlePayHalf}
                  style={{ background: '#475569', padding: '0 0.9rem', fontSize: '0.84rem', boxShadow: 'none' }}
                  disabled={isLoading || saldoPendiente <= 0}
                >
                  50%
                </Button>
                <Button
                  type="button"
                  onClick={handlePayFull}
                  style={{ background: '#2563eb', padding: '0 1rem', fontSize: '0.84rem', boxShadow: 'none' }}
                  disabled={isLoading || saldoPendiente <= 0}
                >
                  Liquidar Total
                </Button>
              </div>
            </InputGroup>

            <PreviewBox>
              <div className="item">
                <span className="lbl">Saldo Evaluado</span>
                <span className="val" style={{ color: '#64748b' }}>{formatCurrency(maxMonto)}</span>
              </div>
              <div className="item">
                <span className="lbl">Su Abono ({metodoPago === 'Efectivo' ? 'Contado' : metodoPago})</span>
                <span className="val" style={{ color: '#10b981' }}>- {formatCurrency(montoNumPreview)}</span>
              </div>
              <div className="item">
                <span className="lbl">Nuevo Saldo</span>
                <span className="val" style={{ color: nuevoSaldoPreview > 0 ? '#dc2626' : '#10b981' }}>
                  {formatCurrency(nuevoSaldoPreview)}
                </span>
              </div>
            </PreviewBox>

            {errorMonto && <ErrorText>{errorMonto}</ErrorText>}

            <Button type="submit" disabled={isSubmitDisabled}>
              {isLoading ? (
                <><SpinAnimation /> Procesando Abono...</>
              ) : (
                <><FaSave /> Confirmar Abono en {selectedTicket ? `Venta #${selectedTicket.idVenta}` : 'Cuenta General'}</>
              )}
            </Button>
          </Form>
        </Body>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default React.memo(AbonoCreditoModal);
