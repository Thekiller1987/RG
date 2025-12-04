import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaSearch } from 'react-icons/fa';
import * as api from '../../service/api'; // Asegúrate que la ruta sea correcta

// Estilos básicos para el modal
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); z-index: 1200;
  display: flex; align-items: center; justifyContent: center;
`;
const ModalContainer = styled.div`
  background: white; padding: 20px; border-radius: 8px;
  width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto;
  display: flex; flex-direction: column; gap: 15px;
`;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #eee; padding-bottom: 10px;
`;
const Title = styled.h2` margin: 0; color: #333; `;
const CloseButton = styled.button`
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; margin-top: 10px;
  th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
  th { background-color: #f8f9fa; font-weight: bold; }
  tr:hover { background-color: #f1f1f1; }
`;
const Button = styled.button`
  padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
  color: white; background-color: ${p => p.color || '#007bff'};
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;
const Input = styled.input`
  padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 100%;
`;
const PaySection = styled.div`
  background: #f0f8ff; padding: 15px; border-radius: 8px; border: 1px solid #cce5ff;
  display: flex; flex-direction: column; gap: 10px;
`;

const PendingTicketsModal = ({ onClose, onRegisterTransaction, currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo'); // 'Efectivo' | 'Tarjeta' | 'Transferencia'
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  // Cargar tickets pendientes al abrir
  useEffect(() => {
    loadPendingTickets();
  }, []);

  const loadPendingTickets = async () => {
    setLoading(true);
    try {
      // Asumimos que tienes un endpoint que trae ventas, filtramos las pendientes
      // Si tienes un endpoint especifico api.getPendingSales() úsalo
      const allSales = await api.fetchSales(token); // O api.getSalesWithBalance(token)
      
      // Filtramos localmente las que tienen deuda (adaptar según tu backend)
      const pending = Array.isArray(allSales) 
        ? allSales.filter(s => s.saldo_pendiente > 0 || s.estado === 'pendiente')
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
    if (payAmount > selectedTicket.saldo_pendiente) {
        alert("El abono no puede ser mayor al saldo pendiente");
        return;
    }

    try {
      // 1. Registrar el pago en el backend (actualiza la deuda de la venta)
      // Ajusta 'api.addPaymentToSale' a como se llame tu función real en api.js
      await api.addPaymentToSale({
        saleId: selectedTicket.id,
        amount: payAmount,
        method: paymentMethod,
        userId: currentUser?.id
      }, token);

      // 2. CRÍTICO: Si es EFECTIVO, registrar en la CAJA del turno actual
      if (paymentMethod === 'Efectivo') {
        const clientName = selectedTicket.clienteNombre || selectedTicket.cliente?.nombre || 'Cliente';
        const note = `Abono: ${clientName} - Ticket #${selectedTicket.id}`;
        
        // Llamamos a la función que nos pasó POS.jsx
        onRegisterTransaction('entrada', payAmount, note);
      }

      alert("Abono registrado correctamente");
      setSelectedTicket(null);
      setAmount('');
      loadPendingTickets(); // Recargar lista
    } catch (error) {
      alert("Error al registrar abono: " + error.message);
    }
  };

  // Filtrado de búsqueda
  const filteredTickets = tickets.filter(t => 
    (t.clienteNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(t.id).includes(searchTerm)
  );

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>Cuentas por Cobrar</Title>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </Header>

        {/* Barra de búsqueda */}
        <div style={{display: 'flex', gap: 10}}>
            <Input 
                placeholder="Buscar por cliente o # ticket..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
            />
            <Button onClick={loadPendingTickets}><FaSearch /></Button>
        </div>

        {/* Lista de Tickets */}
        <div style={{flex: 1, overflowY: 'auto'}}>
            <Table>
                <thead>
                    <tr>
                        <th>Ticket #</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Total Original</th>
                        <th>Saldo Pendiente</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <tr><td colSpan="6">Cargando...</td></tr> : 
                     filteredTickets.length === 0 ? <tr><td colSpan="6">No hay cuentas pendientes.</td></tr> :
                     filteredTickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{new Date(ticket.created_at || ticket.fecha).toLocaleDateString()}</td>
                            <td>{ticket.clienteNombre || ticket.cliente?.nombre || 'N/A'}</td>
                            <td>C$ {Number(ticket.total_venta).toFixed(2)}</td>
                            <td style={{color: 'red', fontWeight: 'bold'}}>C$ {Number(ticket.saldo_pendiente).toFixed(2)}</td>
                            <td>
                                <Button 
                                    color="#28a745"
                                    onClick={() => { setSelectedTicket(ticket); setAmount(''); }}
                                >
                                    Abonar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

        {/* Sección de Pago (Solo aparece si seleccionas un ticket) */}
        {selectedTicket && (
            <PaySection>
                <h3>Abonando al Ticket #{selectedTicket.id} - {selectedTicket.clienteNombre}</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                    <div>
                        <label>Monto a Abonar (Max: {selectedTicket.saldo_pendiente})</label>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)}
                            max={selectedTicket.saldo_pendiente}
                        />
                    </div>
                    <div>
                        <label>Método de Pago</label>
                        <select 
                            style={{width: '100%', padding: 9, borderRadius: 4, border: '1px solid #ddd'}}
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                        >
                            <option value="Efectivo">Efectivo (Entra a Caja)</option>
                            <option value="Tarjeta">Tarjeta / Transferencia (No afecta Caja)</option>
                        </select>
                    </div>
                </div>
                <div style={{display: 'flex', gap: 10, marginTop: 10}}>
                    <Button color="#007bff" onClick={handleProcessPayment} style={{flex: 1}}>
                        <FaMoneyBillWave /> Confirmar Abono
                    </Button>
                    <Button color="#dc3545" onClick={() => setSelectedTicket(null)}>Cancelar</Button>
                </div>
                {paymentMethod === 'Efectivo' && (
                    <small style={{color: '#28a745'}}>* Este monto se registrará automáticamente como "Entrada" en tu turno de caja actual.</small>
                )}
            </PaySection>
        )}

      </ModalContainer>
    </Overlay>
  );
};

export default PendingTicketsModal;