import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
    FaUsers, FaCreditCard, FaTrashAlt, FaEdit, FaPlus, FaMoneyBillWave,
    FaArrowLeft, FaRedo, FaSearch, FaUserCheck, FaWallet, FaChartLine,
    FaLandmark, FaShoppingBag, FaCalendarAlt, FaTrophy, FaReceipt,
    FaPhoneAlt, FaIdCard, FaMapMarkerAlt, FaSortAmountDown
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCaja } from '../context/CajaContext';
import * as api from '../service/api';
import ClientFormModal from './pos/components/ClientFormModal';
import AbonoCreditoModal from './pos/components/AbonoCreditoModal';
import HistorialCreditoModal from './pos/components/HistorialCreditoModal';
import SalesHistoryModal from './pos/components/SalesHistoryModal';
import TicketModal from './pos/components/TicketModal';
import AlertModal from './pos/components/AlertModal';

const PageWrapper = styled.div`
    padding: 2rem 3.2rem 3.5rem;
    background: linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%);
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    @media (max-width: 1100px) {
        padding: 1.25rem 1rem 2.5rem;
    }
`;

const HeroHeader = styled.div`
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f766e 100%);
    border-radius: 22px;
    padding: 1.75rem 2.25rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin-bottom: 1.75rem;
    box-shadow: 0 20px 35px -12px rgba(15, 23, 42, 0.25);
`;

const TitleBlock = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    .icon-3d {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.65rem;
        color: white;
        box-shadow: 0 10px 20px -5px rgba(56, 189, 248, 0.45), inset 0 2px 2px rgba(255,255,255,0.35);
    }
    h1 {
        font-size: 1.85rem;
        font-weight: 900;
        margin: 0;
        letter-spacing: -0.02em;
    }
    p {
        margin: 4px 0 0;
        font-size: 0.9rem;
        color: #cbd5e1;
        font-weight: 500;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.65rem;
    flex-wrap: wrap;
    align-items: center;
`;

const ActionBtn = styled.button`
    padding: 0.65rem 1.15rem;
    border: none;
    border-radius: 11px;
    font-weight: 800;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s ease;
    background: ${p =>
        p.$variant === 'primary' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
        p.$variant === 'abono' ? 'linear-gradient(135deg, #10b981, #059669)' :
        p.$variant === 'compras' ? 'linear-gradient(135deg, #0284c7, #0369a1)' :
        p.$variant === 'cuenta' ? 'linear-gradient(135deg, #4f46e5, #3730a3)' :
        p.$variant === 'tickets' ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' :
        p.$variant === 'delete' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' :
        'rgba(255, 255, 255, 0.14)'};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.06);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }
    &:disabled {
        background: #cbd5e1;
        color: #64748b;
        box-shadow: none;
        cursor: not-allowed;
    }
`;

const BackButton = styled(Link)`
    padding: 0.65rem 1.15rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.22);
    color: white;
    border-radius: 11px;
    font-weight: 800;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
    transition: all 0.2s ease;
    &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
    }
`;

/* KPI Metrics grid */
const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(255px, 1fr));
    gap: 1.15rem;
    margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
    background: #ffffff;
    border-radius: 18px;
    padding: 1.35rem 1.5rem;
    box-shadow: 0 8px 24px -6px rgba(15, 23, 42, 0.05);
    border: 1px solid #e2e8f0;
    border-left: 5px solid ${p => p.$color || '#2563eb'};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transition: transform 0.2s;
    &:hover {
        transform: translateY(-3px);
    }
`;

const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    span.label {
        font-size: 0.76rem;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 800;
        letter-spacing: 0.4px;
    }
    span.value {
        font-size: 1.7rem;
        font-weight: 900;
        color: #0f172a;
        letter-spacing: -0.02em;
    }
    span.sub {
        font-size: 0.78rem;
        font-weight: 700;
        color: ${p => p.$subColor || '#475569'};
    }
`;

const StatIconWrapper = styled.div`
    background: ${p => p.$bg || '#eff6ff'};
    color: ${p => p.$color || '#2563eb'};
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
    flex-shrink: 0;
`;

/* Control Bar */
const ControlPanel = styled.div`
    background: #ffffff;
    border-radius: 18px;
    padding: 1.15rem 1.4rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 6px 20px -6px rgba(15, 23, 42, 0.04);
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ControlRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.85rem;
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    padding: 0.6rem 1rem;
    flex: 1;
    min-width: 280px;
    max-width: 460px;
    transition: all 0.2s;
    input {
        border: none;
        outline: none;
        margin-left: 0.65rem;
        width: 100%;
        font-size: 0.92rem;
        font-weight: 600;
        color: #0f172a;
        background: transparent;
        &::placeholder { color: #94a3b8; }
    }
    svg { color: #64748b; }
    &:focus-within {
        border-color: #2563eb;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        svg { color: #2563eb; }
    }
`;

const PillGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
`;

const FilterPill = styled.button`
    padding: 0.5rem 0.95rem;
    border-radius: 999px;
    border: 1.5px solid ${p => p.$active ? (p.$color || '#2563eb') : '#e2e8f0'};
    background: ${p => p.$active ? (p.$bg || '#eff6ff') : '#ffffff'};
    color: ${p => p.$active ? (p.$color || '#1d4ed8') : '#475569'};
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.18s;
    &:hover {
        border-color: ${p => p.$color || '#2563eb'};
        transform: translateY(-1px);
    }
`;

const SortSelect = styled.select`
    padding: 0.52rem 0.9rem;
    border-radius: 10px;
    border: 1.5px solid #cbd5e1;
    background: #f8fafc;
    color: #0f172a;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    &:focus {
        outline: none;
        border-color: #2563eb;
    }
`;

/* Table */
const TableWrapper = styled.div`
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.06);
    border: 1px solid #e2e8f0;
    overflow-x: auto;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td {
        padding: 1rem 1.2rem;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
    }
    th {
        background: #f8fafc;
        color: #475569;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 0.74rem;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e2e8f0;
    }
    tbody tr {
        transition: background 0.15s ease;
    }
    tbody tr:hover {
        background-color: #f8fafc;
    }
    tr:last-child td {
        border-bottom: none;
    }
`;

const ClientProfileCell = styled.div`
    display: flex;
    align-items: center;
    gap: 0.85rem;
    .avatar {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: ${p => p.$hasDebt ? 'linear-gradient(135deg, #fee2e2, #fecaca)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)'};
        color: ${p => p.$hasDebt ? '#b91c1c' : '#1d4ed8'};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 0.95rem;
        flex-shrink: 0;
    }
    .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        .name-row {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            flex-wrap: wrap;
        }
        .name {
            font-weight: 800;
            font-size: 0.98rem;
            color: #0f172a;
        }
        .meta {
            font-size: 0.77rem;
            color: #64748b;
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
        }
    }
`;

const CategoryBadge = styled.span`
    font-size: 0.68rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 999px;
    text-transform: uppercase;
    background: ${p =>
        p.$type === 'Mayorista' ? '#fef3c7' :
        p.$type?.includes('VIP') ? '#f3e8ff' :
        p.$type?.includes('Taller') ? '#e0f2fe' : '#f1f5f9'};
    color: ${p =>
        p.$type === 'Mayorista' ? '#b45309' :
        p.$type?.includes('VIP') ? '#7c3aed' :
        p.$type?.includes('Taller') ? '#0369a1' : '#475569'};
`;

const PurchasesBreakdownBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    .primary-val {
        font-size: 1.1rem;
        font-weight: 900;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 0.45rem;
    }
    .mini-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
    }
    .mini-pill {
        font-size: 0.71rem;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 6px;
        background: #f1f5f9;
        color: #475569;
        strong { color: #0f172a; }
    }
`;

const CreditStatusBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 155px;
    .debt-val {
        font-size: 1.08rem;
        font-weight: 900;
        color: ${p => p.$hasDebt ? '#dc2626' : '#059669'};
    }
    .limit-row {
        font-size: 0.74rem;
        color: #64748b;
        display: flex;
        justify-content: space-between;
    }
    .bar {
        height: 6px;
        background: #e2e8f0;
        border-radius: 999px;
        overflow: hidden;
        .fill {
            height: 100%;
            background: ${p => p.$pct > 85 ? '#dc2626' : p.$pct > 50 ? '#f59e0b' : '#10b981'};
            width: ${p => Math.min(100, p.$pct)}%;
        }
    }
`;

const MobileContainer = styled.div`
    display: none;
    flex-direction: column;
    gap: 1rem;
    @media (max-width: 1024px) {
        display: flex;
    }
`;

const ClientCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export default function ClientesYCreditos() {
    const { clients, user, token, isLoading, refreshClients, allUsers } = useAuth();
    const { isCajaOpen, refreshSession } = useCaja();
    const [modal, setModal] = useState({ name: null, data: null, initialTab: 'compras' });
    const [ticketToPrint, setTicketToPrint] = useState(null);
    const [alertState, setAlertState] = useState({ open: false, title: '', message: '' });

    // Filtros y vistas
    const [searchQuery, setSearchQuery] = useState('');
    const [purchasePeriod, setPurchasePeriod] = useState('TOTAL'); // TOTAL, ANIO, MES, SEMANA
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, DEBT, CLEAN, VIP
    const [sortBy, setSortBy] = useState('PURCHASES_DESC'); // PURCHASES_DESC, DEBT_DESC, RECENT, NAME_ASC

    const showAlert = useCallback(({ title, message }) => {
        setAlertState({ open: true, title: title || 'Aviso', message: message || '' });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState({ open: false, title: '', message: '' });
    }, []);

    const handleDelete = async (cliente) => {
        if (cliente.saldo_pendiente > 0) {
            toast.error("No se puede eliminar un cliente con saldo pendiente.");
            return;
        }
        if (window.confirm(`¿Seguro de eliminar al cliente "${cliente.nombre}"?`)) {
            try {
                await api.deleteClient(cliente.id_cliente, token);
                toast.success("Cliente eliminado correctamente.");
                refreshClients();
            } catch (err) {
                toast.error(err.message || "Error al eliminar cliente.");
            }
        }
    };

    const handleOpenModal = (name, data = null, initialTab = 'compras') => setModal({ name, data, initialTab });
    const handleCloseModal = () => setModal({ name: null, data: null, initialTab: 'compras' });

    const formatCurrency = (amount) => `C$${Number(amount || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const renderLimit = (limit) => (limit === null || limit === undefined) ? '∞ Sin Límite' : formatCurrency(limit);
    const fmtShortDate = (iso) => {
        if (!iso) return 'Sin compras';
        return new Date(iso).toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getPeriodAmount = useCallback((c) => {
        if (purchasePeriod === 'ANIO') return Number(c.compras_anio || 0);
        if (purchasePeriod === 'MES') return Number(c.compras_mes || 0);
        if (purchasePeriod === 'SEMANA') return Number(c.compras_semana || 0);
        return Number(c.compras_total || 0);
    }, [purchasePeriod]);

    const periodLabel = useMemo(() => {
        if (purchasePeriod === 'ANIO') return `Este Año (${new Date().getFullYear()})`;
        if (purchasePeriod === 'MES') return 'Este Mes';
        if (purchasePeriod === 'SEMANA') return 'Esta Semana';
        return 'Total Histórico';
    }, [purchasePeriod]);

    // Filtrar y ordenar clientes
    const filteredClients = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const list = clients.filter(c => {
            if (statusFilter === 'DEBT' && !(Number(c.saldo_pendiente) > 0)) return false;
            if (statusFilter === 'CLEAN' && Number(c.saldo_pendiente) > 0) return false;
            if (statusFilter === 'VIP' && !(Number(c.compras_total) > 0 || (c.tipo_cliente || '').includes('VIP') || c.tipo_cliente === 'Mayorista')) return false;

            if (!q) return true;
            return (
                (c.nombre || '').toLowerCase().includes(q) ||
                String(c.id_cliente).includes(q) ||
                (c.telefono && c.telefono.toLowerCase().includes(q)) ||
                (c.cedula && c.cedula.toLowerCase().includes(q)) ||
                (c.direccion && c.direccion.toLowerCase().includes(q)) ||
                (c.tipo_cliente && c.tipo_cliente.toLowerCase().includes(q))
            );
        });

        return [...list].sort((a, b) => {
            if (sortBy === 'PURCHASES_DESC') {
                return getPeriodAmount(b) - getPeriodAmount(a);
            }
            if (sortBy === 'DEBT_DESC') {
                return Number(b.saldo_pendiente || 0) - Number(a.saldo_pendiente || 0);
            }
            if (sortBy === 'RECENT') {
                const da = a.ultima_compra ? new Date(a.ultima_compra).getTime() : 0;
                const db = b.ultima_compra ? new Date(b.ultima_compra).getTime() : 0;
                return db - da;
            }
            return (a.nombre || '').localeCompare(b.nombre || '');
        });
    }, [clients, searchQuery, statusFilter, sortBy, getPeriodAmount]);

    // Estadísticas globales
    const stats = useMemo(() => {
        const total = clients.length;
        const withDebt = clients.filter(c => Number(c.saldo_pendiente) > 0).length;
        const totalDebt = clients.reduce((sum, c) => sum + Number(c.saldo_pendiente || 0), 0);
        const totalAbonado = clients.reduce((sum, c) => sum + Number(c.total_abonado || 0), 0);
        const sumTotal = clients.reduce((sum, c) => sum + Number(c.compras_total || 0), 0);
        const sumAnio = clients.reduce((sum, c) => sum + Number(c.compras_anio || 0), 0);
        const sumMes = clients.reduce((sum, c) => sum + Number(c.compras_mes || 0), 0);
        const sumSemana = clients.reduce((sum, c) => sum + Number(c.compras_semana || 0), 0);
        const activeThisMonth = clients.filter(c => Number(c.compras_mes || 0) > 0).length;
        return { total, withDebt, totalDebt, totalAbonado, sumTotal, sumAnio, sumMes, sumSemana, activeThisMonth };
    }, [clients]);

    const activeVolumeValue = useMemo(() => {
        if (purchasePeriod === 'ANIO') return stats.sumAnio;
        if (purchasePeriod === 'MES') return stats.sumMes;
        if (purchasePeriod === 'SEMANA') return stats.sumSemana;
        return stats.sumTotal;
    }, [purchasePeriod, stats]);

    const getInitials = (name = '') => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return (name.slice(0, 2) || 'CL').toUpperCase();
    };

    if (isLoading) {
        return <PageWrapper><h1>Cargando directorio de clientes...</h1></PageWrapper>;
    }

    return (
        <PageWrapper>
            <HeroHeader>
                <TitleBlock>
                    <div className="icon-3d"><FaUsers /></div>
                    <div>
                        <h1>Centro de Clientes, Compras y Cuenta General</h1>
                        <p>Control de compras (Total, Año, Mes, Semanal y por Fechas), Cuenta General y Registro de Abonos</p>
                    </div>
                </TitleBlock>
                <ButtonGroup>
                    <ActionBtn $variant="primary" onClick={() => handleOpenModal('client')}>
                        <FaPlus /> Nuevo Cliente
                    </ActionBtn>
                    <ActionBtn onClick={refreshClients}>
                        <FaRedo /> Actualizar
                    </ActionBtn>
                    <BackButton to="/dashboard">
                        <FaArrowLeft /> Dashboard
                    </BackButton>
                </ButtonGroup>
            </HeroHeader>

            {/* ─── KPI SECTION ─── */}
            <StatsGrid>
                <StatCard $color="#2563eb">
                    <StatInfo $subColor="#2563eb">
                        <span className="label">Total Clientes Registrados</span>
                        <span className="value">{stats.total}</span>
                        <span className="sub">{stats.activeThisMonth} compraron este mes</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#eff6ff" $color="#2563eb">
                        <FaUsers />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#0284c7">
                    <StatInfo $subColor="#0284c7">
                        <span className="label">Compras Clientes ({periodLabel})</span>
                        <span className="value">{formatCurrency(activeVolumeValue)}</span>
                        <span className="sub">
                            Año: {formatCurrency(stats.sumAnio)} • Sem: {formatCurrency(stats.sumSemana)}
                        </span>
                    </StatInfo>
                    <StatIconWrapper $bg="#e0f2fe" $color="#0284c7">
                        <FaShoppingBag />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#dc2626">
                    <StatInfo $subColor="#dc2626">
                        <span className="label">Cartera de Crédito (Saldo Pendiente)</span>
                        <span className="value">{formatCurrency(stats.totalDebt)}</span>
                        <span className="sub">{stats.withDebt} cliente(s) con saldo activo</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#fef2f2" $color="#dc2626">
                        <FaUserCheck />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#059669">
                    <StatInfo $subColor="#059669">
                        <span className="label">Total Recuperado en Abonos</span>
                        <span className="value">{formatCurrency(stats.totalAbonado)}</span>
                        <span className="sub">Contado, Transferencia y Tarjeta</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#ecfdf5" $color="#059669">
                        <FaWallet />
                    </StatIconWrapper>
                </StatCard>
            </StatsGrid>

            {/* ─── PANEL DE CONTROL Y FILTROS ─── */}
            <ControlPanel>
                <ControlRow>
                    <SearchContainer>
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar cliente por nombre, ID, teléfono, cédula/RUC o dirección..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </SearchContainer>

                    {/* Selector de Período de "¿Cuánto nos ha comprado?" */}
                    <PillGroup>
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                            Ver Compras por:
                        </span>
                        <FilterPill $active={purchasePeriod === 'TOTAL'} onClick={() => setPurchasePeriod('TOTAL')}>
                            <FaTrophy /> Total Histórico
                        </FilterPill>
                        <FilterPill $active={purchasePeriod === 'ANIO'} $color="#7c3aed" $bg="#f5f3ff" onClick={() => setPurchasePeriod('ANIO')}>
                            <FaCalendarAlt /> Este Año
                        </FilterPill>
                        <FilterPill $active={purchasePeriod === 'MES'} $color="#0284c7" $bg="#e0f2fe" onClick={() => setPurchasePeriod('MES')}>
                            <FaChartLine /> Este Mes
                        </FilterPill>
                        <FilterPill $active={purchasePeriod === 'SEMANA'} $color="#059669" $bg="#ecfdf5" onClick={() => setPurchasePeriod('SEMANA')}>
                            <FaShoppingBag /> Semanal
                        </FilterPill>
                    </PillGroup>
                </ControlRow>

                <ControlRow>
                    <PillGroup>
                        <FilterPill $active={statusFilter === 'ALL'} onClick={() => setStatusFilter('ALL')}>
                            Todos ({clients.length})
                        </FilterPill>
                        <FilterPill $active={statusFilter === 'DEBT'} $color="#dc2626" $bg="#fef2f2" onClick={() => setStatusFilter('DEBT')}>
                            Con Deuda ({stats.withDebt})
                        </FilterPill>
                        <FilterPill $active={statusFilter === 'CLEAN'} $color="#059669" $bg="#ecfdf5" onClick={() => setStatusFilter('CLEAN')}>
                            Al Día ({clients.length - stats.withDebt})
                        </FilterPill>
                        <FilterPill $active={statusFilter === 'VIP'} $color="#d97706" $bg="#fffbeb" onClick={() => setStatusFilter('VIP')}>
                            <FaTrophy /> Con Historial de Compras
                        </FilterPill>
                    </PillGroup>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaSortAmountDown style={{ color: '#64748b' }} />
                        <SortSelect value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="PURCHASES_DESC">Ordenar: Mayor Comprador ({periodLabel})</option>
                            <option value="DEBT_DESC">Ordenar: Mayor Saldo Pendiente</option>
                            <option value="RECENT">Ordenar: Compra Más Reciente</option>
                            <option value="NAME_ASC">Ordenar: Nombre (A - Z)</option>
                        </SortSelect>
                    </div>
                </ControlRow>
            </ControlPanel>

            {filteredClients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem', background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    <FaUsers size={48} style={{ marginBottom: '0.75rem', opacity: 0.45 }} />
                    <h3 style={{ margin: '0 0 0.3rem', color: '#0f172a' }}>No se encontraron clientes</h3>
                    <p style={{ margin: 0 }}>Intenta ajustar los filtros o el término de búsqueda.</p>
                </div>
            ) : (
                <>
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Cliente / Expediente</th>
                                    <th>¿Cuánto Nos Ha Comprado? ({periodLabel})</th>
                                    <th>Cuenta General / Crédito</th>
                                    <th style={{ textAlign: 'right' }}>Acciones y Registros</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map(c => {
                                    const hasDebt = Number(c.saldo_pendiente) > 0;
                                    const limitNum = c.limite_credito !== null && c.limite_credito !== undefined ? Number(c.limite_credito) : null;
                                    const creditPct = limitNum && limitNum > 0 ? (Number(c.saldo_pendiente || 0) / limitNum) * 100 : (hasDebt ? 40 : 0);
                                    const periodAmt = getPeriodAmount(c);

                                    return (
                                        <tr key={c.id_cliente}>
                                            <td>
                                                <ClientProfileCell $hasDebt={hasDebt}>
                                                    <div className="avatar">{getInitials(c.nombre)}</div>
                                                    <div className="info">
                                                        <div className="name-row">
                                                            <span className="name">{c.nombre}</span>
                                                            <CategoryBadge $type={c.tipo_cliente}>{c.tipo_cliente || 'General'}</CategoryBadge>
                                                        </div>
                                                        <div className="meta">
                                                            <span>ID #{c.id_cliente}</span>
                                                            {c.telefono && <span><FaPhoneAlt size={10} /> {c.telefono}</span>}
                                                            {c.cedula && <span><FaIdCard size={10} /> {c.cedula}</span>}
                                                            {c.direccion && <span><FaMapMarkerAlt size={10} /> {c.direccion}</span>}
                                                        </div>
                                                    </div>
                                                </ClientProfileCell>
                                            </td>

                                            <td>
                                                <PurchasesBreakdownBox>
                                                    <div className="primary-val">
                                                        <span>{formatCurrency(periodAmt)}</span>
                                                        <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '999px' }}>
                                                            {c.cantidad_compras || 0} compra(s)
                                                        </span>
                                                    </div>
                                                    <div className="mini-grid">
                                                        <span className="mini-pill">Total: <strong>{formatCurrency(c.compras_total)}</strong></span>
                                                        <span className="mini-pill">Año: <strong>{formatCurrency(c.compras_anio)}</strong></span>
                                                        <span className="mini-pill">Mes: <strong>{formatCurrency(c.compras_mes)}</strong></span>
                                                        <span className="mini-pill">Sem: <strong>{formatCurrency(c.compras_semana)}</strong></span>
                                                    </div>
                                                    <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                                                        Última compra: <strong>{fmtShortDate(c.ultima_compra)}</strong>
                                                    </div>
                                                </PurchasesBreakdownBox>
                                            </td>

                                            <td>
                                                <CreditStatusBox $hasDebt={hasDebt} $pct={creditPct}>
                                                    <div className="debt-val">
                                                        {formatCurrency(c.saldo_pendiente)}
                                                    </div>
                                                    <div className="limit-row">
                                                        <span>Límite: <strong>{renderLimit(c.limite_credito)}</strong></span>
                                                        {Number(c.total_abonado) > 0 && (
                                                            <span style={{ color: '#059669', fontWeight: 700 }}>
                                                                Abonado: {formatCurrency(c.total_abonado)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="bar">
                                                        <div className="fill" />
                                                    </div>
                                                </CreditStatusBox>
                                            </td>

                                            <td style={{ textAlign: 'right' }}>
                                                <ButtonGroup style={{ justifyContent: 'flex-end' }}>
                                                    <ActionBtn
                                                        $variant="abono"
                                                        disabled={!isCajaOpen || Number(c.saldo_pendiente) <= 0}
                                                        onClick={() => handleOpenModal('abono', c)}
                                                        title={!isCajaOpen ? "Abra caja para registrar abonos" : "Registrar Abono (Cuenta General o Factura)"}
                                                    >
                                                        <FaMoneyBillWave /> Abonar
                                                    </ActionBtn>

                                                    <ActionBtn
                                                        $variant="compras"
                                                        onClick={() => handleOpenModal('historial', c, 'compras')}
                                                        title="Ver cuánto ha comprado (Total, Año, Semanal y qué productos compró de tal fecha a tal fecha)"
                                                    >
                                                        <FaShoppingBag /> Compras / Fechas
                                                    </ActionBtn>

                                                    <ActionBtn
                                                        $variant="cuenta"
                                                        onClick={() => handleOpenModal('historial', c, 'creditos')}
                                                        title="Ver Cuenta General, Facturas al Crédito y Registro de Abonos con iconos por método"
                                                    >
                                                        <FaLandmark /> Cuenta General
                                                    </ActionBtn>

                                                    <ActionBtn
                                                        $variant="tickets"
                                                        onClick={() => handleOpenModal('tickets', c)}
                                                        title="Ver Tickets de Punto de Venta"
                                                    >
                                                        <FaReceipt />
                                                    </ActionBtn>

                                                    <ActionBtn
                                                        style={{ background: '#475569' }}
                                                        onClick={() => handleOpenModal('client', c)}
                                                        title="Editar Datos del Cliente"
                                                    >
                                                        <FaEdit />
                                                    </ActionBtn>

                                                    <ActionBtn
                                                        $variant="delete"
                                                        onClick={() => handleDelete(c)}
                                                        title="Eliminar Cliente"
                                                    >
                                                        <FaTrashAlt />
                                                    </ActionBtn>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </TableWrapper>

                    {/* ─── VISTA MÓVIL / TABLET ─── */}
                    <MobileContainer>
                        {filteredClients.map(c => {
                            const hasDebt = Number(c.saldo_pendiente) > 0;
                            return (
                                <ClientCard key={c.id_cliente}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800 }}>{c.nombre}</h3>
                                                <CategoryBadge $type={c.tipo_cliente}>{c.tipo_cliente || 'General'}</CategoryBadge>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                ID #{c.id_cliente} • {c.telefono || 'Sin Teléfono'}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800 }}>SALDO</span>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: hasDebt ? '#dc2626' : '#059669' }}>
                                                {formatCurrency(c.saldo_pendiente)}
                                            </div>
                                        </div>
                                    </div>

                                    <PurchasesBreakdownBox>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                                            ¿Cuánto nos ha comprado? ({c.cantidad_compras || 0} compras)
                                        </div>
                                        <div className="mini-grid">
                                            <span className="mini-pill">Total: <strong>{formatCurrency(c.compras_total)}</strong></span>
                                            <span className="mini-pill">Año: <strong>{formatCurrency(c.compras_anio)}</strong></span>
                                            <span className="mini-pill">Mes: <strong>{formatCurrency(c.compras_mes)}</strong></span>
                                            <span className="mini-pill">Sem: <strong>{formatCurrency(c.compras_semana)}</strong></span>
                                        </div>
                                    </PurchasesBreakdownBox>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
                                        <ActionBtn
                                            $variant="abono"
                                            disabled={!isCajaOpen || !hasDebt}
                                            onClick={() => handleOpenModal('abono', c)}
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <FaMoneyBillWave /> Abonar
                                        </ActionBtn>
                                        <ActionBtn
                                            $variant="compras"
                                            onClick={() => handleOpenModal('historial', c, 'compras')}
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <FaShoppingBag /> Compras / Fechas
                                        </ActionBtn>
                                        <ActionBtn
                                            $variant="cuenta"
                                            onClick={() => handleOpenModal('historial', c, 'creditos')}
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <FaLandmark /> Cuenta General
                                        </ActionBtn>
                                        <ActionBtn
                                            $variant="tickets"
                                            onClick={() => handleOpenModal('tickets', c)}
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <FaReceipt /> Tickets POS
                                        </ActionBtn>
                                        <ActionBtn
                                            style={{ background: '#475569', justifyContent: 'center' }}
                                            onClick={() => handleOpenModal('client', c)}
                                        >
                                            <FaEdit /> Editar
                                        </ActionBtn>
                                        <ActionBtn
                                            $variant="delete"
                                            onClick={() => handleDelete(c)}
                                            style={{ justifyContent: 'center' }}
                                        >
                                            <FaTrashAlt /> Eliminar
                                        </ActionBtn>
                                    </div>
                                </ClientCard>
                            );
                        })}
                    </MobileContainer>
                </>
            )}

            {modal.name === 'client' && (
                <ClientFormModal
                    client={modal.data}
                    onClose={handleCloseModal}
                    onSave={refreshClients}
                />
            )}

            {modal.name === 'abono' && (
                <AbonoCreditoModal
                    client={modal.data}
                    onClose={handleCloseModal}
                    onAbonoSuccess={() => {
                        refreshClients();
                        refreshSession();
                        toast.success('Abono registrado correctamente.');
                    }}
                    showAlert={showAlert}
                />
            )}

            {modal.name === 'historial' && (
                <HistorialCreditoModal
                    client={modal.data}
                    initialTab={modal.initialTab}
                    onClose={() => {
                        handleCloseModal();
                        refreshClients();
                    }}
                    token={token}
                />
            )}

            {modal.name === 'tickets' && (
                <SalesHistoryModal
                    onClose={handleCloseModal}
                    initialClientId={modal.data?.id_cliente}
                    clients={clients}
                    users={allUsers}
                    loadSales={async (date, clientId) => {
                        try {
                            return await api.fetchSales(token, { date, clientId });
                        } catch (e) {
                            console.error(e);
                            return [];
                        }
                    }}
                    onReprintTicket={(sale) => {
                        setTicketToPrint(sale);
                    }}
                />
            )}

            {ticketToPrint && (
                <TicketModal
                    isOpen={true}
                    transaction={ticketToPrint}
                    onClose={() => setTicketToPrint(null)}
                    clients={clients}
                    users={allUsers}
                    currentUser={user}
                />
            )}

            {alertState.open && (
                <AlertModal
                    title={alertState.title}
                    message={alertState.message}
                    onClose={closeAlert}
                />
            )}
        </PageWrapper>
    );
}
