import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSearch, FaSync, FaFileInvoiceDollar, FaUserClock, FaPrint } from 'react-icons/fa';
import * as api from '../../service/api'; // Ajusta la ruta a tu servicio

// --- ESTILOS DEL MODAL (Aislados) ---
const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999;
  display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);
`;
const Container = styled.div`
  background: white; width: 95%; max-width: 1100px; height: 85vh; border-radius: 12px;
  display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  font-family: 'Segoe UI', sans-serif;
`;
const Header = styled.div`
  padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;
  background: #f8fafc; border-radius: 12px 12px 0 0;
`;
const Body = styled.div`flex: 1; padding: 20px; overflow-y: auto; display: flex; gap: 20px;`;
const ListSection = styled.div`flex: 2; display: flex; flex-direction: column; gap: 15px;`;
const PaySection = styled.div`
  flex: 1; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px;
  display: flex; flex-direction: column; gap: 15px; height: fit-content;
`;

// Componentes UI simples
const Input = styled.input`width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; &:focus{border-color:#3b82f6}`;
const Button = styled.button`
  padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; justify-content: center;
  background: ${p => p.color || '#3b82f6'}; color: white; transition: 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th { text-align: left; padding: 12px; background: #f1f5f9; position: sticky; top: 0; }
  td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
  tr:hover { background: #f8fafc; }
`;
const Badge = styled.span`
  padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;
  background: ${p => p.bg}; color: ${p => p.txt};
`;

const PendingTicketsModal = ({ onClose, onRegisterTransaction, currentUser, onPrintTicket }) => {
    const token = localStorage.getItem('token');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado del cobro
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [processing, setProcessing] = useState(false);

 // 1. CARGA DE DATOS ROBUSTA (A prueba de fallos)
    const loadData = async () => {
        setLoading(true);
        try {
            console.log("Iniciando carga de deudas...");

            // Intentamos cargar pedidos y ventas
            const [ordersRes, salesRes] = await Promise.all([
                api.fetchOrders(token).catch(err => { console.log("Error pedidos", err); return []; }), 
                api.fetchSales(token).catch(err => { console.log("Error ventas", err); return []; })
            ]);

            // Normalizamos la respuesta (por si viene en .data o directo)
            const rawOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || []);
            const rawSales = Array.isArray(salesRes) ? salesRes : (salesRes.data || []);

            // Función auxiliar para limpiar números
            const toNum = (val) => parseFloat(val) || 0;

            // Procesar PEDIDOS
            const orders = rawOrders.map(o => ({
                id: o.id,
                type: 'PEDIDO',
                client: o.clienteNombre || o.cliente?.nombre || 'Cliente Casual',
                date: o.created_at || o.fecha,
                // Buscamos cualquier campo que parezca un total
                total: toNum(o.total || o.monto_total || o.precio_total), 
                paid: toNum(o.abonado || o.pagado || 0),
                status: (o.estado || 'PENDIENTE').toUpperCase()
            }));

            // Procesar VENTAS (Historial)
            const sales = rawSales.map(s => ({
                id: s.id,
                type: 'VENTA',
                client: s.cliente?.nombre || s.clienteNombre || 'Cliente Casual',
                date: s.fecha || s.created_at,
                // Las ventas suelen tener 'total_venta' o 'total'
                total: toNum(s.total_venta || s.total || s.monto_final),
                paid: toNum(s.monto_pagado || s.abonado || 0),
                status: (s.estado || 'COMPLETADO').toUpperCase()
            }));

            // UNIFICAR Y FILTRAR
            const combined = [...orders, ...sales].filter(t => {
                // 1. Calculamos el saldo real matemáticamente
                const saldoCalculado = t.total - t.paid;
                
                // 2. ¿Tiene deuda? (Mayor a 0.50 c$ para evitar errores de decimales)
                const tieneDeuda = saldoCalculado > 0.5;

                // 3. ¿El estado indica deuda explícita?
                const dicePendiente = t.status.includes('PENDIENTE') || t.status.includes('CREDITO') || t.status.includes('APARTADO');

                // 4. Ignorar anulados/cancelados
                const esValido = !t.status.includes('ANULADO') && !t.status.includes('CANCELADO');

                // REGLA FINAL: Si tiene deuda real Y es válido, O si dice explícitamente pendiente.
                return esValido && (tieneDeuda || dicePendiente);
            }).map(t => ({
                ...t, 
                saldo: (t.total - t.paid) > 0 ? (t.total - t.paid) : t.total // Si el cálculo falló, asumimos deuda total
            }));

            console.log("Tickets encontrados con deuda:", combined);
            setTickets(combined.sort((a,b) => new Date(b.date) - new Date(a.date)));
            setSelectedTicket(null);

        } catch (error) {
            console.error("Error fatal cargando:", error);
            // Opcional: alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { loadData(); }, []);

    // 2. PROCESAR EL COBRO
    const handlePay = async () => {
        if (!selectedTicket || !amount || parseFloat(amount) <= 0) return;
        
        const payVal = parseFloat(amount);
        if (payVal > (selectedTicket.saldo + 0.1)) {
            alert("El monto no puede ser mayor a la deuda.");
            return;
        }

        setProcessing(true);
        try {
            // A) Llamada a la API para registrar el pago en la BD
            // NOTA: Ajusta 'addPaymentToSale' a tu endpoint real. 
            // Si usas endpoints distintos para pedidos y ventas, usa selectedTicket.type para decidir.
            const response = await api.addPaymentToSale({
                saleId: selectedTicket.id,
                amount: payVal,
                method: paymentMethod,
                userId: currentUser?.id || currentUser?.id_usuario,
                type: selectedTicket.type // Enviar tipo por si el backend lo requiere
            }, token);

            // B) Registrar en CAJA LOCAL (Solo si es efectivo)
            // Esto actualiza el conteo del POS sin recargar la página
            if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
                const note = `Abono a ${selectedTicket.type} #${selectedTicket.id} - ${selectedTicket.client}`;
                onRegisterTransaction('entrada', payVal, note);
            }

            // C) Imprimir Recibo (Si existe la función)
            if (onPrintTicket && response && response.data) {
                 // Simulamos un objeto imprimible si la API no devuelve uno completo
                 const ticketToPrint = {
                     ...response.data,
                     isAbono: true,
                     montoAbonado: payVal,
                     saldoRestante: selectedTicket.saldo - payVal,
                     cliente: selectedTicket.client
                 };
                 onPrintTicket(ticketToPrint);
            }

            alert("¡Pago registrado con éxito!");
            await loadData(); // Recargar lista
            setAmount('');
            
        } catch (error) {
            console.error(error);
            alert("Error al procesar el pago: " + (error.message || "Error de conexión"));
        } finally {
            setProcessing(false);
        }
    };

    // Filtro visual
    const filtered = tickets.filter(t => 
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        String(t.id).includes(searchTerm)
    );

    return (
        <Overlay>
            <Container>
                <Header>
                    <h2 style={{margin:0, display:'flex', alignItems:'center', gap:10}}>
                        <FaFileInvoiceDollar color="#2563eb"/> Cuentas por Cobrar
                    </h2>
                    <Button onClick={onClose} color="#ef4444" style={{padding:'8px 15px'}}><FaTimes/></Button>
                </Header>

                <Body>
                    <ListSection>
                        <div style={{display:'flex', gap:10}}>
                            <Input 
                                placeholder="Buscar por cliente o ID..." 
                                autoFocus 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Button color="#64748b" onClick={loadData} title="Recargar"><FaSync/></Button>
                        </div>

                        <div style={{overflow:'auto', border:'1px solid #e2e8f0', borderRadius:8}}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Fecha</th>
                                        <th>Cliente</th>
                                        <th>Deuda</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan={6} align="center">Cargando...</td></tr> :
                                     filtered.length === 0 ? <tr><td colSpan={6} align="center">No hay cuentas pendientes.</td></tr> :
                                     filtered.map(t => (
                                        <tr key={`${t.type}-${t.id}`} style={{background: selectedTicket?.id === t.id ? '#eff6ff' : 'transparent'}}>
                                            <td><strong>#{t.id}</strong></td>
                                            <td>
                                                <Badge bg={t.type === 'PEDIDO' ? '#fff7ed' : '#eff6ff'} txt={t.type === 'PEDIDO' ? '#c2410c' : '#1d4ed8'}>
                                                    {t.type}
                                                </Badge>
                                            </td>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                            <td>{t.client}</td>
                                            <td style={{color:'#dc2626', fontWeight:'bold'}}>C$ {t.saldo.toFixed(2)}</td>
                                            <td>
                                                <Button 
                                                    color={selectedTicket?.id === t.id ? "#2563eb" : "#94a3b8"} 
                                                    style={{padding:'5px 10px', fontSize:'0.8rem'}}
                                                    onClick={() => {
                                                        setSelectedTicket(t);
                                                        setAmount(''); // Limpiar monto anterior
                                                    }}
                                                >
                                                    Seleccionar
                                                </Button>
                                            </td>
                                        </tr>
                                     ))}
                                </tbody>
                            </Table>
                        </div>
                    </ListSection>

                    {/* SECCIÓN DE PAGO LATERAL */}
                    {selectedTicket && (
                        <PaySection>
                            <h3 style={{margin:0, borderBottom:'1px solid #bae6fd', paddingBottom:10}}>
                                Cobrar #{selectedTicket.id}
                            </h3>
                            <div style={{fontSize:'0.9rem', color:'#64748b'}}>
                                <p style={{margin:'5px 0'}}><FaUserClock/> {selectedTicket.client}</p>
                                <p style={{margin:'5px 0'}}>Saldo Pendiente: <strong style={{color:'#dc2626', fontSize:'1.1rem'}}>C$ {selectedTicket.saldo.toFixed(2)}</strong></p>
                            </div>

                            <div>
                                <label style={{fontSize:'0.85rem', fontWeight:'bold'}}>Monto a Abonar</label>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)}
                                    style={{fontSize:'1.2rem', fontWeight:'bold', color:'#059669'}}
                                />
                                <div style={{display:'flex', gap:5, marginTop:5}}>
                                    <Badge bg="#d1fae5" txt="#059669" style={{cursor:'pointer'}} onClick={() => setAmount(selectedTicket.saldo)}>Total</Badge>
                                    <Badge bg="#e0f2fe" txt="#0284c7" style={{cursor:'pointer'}} onClick={() => setAmount((selectedTicket.saldo/2).toFixed(2))}>50%</Badge>
                                </div>
                            </div>

                            <div>
                                <label style={{fontSize:'0.85rem', fontWeight:'bold'}}>Método de Pago</label>
                                <select 
                                    style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}}
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                >
                                    <option value="Efectivo">Efectivo (Entra a Caja)</option>
                                    <option value="Tarjeta">Tarjeta / POS</option>
                                    <option value="Transferencia">Transferencia Bancaria</option>
                                    <option value="Sinpe">Billetera Móvil</option>
                                </select>
                            </div>

                            <div style={{marginTop:'auto'}}>
                                <Button 
                                    style={{width:'100%', padding:15, fontSize:'1rem'}} 
                                    color="#10b981"
                                    onClick={handlePay}
                                    disabled={processing || !amount}
                                >
                                    {processing ? 'Procesando...' : (
                                        <>
                                            <FaMoneyBillWave/> CONFIRMAR PAGO
                                        </>
                                    )}
                                </Button>
                                {paymentMethod === 'Efectivo' && (
                                    <p style={{fontSize:'0.75rem', color:'#059669', textAlign:'center', marginTop:5}}>
                                        * Se registrará ingreso en tu corte de caja actual.
                                    </p>
                                )}
                            </div>
                        </PaySection>
                    )}
                </Body>
            </Container>
        </Overlay>
    );
};

export default PendingTicketsModal;