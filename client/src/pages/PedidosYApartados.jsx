// client/src/pages/PedidosYApartados.jsx
// VERSIÓN CON DISEÑO BLANCO Y ANIMACIONES MEJORADAS

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { 
    FaClipboardList, 
    FaFilter, 
    FaPlus, 
    FaSearch, 
    FaArrowLeft, 
    FaBoxOpen,
    FaDollarSign,
    FaCalendar,
    FaUser,
    FaReceipt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaExclamationTriangle
} from 'react-icons/fa';

import CreateOrderModal from './pos/components/CreateOrderModal';
import OrderDetailModal from './pos/components/OrderDetailModal'; 
import ConfirmationModal from './pos/components/ConfirmationModal';
import AlertModal from './pos/components/AlertModal';
import { loadCajaSession } from '../utils/caja';

// --- ANIMACIONES MEJORADAS ---
const fadeIn = keyframes`
    from { 
        opacity: 0; 
        transform: translateY(20px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
`;

const slideIn = keyframes`
    from { 
        transform: translateX(-20px); 
        opacity: 0; 
    }
    to { 
        transform: translateX(0); 
        opacity: 1; 
    }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
`;

// --- ESTILOS BLANCOS CON ANIMACIONES ---
const PageWrapper = styled.div`
    padding: 2rem;
    background: #ffffff;
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    animation: ${fadeIn} 0.6s ease-out;

    @media (max-width: 768px) { 
        padding: 1rem; 
    }
`;

const HeaderContainer = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
    animation: ${slideIn} 0.5s ease-out;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const Title = styled.h1`
    font-size: 2.5rem; 
    color: #2d3748; 
    display: flex;
    align-items: center; 
    gap: 1rem;
    margin: 0;
    font-weight: 700;

    @media (max-width: 768px) { 
        font-size: 2rem; 
        justify-content: center;
    }
`;

const Button = styled.button`
    padding: 0.9rem 1.8rem; 
    border: none;
    background: ${props => props.$primary ? 
        'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
    color: white; 
    border-radius: 12px; 
    cursor: pointer; 
    font-weight: 600;
    font-size: 0.95rem;
    display: inline-flex; 
    align-items: center; 
    gap: 0.75rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        animation: ${pulse} 0.6s ease;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

const BackButton = styled(Link)`
    padding: 0.9rem 1.8rem;
    background: #6b7280;
    color: white; 
    border-radius: 12px; 
    font-weight: 600;
    font-size: 0.95rem;
    display: inline-flex; 
    align-items: center; 
    gap: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        background: #4b5563;
    }
`;

const ContentGrid = styled.div`
    display: grid; 
    grid-template-columns: 320px 1fr; 
    gap: 2rem;
    animation: ${fadeIn} 0.7s ease-out 0.1s both;
    
    @media (max-width: 992px) { 
        grid-template-columns: 1fr; 
    }
`;

const FilterPanel = styled.aside`
    background: #ffffff; 
    padding: 1.8rem; 
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    align-self: flex-start;
    display: flex; 
    flex-direction: column; 
    gap: 1.8rem;
    border: 1px solid #e5e7eb;
    animation: ${slideIn} 0.6s ease-out 0.2s both;
`;

const Input = styled.input`
    width: 100%; 
    padding: 1rem; 
    font-size: 1rem; 
    border-radius: 10px; 
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
    background: #ffffff;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        transform: translateY(-1px);
    }
`;

const Select = styled.select`
    width: 100%; 
    padding: 1rem; 
    font-size: 1rem; 
    border-radius: 10px; 
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
    background: #ffffff;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        transform: translateY(-1px);
    }
`;

const PedidoCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border-left: 6px solid ${props => {
        switch (props.estado) {
            case 'APARTADO': return '#f59e0b'; 
            case 'COMPLETADO': return '#10b981';
            case 'CANCELADO': return '#ef4444';
            case 'PENDIENTE': return '#3b82f6';
            default: return '#6b7280';
        }
    }};
    display: flex; 
    flex-direction: column;
    transition: all 0.3s ease;
    overflow: hidden;
    border: 1px solid #f1f5f9;
    animation: ${fadeIn} 0.5s ease-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
`;

const CardBody = styled.div`
    padding: 1.8rem;
    cursor: pointer;
    flex: 1;
`;

const CardFooter = styled.div`
    padding: 1.2rem 1.8rem;
    background: #f8fafc;
    border-top: 1px solid #e5e7eb;
`;

const ProgressBar = styled.div`
    background: #e5e7eb; 
    border-radius: 10px; 
    height: 12px;
    overflow: hidden;
    position: relative;

    div {
        width: ${props => props.percent}%;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        height: 100%;
        transition: width 0.8s ease;
        border-radius: 10px;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    background: #ffffff;
    border-radius: 16px;
    color: #6b7280;
    border: 2px dashed #e5e7eb;
    animation: ${fadeIn} 0.6s ease-out;

    svg { 
        font-size: 4rem; 
        margin-bottom: 1.5rem; 
        opacity: 0.7;
        color: #9ca3af;
    }
    
    p { 
        font-size: 1.3rem; 
        margin: 0;
        font-weight: 500;
    }
`;

const StatusBadge = styled.span`
    background: ${props => {
        switch (props.estado) {
            case 'APARTADO': return '#fef3c7';
            case 'COMPLETADO': return #d1fae5';
            case 'CANCELADO': return '#fee2e2';
            case 'PENDIENTE': return '#dbeafe';
            default: return '#f3f4f6';
        }
    }};
    color: ${props => {
        switch (props.estado) {
            case 'APARTADO': return '#92400e';
            case 'COMPLETADO': return '#065f46';
            case 'CANCELADO': return '#991b1b';
            case 'PENDIENTE': return '#1e40af';
            default: return '#374151';
        }
    }};
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid;
    border-color: ${props => {
        switch (props.estado) {
            case 'APARTADO': return '#f59e0b';
            case 'COMPLETADO': return '#10b981';
            case 'CANCELADO': return '#ef4444';
            case 'PENDIENTE': return '#3b82f6';
            default: return #6b7280';
        }
    }};
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.2rem;
`;

const CardContent = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    margin-bottom: 1.2rem;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #6b7280;
    font-size: 0.95rem;

    strong {
        color: #374151;
        font-weight: 600;
    }
`;

const AmountDisplay = styled.div`
    background: #f8fafc;
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
`;

const WarningBanner = styled.div`
    background: #fef3c7;
    border: 1px solid #f59e0b;
    color: #92400e;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
    animation: ${pulse} 2s infinite;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        
        button, a {
            width: 100%;
            justify-content: center;
        }
    }
`;

const StatsBar = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    animation: ${fadeIn} 0.6s ease-out 0.3s both;
`;

const StatCard = styled.div`
    background: #ffffff;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #f1f5f9;
    flex: 1;
    min-width: 150px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.25rem;
    }

    .stat-label {
        font-size: 0.85rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
`;

const LoadingShimmer = styled.div`
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: ${shimmer} 1.5s infinite;
    border-radius: 8px;
    height: 100px;
    margin-bottom: 1rem;
`;

// --- COMPONENTE PRINCIPAL MEJORADO ---
const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('Activos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modal, setModal] = useState({ name: null, props: {} });
    
    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);

    const isCajaOpen = useMemo(() => {
        if (!user) return false;
        const session = loadCajaSession(user.id_usuario || user.id);
        return session && !session.closedAt;
    }, [user]);

    const fetchPedidos = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const data = await api.fetchOrders(token);
            setPedidos(data);
        } catch (error) {
            showAlert({ 
                title: "Error de Red", 
                message: `No se pudieron cargar los pedidos. ${error.message}` 
            });
        } finally {
            setIsLoading(false);
        }
    }, [token, showAlert]);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);
    
    const pedidosFiltrados = useMemo(() => {
        let filtered = Array.isArray(pedidos) ? pedidos : [];
        
        if (filtroEstado === 'Activos') {
            filtered = filtered.filter(p => p.estado === 'APARTADO' || p.estado === 'PENDIENTE');
        } else if (filtroEstado !== 'Todos') {
            filtered = filtered.filter(p => p.estado === filtroEstado.toUpperCase());
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                (p.clienteNombre && p.clienteNombre.toLowerCase().includes(lowerSearch)) || 
                String(p.id).includes(lowerSearch)
            );
        }
        return filtered;
    }, [pedidos, filtroEstado, searchTerm]);

    // Estadísticas calculadas
    const stats = useMemo(() => {
        const total = pedidosFiltrados.length;
        const activos = pedidosFiltrados.filter(p => p.estado === 'APARTADO' || p.estado === 'PENDIENTE').length;
        const completados = pedidosFiltrados.filter(p => p.estado === 'COMPLETADO').length;
        const totalVentas = pedidosFiltrados.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);

        return { total, activos, completados, totalVentas };
    }, [pedidosFiltrados]);

    const handleCreateOrder = async (orderData) => {
        try {
            await api.createOrder(orderData, token);
            showAlert({ 
                title: "¡Éxito!", 
                message: "Pedido creado correctamente."
            });
            await fetchPedidos();
            closeModal();
        } catch (error) {
            showAlert({ 
                title: "Error al Crear", 
                message: `No se pudo crear el pedido. ${error.message}` 
            });
        }
    };

    const getStatusIcon = (estado) => {
        switch (estado) {
            case 'APARTADO': return <FaDollarSign />;
            case 'COMPLETADO': return <FaCheckCircle />;
            case 'PENDIENTE': return <FaClock />;
            case 'CANCELADO': return <FaTimesCircle />;
            default: return <FaReceipt />;
        }
    };

    if (isLoading) {
        return (
            <PageWrapper>
                <HeaderContainer>
                    <Title>
                        <FaClipboardList /> 
                        Pedidos y Apartados
                    </Title>
                </HeaderContainer>
                <ContentGrid>
                    <FilterPanel>
                        <LoadingShimmer style={{height: '50px'}} />
                        <LoadingShimmer style={{height: '50px'}} />
                    </FilterPanel>
                    <main>
                        {[1, 2, 3].map(i => (
                            <LoadingShimmer key={i} style={{height: '150px', marginBottom: '1rem'}} />
                        ))}
                    </main>
                </ContentGrid>
            </PageWrapper>
        );
    }

    if (!user) {
        return (
            <PageWrapper>
                <div style={{ 
                    textAlign: 'center', 
                    color: '#374151',
                    padding: '4rem 2rem'
                }}>
                    <h1>No estás autenticado</h1>
                    <p>Por favor, inicia sesión para acceder a esta página.</p>
                    <BackButton to="/login" style={{ marginTop: '1rem' }}>
                        Iniciar Sesión
                    </BackButton>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title>
                    <FaClipboardList /> 
                    Pedidos y Apartados
                </Title>
                
                <ButtonGroup>
                    <Button 
                        $primary 
                        onClick={() => openModal('createOrder')} 
                        disabled={!isCajaOpen}
                    >
                        <FaPlus /> Crear Pedido
                    </Button>
                    <BackButton to="/dashboard">
                        <FaArrowLeft/> Volver al Dashboard
                    </BackButton>
                </ButtonGroup>
            </HeaderContainer>

            {!isCajaOpen && (
                <WarningBanner>
                    <FaExclamationTriangle />
                    La caja está cerrada. No se pueden crear nuevos pedidos ni registrar pagos.
                </WarningBanner>
            )}

            {/* Estadísticas */}
            <StatsBar>
                <StatCard>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Pedidos</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">{stats.activos}</div>
                    <div className="stat-label">Pedidos Activos</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">{stats.completados}</div>
                    <div className="stat-label">Completados</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">C${stats.totalVentas.toFixed(2)}</div>
                    <div className="stat-label">Total en Ventas</div>
                </StatCard>
            </StatsBar>
            
            <ContentGrid>
                {/* Panel de Filtros */}
                <FilterPanel>
                    <div>
                        <h3 style={{
                            marginTop: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            color: '#374151',
                            fontSize: '1.2rem'
                        }}>
                            <FaSearch /> Búsqueda
                        </h3>
                        <Input 
                            type="text" 
                            placeholder="Buscar por ID o nombre de cliente..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    
                    <div>
                        <h3 style={{
                            marginTop: 0, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            color: '#374151',
                            fontSize: '1.2rem'
                        }}>
                            <FaFilter /> Filtros
                        </h3>
                        <Select 
                            value={filtroEstado} 
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="Activos">Activos (Apartados y Pendientes)</option>
                            <option value="Todos">Todos los Pedidos</option>
                            <option value="APARTADO">Solo Apartados</option>
                            <option value="PENDIENTE">Solo Pendientes</option>
                            <option value="COMPLETADO">Completados</option>
                            <option value="CANCELADO">Cancelados</option>
                        </Select>
                    </div>

                    <div style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <p style={{ 
                            margin: 0, 
                            fontSize: '0.9rem', 
                            color: '#6b7280',
                            textAlign: 'center'
                        }}>
                            Mostrando <strong>{pedidosFiltrados.length}</strong> pedidos
                        </p>
                    </div>
                </FilterPanel>

                {/* Lista de Pedidos */}
                <main>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {pedidosFiltrados.length > 0 ? (
                            pedidosFiltrados.map((pedido, index) => {
                                const saldoPendiente = pedido.total - pedido.abonado;
                                const percentPaid = pedido.total > 0 ? (pedido.abonado / pedido.total) * 100 : 0;
                                
                                return (
                                    <PedidoCard 
                                        key={pedido.id} 
                                        estado={pedido.estado}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <CardBody onClick={() => openModal('orderDetail', { pedidoId: pedido.id })}>
                                            <CardHeader>
                                                <div>
                                                    <h3 style={{ 
                                                        margin: 0, 
                                                        color: '#1f2937',
                                                        fontSize: '1.3rem',
                                                        fontWeight: '600'
                                                    }}>
                                                        Pedido #{pedido.id}
                                                    </h3>
                                                    <p style={{ 
                                                        margin: '0.5rem 0 0', 
                                                        color: '#6b7280',
                                                        fontSize: '0.95rem'
                                                    }}>
                                                        <FaUser style={{ marginRight: '0.5rem' }} />
                                                        {pedido.clienteNombre || 'Cliente no asignado'}
                                                    </p>
                                                </div>
                                                <StatusBadge estado={pedido.estado}>
                                                    {getStatusIcon(pedido.estado)}
                                                    {pedido.estado}
                                                </StatusBadge>
                                            </CardHeader>

                                            <CardContent>
                                                <InfoItem>
                                                    <FaDollarSign />
                                                    <div>
                                                        <strong>Total:</strong> C${Number(pedido.total).toFixed(2)}
                                                    </div>
                                                </InfoItem>
                                                
                                                <InfoItem>
                                                    <FaCheckCircle style={{ color: '#10b981' }} />
                                                    <div>
                                                        <strong>Abonado:</strong> C${Number(pedido.abonado).toFixed(2)}
                                                    </div>
                                                </InfoItem>

                                                <InfoItem>
                                                    <FaCalendar />
                                                    <div>
                                                        <strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString('es-NI')}
                                                    </div>
                                                </InfoItem>

                                                {saldoPendiente > 0.009 && (
                                                    <InfoItem>
                                                        <FaExclamationTriangle style={{ color: '#ef4444' }} />
                                                        <div>
                                                            <strong>Saldo Pendiente:</strong> 
                                                            <span style={{ color: '#ef4444', fontWeight: '600' }}>
                                                                C${saldoPendiente.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </InfoItem>
                                                )}
                                            </CardContent>

                                            <AmountDisplay>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                                        Progreso de pago:
                                                    </span>
                                                    <span style={{ 
                                                        fontWeight: '600', 
                                                        color: percentPaid === 100 ? '#10b981' : '#3b82f6'
                                                    }}>
                                                        {percentPaid.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <ProgressBar percent={percentPaid}>
                                                    <div></div>
                                                </ProgressBar>
                                            </AmountDisplay>
                                        </CardBody>
                                    </PedidoCard>
                                );
                            })
                        ) : (
                            <EmptyState>
                                <FaBoxOpen />
                                <p>No se han encontrado pedidos</p>
                                <p style={{ 
                                    fontSize: '1rem', 
                                    marginTop: '0.5rem',
                                    color: '#9ca3af'
                                }}>
                                    {searchTerm || filtroEstado !== 'Todos' 
                                        ? 'Prueba ajustando los filtros de búsqueda' 
                                        : 'Crea tu primer pedido usando el botón superior'
                                    }
                                </p>
                            </EmptyState>
                        )}
                    </div>
                </main>
            </ContentGrid>
            
            {/* Modales */}
            {modal.name === 'createOrder' && (
                <CreateOrderModal 
                    onClose={closeModal} 
                    onSubmit={handleCreateOrder} 
                    showAlert={showAlert} 
                />
            )}
            
            {modal.name === 'orderDetail' && (
                <OrderDetailModal 
                    pedidoId={modal.props.pedidoId} 
                    onClose={closeModal} 
                    onUpdate={fetchPedidos} 
                    showAlert={showAlert} 
                    showConfirmation={showConfirmation} 
                    isCajaOpen={isCajaOpen} 
                />
            )}
            
            <AlertModal 
                isOpen={modal.name === 'alert'} 
                onClose={closeModal} 
                {...modal.props} 
            />
            
            <ConfirmationModal 
                isOpen={modal.name === 'confirmation'} 
                onClose={closeModal} 
                onConfirm={() => { 
                    if(modal.props.onConfirm) modal.props.onConfirm(); 
                    closeModal(); 
                }} 
                {...modal.props} 
            />
        </PageWrapper>
    );
};

export default PedidosYApartados;