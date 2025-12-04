import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSearch, FaExclamationCircle } from 'react-icons/fa';
import * as api from '../../../service/api'; // Ajusta la ruta según tu estructura real

// --- ESTILOS ---
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); z-index: 1200;
  display: flex; align-items: center; justify-content: center;
`;
const ModalContainer = styled.div`
  background: white; padding: 25px; border-radius: 12px;
  width: 95%; max-width: 900px; max-height: 90vh; overflow-y: auto;
  display: flex; flex-direction: column; gap: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;
`;
const Title = styled.h2` margin: 0; color: #1f2937; display: flex; align-items: center; gap: 10px; `;
const CloseButton = styled.button`
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9ca3af;
  &:hover { color: #ef4444; }
`;
const TableContainer = styled.div`
  flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 8px;
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th { background-color: #f9fafb; padding: 12px; text-align: left; font-weight: 600; color: #4b5563; position: sticky; top: 0; }
  td { padding: 12px; border-bottom: 1px solid #f3f4f6; color: #1f2937; }
  tr:hover { background-color: #f8fafc; }
`;
const Button = styled.button`
  padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;
  color: white; background-color: ${p => p.color || '#3b82f6'};
  display: flex; align-items: center; gap: 8px; justify-content: center;
  transition: opacity 0.2s;
  &:disabled { background-color: #9ca3af; cursor: not-allowed; }
  &:hover:not(:disabled) { opacity: 0.9; }
`;
const Input = styled.input`
  padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%;
`;
const PaySection = styled.div`
  background: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #dbeafe;
  display: flex; flex-direction: column; gap: 15px; animation: fadeIn 0.3s;
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
    loadPendingTickets();
  }, []);

  const loadPendingTickets = async () => {
    setLoading(true);
    try {
      // 1. Obtenemos todas las ventas/pedidos
      const allSales = await api.fetchOrders(token); 
      
      // 2. Filtramos solo las que deben dinero (Saldo pendiente > 0)
      // Aseguramos que 'saldo_pendiente' o la lógica de cálculo exista
      const pending = Array.isArray(allSales) 
        ? allSales.filter(s => {
            const total = parseFloat(s.total || 0);
            const abonado = parseFloat(s.abonado || 0);
            const saldo = total - abonado;
            // Mostramos si hay deuda y no está cancelado
            return saldo > 0.5 && s.estado !== 'CANCELADO';
          })
        : [];
        
      setTickets(pending);
    } catch (error) {
      console.error("Error cargando pendientes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedTicket || !amount || Number(amount) <= 0) return;
    
    const payAmount = Number(amount);
    const total = parseFloat(selectedTicket.total || 0);
    const abonadoPrevio = parseFloat(selectedTicket.abonado || 0);
    const deudaActual = total - abonadoPrevio;

    if (payAmount > (deudaActual + 0.5)) { // Margen de error pequeño por decimales
        alert("El abono no puede ser mayor al saldo pendiente.");
        return;
    }

    try {
      // 1. Registrar el abono en la base de datos de la venta
      await api.addPaymentToSale({
        saleId: selectedTicket.id,
        amount: payAmount,
        method: paymentMethod,
        userId: currentUser?.id
      }, token);

      // 2. IMPORTANTE: Si es EFECTIVO, avisar al POS para meter dinero en Caja
      if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
        const clientName = selectedTicket.clienteNombre || selectedTicket.cliente?.nombre || 'Cliente';
        const note = `Cobro Ticket #${selectedTicket.id} - ${clientName}`;
        
        // Esta función viene del padre (POS.jsx)
        onRegisterTransaction('entrada', payAmount, note);
      }

      alert("¡Abono registrado con éxito!");
      setSelectedTicket(null);
      setAmount('');
      loadPendingTickets(); // Recargar lista para quitar al que ya pagó
    } catch (error) {
      console.error(error);
      alert("Error al registrar abono: " + (error.message || "Error desconocido"));
    }
  };

  // Filtrado en tiempo real
  const filteredTickets = tickets.filter(t => 
    (t.clienteNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(t.id).includes(searchTerm)
  );

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title><FaMoneyBillWave /> Cobrar Cuentas Pendientes</Title>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </Header>

        {/* Buscador */}
        <div style={{display: 'flex', gap: 10}}>
            <div style={{position: 'relative', flex: 1}}>
                <FaSearch style={{position: 'absolute', top: 12, left: 10, color: '#9ca3af'}}/>
                <Input 
                    style={{paddingLeft: 35}}
                    placeholder="Buscar por nombre de cliente o número de ticket..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
            <Button onClick={loadPendingTickets} color="#6b7280">Refrescar</Button>
        </div>

        {/* Tabla de Deudores */}
        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Abonado</th>
                        <th>Deuda</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <tr><td colSpan="8" style={{textAlign: 'center'}}>Cargando cuentas...</td></tr> : 
                     filteredTickets.length === 0 ? <tr><td colSpan="8" style={{textAlign: 'center', padding: 20}}>No hay cuentas por cobrar.</td></tr> :
                     filteredTickets.map(ticket => {
                        const total = parseFloat(ticket.total || 0);
                        const abonado = parseFloat(ticket.abonado || 0);
                        const deuda = total - abonado;
                        return (
                        <tr key={ticket.id}>
                            <td>#{ticket.id}</td>
                            <td>{new Date(ticket.created_at || ticket.fecha).toLocaleDateString()}</td>
                            <td><strong>{ticket.clienteNombre || 'Cliente Casual'}</strong></td>
                            <td><span style={{padding: '2px 8px', borderRadius: 10, background: '#dbeafe', color: '#1e40af', fontSize: '0.8rem'}}>{ticket.estado}</span></td>
                            <td>C$ {total.toFixed(2)}</td>
                            <td>C$ {abonado.toFixed(2)}</td>
                            <td style={{color: '#dc2626', fontWeight: 'bold'}}>C$ {deuda.toFixed(2)}</td>
                            <td>
                                <Button 
                                    color="#10b981"
                                    onClick={() => { setSelectedTicket({...ticket, deudaCalculada: deuda}); setAmount(''); }}
                                >
                                    Cobrar
                                </Button>
                            </td>
                        </tr>
                     )})}
                </tbody>
            </Table>
        </TableContainer>

        {/* Panel de Pago (Abajo) */}
        {selectedTicket && (
            <PaySection>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3 style={{margin: 0}}>Cobrando Ticket #{selectedTicket.id}</h3>
                    <button onClick={() => setSelectedTicket(null)} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#666'}}><FaTimes/></button>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                    <div>
                        <label style={{display: 'block', marginBottom: 5, fontWeight: 600}}>Monto a Pagar (Máx: {selectedTicket.deudaCalculada.toFixed(2)})</label>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: 5, fontWeight: 600}}>Método</label>
                        <select 
                            style={{width: '100%', padding: 10, borderRadius: 6, border: '1px solid #d1d5db'}}
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                        >
                            <option value="Efectivo">Efectivo (Entra a Caja)</option>
                            <option value="Tarjeta">Tarjeta (Banco)</option>
                            <option value="Transferencia">Transferencia (Banco)</option>
                        </select>
                    </div>
                </div>
                
                <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10}}>
                    <Button color="#ef4444" onClick={() => setSelectedTicket(null)}>Cancelar</Button>
                    <Button color="#3b82f6" onClick={handleProcessPayment}>
                        <FaMoneyBillWave /> Confirmar Pago
                    </Button>
                </div>
                {paymentMethod === 'Efectivo' && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 5, color: '#059669', fontSize: '0.9rem'}}>
                        <FaExclamationCircle /> 
                        <span>Este dinero se sumará automáticamente a tu turno de caja actual.</span>
                    </div>
                )}
            </PaySection>
        )}

      </ModalContainer>
    </Overlay>
  );
};

export default PendingTicketsModal;