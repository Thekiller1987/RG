import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { 
    FaArrowLeft, FaPlus, FaSearch, FaFilter, FaFileInvoiceDollar, 
    FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock,
    FaMoneyBillWave, FaBuilding
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';

// --- ANIMACIONES ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const slideIn = keyframes`from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; }`;

// --- ESTILOS ---
const PageWrapper = styled.div`
    padding: 2rem; background: #ffffff; min-height: 100vh; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.6s ease-out;
    @media (max-width: 768px) { padding: 1rem; }
`;

const HeaderContainer = styled.div`
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem; animation: ${slideIn} 0.5s ease-out;
`;

const Title = styled.h1`
    font-size: 2.5rem; color: #2d3748; display: flex; align-items: center; gap: 1rem; margin: 0; font-weight: 700;
    @media (max-width: 768px) { font-size: 2rem; }
`;

const ActionButtons = styled.div`
    display: flex; gap: 1rem;
`;

const Button = styled.button`
    padding: 0.8rem 1.5rem; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;
    background: ${props => props.$primary ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f3f4f6'};
    color: ${props => props.$primary ? 'white' : '#374151'};
    box-shadow: ${props => props.$primary ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'};

    &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
`;

const BackButton = styled(Link)`
    padding: 0.8rem 1.5rem; background: #6b7280; color: white; border-radius: 12px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s;
    &:hover { background: #4b5563; transform: translateY(-2px); }
`;

// --- BARRA DE ESTADÍSTICAS (KPIs) ---
const StatsGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column;
    border-left: 5px solid ${props => props.color || '#ccc'};
    
    .label { font-size: 0.9rem; color: #6b7280; font-weight: 600; text-transform: uppercase; }
    .value { font-size: 2rem; font-weight: 800; color: #1f2937; margin-top: 0.5rem; }
    .sub { font-size: 0.85rem; color: ${props => props.color || '#666'}; margin-top: 0.25rem; font-weight: 500; }
`;

// --- FILTROS TIPO PESTAÑA CON CONTADORES ---
const FilterTabs = styled.div`
    display: flex; gap: 1rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem;
`;

const TabButton = styled.button`
    padding: 0.75rem 1.5rem; border-radius: 50px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;
    background: ${props => props.active ? props.activeColor : 'white'};
    color: ${props => props.active ? 'white' : '#6b7280'};
    border: 1px solid ${props => props.active ? props.activeColor : '#e5e7eb'};

    &:hover { background: ${props => props.active ? props.activeColor : '#f9fafb'}; }

    .badge {
        background: ${props => props.active ? 'rgba(255,255,255,0.2)' : props.badgeColor};
        color: ${props => props.active ? 'white' : 'white'};
        padding: 0.1rem 0.6rem; border-radius: 20px; font-size: 0.75rem;
    }
`;

const SearchBar = styled.div`
    display: flex; align-items: center; background: white; padding: 0.8rem 1.2rem; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    input { border: none; outline: none; font-size: 1rem; width: 100%; margin-left: 0.5rem; color: #374151; }
    svg { color: #9ca3af; }
`;

// --- GRID DE FACTURAS ---
const InvoicesGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;
`;

const InvoiceCard = styled.div`
    background: white; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; transition: all 0.3s; position: relative;
    &:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-color: #3b82f6; }

    .header { padding: 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: flex-start; }
    .provider { font-weight: 700; color: #1f2937; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; }
    .id { font-size: 0.85rem; color: #9ca3af; margin-top: 0.25rem; }
    
    .body { padding: 1.5rem; }
    .row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.95rem; color: #4b5563; }
    .amount { font-size: 1.5rem; font-weight: 800; color: #1f2937; margin-top: 1rem; text-align: right; }
    .paid { font-size: 0.9rem; color: #10b981; text-align: right; font-weight: 600; }
    
    .status-stripe { height: 6px; width: 100%; background: ${props => props.color}; }
`;

const StatusChip = styled.span`
    padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    background: ${props => props.bg}; color: ${props => props.text};
`;

// --- COMPONENTE PRINCIPAL ---
const FacturasProveedores = () => {
    const { token } = useAuth();
    
    // Estados
    const [invoices, setInvoices] = useState([]);
    const [filter, setFilter] = useState('PENDIENTE'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // --- SIMULACIÓN DE DATOS ---
    // NOTA: Cuando tengas el backend listo, reemplazarás esto con api.fetchProviderInvoices()
    useEffect(() => {
        setLoading(true);
        // Simulamos que llamamos a la API
        setTimeout(() => {
            const mockData = [
                { id: 1, proveedor: 'Distribuidora Central', numero: 'FAC-2024-001', fecha: '2024-03-01', vence: '2024-03-15', total: 15000, abono: 5000, estado: 'PENDIENTE' },
                { id: 2, proveedor: 'Repuestos del Norte', numero: 'B-99821', fecha: '2024-02-20', vence: '2024-03-05', total: 8500, abono: 0, estado: 'VENCIDA' },
                { id: 3, proveedor: 'Aceites y Lubricantes SA', numero: 'A-771', fecha: '2024-03-10', vence: '2024-04-10', total: 4200, abono: 4200, estado: 'PAGADA' },
                { id: 4, proveedor: 'Llantas Managua', numero: 'FAC-9912', fecha: '2024-03-12', vence: '2024-03-20', total: 25000, abono: 10000, estado: 'PENDIENTE' },
                { id: 5, proveedor: 'Importaciones Rápidas', numero: 'IR-223', fecha: '2024-01-15', vence: '2024-02-15', total: 3000, abono: 0, estado: 'VENCIDA' },
            ];
            setInvoices(mockData);
            setLoading(false);
        }, 500);
    }, []);

    // --- CÁLCULOS Y FILTROS ---
    const stats = useMemo(() => {
        const pend = invoices.filter(i => i.estado === 'PENDIENTE').length;
        const venc = invoices.filter(i => i.estado === 'VENCIDA').length;
        const pag = invoices.filter(i => i.estado === 'PAGADA').length;
        const totalDebt = invoices.reduce((acc, curr) => curr.estado !== 'PAGADA' ? acc + (curr.total - curr.abono) : acc, 0);
        return { pend, venc, pag, totalDebt };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        let data = invoices;
        
        // 1. Filtro por estado
        if (filter !== 'TODAS') {
            data = data.filter(i => i.estado === filter);
        }

        // 2. Búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(i => 
                i.proveedor.toLowerCase().includes(term) || 
                i.numero.toLowerCase().includes(term)
            );
        }
        return data;
    }, [invoices, filter, searchTerm]);

    // --- HELPERS VISUALES ---
    const getStatusColor = (status) => {
        switch(status) {
            case 'VENCIDA': return '#ef4444'; // Rojo
            case 'PAGADA': return '#10b981'; // Verde
            case 'PENDIENTE': return '#3b82f6'; // Azul
            default: return '#9ca3af';
        }
    };

    const getStatusBg = (status) => {
        switch(status) {
            case 'VENCIDA': return '#fee2e2';
            case 'PAGADA': return '#d1fae5';
            case 'PENDIENTE': return '#dbeafe';
            default: return '#f3f4f6';
        }
    };

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title>
                    <FaFileInvoiceDollar /> Facturas de Proveedores
                </Title>
                <ActionButtons>
                    <Button $primary onClick={() => alert("Aquí abrirías el modal para Registrar Factura")}>
                        <FaPlus /> Registrar Factura
                    </Button>
                    <BackButton to="/dashboard">
                        <FaArrowLeft /> Volver
                    </BackButton>
                </ActionButtons>
            </HeaderContainer>

            {/* --- TARJETAS DE RESUMEN (KPIs) --- */}
            <StatsGrid>
                <StatCard color="#ef4444">
                    <div className="label">Facturas Vencidas</div>
                    <div className="value">{stats.venc}</div>
                    <div className="sub">Requieren atención inmediata</div>
                </StatCard>
                <StatCard color="#3b82f6">
                    <div className="label">Por Pagar (Pendientes)</div>
                    <div className="value">{stats.pend}</div>
                    <div className="sub">En plazo normal</div>
                </StatCard>
                <StatCard color="#f59e0b">
                    <div className="label">Deuda Total</div>
                    <div className="value">C${stats.totalDebt.toLocaleString()}</div>
                    <div className="sub">Monto total pendiente</div>
                </StatCard>
            </StatsGrid>

            {/* --- BARRA DE BÚSQUEDA --- */}
            <SearchBar>
                <FaSearch />
                <input 
                    type="text" 
                    placeholder="Buscar por proveedor o número de factura..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchBar>

            {/* --- FILTROS TIPO PESTAÑA (NOTIFICACIONES) --- */}
            <FilterTabs>
                <TabButton 
                    active={filter === 'PENDIENTE'} 
                    activeColor="#3b82f6" 
                    badgeColor="#3b82f6"
                    onClick={() => setFilter('PENDIENTE')}
                >
                    <FaClock /> Pendientes 
                    {stats.pend > 0 && <span className="badge">{stats.pend}</span>}
                </TabButton>

                <TabButton 
                    active={filter === 'VENCIDA'} 
                    activeColor="#ef4444" 
                    badgeColor="#ef4444"
                    onClick={() => setFilter('VENCIDA')}
                >
                    <FaExclamationCircle /> Vencidas 
                    {stats.venc > 0 && <span className="badge">{stats.venc}</span>}
                </TabButton>

                <TabButton 
                    active={filter === 'PAGADA'} 
                    activeColor="#10b981" 
                    badgeColor="#10b981"
                    onClick={() => setFilter('PAGADA')}
                >
                    <FaCheckCircle /> Pagadas 
                    {stats.pag > 0 && <span className="badge">{stats.pag}</span>}
                </TabButton>

                <TabButton 
                    active={filter === 'TODAS'} 
                    activeColor="#6b7280" 
                    badgeColor="#6b7280"
                    onClick={() => setFilter('TODAS')}
                >
                    <FaList /> Todas
                </TabButton>
            </FilterTabs>

            {/* --- LISTADO DE FACTURAS --- */}
            {loading ? (
                <p style={{textAlign: 'center', color: '#666'}}>Cargando facturas...</p>
            ) : filteredInvoices.length > 0 ? (
                <InvoicesGrid>
                    {filteredInvoices.map(invoice => {
                        const color = getStatusColor(invoice.estado);
                        const bg = getStatusBg(invoice.estado);
                        const saldo = invoice.total - invoice.abono;

                        return (
                            <InvoiceCard key={invoice.id} color={color}>
                                <div className="status-stripe"></div>
                                <div className="header">
                                    <div>
                                        <div className="provider">
                                            <FaBuilding style={{color: '#9ca3af'}} /> 
                                            {invoice.proveedor}
                                        </div>
                                        <div className="id">#{invoice.numero}</div>
                                    </div>
                                    <StatusChip bg={bg} text={color}>
                                        {invoice.estado}
                                    </StatusChip>
                                </div>
                                
                                <div className="body">
                                    <div className="row">
                                        <span><FaCalendarAlt style={{marginRight: 6}}/> Emisión:</span>
                                        <strong>{invoice.fecha}</strong>
                                    </div>
                                    <div className="row">
                                        <span style={{color: invoice.estado === 'VENCIDA' ? '#ef4444' : 'inherit'}}>
                                            <FaExclamationCircle style={{marginRight: 6}}/> Vence:
                                        </span>
                                        <strong style={{color: invoice.estado === 'VENCIDA' ? '#ef4444' : 'inherit'}}>
                                            {invoice.vence}
                                        </strong>
                                    </div>
                                    
                                    <div className="amount">
                                        <div style={{fontSize: '0.8rem', color: '#6b7280', fontWeight: '500'}}>Total Factura</div>
                                        C${invoice.total.toLocaleString()}
                                    </div>

                                    {invoice.abono > 0 && (
                                        <div className="paid">
                                            Abonado: C${invoice.abono.toLocaleString()} 
                                            {saldo > 0 && <span style={{color: '#ef4444', marginLeft: '5px'}}> (Resta: C${saldo.toLocaleString()})</span>}
                                        </div>
                                    )}

                                    <Button 
                                        style={{width: '100%', marginTop: '1.5rem', justifyContent: 'center', background: 'white', border: `1px solid ${color}`, color: color}}
                                        onClick={() => alert(`Gestionar factura ${invoice.numero}`)}
                                    >
                                        <FaMoneyBillWave /> Gestionar Pagos
                                    </Button>
                                </div>
                            </InvoiceCard>
                        );
                    })}
                </InvoicesGrid>
            ) : (
                <div style={{textAlign: 'center', padding: '4rem', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: '16px'}}>
                    <FaFileInvoiceDollar style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
                    <h3>No hay facturas para mostrar</h3>
                    <p>Intenta cambiando los filtros o registra una nueva factura.</p>
                </div>
            )}
        </PageWrapper>
    );
};

export default FacturasProveedores;