import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSearch, FaExclamationCircle, FaUserCheck, FaSync, FashoppingBag, FaClipboardList } from 'react-icons/fa';
import * as api from '../../../service/api';

// --- ESTILOS (Sin cambios) ---
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
    loadAllPending();
  }, []);

  // Función auxiliar para entender la estructura de datos, venga de donde venga
  const normalizeData = (item, type) => {
    // Intentar encontrar el TOTAL con todos los nombres posibles
    const total = parseFloat(
        item.total || item.total_venta || item.monto_total || item.amount || item.total_pedido || 0
    );
    
    // Intentar encontrar lo ABONADO con todos los nombres posibles
    const abonado = parseFloat(
        item.abonado || item.monto_pagado || item.pagado || item.abono || 0
    );

    // Intentar encontrar el ID
    const id = item.id || item.id_venta || item.id_pedido;

    // Intentar encontrar el nombre del CLIENTE
    const clientName = item.clienteNombre 
                    || item.cliente?.nombre 
                    || item.nombre_cliente 
                    || (item.cliente ? item.cliente.nombre : 'Cliente Casual');

    // Intentar encontrar la FECHA
    const fecha = item.created_at || item.fecha || item.date;

    return {
        original: item, // Guardamos el objeto original por si acaso
        id: id,
        type: type, // 'Pedido' o 'Venta'
        date: fecha,
        clientName: clientName,
        total: total,
        abonado: abonado,
        saldo: total - abonado,
        estado: (item.estado || '').toUpperCase()
    };
  };

  const loadAllPending = async () => {
    setLoading(true);
    let combinedData = [];

    try {
        console.log("Iniciando carga híbrida...");

        // 1. Intentar cargar PEDIDOS (Orders)
        try {
            const ordersRes = await api.fetchOrders(token);
            const ordersRaw = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || ordersRes.orders || []);
            const ordersNorm = ordersRaw.map(o => normalizeData(o, 'Pedido'));
            combinedData = [...combinedData, ...ordersNorm];
            console.log("Pedidos cargados:", ordersNorm.length);
        } catch (e) {
            console.warn("No se pudieron cargar pedidos (quizás no existe la ruta):", e);
        }

        // 2. Intentar cargar VENTAS (Sales)
        try {
            const salesRes = await api.fetchSales(token);
            const salesRaw = Array.isArray(salesRes) ? salesRes : (salesRes.data || []);
            const salesNorm = salesRaw.map(s => normalizeData(s, 'Venta'));
            combinedData = [...combinedData, ...salesNorm];
            console.log("Ventas cargadas:", salesNorm.length);
        } catch (e) {
            console.warn("No se pudieron cargar ventas:", e);
        }

        // 3. Filtrar lo que realmente se debe (Saldo > 0.5 y NO Cancelado)
        const pending = combinedData.filter(item => {
            return item.saldo > 0.5 && item.estado !== 'CANCELADO';
        });

        // 4. Ordenar por fecha (más reciente primero)
        pending.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        console.log("Total pendientes finales:", pending);
        setTickets(pending);

    } catch (error) {
        console.error("Error crítico cargando datos:", error);
        alert("Error al cargar datos. Revisa la consola.");
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
      // AQUÍ ES IMPORTANTE: Dependiendo de tu backend, el endpoint puede ser el mismo o distinto.
      // Usaremos addPaymentToSale por defecto, ya que usualmente maneja ambos por ID.
      // Si tu backend tiene "addPaymentToOrder", avísame para cambiarlo.
      
      await api.addPaymentToSale({
        saleId: selectedTicket.id, 
        amount: payAmount,
        method: paymentMethod,
        userId: currentUser?.id || currentUser?.id_usuario
      }, token);

      // Registrar en CAJA LOCAL
      if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
        const note = `Abono a ${selectedTicket.type} #${selectedTicket.id} - ${selectedTicket.clientName}`;
        onRegisterTransaction('entrada', payAmount, note);
      }

      alert("¡Abono registrado correctamente!");
      setSelectedTicket(null);
      setAmount('');
      loadAllPending(); // Recargar todo
    } catch (error) {
      console.error(error);
      alert("Error al registrar abono: " + (error.message || "Error desconocido"));
    }
  };

  // Filtrado del buscador
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
          <Title><FaClipboardList /> Pedidos y Cuentas Pendientes</Title>
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        </Header>

        <div style={{display: 'flex', gap: 10, marginBottom: 15}}>
            <div style={{position: 'relative', flex: 1}}>
                <FaSearch style={{position: 'absolute', top: 12, left: 10, color: '#9ca3af'}}/>
                <Input 
                    style={{paddingLeft: 35}}
                    placeholder="Buscar cliente, pedido o venta..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
            <Button onClick={loadAllPending} color="#6b7280" title="Recargar lista">
                <FaSync /> Actualizar
            </Button>
        </div>

        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
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
                        <tr><td colSpan="9" style={{textAlign: 'center', padding: 20}}>Buscando en Ventas y Pedidos...</td></tr> 
                    : filteredTickets.length === 0 ? 
                        <tr><td colSpan="9" style={{textAlign: 'center', padding: 20, color: '#666'}}>
                            No se encontraron deudas pendientes ni en pedidos ni en ventas.
                        </td></tr> 
                    : filteredTickets.map((ticket, index) => {
                        const dateStr = ticket.date ? new Date(ticket.date).toLocaleDateString() : 'S/F';

                        return (
                        <tr key={`${ticket.type}-${ticket.id}-${index}`}>
                            <td>#{ticket.id}</td>
                            <td>
                                {ticket.type === 'Pedido' ? 
                                    <span style={{color:'#d97706', fontWeight:'bold', fontSize:'0.8rem'}}><FaClipboardList/> PEDIDO</span> : 
                                    <span style={{color:'#2563eb', fontWeight:'bold', fontSize:'0.8rem'}}><FaMoneyBillWave/> VENTA</span>
                                }
                            </td>
                            <td>{dateStr}</td>
                            <td><FaUserCheck style={{color: '#6b7280', marginRight:5}}/> {ticket.clientName}</td>
                            <td>
                                <span style={{
                                    padding: '3px 8px', borderRadius: 10, 
                                    background: '#fee2e2', color: '#991b1b', 
                                    fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    {ticket.estado || 'PENDIENTE'}
                                </span>
                            </td>
                            <td>C$ {ticket.total.toFixed(2)}</td>
                            <td>C$ {ticket.abonado.toFixed(2)}</td>
                            <td style={{color: '#dc2626', fontWeight: 'bold', fontSize: '1.05rem'}}>C$ {ticket.saldo.toFixed(2)}</td>
                            <td>
                                <Button 
                                    color="#10b981"
                                    onClick={() => { setSelectedTicket(ticket); setAmount(''); }}
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
                    <h3 style={{margin: 0, color: '#1e40af'}}>
                        Cobrando {selectedTicket.type} #{selectedTicket.id} - {selectedTicket.clientName}
                    </h3>
                    <button onClick={() => setSelectedTicket(null)} style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#666'}}>
                        <FaTimes/>
                    </button>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                    <div>
                        <label style={{display: 'block', marginBottom: 5, fontWeight: 600}}>
                            Monto a Pagar (Saldo: C$ {selectedTicket.saldo.toFixed(2)})
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