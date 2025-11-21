// client/src/pages/PedidosYApartados.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { 
    FaClipboardList, 
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
    FaUserCircle,
    FaPrint,
    FaEdit,
    FaTrash,
    FaShoppingCart,
    FaChartBar,
    FaFilter,
    FaFileExport
} from 'react-icons/fa';

import CreateTicketModal from './components/CreateTicketModal';
import TicketDetailModal from './components/TicketDetailModal';
import FacturarTicketModal from './components/FacturarTicketModal';
import AlertModal from './components/AlertModal';
import ConfirmationModal from './components/ConfirmationModal';
import ReportesModal from './components/ReportesModal';

// --- ESTILOS (mantén los mismos estilos que te proporcioné antes) ---
const PageWrapper = styled.div`
    padding: 2rem;
    background: #ffffff;
    min-height: 100vh;
    font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const HeaderContainer = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    margin-bottom: 2rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;

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

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
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
    grid-template-columns: 300px 1fr; 
    gap: 2rem;
    
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
    }
`;

const TicketsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
`;

const TicketCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border-left: 6px solid ${props => {
        switch (props.estado) {
            case 'PENDIENTE': return '#3b82f6';
            case 'FACTURADO': return '#10b981';
            case 'CANCELADO': return '#ef4444';
            default: return '#6b7280';
        }
    }};
    display: flex; 
    flex-direction: column;
    transition: all 0.3s ease;
    overflow: hidden;
    border: 1px solid #f1f5f9;

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    background: #ffffff;
    border-radius: 16px;
    color: #6b7280;
    border: 2px dashed #e5e7eb;

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
            case 'PENDIENTE': return '#dbeafe';
            case 'FACTURADO': return '#d1fae5';
            case 'CANCELADO': return '#fee2e2';
            default: return '#f3f4f6';
        }
    }};
    color: ${props => {
        switch (props.estado) {
            case 'PENDIENTE': return '#1e40af';
            case 'FACTURADO': return '#065f46';
            case 'CANCELADO': return '#991b1b';
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
            case 'PENDIENTE': return '#3b82f6';
            case 'FACTURADO': return '#10b981';
            case 'CANCELADO': return '#ef4444';
            default: return '#6b7280';
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
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.2rem;
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

const ProductItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
`;

const ProductInfo = styled.div`
    flex: 1;
    
    .product-name {
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.25rem;
    }
    
    .product-details {
        font-size: 0.8rem;
        color: #6b7280;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
    
    button {
        padding: 0.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        
        &:hover {
            transform: scale(1.05);
        }
    }
`;

const EditButton = styled.button`
    background: #3b82f6;
    color: white;
`;

const DeleteButton = styled.button`
    background: #ef4444;
    color: white;
`;

const PrintButton = styled.button`
    background: #10b981;
    color: white;
`;

const StatsBar = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
`;

const StatCard = styled.div`
    background: #ffffff;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    border: 1px solid #f1f5f9;
    flex: 1;
    min-width: 150px;

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

const TabsContainer = styled.div`
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 1.5rem;
`;

const Tab = styled.button`
    padding: 1rem 1.5rem;
    background: ${props => props.active ? '#3b82f6' : 'transparent'};
    color: ${props => props.active ? 'white' : '#6b7280'};
    border: none;
    cursor: pointer;
    font-weight: 600;
    border-radius: 8px 8px 0 0;
    transition: all 0.3s ease;

    &:hover {
        background: ${props => props.active ? '#3b82f6' : '#f3f4f6'};
    }
`;

// --- COMPONENTE PRINCIPAL ACTUALIZADO ---
const PedidosYApartados = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('PENDIENTE');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('tickets');
    const [fechaReporte, setFechaReporte] = useState(new Date().toISOString().split('T')[0]);
    const [reporteData, setReporteData] = useState(null);
    const [modal, setModal] = useState({ name: null, props: {} });

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);

    // Función para cargar tickets
    const fetchTickets = useCallback(async () => {
        if (!token) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const params = {};
            if (filtroEstado !== 'TODOS') {
                params.estado = filtroEstado;
            }
            const data = await api.fetchTickets(token, params);
            setTickets(data);
        } catch (error) {
            showAlert({ 
                title: "Error de Red", 
                message: `No se pudieron cargar los tickets. ${error.message}` 
            });
        } finally {
            setIsLoading(false);
        }
    }, [token, showAlert, filtroEstado]);

    // Función para cargar reportes
    const fetchReportes = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await api.fetchReporteVentas(token, {
                fecha: fechaReporte,
                id_vendedor: user.id_usuario
            });
            setReporteData(data);
        } catch (error) {
            showAlert({ 
                title: "Error", 
                message: `No se pudieron cargar los reportes. ${error.message}` 
            });
        } finally {
            setIsLoading(false);
        }
    }, [token, fechaReporte, user, showAlert]);

    useEffect(() => {
        if (activeTab === 'tickets') {
            fetchTickets();
        } else if (activeTab === 'reportes') {
            fetchReportes();
        }
    }, [activeTab, fetchTickets, fetchReportes]);

    // Filtrar tickets
    const ticketsFiltrados = useMemo(() => {
        let filtered = Array.isArray(tickets) ? tickets : [];
        
        if (filtroEstado !== 'TODOS') {
            filtered = filtered.filter(t => t.estado === filtroEstado);
        }

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(t => 
                (t.cliente_nombre && t.cliente_nombre.toLowerCase().includes(lowerSearch)) || 
                String(t.id_ticket).includes(lowerSearch) ||
                (t.items && t.items.some(item => 
                    item.nombre_producto && item.nombre_producto.toLowerCase().includes(lowerSearch)
                ))
            );
        }
        return filtered;
    }, [tickets, filtroEstado, searchTerm]);

    // Estadísticas
    const stats = useMemo(() => {
        const total = ticketsFiltrados.length;
        const pendientes = ticketsFiltrados.filter(t => t.estado === 'PENDIENTE').length;
        const facturados = ticketsFiltrados.filter(t => t.estado === 'FACTURADO').length;
        const cancelados = ticketsFiltrados.filter(t => t.estado === 'CANCELADO').length;
        const totalVentas = ticketsFiltrados.reduce((sum, t) => sum + parseFloat(t.total || 0), 0);

        return { total, pendientes, facturados, cancelados, totalVentas };
    }, [ticketsFiltrados]);

    // Función para crear ticket
    const handleCreateTicket = async (ticketData) => {
        try {
            // Agregar información del vendedor
            const ticketCompleto = {
                ...ticketData,
                id_vendedor: user.id_usuario,
                id_usuario: user.id_usuario
            };
            
            await api.createTicket(ticketCompleto, token);
            showAlert({ 
                title: "¡Éxito!", 
                message: "Ticket creado correctamente."
            });
            await fetchTickets();
            closeModal();
        } catch (error) {
            showAlert({ 
                title: "Error al Crear", 
                message: `No se pudo crear el ticket. ${error.message}` 
            });
        }
    };

    // Función para facturar ticket
    const handleFacturarTicket = async (ticketId, pagoDetalles) => {
        try {
            await api.facturarTicket(ticketId, pagoDetalles, token);
            showAlert({ 
                title: "¡Éxito!", 
                message: "Ticket facturado correctamente."
            });
            await fetchTickets();
            closeModal();
        } catch (error) {
            showAlert({ 
                title: "Error al Facturar", 
                message: `No se pudo facturar el ticket. ${error.message}` 
            });
        }
    };

    // Función para cancelar ticket
    const handleCancelarTicket = async (ticketId) => {
        showConfirmation({
            title: "Cancelar Ticket",
            message: "¿Estás seguro de que deseas cancelar este ticket?",
            onConfirm: async () => {
                try {
                    await api.cancelarTicket(ticketId, token);
                    showAlert({ 
                        title: "¡Éxito!", 
                        message: "Ticket cancelado correctamente."
                    });
                    await fetchTickets();
                } catch (error) {
                    showAlert({ 
                        title: "Error al Cancelar", 
                        message: `No se pudo cancelar el ticket. ${error.message}` 
                    });
                }
            }
        });
    };

    const getStatusIcon = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return <FaClock />;
            case 'FACTURADO': return <FaCheckCircle />;
            case 'CANCELADO': return <FaTimesCircle />;
            default: return <FaReceipt />;
        }
    };

    const renderTicketsTab = () => (
        <>
            <StatsBar>
                <StatCard>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Tickets</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">{stats.pendientes}</div>
                    <div className="stat-label">Pendientes</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">{stats.facturados}</div>
                    <div className="stat-label">Facturados</div>
                </StatCard>
                <StatCard>
                    <div className="stat-value">C${stats.totalVentas.toFixed(2)}</div>
                    <div className="stat-label">Total en Ventas</div>
                </StatCard>
            </StatsBar>
            
            <ContentGrid>
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
                            placeholder="Buscar por ID, cliente o producto..." 
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
                            <FaFilter /> Estado
                        </h3>
                        <Select 
                            value={filtroEstado} 
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="TODOS">Todos los Tickets</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="FACTURADO">Facturados</option>
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
                            Mostrando <strong>{ticketsFiltrados.length}</strong> tickets
                        </p>
                    </div>
                </FilterPanel>

                <main>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {ticketsFiltrados.length > 0 ? (
                            ticketsFiltrados.map((ticket) => (
                                <TicketCard key={ticket.id_ticket} estado={ticket.estado}>
                                    <CardBody onClick={() => openModal('ticketDetail', { ticket })}>
                                        <CardHeader>
                                            <div>
                                                <h3 style={{ 
                                                    margin: 0, 
                                                    color: '#1f2937',
                                                    fontSize: '1.3rem',
                                                    fontWeight: '600'
                                                }}>
                                                    Ticket #{ticket.id_ticket}
                                                </h3>
                                                <p style={{ 
                                                    margin: '0.5rem 0 0', 
                                                    color: '#6b7280',
                                                    fontSize: '0.95rem'
                                                }}>
                                                    <FaUser style={{ marginRight: '0.5rem' }} />
                                                    {ticket.cliente_nombre || 'Cliente no asignado'}
                                                </p>
                                                {ticket.vendedor_nombre && (
                                                    <div style={{ 
                                                        background: '#e0e7ff',
                                                        color: '#3730a3',
                                                        padding: '0.3rem 0.8rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem',
                                                        marginTop: '0.3rem'
                                                    }}>
                                                        <FaUserCircle />
                                                        Vendedor: {ticket.vendedor_nombre}
                                                    </div>
                                                )}
                                            </div>
                                            <StatusBadge estado={ticket.estado}>
                                                {getStatusIcon(ticket.estado)}
                                                {ticket.estado}
                                            </StatusBadge>
                                        </CardHeader>

                                        <CardContent>
                                            <InfoItem>
                                                <FaDollarSign />
                                                <div>
                                                    <strong>Total:</strong> C${Number(ticket.total).toFixed(2)}
                                                </div>
                                            </InfoItem>
                                            
                                            <InfoItem>
                                                <FaCalendar />
                                                <div>
                                                    <strong>Fecha:</strong> {new Date(ticket.fecha_creacion).toLocaleDateString('es-NI')}
                                                </div>
                                            </InfoItem>

                                            <div>
                                                <strong style={{ color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                                                    Productos ({ticket.items?.length || 0}):
                                                </strong>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {ticket.items?.slice(0, 3).map((item, index) => (
                                                        <ProductItem key={index}>
                                                            <ProductInfo>
                                                                <div className="product-name">{item.nombre_producto}</div>
                                                                <div className="product-details">
                                                                    {item.cantidad} x C${Number(item.precio_unitario).toFixed(2)} = C${(item.cantidad * item.precio_unitario).toFixed(2)}
                                                                </div>
                                                            </ProductInfo>
                                                        </ProductItem>
                                                    ))}
                                                    {ticket.items?.length > 3 && (
                                                        <div style={{ 
                                                            textAlign: 'center', 
                                                            color: '#6b7280', 
                                                            fontSize: '0.8rem',
                                                            padding: '0.5rem'
                                                        }}>
                                                            ... y {ticket.items.length - 3} productos más
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </CardBody>
                                    <CardFooter>
                                        <ActionButtons>
                                            {ticket.estado === 'PENDIENTE' && (
                                                <>
                                                    <PrintButton 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openModal('ticketDetail', { ticket, mode: 'print' });
                                                        }}
                                                        title="Imprimir Ticket"
                                                    >
                                                        <FaPrint />
                                                    </PrintButton>
                                                    <EditButton 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openModal('ticketDetail', { ticket, mode: 'edit' });
                                                        }}
                                                        title="Editar Ticket"
                                                    >
                                                        <FaEdit />
                                                    </EditButton>
                                                </>
                                            )}
                                            {ticket.estado === 'PENDIENTE' && (
                                                <DeleteButton 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelarTicket(ticket.id_ticket);
                                                    }}
                                                    title="Cancelar Ticket"
                                                >
                                                    <FaTrash />
                                                </DeleteButton>
                                            )}
                                        </ActionButtons>
                                        
                                        {ticket.estado === 'PENDIENTE' && (
                                            <Button 
                                                $primary 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal('facturarTicket', { ticket });
                                                }}
                                            >
                                                <FaShoppingCart /> Facturar
                                            </Button>
                                        )}
                                    </CardFooter>
                                </TicketCard>
                            ))
                        ) : (
                            <EmptyState>
                                <FaBoxOpen />
                                <p>No se han encontrado tickets</p>
                                <p style={{ 
                                    fontSize: '1rem', 
                                    marginTop: '0.5rem',
                                    color: '#9ca3af'
                                }}>
                                    {searchTerm || filtroEstado !== 'TODOS'
                                        ? 'Prueba ajustando los filtros de búsqueda' 
                                        : 'Crea tu primer ticket usando el botón superior'
                                    }
                                </p>
                            </EmptyState>
                        )}
                    </div>
                </main>
            </ContentGrid>
        </>
    );

    const renderReportesTab = () => (
        <div>
            <div style={{ 
                background: '#f8fafc', 
                padding: '1.5rem', 
                borderRadius: '12px',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    color: '#374151',
                    marginBottom: '1rem'
                }}>
                    <FaChartBar /> Reporte de Ventas
                </h3>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Fecha del Reporte:
                        </label>
                        <Input 
                            type="date" 
                            value={fechaReporte}
                            onChange={(e) => setFechaReporte(e.target.value)}
                            style={{ width: '200px' }}
                        />
                    </div>
                    
                    <Button 
                        onClick={fetchReportes}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        <FaSearch /> Generar Reporte
                    </Button>

                    <Button 
                        $primary
                        onClick={() => openModal('reportesCompletos')}
                    >
                        <FaFileExport /> Reportes Completos
                    </Button>
                </div>
            </div>

            {reporteData && (
                <StatsBar>
                    <StatCard>
                        <div className="stat-value">{reporteData.total_tickets || 0}</div>
                        <div className="stat-label">Tickets del Día</div>
                    </StatCard>
                    <StatCard>
                        <div className="stat-value">{reporteData.tickets_pendientes || 0}</div>
                        <div className="stat-label">Pendientes</div>
                    </StatCard>
                    <StatCard>
                        <div className="stat-value">{reporteData.tickets_facturados || 0}</div>
                        <div className="stat-label">Facturados</div>
                    </StatCard>
                    <StatCard>
                        <div className="stat-value">C${(reporteData.total_ventas || 0).toFixed(2)}</div>
                        <div className="stat-label">Total Vendido</div>
                    </StatCard>
                </StatsBar>
            )}

            {reporteData && reporteData.detalle_ventas && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <h4>Detalle de Ventas Facturadas</h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {reporteData.detalle_ventas.map((venta, index) => (
                            <div key={index} style={{ 
                                padding: '1rem', 
                                border: '1px solid #e5e7eb', 
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <strong>Ticket #{venta.id_ticket}</strong>
                                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                        Cliente: {venta.cliente_nombre} | 
                                        Total: C${venta.total_venta} |
                                        Hora: {new Date(venta.fecha_facturacion).toLocaleTimeString('es-NI')}
                                    </div>
                                </div>
                                <StatusBadge estado="FACTURADO">
                                    <FaCheckCircle /> FACTURADO
                                </StatusBadge>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    if (isLoading && activeTab === 'tickets') {
        return (
            <PageWrapper>
                <HeaderContainer>
                    <Title>
                        <FaClipboardList /> 
                        Sistema de Tickets
                    </Title>
                </HeaderContainer>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>Cargando tickets...</p>
                </div>
            </PageWrapper>
        );
    }

    if (!user) {
        return (
            <PageWrapper>
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
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
                    Sistema de Tickets
                </Title>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button 
                        $primary 
                        onClick={() => openModal('createTicket')}
                    >
                        <FaPlus /> Nuevo Ticket
                    </Button>
                    <BackButton to="/dashboard">
                        <FaArrowLeft/> Volver al Dashboard
                    </BackButton>
                </div>
            </HeaderContainer>

            <TabsContainer>
                <Tab 
                    active={activeTab === 'tickets'} 
                    onClick={() => setActiveTab('tickets')}
                >
                    <FaReceipt /> Mis Tickets
                </Tab>
                <Tab 
                    active={activeTab === 'reportes'} 
                    onClick={() => setActiveTab('reportes')}
                >
                    <FaChartBar /> Mis Reportes
                </Tab>
            </TabsContainer>

            {activeTab === 'tickets' ? renderTicketsTab() : renderReportesTab()}

            {/* Modales */}
            {modal.name === 'createTicket' && (
                <CreateTicketModal 
                    onClose={closeModal} 
                    onSubmit={handleCreateTicket} 
                    showAlert={showAlert} 
                />
            )}
            
            {modal.name === 'ticketDetail' && (
                <TicketDetailModal 
                    ticket={modal.props.ticket}
                    mode={modal.props.mode}
                    onClose={closeModal} 
                    onUpdate={fetchTickets}
                    showAlert={showAlert}
                />
            )}

            {modal.name === 'facturarTicket' && (
                <FacturarTicketModal 
                    ticket={modal.props.ticket}
                    onClose={closeModal}
                    onFacturar={handleFacturarTicket}
                    showAlert={showAlert}
                />
            )}

            {modal.name === 'reportesCompletos' && (
                <ReportesModal 
                    onClose={closeModal}
                    user={user}
                    token={token}
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
