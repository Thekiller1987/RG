import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import { 
    FaArrowLeft, FaPlus, FaSearch, FaFileInvoiceDollar, 
    FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock,
    FaMoneyBillWave, FaBuilding, FaList, FaTrashAlt, FaTimes, FaStore
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import { API_URL } from '../service/api';
import ConfirmationModal from './pos/components/ConfirmationModal'; 
import AlertModal from './pos/components/AlertModal';

// --- ANIMACIONES ---
const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;
const scaleIn = keyframes`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`;

// --- ESTILOS RESPONSIVOS Y MODERNOS ---
const PageWrapper = styled.div`
    padding: clamp(1rem, 3vw, 2.5rem); 
    background: #f1f5f9; 
    min-height: 100vh; 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const HeaderContainer = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 2.5rem; 
    flex-wrap: wrap; 
    gap: 1.5rem;
`;

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: clamp(1.8rem, 2.5vw, 2.2rem); 
    color: #0f172a; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin: 0; 
    font-weight: 800;
    letter-spacing: -0.025em;
    
    svg { color: #2563eb; }
`;

const Subtitle = styled.p`
    color: #64748b;
    margin: 0.25rem 0 0 0;
    font-size: 1rem;
`;

const ActionButtons = styled.div`
    display: flex; 
    gap: 0.75rem;
    flex-wrap: wrap;
    
    @media (max-width: 600px) {
        width: 100%;
        button, a { flex: 1; justify-content: center; }
    }
`;

const Button = styled.button`
    padding: 0.75rem 1.25rem; 
    border: none; 
    border-radius: 10px; 
    font-weight: 600; 
    font-size: 0.95rem;
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 0.5rem; 
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Variantes */
    ${props => props.$primary && css`
        background: #2563eb;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        &:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }
    `}

    ${props => props.$secondary && css`
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        &:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px); }
    `}

    ${props => props.$danger && css`
        background: #fee2e2;
        color: #dc2626;
        &:hover { background: #fecaca; }
    `}

    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const BackButton = styled(Link)`
    padding: 0.75rem 1.25rem; 
    background: white; 
    color: #475569; 
    border: 1px solid #e2e8f0;
    border-radius: 10px; 
    font-weight: 600; 
    text-decoration: none; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: all 0.2s;
    font-size: 0.95rem;
    &:hover { background: #f1f5f9; color: #0f172a; }
`;

// --- STATS CARDS ---
const StatsGrid = styled.div`
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
    gap: 1.5rem; 
    margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
    background: white; 
    padding: 1.75rem; 
    border-radius: 16px; 
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); 
    position: relative; 
    overflow: hidden;
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
    
    &::after { 
        content: ''; position: absolute; top: 0; right: 0; width: 6px; height: 100%; 
        background: ${props => props.color}; opacity: 0.8; 
    }

    .icon-wrapper {
        width: 40px; height: 40px; border-radius: 10px; background: ${props => props.bg}; 
        display: flex; align-items: center; justify-content: center; 
        color: ${props => props.color}; font-size: 1.2rem; margin-bottom: 1rem;
    }

    .label { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0.25rem 0; letter-spacing: -0.03em; }
    .sub { font-size: 0.9rem; color: ${props => props.color}; font-weight: 500; }
`;

// --- FILTROS Y BÚSQUEDA ---
const Toolbar = styled.div`
    background: white;
    padding: 0.5rem;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    
    @media (max-width: 768px) { flex-direction: column-reverse; gap: 0.5rem; padding: 1rem; }
`;

const FilterTabs = styled.div`
    display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.5rem;
    &::-webkit-scrollbar { height: 0; width: 0; }
`;

const TabButton = styled.button`
    padding: 0.5rem 1rem; 
    border-radius: 8px; 
    border: none; 
    font-weight: 600; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    transition: all 0.2s;
    font-size: 0.9rem;
    white-space: nowrap;

    background: ${props => props.active ? props.activeBg : 'transparent'};
    color: ${props => props.active ? props.activeColor : '#64748b'};
    
    &:hover { background: ${props => props.active ? props.activeBg : '#f1f5f9'}; }

    .badge {
        background: ${props => props.active ? props.activeColor : '#e2e8f0'};
        color: ${props => props.active ? 'white' : '#475569'};
        padding: 0.1rem 0.5rem; border-radius: 99px; font-size: 0.75rem; min-width: 20px; text-align: center;
    }
`;

const SearchContainer = styled.div`
    position: relative;
    min-width: 300px;
    margin: 0.5rem;
    @media (max-width: 768px) { width: calc(100% - 1rem); }

    svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    
    input {
        width: 100%;
        padding: 0.65rem 1rem 0.65rem 2.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 0.95rem;
        transition: all 0.2s;
        &:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    }
`;

// --- GRID DE FACTURAS ---
const InvoicesGrid = styled.div`
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
    gap: 1.5rem;
`;

const InvoiceCard = styled.div`
    background: white; 
    border-radius: 16px; 
    border: 1px solid #e2e8f0; 
    overflow: hidden; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
    display: flex; flex-direction: column;
    
    &:hover { 
        transform: translateY(-4px); 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); 
        border-color: #cbd5e1;
    }

    .card-header {
        padding: 1.25rem;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background: linear-gradient(to bottom, #ffffff, #fafafa);
    }

    .provider-info {
        display: flex; flex-direction: column;
        h3 { margin: 0; font-size: 1.05rem; color: #0f172a; font-weight: 700; line-height: 1.4; }
        .invoice-number { font-size: 0.8rem; color: #64748b; font-family: 'Monaco', monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; width: fit-content; margin-top: 0.25rem; }
    }

    .card-body {
        padding: 1.25rem;
        flex: 1;
    }

    .meta-row {
        display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem;
        .label { color: #64748b; display: flex; align-items: center; gap: 0.4rem; }
        .value { font-weight: 600; color: #334155; }
    }

    .financial-block {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px dashed #e2e8f0;
    }

    .total-row {
        display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;
        .label { font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
        .amount { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    }

    .progress-bar {
        height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;
        div { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
    }

    .balance-text {
        font-size: 0.85rem; text-align: right; color: #64748b;
        strong { color: ${props => props.balanceColor}; }
    }

    .card-footer {
        padding: 1rem 1.25rem;
        background: #f8fafc;
        border-top: 1px solid #f1f5f9;
        display: flex;
        gap: 0.75rem;
    }
`;

const StatusBadge = styled.span`
    padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.025em;
    background: ${props => props.bg}; color: ${props => props.text}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

// --- MODAL ---
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1100; animation: ${fadeIn} 0.2s;
`;
const ModalContent = styled.div`
    background: white; padding: 2.5rem; border-radius: 24px; width: 95%; max-width: 550px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: ${scaleIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: 90vh; overflow-y: auto;
    
    h2 { margin: 0 0 1.5rem 0; color: #0f172a; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.025em; }
`;
const FormGroup = styled.div`
    margin-bottom: 1.25rem;
    label { display: block; font-size: 0.9rem; color: #334155; margin-bottom: 0.5rem; font-weight: 600; }
    input, select, textarea { 
        width: 100%; padding: 0.85rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 1rem; color: #0f172a; background: #fff; transition: all 0.2s; 
        &:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        &::placeholder { color: #94a3b8; }
    }
`;

const CloseButton = styled.button`
    position: absolute; top: 1.5rem; right: 1.5rem; background: transparent; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer;
    &:hover { color: #0f172a; }
`;

// --- COMPONENTE LÓGICO ---
const FacturasProveedores = () => {
    const { token } = useAuth();
    
    // Estados de datos
    const [invoices, setInvoices] = useState([]);
    const [providers, setProviders] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Estados de UI
    const [filter, setFilter] = useState('PENDIENTE'); 
    const [searchTerm, setSearchTerm] = useState('');
    
    // ESTADO PARA LA ALERTA BONITA
    const [alertInfo, setAlertInfo] = useState({ show: false, title: '', message: '', type: 'info' });

    // Estados de Modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Formularios
    const [formData, setFormData] = useState({
        proveedor: '', 
        numero_factura: '', 
        fecha_emision: new Date().toISOString().split('T')[0], 
        fecha_vencimiento: '', 
        monto_total: '', 
        notas: ''
    });
    const [payAmount, setPayAmount] = useState('');

    // --- HELPER PARA ALERTAS ---
    const showAlert = (title, message, type = 'info') => {
        setAlertInfo({ show: true, title, message, type });
    };

    // --- CARGA INICIAL ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Cargar Facturas
                const invData = await api.fetchProviderInvoices(token);
                setInvoices(Array.isArray(invData) ? invData : []);

                // 2. Cargar Proveedores Directamente con Axios
                // Utilizamos el mismo patrón que en el inventario
                const provResponse = await axios.get(`${API_URL}/providers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const provList = Array.isArray(provResponse.data) ? provResponse.data : (provResponse.data.data || []);
                setProviders(provList);

            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [token, refreshTrigger]);

    // --- LOGICA DE NEGOCIO ---
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.proveedor) return showAlert("Atención", "Seleccione un proveedor de la lista", "warning");

        try {
            await api.createProviderInvoice(formData, token);
            setRefreshTrigger(prev => prev + 1);
            setShowCreateModal(false);
            setFormData({ 
                proveedor: '', numero_factura: '', 
                fecha_emision: new Date().toISOString().split('T')[0], 
                fecha_vencimiento: '', monto_total: '', notas: '' 
            });
            showAlert("Éxito", "Factura registrada exitosamente.", "success");
        } catch (error) {
            showAlert("Error", "Error al guardar factura. Verifique los datos.", "error");
        }
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!selectedInvoice || !payAmount) return;
        
        const maxPay = parseFloat(selectedInvoice.monto_total) - parseFloat(selectedInvoice.monto_abonado);
        if(parseFloat(payAmount) > maxPay) return showAlert("Error", `El monto no puede ser mayor a la deuda (C$${maxPay})`, "error");

        try {
            await api.payProviderInvoice(selectedInvoice.id, payAmount, token);
            setRefreshTrigger(prev => prev + 1);
            setShowPayModal(false);
            setPayAmount('');
            showAlert("Éxito", "Abono registrado correctamente.", "success");
        } catch (error) {
            showAlert("Error", "Error al registrar el pago.", "error");
        }
    };

    const handleDelete = async () => {
        if (!selectedInvoice) return;
        try {
            await api.deleteProviderInvoice(selectedInvoice.id, token);
            setRefreshTrigger(prev => prev + 1);
            setShowConfirmDelete(false);
            showAlert("Eliminado", "Factura eliminada correctamente.", "success");
        } catch (error) {
            showAlert("Error", "No se pudo eliminar la factura.", "error");
        }
    };

    // --- HELPERS ---
    const getStatusStyles = (status) => {
        switch(status) {
            case 'VENCIDA': return { color: '#dc2626', bg: '#fef2f2', activeColor: '#dc2626', activeBg: '#fee2e2' };
            case 'PAGADA': return { color: '#16a34a', bg: '#f0fdf4', activeColor: '#16a34a', activeBg: '#dcfce7' };
            default: return { color: '#2563eb', bg: '#eff6ff', activeColor: '#2563eb', activeBg: '#dbeafe' };
        }
    };

    // --- COMPUTED ---
    const stats = useMemo(() => {
        const pend = invoices.filter(i => i.estado === 'PENDIENTE').length;
        const venc = invoices.filter(i => i.estado === 'VENCIDA').length;
        const pag = invoices.filter(i => i.estado === 'PAGADA').length;
        const totalDebt = invoices.reduce((acc, curr) => {
            const deuda = parseFloat(curr.monto_total) - parseFloat(curr.monto_abonado);
            return curr.estado !== 'PAGADA' ? acc + deuda : acc;
        }, 0);
        return { pend, venc, pag, totalDebt };
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        let data = invoices;
        if (filter !== 'TODAS') data = data.filter(i => i.estado === filter);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(i => 
                (i.proveedor && i.proveedor.toLowerCase().includes(term)) || 
                (i.numero_factura && i.numero_factura.toLowerCase().includes(term))
            );
        }
        return data;
    }, [invoices, filter, searchTerm]);

    return (
        <PageWrapper>
            <HeaderContainer>
                <TitleSection>
                    <Title><FaFileInvoiceDollar /> Facturas de Proveedores</Title>
                    <Subtitle>Gestión de cuentas por pagar y control de gastos</Subtitle>
                </TitleSection>
                <ActionButtons>
                    <Button $secondary onClick={() => setRefreshTrigger(prev => prev+1)}>Actualizar</Button>
                    <BackButton to="/dashboard"><FaArrowLeft /> Dashboard</BackButton>
                    <Button $primary onClick={() => setShowCreateModal(true)}>
                        <FaPlus /> Nueva Factura
                    </Button>
                </ActionButtons>
            </HeaderContainer>

            {/* KPI CARDS */}
            <StatsGrid>
                <StatCard color="#ef4444" bg="#fef2f2">
                    <div className="icon-wrapper"><FaExclamationCircle /></div>
                    <div className="label">Vencidas</div>
                    <div className="value">{stats.venc}</div>
                    <div className="sub">Requieren pago inmediato</div>
                </StatCard>
                <StatCard color="#3b82f6" bg="#eff6ff">
                    <div className="icon-wrapper"><FaClock /></div>
                    <div className="label">Por Pagar</div>
                    <div className="value">{stats.pend}</div>
                    <div className="sub">Facturas pendientes</div>
                </StatCard>
                <StatCard color="#f59e0b" bg="#fffbeb">
                    <div className="icon-wrapper"><FaMoneyBillWave /></div>
                    <div className="label">Deuda Total</div>
                    <div className="value" style={{color:'#b45309'}}>C${stats.totalDebt.toLocaleString()}</div>
                    <div className="sub" style={{color:'#b45309'}}>Flujo de caja comprometido</div>
                </StatCard>
            </StatsGrid>

            {/* TOOLBAR */}
            <Toolbar>
                <FilterTabs>
                    {[
                        { id: 'PENDIENTE', label: 'Pendientes', icon: FaClock, color: '#3b82f6', bg: '#eff6ff', count: stats.pend },
                        { id: 'VENCIDA', label: 'Vencidas', icon: FaExclamationCircle, color: '#dc2626', bg: '#fef2f2', count: stats.venc },
                        { id: 'PAGADA', label: 'Pagadas', icon: FaCheckCircle, color: '#16a34a', bg: '#f0fdf4', count: stats.pag },
                        { id: 'TODAS', label: 'Todas', icon: FaList, color: '#64748b', bg: '#f1f5f9', count: null },
                    ].map(tab => (
                        <TabButton 
                            key={tab.id}
                            active={filter === tab.id}
                            activeColor={tab.color}
                            activeBg={tab.bg}
                            onClick={() => setFilter(tab.id)}
                        >
                            <tab.icon /> {tab.label}
                            {tab.count !== null && <span className="badge">{tab.count}</span>}
                        </TabButton>
                    ))}
                </FilterTabs>
                <SearchContainer>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Buscar por proveedor, factura..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </SearchContainer>
            </Toolbar>

            {/* CONTENT GRID */}
            {loading ? (
                <div style={{textAlign:'center', padding:'4rem', color:'#94a3b8'}}>Cargando facturas...</div>
            ) : filteredInvoices.length > 0 ? (
                <InvoicesGrid>
                    {filteredInvoices.map(inv => {
                        const styles = getStatusStyles(inv.estado);
                        const total = parseFloat(inv.monto_total) || 0;
                        const abonado = parseFloat(inv.monto_abonado) || 0;
                        const saldo = total - abonado;
                        const progress = total > 0 ? (abonado / total) * 100 : 0;

                        return (
                            <InvoiceCard key={inv.id} color={styles.color} balanceColor={saldo > 0 ? '#ef4444' : '#16a34a'}>
                                <div className="card-header">
                                    <div className="provider-info">
                                        <h3 title={inv.proveedor}><FaStore style={{marginRight:6, color: '#64748b'}}/> {inv.proveedor}</h3>
                                        <span className="invoice-number">#{inv.numero_factura}</span>
                                    </div>
                                    <StatusBadge bg={styles.bg} text={styles.color}>{inv.estado}</StatusBadge>
                                </div>

                                <div className="card-body">
                                    <div className="meta-row">
                                        <span className="label"><FaCalendarAlt/> Emisión</span>
                                        <span className="value">{new Date(inv.fecha_emision).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="label"><FaExclamationCircle/> Vence</span>
                                        <span className="value" style={{color: inv.estado==='VENCIDA'?'#ef4444':'inherit'}}>
                                            {new Date(inv.fecha_vencimiento).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="financial-block">
                                        <div className="total-row">
                                            <span className="label">Total</span>
                                            <span className="amount">C${total.toLocaleString()}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div style={{width: `${progress}%`, background: styles.color}}></div>
                                        </div>
                                        <div className="balance-text">
                                            Abonado: C${abonado.toLocaleString()} &bull; <strong>Resta: C${saldo.toLocaleString()}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    {saldo > 0 && (
                                        <Button $primary style={{flex: 1, justifyContent:'center'}} onClick={() => { setSelectedInvoice(inv); setShowPayModal(true); }}>
                                            <FaMoneyBillWave /> Abonar
                                        </Button>
                                    )}
                                    <Button $danger style={{padding:'0.75rem'}} onClick={() => { setSelectedInvoice(inv); setShowConfirmDelete(true); }}>
                                        <FaTrashAlt />
                                    </Button>
                                </div>
                            </InvoiceCard>
                        );
                    })}
                </InvoicesGrid>
            ) : (
                <div style={{textAlign:'center', padding:'4rem', color:'#94a3b8', border:'2px dashed #e2e8f0', borderRadius:'16px'}}>
                    <FaFileInvoiceDollar style={{fontSize:'3rem', marginBottom:'1rem', opacity:0.5}} />
                    <h3>No hay facturas</h3>
                    <p>Intenta cambiar los filtros o crea una nueva factura.</p>
                </div>
            )}

            {/* --- MODAL: CREAR FACTURA --- */}
            {showCreateModal && (
                <ModalOverlay onClick={() => setShowCreateModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setShowCreateModal(false)}><FaTimes/></CloseButton>
                        <h2>Registrar Factura</h2>
                        <form onSubmit={handleCreate}>
                            <FormGroup>
                                <label>Proveedor</label>
                                {/* AQUÍ ESTÁ LA SELECCIÓN DE PROVEEDORES CARGADA DESDE LA BD */}
                                <select 
                                    required 
                                    value={formData.proveedor} 
                                    onChange={e => setFormData({...formData, proveedor: e.target.value})}
                                >
                                    <option value="">Seleccione un proveedor...</option>
                                    {providers.map(p => (
                                        <option key={p.id_proveedor || p.id} value={p.nombre}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                                <FormGroup>
                                    <label>No. Factura</label>
                                    <input required type="text" value={formData.numero_factura} onChange={e => setFormData({...formData, numero_factura: e.target.value})} placeholder="Ej. F-001" />
                                </FormGroup>
                                <FormGroup>
                                    <label>Monto Total (C$)</label>
                                    <input required type="number" step="0.01" value={formData.monto_total} onChange={e => setFormData({...formData, monto_total: e.target.value})} placeholder="0.00" />
                                </FormGroup>
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                                <FormGroup>
                                    <label>Emisión</label>
                                    <input required type="date" value={formData.fecha_emision} onChange={e => setFormData({...formData, fecha_emision: e.target.value})} />
                                </FormGroup>
                                <FormGroup>
                                    <label>Vencimiento</label>
                                    <input required type="date" value={formData.fecha_vencimiento} onChange={e => setFormData({...formData, fecha_vencimiento: e.target.value})} />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <label>Notas</label>
                                <textarea rows="2" value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} placeholder="Detalles adicionales..." />
                            </FormGroup>
                            <div style={{display:'flex', gap:'1rem', marginTop:'1.5rem'}}>
                                <Button type="button" $secondary style={{flex:1, justifyContent:'center'}} onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                                <Button type="submit" $primary style={{flex:1, justifyContent:'center'}}>Guardar Factura</Button>
                            </div>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- MODAL: ABONAR --- */}
            {showPayModal && selectedInvoice && (
                <ModalOverlay onClick={() => setShowPayModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setShowPayModal(false)}><FaTimes/></CloseButton>
                        <h2>Registrar Abono</h2>
                        <div style={{background:'#f1f5f9', padding:'1rem', borderRadius:'12px', marginBottom:'1.5rem'}}>
                            <div style={{fontSize:'0.9rem', color:'#64748b'}}>Factura #{selectedInvoice.numero_factura}</div>
                            <div style={{fontSize:'1.1rem', fontWeight:'700', color:'#0f172a'}}>{selectedInvoice.proveedor}</div>
                            <div style={{marginTop:'0.5rem', display:'flex', justifyContent:'space-between', fontSize:'0.9rem'}}>
                                <span>Saldo Pendiente:</span>
                                <strong style={{color:'#ef4444'}}>C${(parseFloat(selectedInvoice.monto_total) - parseFloat(selectedInvoice.monto_abonado)).toLocaleString()}</strong>
                            </div>
                        </div>
                        <form onSubmit={handlePay}>
                            <FormGroup>
                                <label>Monto a Abonar (C$)</label>
                                <input 
                                    required type="number" step="0.01" autoFocus
                                    max={parseFloat(selectedInvoice.monto_total) - parseFloat(selectedInvoice.monto_abonado)}
                                    value={payAmount} onChange={e => setPayAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </FormGroup>
                            <div style={{display:'flex', gap:'1rem', marginTop:'1.5rem'}}>
                                <Button type="button" $secondary style={{flex:1, justifyContent:'center'}} onClick={() => setShowPayModal(false)}>Cancelar</Button>
                                <Button type="submit" $primary style={{flex:1, justifyContent:'center'}}>Confirmar Pago</Button>
                            </div>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- MODAL: ELIMINAR --- */}
            <ConfirmationModal 
                isOpen={showConfirmDelete}
                title="¿Eliminar Factura?"
                message="Esta acción eliminará permanentemente el registro de esta factura y su historial de pagos. No se puede deshacer."
                onClose={() => setShowConfirmDelete(false)}
                onConfirm={handleDelete}
            />

            {/* --- ALERTA PERSONALIZADA --- */}
            <AlertModal 
                isOpen={alertInfo.show}
                onClose={() => setAlertInfo(prev => ({ ...prev, show: false }))}
                title={alertInfo.title}
                message={alertInfo.message}
                type={alertInfo.type} 
            />
        </PageWrapper>
    );
};

export default FacturasProveedores;