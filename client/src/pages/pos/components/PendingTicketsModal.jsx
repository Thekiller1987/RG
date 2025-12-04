import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSync, FaFileInvoiceDollar, FaUserClock } from 'react-icons/fa';
import * as api from '../../service/api'; // Asegúrate que la ruta sea correcta

// --- ESTILOS DEL MODAL ---
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

// Componentes UI
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

    // --- CARGA DE DATOS ROBUSTA (Estilo PedidosYApartados) ---
    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        console.log("🔄 Iniciando carga de cuentas por cobrar...");

        try {
            // Ejecutamos ambas peticiones en paralelo, manejando errores individualmente para no romper todo
            const [ordersData, salesData] = await Promise.all([
                api.fetchOrders(token).catch(err => { console.error("Error cargando pedidos:", err); return []; }),
                api.fetchSales(token).catch(err => { console.error("Error cargando ventas:", err); return []; })
            ]);

            // 1. Normalización estricta (Igual que en tu otro código)
            const rawOrders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
            const rawSales = Array.isArray(salesData) ? salesData : (salesData.data || []);

            // Helper para asegurar números
            const getNum = (val) => {
                const num = parseFloat(val);
                return isNaN(num) ? 0 : num;
            };

            // 2. Procesar PEDIDOS (Igual que tu otro archivo pero extrayendo deuda)
            const processedOrders = rawOrders.map(o => {
                const total = getNum(o.total || o.monto_total || o.precio_total);
                const paid = getNum(o.abonado || o.pagado || 0);
                return {
                    id: o.id,
                    type: 'PEDIDO', // Normalmente estos son Apartados
                    client: o.clienteNombre || o.cliente?.nombre || 'Cliente Casual',
                    date: o.created_at || o.fecha,
                    total: total,
                    paid: paid,
                    saldo: total - paid,
                    status: (o.estado || 'PENDIENTE').toUpperCase()
                };
            });

            // 3. Procesar VENTAS (Historial de créditos)
            const processedSales = rawSales.map(s => {
                const total = getNum(s.total_venta || s.total || s.monto_final);
                const paid = getNum(s.monto_pagado || s.abonado || 0);
                return {
                    id: s.id,
                    type: 'VENTA', // Ventas a crédito
                    client: s.clienteNombre || s.cliente?.nombre || 'Cliente Casual',
                    date: s.fecha || s.created_at,
                    total: total,
                    paid: paid,
                    saldo: total - paid,
                    status: (s.estado || 'COMPLETADO').toUpperCase()
                };
            });

            // 4. UNIFICAR Y FILTRAR SOLO DEUDAS REALES
            const allTickets = [...processedOrders, ...processedSales].filter(t => {
                // Filtro 1: Que tenga deuda positiva (mayor a 0.50 para margen de error decimal)
                const tieneDeuda = t.saldo > 0.5;

                // Filtro 2: Que NO esté cancelado ni anulado
                const esValido = !t.status.includes('CANCEL') && !t.status.includes('ANUL');

                // Filtro 3 (Opcional): Si el estado dice explícitamente PENDIENTE o CREDITO
                const estadoDeuda = t.status.includes('PENDIENTE') || t.status.includes('CREDITO') || t.status.includes('APARTADO');

                return esValido && (tieneDeuda || estadoDeuda);
            });

            // Ordenar por fecha (más reciente primero)
            allTickets.sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log(`✅ Carga completa: ${allTickets.length} cuentas con deuda encontradas.`);
            setTickets(allTickets);

        } catch (error) {
            console.error("❌ Error fatal en loadData:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []); // Se ejecuta al montar

    // --- LÓGICA DE PAGO ---
    const handlePay = async () => {
        if (!selectedTicket || !amount || parseFloat(amount) <= 0) return;
        
        const payVal = parseFloat(amount);
        if (payVal > (selectedTicket.saldo + 0.5)) { // Margen de 0.5 por redondeo
            alert("El monto no puede ser mayor a la deuda.");
            return;
        }

        setProcessing(true);
        try {
            // Enviar pago a la API
            const response = await api.addPaymentToSale({
                saleId: selectedTicket.id,
                amount: payVal,
                method: paymentMethod,
                userId: currentUser?.id || currentUser?.id_usuario || 1,
                type: selectedTicket.type 
            }, token);

            // Registrar en Caja Local (Para cuadre del día)
            if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
                const note = `Abono a ${selectedTicket.type} #${selectedTicket.id} - ${selectedTicket.client}`;
                onRegisterTransaction('entrada', payVal, note);
            }

            // Imprimir Ticket
            if (onPrintTicket) {
                 const ticketToPrint = {
                     ...(response?.data || {}),
                     isAbono: true,
                     ticketId: selectedTicket.id,
                     montoAbonado: payVal,
                     saldoRestante: selectedTicket.saldo - payVal,
                     cliente: selectedTicket.client,
                     fecha: new Date().toLocaleString()
                 };
                 onPrintTicket(ticketToPrint);
            }

            alert("¡Pago registrado con éxito!");
            setSelectedTicket(null);
            setAmount('');
            await loadData(); // Recargar lista para ver cambios
            
        } catch (error) {
            console.error(error);
            alert("Error al procesar el pago. Revisa la consola.");
        } finally {
            setProcessing(false);
        }
    };

    // --- FILTRADO VISUAL ---
    const filtered = tickets.filter(t => 
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
        String(t.id).includes(searchTerm)
    );

    return (
        <Overlay>
            <Container>
                <Header>
                    <h2 style={{margin:0, display:'flex', alignItems:'center', gap:10, color: '#1e293b'}}>
                        <FaFileInvoiceDollar color="#2563eb"/> Cuentas por Cobrar
                    </h2>
                    <Button onClick={onClose} color="#ef4444" style={{padding:'8px 15px'}}><FaTimes/></Button>
                </Header>

                <Body>
                    <ListSection>
                        <div style={{display:'flex', gap:10}}>
                            <Input 
                                placeholder="🔍 Buscar por cliente o ID..." 
                                autoFocus 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Button color="#64748b" onClick={loadData} title="Recargar lista"><FaSync/></Button>
                        </div>

                        <div style={{overflow:'auto', border:'1px solid #e2e8f0', borderRadius:8, flex: 1}}>
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
                                    {loading ? (
                                        <tr><td colSpan={6} align="center" style={{padding:20}}>Cargando deudas...</td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={6} align="center" style={{padding:20, color:'#64748b'}}>No hay cuentas pendientes.</td></tr>
                                    ) : (
                                        filtered.map(t => (
                                            <tr key={`${t.type}-${t.id}`} style={{background: selectedTicket?.id === t.id ? '#eff6ff' : 'transparent'}}>
                                                <td><strong>#{t.id}</strong></td>
                                                <td>
                                                    <Badge bg={t.type === 'PEDIDO' ? '#fff7ed' : '#f0f9ff'} txt={t.type === 'PEDIDO' ? '#c2410c' : '#0369a1'}>
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
                                                            setAmount(''); 
                                                        }}
                                                    >
                                                        Seleccionar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </ListSection>

                    {/* SECCIÓN DE PAGO */}
                    {selectedTicket && (
                        <PaySection>
                            <h3 style={{margin:0, borderBottom:'1px solid #bae6fd', paddingBottom:10, color:'#0369a1'}}>
                                Cobrar Ticket #{selectedTicket.id}
                            </h3>
                            <div style={{fontSize:'0.9rem', color:'#475569'}}>
                                <p style={{margin:'5px 0', display:'flex', alignItems:'center', gap:5}}>
                                    <FaUserClock/> {selectedTicket.client}
                                </p>
                                <p style={{margin:'10px 0'}}>
                                    Saldo Pendiente: <br/>
                                    <strong style={{color:'#dc2626', fontSize:'1.4rem'}}>C$ {selectedTicket.saldo.toFixed(2)}</strong>
                                </p>
                            </div>

                            <div>
                                <label style={{fontSize:'0.85rem', fontWeight:'bold', color:'#334155'}}>Monto a Abonar</label>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)}
                                    style={{fontSize:'1.2rem', fontWeight:'bold', color:'#059669', marginTop: 5}}
                                />
                                <div style={{display:'flex', gap:5, marginTop:8}}>
                                    <Badge bg="#d1fae5" txt="#059669" style={{cursor:'pointer', padding:'5px 10px'}} onClick={() => setAmount(selectedTicket.saldo.toFixed(2))}>Total</Badge>
                                    <Badge bg="#e0f2fe" txt="#0284c7" style={{cursor:'pointer', padding:'5px 10px'}} onClick={() => setAmount((selectedTicket.saldo/2).toFixed(2))}>50%</Badge>
                                </div>
                            </div>

                            <div>
                                <label style={{fontSize:'0.85rem', fontWeight:'bold', color:'#334155'}}>Método de Pago</label>
                                <select 
                                    style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1', marginTop:5}}
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
                                        <> <FaMoneyBillWave/> CONFIRMAR PAGO </>
                                    )}
                                </Button>
                                {paymentMethod === 'Efectivo' && (
                                    <p style={{fontSize:'0.75rem', color:'#059669', textAlign:'center', marginTop:8}}>
                                        * Se sumará a tu corte de caja actual.
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