import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSearch, FaExclamationCircle, FaUserCheck, FaSync, FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import * as api from '../../../service/api';

// --- ESTILOS (Optimizados) ---
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.75); z-index: 1200;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`;
const ModalContainer = styled.div`
  background: white; padding: 25px; border-radius: 12px;
  width: 95%; max-width: 1000px; height: 85vh; display: flex; flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: fadeIn 0.3s;
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 15px;
`;
const Title = styled.h2` margin: 0; color: #111827; display: flex; align-items: center; gap: 10px; `;
const CloseButton = styled.button`
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9ca3af;
  transition: color 0.2s; &:hover { color: #ef4444; }
`;
const TableContainer = styled.div`
  flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 15px;
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th { background-color: #f9fafb; padding: 14px; text-align: left; font-weight: 700; color: #374151; position: sticky; top: 0; z-index: 10; border-bottom: 2px solid #e5e7eb; }
  td { padding: 12px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: middle; }
  tr:hover { background-color: #f0f9ff; }
`;
const Button = styled.button`
  padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;
  color: white; background-color: ${p => p.color || '#3b82f6'};
  display: flex; align-items: center; gap: 8px; justify-content: center;
  transition: all 0.2s;
  &:disabled { background-color: #9ca3af; cursor: not-allowed; }
  &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
`;
const Input = styled.input`
  padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%; outline: none; font-size: 1rem;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
`;
const PaySection = styled.div`
  background: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe;
  display: flex; flex-direction: column; gap: 15px; animation: slideUp 0.3s;
`;
const Badge = styled.span`
  padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  background: ${p => p.bg}; color: ${p => p.color};
`;

const PendingTicketsModal = ({ onClose, onRegisterTransaction, currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo'); 
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadAllPending();
  }, []);

  // --- FUNCIÓN INTELIGENTE DE NORMALIZACIÓN ---
  // Esta función revisa todos los posibles nombres que tu base de datos pueda tener
  const normalizeData = (item, originType) => {
    // 1. Detectar ID
    const id = item.id || item.id_pedido || item.id_venta;

    // 2. Detectar Total (Venta o Pedido)
    const total = parseFloat(
        item.total || item.total_venta || item.total_pedido || item.monto_total || item.amount || 0
    );
    
    // 3. Detectar Abono/Pagado
    const abonado = parseFloat(
        item.abonado || item.monto_pagado || item.pagado || item.abono || 0
    );

    // 4. Detectar Cliente (Objeto o String)
    let clientName = 'Cliente Casual';
    if (item.clienteNombre) clientName = item.clienteNombre;
    else if (item.nombre_cliente) clientName = item.nombre_cliente;
    else if (item.cliente && typeof item.cliente === 'object') clientName = item.cliente.nombre || item.cliente.razon_social;
    else if (item.cliente && typeof item.cliente === 'string') clientName = item.cliente;

    // 5. Detectar Fecha
    const fecha = item.created_at || item.fecha || item.date || new Date().toISOString();

    // 6. Estado
    const estado = (item.estado || 'PENDIENTE').toUpperCase();

    return {
        original: item, 
        id: id,
        type: originType, // 'Pedido' o 'Venta'
        date: fecha,
        clientName: clientName,
        total: total,
        abonado: abonado,
        saldo: total - abonado,
        estado: estado
    };
  };

  const loadAllPending = async () => {
    setLoading(true);
    let combinedData = [];

    try {
        console.log("--- Iniciando Carga de Pendientes ---");

        // 1. Cargar PEDIDOS (Orders)
        try {
            const ordersRes = await api.fetchOrders(token);
            // Manejo robusto de respuesta: puede ser array directo o objeto { data: [] }
            const ordersRaw = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || ordersRes.orders || []);
            const ordersNorm = ordersRaw.map(o => normalizeData(o, 'Pedido'));
            combinedData = [...combinedData, ...ordersNorm];
            console.log(`Pedidos cargados: ${ordersNorm.length}`);
        } catch (e) {
            console.warn("Error cargando pedidos (puede que la ruta no exista o falle):", e);
        }

        // 2. Cargar VENTAS (Sales) con saldo pendiente
        try {
            const salesRes = await api.fetchSales(token);
            const salesRaw = Array.isArray(salesRes) ? salesRes : (salesRes.data || []);
            const salesNorm = salesRaw.map(s => normalizeData(s, 'Venta'));
            combinedData = [...combinedData, ...salesNorm];
            console.log(`Ventas cargadas: ${salesNorm.length}`);
        } catch (e) {
            console.warn("Error cargando ventas:", e);
        }

        // 3. FILTRADO MAESTRO
        // Mostrar solo lo que tiene deuda (Saldo > 0.5) Y no está cancelado/completado totalmente
        const pending = combinedData.filter(item => {
            const hasDebt = item.saldo > 0.5;
            const isNotCancelled = item.estado !== 'CANCELADO' && item.estado !== 'ANULADO';
            return hasDebt && isNotCancelled;
        });

        // 4. Ordenar: Lo más reciente primero
        pending.sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log("Total tickets procesables:", pending.length);
        setTickets(pending);

    } catch (error) {
        console.error("Error crítico general:", error);
        alert("Ocurrió un error al cargar los datos. Revisa la conexión.");
    } finally {
        setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedTicket || !amount || Number(amount) <= 0) return;
    
    const payAmount = Number(amount);
    
    if (payAmount > (selectedTicket.saldo + 0.5)) {
        alert(`El abono no puede ser mayor a la deuda (C$ ${selectedTicket.saldo.toFixed(2)})`);
        return;
    }

    try {
      // Usamos addPaymentToSale. 
      // NOTA: Si tu backend requiere un endpoint diferente para pedidos (ej. /orders/:id/pay), cámbialo aquí.
      // Por lo general, los sistemas unifican el pago por ID.
      await api.addPaymentToSale({
        saleId: selectedTicket.id, 
        amount: payAmount,
        method: paymentMethod,
        userId: currentUser?.id || currentUser?.id_usuario
      }, token);

      // Registrar movimiento en CAJA LOCAL
      if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
        const note = `Cobro de ${selectedTicket.type} #${selectedTicket.id} - ${selectedTicket.clientName}`;
        onRegisterTransaction('entrada', payAmount, note);
      }

      alert("¡Pago aplicado correctamente!");
      setSelectedTicket(null);
      setAmount('');
      loadAllPending(); // Recargar la lista para actualizar saldos
    } catch (error) {
      console.error(error);
      alert("Error al registrar el pago: " + (error.message || "Error desconocido del servidor"));
    }
  };

  // Buscador en tiempo real
  const filteredTickets = tickets.filter(t => {
    const term = searchTerm.toLowerCase();
    const cName = (t.clientName || '').toLowerCase();
    const tId = String(t.id || '');
    return cName.includes(term) || tId.includes(term);
  });

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title><FaClipboardList /> Cuentas por Cobrar (Pedidos y Ventas)</Title>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </Header>

        <div style={{display: 'flex', gap: 10, marginBottom: 15}}>
            <div style={{position: 'relative', flex: 1}}>
                <FaSearch style={{position: 'absolute', top: 14, left: 12, color: '#9ca3af'}}/>
                <Input 
                    style={{paddingLeft: 38}}
                    placeholder="Buscar por cliente, ID de pedido o venta..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
            <Button onClick={loadAllPending} color="#6b7280" title="Forzar recarga">
                <FaSync /> Actualizar
            </Button>
        </div>

        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <th style={{width: '80px'}}>ID</th>
                        <th style={{width: '100px'}}>Origen</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Abonado</th>
                        <th>Saldo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? 
                        <tr><td colSpan="9" style={{textAlign: 'center', padding: 30, color: '#6b7280'}}>Cargando datos...</td></tr> 
                    : filteredTickets.length === 0 ? 
                        <tr><td colSpan="9" style={{textAlign: 'center', padding: 30, color: '#9ca3af', fontStyle: 'italic'}}>
                            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                                <FaExclamationCircle size={30}/>
                                No se encontraron cuentas pendientes.
                            </div>
                        </td></tr> 
                    : filteredTickets.map((ticket, index) => {
                        const dateStr = ticket.date ? new Date(ticket.date).toLocaleDateString() : 'S/F';
                        return (
                        <tr key={`${ticket.type}-${ticket.id}-${index}`}>
                            <td><strong>#{ticket.id}</strong></td>
                            <td>
                                {ticket.type === 'Pedido' ? 
                                    <Badge bg="#fff7ed" color="#c2410c"><FaClipboardList/> PEDIDO</Badge> : 
                                    <Badge bg="#eff6ff" color="#1d4ed8"><FaShoppingCart/> VENTA</Badge>
                                }
                            </td>
                            <td>{dateStr}</td>
                            <td><FaUserCheck style={{color: '#6b7280', marginRight:5}}/> {ticket.clientName}</td>
                            <td>
                                <Badge bg="#fee2e2" color="#991b1b">{ticket.estado}</Badge>
                            </td>
                            <td>C$ {ticket.total.toFixed(2)}</td>
                            <td style={{color: '#059669'}}>C$ {ticket.abonado.toFixed(2)}</td>
                            <td style={{color: '#dc2626', fontWeight: 'bold', fontSize: '1.05rem'}}>C$ {ticket.saldo.toFixed(2)}</td>
                            <td>
                                <Button 
                                    color="#10b981"
                                    onClick={() => { setSelectedTicket(ticket); setAmount(ticket.saldo); /* Sugerir saldo total */ }}
                                >
                                    <FaMoneyBillWave /> Cobrar
                                </Button>
                            </td>
                        </tr>
                     )})}
                </tbody>
            </Table>
        </TableContainer>

        {selectedTicket && (
            <PaySection>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                    <h3 style={{margin: 0, color: '#1e40af', display:'flex', alignItems:'center', gap: 10}}>
                        <FaMoneyBillWave /> Cobrando {selectedTicket.type} #{selectedTicket.id} 
                        <span style={{fontSize:'0.9rem', color:'#6b7280', fontWeight:'normal'}}>({selectedTicket.clientName})</span>
                    </h3>
                    <button onClick={() => setSelectedTicket(null)} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#666', fontSize: '1.2rem'}}>
                        <FaTimes/>
                    </button>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                    <div>
                        <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>
                            Monto a Pagar (Deuda: <span style={{color: '#dc2626'}}>C$ {selectedTicket.saldo.toFixed(2)}</span>)
                        </label>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                            onKeyDown={e => e.key === 'Enter' && handleProcessPayment()}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#374151'}}>Método de Pago</label>
                        <select 
                            style={{width: '100%', padding: 12, borderRadius: 6, border: '1px solid #d1d5db', fontSize: '1rem', background: 'white'}}
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                        >
                            <option value="Efectivo">Efectivo (Caja)</option>
                            <option value="Tarjeta">Tarjeta (Banco)</option>
                            <option value="Transferencia">Transferencia (Banco)</option>
                            <option value="Sinpe">Móvil / Otro</option>
                        </select>
                    </div>
                </div>
                
                <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 15}}>
                    <Button color="#ef4444" onClick={() => setSelectedTicket(null)}>Cancelar Operación</Button>
                    <Button color="#2563eb" onClick={handleProcessPayment} style={{fontSize: '1.05rem', padding: '10px 30px'}}>
                        CONFIRMAR PAGO
                    </Button>
                </div>
                {paymentMethod === 'Efectivo' && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: '0.85rem', marginTop: 10, fontWeight: 600}}>
                        <FaExclamationCircle /> 
                        <span>Este ingreso se registrará automáticamente en tu corte de caja actual.</span>
                    </div>
                )}
            </PaySection>
        )}

      </ModalContainer>
    </Overlay>
  );
};

export default PendingTicketsModal;