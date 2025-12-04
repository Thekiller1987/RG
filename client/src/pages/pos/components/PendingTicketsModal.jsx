import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSearch, FaExclamationCircle, FaUserCheck } from 'react-icons/fa';
import * as api from '../../../service/api';

// --- ESTILOS ---
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); z-index: 1200;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(3px);
`;
const ModalContainer = styled.div`
  background: white; padding: 25px; border-radius: 12px;
  width: 95%; max-width: 950px; height: 85vh; display: flex; flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: fadeIn 0.3s;
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 15px;
`;
const Title = styled.h2` margin: 0; color: #1f2937; display: flex; align-items: center; gap: 10px; `;
const CloseButton = styled.button`
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #9ca3af;
  &:hover { color: #ef4444; }
`;
const TableContainer = styled.div`
  flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 15px;
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th { background-color: #f9fafb; padding: 12px; text-align: left; font-weight: 600; color: #4b5563; position: sticky; top: 0; }
  td { padding: 12px; border-bottom: 1px solid #f3f4f6; color: #1f2937; font-size: 0.95rem; }
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
  padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%; outline: none;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
`;
const PaySection = styled.div`
  background: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #dbeafe;
  display: flex; flex-direction: column; gap: 15px; animation: slideUp 0.3s;
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
      const allSales = await api.fetchOrders(token); 
      
      // Filtramos ventas que tengan deuda (Total - Abonado > 0) y no estén canceladas
      const pending = Array.isArray(allSales) 
        ? allSales.filter(s => {
            const total = parseFloat(s.total || s.total_venta || 0);
            const abonado = parseFloat(s.abonado || 0);
            const saldo = total - abonado;
            // Tolerancia de 0.5 por decimales, y excluimos cancelados
            return saldo > 0.5 && s.estado !== 'CANCELADO';
          })
        : [];
      
      // Ordenar por fecha (más recientes primero)
      pending.sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));
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
    const deudaActual = selectedTicket.deudaCalculada;

    if (payAmount > (deudaActual + 0.5)) {
        alert(`El abono no puede ser mayor a la deuda (C$ ${deudaActual.toFixed(2)})`);
        return;
    }

    try {
      // 1. Registrar el abono en la Base de Datos (API)
      await api.addPaymentToSale({
        saleId: selectedTicket.id,
        amount: payAmount,
        method: paymentMethod,
        userId: currentUser?.id || currentUser?.id_usuario
      }, token);

      // 2. IMPORTANTE: Conectar con la CAJA del POS
      if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
        const clientName = selectedTicket.clienteNombre || selectedTicket.cliente?.nombre || 'Cliente';
        const note = `Abono a Ticket #${selectedTicket.id} - ${clientName}`;
        
        // Llamamos a la función del padre (POS.jsx) para meter dinero al turno actual
        onRegisterTransaction('entrada', payAmount, note);
      }

      alert("¡Abono registrado correctamente!");
      setSelectedTicket(null);
      setAmount('');
      loadPendingTickets(); // Recargar lista
    } catch (error) {
      console.error(error);
      alert("Error al registrar abono: " + (error.message || "Error desconocido"));
    }
  };

  const filteredTickets = tickets.filter(t => 
    (t.clienteNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(t.id).includes(searchTerm)
  );

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title><FaMoneyBillWave /> Cuentas por Cobrar y Pendientes</Title>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </Header>

        <div style={{display: 'flex', gap: 10, marginBottom: 15}}>
            <div style={{position: 'relative', flex: 1}}>
                <FaSearch style={{position: 'absolute', top: 12, left: 10, color: '#9ca3af'}}/>
                <Input 
                    style={{paddingLeft: 35}}
                    placeholder="Buscar por cliente o número de ticket..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
            <Button onClick={loadPendingTickets} color="#6b7280">Actualizar</Button>
        </div>

        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <th>Ticket</th>
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
                    {loading ? <tr><td colSpan="8" style={{textAlign: 'center'}}>Buscando cuentas...</td></tr> : 
                     filteredTickets.length === 0 ? <tr><td colSpan="8" style={{textAlign: 'center', padding: 20}}>No hay cuentas pendientes.</td></tr> :
                     filteredTickets.map(ticket => {
                        const total = parseFloat(ticket.total || ticket.total_venta || 0);
                        const abonado = parseFloat(ticket.abonado || 0);
                        const deuda = total - abonado;
                        return (
                        <tr key={ticket.id}>
                            <td>#{ticket.id}</td>
                            <td>{new Date(ticket.created_at || ticket.fecha).toLocaleDateString()}</td>
                            <td><FaUserCheck style={{color: '#6b7280', marginRight:5}}/> {ticket.clienteNombre || 'Casual'}</td>
                            <td><span style={{padding: '3px 8px', borderRadius: 10, background: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 'bold'}}>{ticket.estado}</span></td>
                            <td>C$ {total.toFixed(2)}</td>
                            <td>C$ {abonado.toFixed(2)}</td>
                            <td style={{color: '#dc2626', fontWeight: 'bold'}}>C$ {deuda.toFixed(2)}</td>
                            <td>
                                <Button 
                                    color="#10b981"
                                    onClick={() => { setSelectedTicket({...ticket, deudaCalculada: deuda}); setAmount(''); }}
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
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h3 style={{margin: 0, color: '#1e40af'}}>Cobrando Ticket #{selectedTicket.id} - {selectedTicket.clienteNombre}</h3>
                    <button onClick={() => setSelectedTicket(null)} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#666'}}><FaTimes/></button>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                    <div>
                        <label style={{display: 'block', marginBottom: 5, fontWeight: 600}}>Monto a Pagar (Deuda: {selectedTicket.deudaCalculada.toFixed(2)})</label>
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
                        <label style={{display: 'block', marginBottom: 5, fontWeight: 600}}>Método de Pago</label>
                        <select 
                            style={{width: '100%', padding: 10, borderRadius: 6, border: '1px solid #d1d5db'}}
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                        >
                            <option value="Efectivo">Efectivo (Caja)</option>
                            <option value="Tarjeta">Tarjeta (Banco)</option>
                            <option value="Transferencia">Transferencia (Banco)</option>
                        </select>
                    </div>
                </div>
                
                <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 15}}>
                    <Button color="#ef4444" onClick={() => setSelectedTicket(null)}>Cancelar</Button>
                    <Button color="#2563eb" onClick={handleProcessPayment} style={{fontSize: '1.1rem', padding: '10px 25px'}}>
                        Confirmar Pago
                    </Button>
                </div>
                {paymentMethod === 'Efectivo' && (
                    <div style={{display: 'flex', alignItems: 'center', gap: 5, color: '#059669', fontSize: '0.9rem', marginTop: 5}}>
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