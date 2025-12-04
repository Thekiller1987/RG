import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'; // Agregamos useNavigate
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';

// Iconos seguros
import { 
    FaClipboardList, FaSearch, FaArrowLeft, FaSync, 
    FaCartPlus, FaUser, FaClock, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

// --- MODALES (Descomenta si las rutas son correctas en tu proyecto) ---
// import CreateOrderModal from './pos/components/CreateOrderModal';
// import OrderDetailModal from './pos/components/OrderDetailModal'; 

// --- ESTILOS ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;

const PageWrapper = styled.div`
  padding: 2rem; 
  background: #f1f5f9; 
  min-height: 100vh; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
  background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 10px;
`;

const Grid = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
  gap: 1.5rem;
`;

const TicketCard = styled.div`
  background: white; 
  border-radius: 12px; 
  padding: 1.5rem; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 6px solid ${props => props.color};
  transition: transform 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
`;

const Badge = styled.span`
  background: ${props => props.bg}; color: ${props => props.color};
  padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;
`;

const ActionButton = styled.button`
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 0.2s;
  
  /* Estilo dinámico */
  background: ${props => props.primary ? '#2563eb' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#475569'};

  &:hover {
    background: ${props => props.primary ? '#1d4ed8' : '#cbd5e1'};
  }
`;

const Input = styled.input`
  padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; width: 250px;
  &:focus { border-color: #2563eb; }
`;

const PedidosYApartados = () => {
    const navigate = useNavigate(); // Hook para redireccionar
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para modales (si los usas)
    const [modalOpen, setModalOpen] = useState(false);

    // --- 1. CARGAR PEDIDOS ---
    const fetchPedidos = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await api.fetchOrders(token);
            // Aseguramos que sea array y filtramos si es necesario
            const lista = Array.isArray(data) ? data : [];
            // Ordenamos: Los pendientes primero, luego por fecha reciente
            lista.sort((a, b) => {
                if (a.estado === 'PENDIENTE' && b.estado !== 'PENDIENTE') return -1;
                if (a.estado !== 'PENDIENTE' && b.estado === 'PENDIENTE') return 1;
                return new Date(b.fecha) - new Date(a.fecha);
            });
            setPedidos(lista);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPedidos();
        // Auto-actualizar cada 15 segundos para ver nuevos tickets de vendedores
        const interval = setInterval(fetchPedidos, 15000); 
        return () => clearInterval(interval);
    }, [fetchPedidos]);

    // --- 2. FUNCIÓN CLAVE: CARGAR AL POS (CAJA) ---
    const handleCargarEnCaja = (pedido) => {
        if (!pedido.items || pedido.items.length === 0) {
            alert("Este ticket no tiene productos.");
            return;
        }

        const confirmacion = window.confirm(`¿Cargar Ticket #${pedido.id} en la pantalla de cobro?`);
        if (confirmacion) {
            // Redirigimos a la ruta del POS y le pasamos los datos
            // IMPORTANTE: Asegúrate que tu ruta sea '/pos' o '/caja'
            navigate('/pos', { 
                state: { 
                    ticketData: {
                        items: pedido.items,
                        cliente: pedido.cliente, // Si tienes objeto cliente
                        clienteNombre: pedido.clienteNombre,
                        originalOrderId: pedido.id // Para saber qué ticket actualizar luego
                    }
                } 
            });
        }
    };

    // --- FILTROS ---
    const filteredPedidos = useMemo(() => {
        if (!searchTerm) return pedidos;
        const lower = searchTerm.toLowerCase();
        return pedidos.filter(p => 
            (p.clienteNombre || '').toLowerCase().includes(lower) || 
            String(p.id).includes(lower)
        );
    }, [pedidos, searchTerm]);

    return (
        <PageWrapper>
            <Header>
                <div>
                    <Title><FaClipboardList /> Tickets Pendientes</Title>
                    <p style={{color: '#64748b', margin: '5px 0 0 0'}}>
                        Selecciona un ticket creado por un vendedor para cobrarlo.
                    </p>
                </div>
                <div style={{display:'flex', gap: '10px', alignItems:'center'}}>
                    <div style={{position:'relative'}}>
                        <FaSearch style={{position:'absolute', left:10, top:12, color:'#94a3b8'}}/>
                        <Input 
                            placeholder="Buscar cliente o ticket #..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{paddingLeft: 35}}
                        />
                    </div>
                    <button 
                        onClick={fetchPedidos} 
                        style={{padding:10, background:'#e2e8f0', border:'none', borderRadius:8, cursor:'pointer'}}
                        title="Actualizar lista"
                    >
                        <FaSync className={loading ? 'fa-spin' : ''} />
                    </button>
                    <Link to="/dashboard" style={{textDecoration:'none', color:'#475569', fontWeight:'bold', marginLeft:10}}>
                        <FaArrowLeft /> Salir
                    </Link>
                </div>
            </Header>

            {loading && pedidos.length === 0 ? (
                <div style={{textAlign:'center', padding:40, color:'#64748b'}}>Cargando tickets...</div>
            ) : (
                <Grid>
                    {filteredPedidos.map(p => {
                        const esPendiente = p.estado === 'PENDIENTE';
                        const colorEstado = esPendiente ? '#f59e0b' : p.estado === 'COMPLETADO' ? '#10b981' : '#ef4444';
                        
                        return (
                            <TicketCard key={p.id} color={colorEstado}>
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:15}}>
                                    <span style={{fontWeight:'800', fontSize:'1.1rem', color:'#334155'}}>
                                        Ticket #{p.id}
                                    </span>
                                    <Badge 
                                        bg={esPendiente ? '#fef3c7' : '#dcfce7'} 
                                        color={esPendiente ? '#b45309' : '#166534'}
                                    >
                                        {p.estado}
                                    </Badge>
                                </div>

                                <div style={{display:'flex', flexDirection:'column', gap:8, color:'#475569', fontSize:'0.95rem'}}>
                                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                                        <FaUser size={14}/> 
                                        <strong>{p.clienteNombre || 'Consumidor Final'}</strong>
                                    </div>
                                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                                        <FaClock size={14}/> 
                                        {new Date(p.fecha).toLocaleString()}
                                    </div>
                                    <div style={{marginTop:5, paddingTop:10, borderTop:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <span>Total estimado:</span>
                                        <span style={{fontSize:'1.2rem', fontWeight:'bold', color:'#0f172a'}}>
                                            C$ {Number(p.total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* BOTÓN DE ACCIÓN PRINCIPAL */}
                                {esPendiente ? (
                                    <ActionButton 
                                        primary 
                                        onClick={() => handleCargarEnCaja(p)}
                                    >
                                        <FaCartPlus size={18} /> CARGAR A CAJA
                                    </ActionButton>
                                ) : (
                                    <ActionButton disabled>
                                        {p.estado === 'COMPLETADO' ? <FaCheckCircle/> : <FaTimesCircle/>} 
                                        {p.estado}
                                    </ActionButton>
                                )}
                            </TicketCard>
                        );
                    })}
                </Grid>
            )}

            {filteredPedidos.length === 0 && !loading && (
                <div style={{textAlign:'center', marginTop:50, color:'#94a3b8'}}>
                    <h3>No hay tickets encontrados</h3>
                    <p>Los vendedores deben crear pedidos para que aparezcan aquí.</p>
                </div>
            )}
        </PageWrapper>
    );
};

export default PedidosYApartados;