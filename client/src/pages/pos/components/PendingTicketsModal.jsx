import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaMoneyBillWave, FaSync, FaFileInvoiceDollar, FaUserClock, FaBug } from 'react-icons/fa';
import * as api from '../../service/api'; 

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
const DebugBox = styled.pre`
  background: #333; color: #0f0; padding: 10px; border-radius: 5px; font-size: 0.7rem; 
  max-height: 150px; overflow: auto; margin-top: 20px;
`;

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
    const [rawDataDebug, setRawDataDebug] = useState(null); // Para ver qué llega
    
    // Estado del cobro
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [processing, setProcessing] = useState(false);

    // --- CARGA DE DATOS ---
  // Reemplaza la función loadData completa con esta versión mejorada
const loadData = async () => {
    setLoading(true);
    console.log("🔄 Iniciando carga de pendientes...");

    try {
        // IMPORTANTE: Cambiar la API que usas para pedidos pendientes
        let orders = [];
        let sales = [];

        try {
            // USAR LA MISMA API QUE PEDIDOSYAPARTADOS
            const resOrders = await api.fetchOrders(token);
            console.log("📦 Respuesta de Pedidos:", resOrders);
            
            // Asegurarnos de obtener el array correctamente
            if (Array.isArray(resOrders)) {
                orders = resOrders;
            } else if (resOrders && Array.isArray(resOrders.data)) {
                orders = resOrders.data;
            } else if (resOrders && resOrders.orders) {
                orders = Array.isArray(resOrders.orders) ? resOrders.orders : [];
            }
            
            // DEBUG: Guardar el primer pedido para inspeccionar
            if (orders.length > 0) {
                console.log("📋 Primer pedido:", orders[0]);
                console.log("📋 Campos disponibles:", Object.keys(orders[0]));
            }
        } catch (e) { 
            console.error("❌ Error Pedidos:", e); 
        }

        try {
            // También cargar ventas para completar
            const resSales = await api.fetchSales(token);
            console.log("💰 Respuesta de Ventas:", resSales);
            
            if (Array.isArray(resSales)) {
                sales = resSales;
            } else if (resSales && Array.isArray(resSales.data)) {
                sales = resSales.data;
            }
        } catch (e) { 
            console.error("❌ Error Ventas:", e); 
        }

        // Helper mejorado para números
        const getNum = (val) => {
            if (val === null || val === undefined) return 0;
            const num = parseFloat(val);
            return isNaN(num) ? 0 : num;
        };

        // Helper para obtener cliente
        const getCliente = (obj) => {
            return obj.clienteNombre || 
                   obj.cliente?.nombre || 
                   obj.nombre_cliente || 
                   'Consumidor Final';
        };

        // Helper para obtener estado
        const getEstado = (obj) => {
            return (obj.estado || obj.status || 'PENDIENTE').toUpperCase();
        };

        // Procesar pedidos (orders)
        // En loadData, dentro del bloque donde procesas los pedidos:
const processedOrders = orders.map(o => {
    const totalPedido = getNum(o.total || o.monto_total || o.precio_total || 0);
    const abonadoPedido = getNum(o.abonado || o.pagado || 0);
    
    return {
        id: o.id || o.id_pedido,
        type: 'PEDIDO',
        raw: o,
        client: getCliente(o),
        date: o.created_at || o.fecha || o.fecha_creacion || new Date().toISOString(),
        total: totalPedido,
        paid: abonadoPedido,
        status: getEstado(o),
        saldo: totalPedido - abonadoPedido,
        // Asegurar que siempre haya una propiedad items (aunque sea vacía)
        items: o.items || o.detalles || o.productos || [],
        // Campos adicionales para debug
        debug: {
            total_raw: o.total,
            abonado_raw: o.abonado,
            estado_raw: o.estado,
            has_items: !!(o.items || o.detalles || o.productos)
        }
    };
});
        // Procesar ventas (sales) que puedan estar pendientes
        const processedSales = sales.map(s => {
            const totalVenta = getNum(s.total_venta || s.total || s.monto_final || 0);
            const pagadoVenta = getNum(s.monto_pagado || s.abonado || 0);
            const estadoVenta = getEstado(s);
            
            // Solo incluir ventas que estén pendientes
            if (estadoVenta.includes('COMPLETADO') || estadoVenta.includes('CANCELADO')) {
                return null;
            }
            
            return {
                id: s.id || s.id_venta,
                type: 'VENTA',
                raw: s,
                client: getCliente(s),
                date: s.fecha || s.created_at || s.fecha_creacion || new Date().toISOString(),
                total: totalVenta,
                paid: pagadoVenta,
                status: estadoVenta,
                saldo: totalVenta - pagadoVenta
            };
        }).filter(Boolean); // Eliminar nulls

        // Combinar todo
        const allItems = [...processedOrders, ...processedSales];
        console.log("📊 Total items procesados:", allItems.length);
        console.log("📊 Ejemplo item:", allItems[0]);

        // Filtrar solo los pendientes (lógica más flexible)
        const filteredList = allItems.filter(t => {
            // 1. Descartar explícitamente cancelados/anulados
            if (t.status.includes('CANCELADO') || 
                t.status.includes('ANULADO') || 
                t.status.includes('COMPLETADO')) {
                return false;
            }
            
            // 2. Si tiene saldo positivo (> 0.5 para evitar decimales pequeños)
            if (t.saldo > 0.5) return true;
            
            // 3. Si el estado indica pendiente/apartado/crédito
            if (t.status.includes('PENDIENTE') || 
                t.status.includes('APARTADO') || 
                t.status.includes('CREDITO') ||
                t.status.includes('POR COBRAR')) {
                return true;
            }
            
            return false;
        });

        // Ordenar por fecha más reciente
        filteredList.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log("✅ Pendientes finales:", filteredList.length);
        console.log("✅ Lista:", filteredList);
        
        setTickets(filteredList);
        setRawDataDebug({
            totalProcesados: allItems.length,
            pendientes: filteredList.length,
            ejemplo: filteredList[0] || { mensaje: 'No hay items' },
            rawCounts: {
                orders: orders.length,
                sales: sales.length
            }
        });

    } catch (error) {
        console.error("❌ Error fatal:", error);
        setRawDataDebug({ 
            error: error.message,
            stack: error.stack 
        });
    } finally {
        setLoading(false);
    }
};

    useEffect(() => { loadData(); }, []);

    // --- COBRO ---
    const handlePay = async () => {
        if (!selectedTicket || !amount) return;
        const val = parseFloat(amount);
        if (val <= 0 || val > (selectedTicket.saldo + 1)) {
             alert("Monto inválido (no puede ser mayor a la deuda)."); return; 
        }

        setProcessing(true);
        try {
            const payload = {
                saleId: selectedTicket.id,
                amount: val,
                method: paymentMethod,
                userId: currentUser?.id || 1,
                type: selectedTicket.type
            };
            
            const res = await api.addPaymentToSale(payload, token);
            
            if (paymentMethod === 'Efectivo' && onRegisterTransaction) {
                onRegisterTransaction('entrada', val, `Abono ${selectedTicket.type} #${selectedTicket.id}`);
            }

            if (onPrintTicket) {
                 onPrintTicket({
                     ...res?.data, 
                     isAbono: true, 
                     cliente: selectedTicket.client,
                     montoAbonado: val,
                     saldoRestante: selectedTicket.saldo - val
                 });
            }

            alert("Pago registrado");
            setSelectedTicket(null);
            setAmount('');
            loadData();
        } catch (e) {
            console.error(e);
            alert("Error: " + (e.message || "No se pudo cobrar"));
        } finally {
            setProcessing(false);
        }
    };

    const displayTickets = tickets.filter(t => 
        t.client.toLowerCase().includes(searchTerm.toLowerCase()) || String(t.id).includes(searchTerm)
    );

    return (
        <Overlay>
            <Container>
                <Header>
                    <h2 style={{margin:0, display:'flex', alignItems:'center', gap:10}}>
                        <FaFileInvoiceDollar color="#2563eb"/> Cuentas por Cobrar ({tickets.length})
                    </h2>
                    <Button onClick={onClose} color="#ef4444" style={{padding:'8px'}}><FaTimes/></Button>
                </Header>

                <Body>
                    <ListSection>
                        <div style={{display:'flex', gap:10}}>
                            <Input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus/>
                            <Button color="#64748b" onClick={loadData}><FaSync/></Button>
                        </div>
                        
                        <div style={{overflow:'auto', border:'1px solid #e2e8f0', borderRadius:8, flex:1}}>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Tipo</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayTickets.length === 0 ? (
                                        <tr><td colSpan={8} align="center" style={{padding:20}}>No hay datos para mostrar. Revisa el cuadro negro abajo.</td></tr>
                                    ) : displayTickets.map(t => (
                                        <tr key={`${t.type}-${t.id}`} style={{background: selectedTicket?.id === t.id ? '#eff6ff' : ''}}>
                                            <td>#{t.id}</td>
                                            <td><Badge bg={t.type === 'PEDIDO'?'#fff7ed':'#f0f9ff'} txt={t.type==='PEDIDO'?'#c2410c':'#0369a1'}>{t.type}</Badge></td>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                            <td>{t.client}</td>
                                            <td>{t.total.toFixed(2)}</td>
                                            <td>{t.paid.toFixed(2)}</td>
                                            <td style={{color:'red', fontWeight:'bold'}}>{t.saldo.toFixed(2)}</td>
                                            <td>
                                                <Button onClick={() => { setSelectedTicket(t); setAmount(''); }} style={{padding:'5px 10px', fontSize:'0.8rem'}}>Cobrar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        {/* --- DEBUG BOX: SI SALE VACÍO, MIRA ESTO --- */}
                        <div style={{marginTop: 10}}>
                             <small style={{fontWeight:'bold', color:'#ef4444'}}> <FaBug/> Diagnóstico de Datos (Solo visible si hay error)</small>
                             <DebugBox>
                                 {JSON.stringify(rawDataDebug, null, 2)}
                             </DebugBox>
                        </div>

                    </ListSection>

                    {selectedTicket && (
                        <PaySection>
                            <h3>Cobrar #{selectedTicket.id}</h3>
                            <p>Cliente: <strong>{selectedTicket.client}</strong></p>
                            <p style={{fontSize:'1.2rem', color:'red'}}>Deuda: C$ {selectedTicket.saldo.toFixed(2)}</p>
                            
                            <label>Monto a Abonar</label>
                            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{fontSize:'1.2rem'}}/>
                            <div style={{display:'flex', gap:5, marginTop:5}}>
                                <Badge bg="#d1fae5" txt="#059669" onClick={() => setAmount(selectedTicket.saldo.toFixed(2))} style={{cursor:'pointer'}}>Todo</Badge>
                            </div>

                            <label style={{marginTop:10}}>Método</label>
                            <select style={{width:'100%', padding:10}} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                <option>Efectivo</option>
                                <option>Tarjeta</option>
                                <option>Transferencia</option>
                            </select>

                            <Button onClick={handlePay} disabled={processing || !amount} color="#10b981" style={{width:'100%', marginTop:20, padding:15}}>
                                {processing ? '...' : 'CONFIRMAR PAGO'}
                            </Button>
                        </PaySection>
                    )}
                </Body>
            </Container>
        </Overlay>
    );
};

export default PendingTicketsModal;