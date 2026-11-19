import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
    FaUsers, FaCreditCard, FaTrash, FaEdit, FaPlus, FaMoneyBillWave,
    FaArrowLeft, FaRedo, FaHistory, FaSearch, FaUserCheck, FaWallet,
    FaShoppingBag, FaReceipt
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

/* ================================
   ESTÉTICA IDÉNTICA A INVENTARIO
================================ */
const PageWrapper = styled.div`
    padding: 20px;
    background-color: #f8fafc;
    min-height: 100vh;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    @media (max-width: 640px) {
        padding: 10px;
    }
`;

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 8px 12px;
    margin-bottom: 1rem;
    border-radius: 8px;
    transition: all 0.2s;
    &:hover {
        color: #3b82f6;
        background: #eff6ff;
        transform: translateX(-4px);
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    padding: 1rem 1.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    position: sticky;
    top: 10px;
    z-index: 40;
    border: 1px solid rgba(255, 255, 255, 0.5);
    @media (min-width: 1024px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
`;

const Title = styled.h1`
    font-size: 1.5rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    font-weight: 800;
    svg {
        color: #3b82f6;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const Button = styled.button`
    border: none;
    padding: 0.65rem 1.2rem;
    border-radius: 99px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    ${p => p.primary && `
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        &:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
    `}
    ${p => p.secondary && `
        background: white;
        color: #475569;
        border: 1px solid #cbd5e1;
        &:hover:not(:disabled) { border-color: #94a3b8; background: #f8fafc; color: #1e293b; }
    `}
    &:active { transform: translateY(0); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    border-left: 5px solid ${props => props.$color || '#3b82f6'};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    span.label {
        font-size: 0.78rem;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 0.25rem;
    }
    span.value {
        font-size: 1.65rem;
        font-weight: 800;
        color: #0f172a;
    }
`;

const StatIconWrapper = styled.div`
    background: ${props => props.$bg || '#eff6ff'};
    color: ${props => props.$color || '#3b82f6'};
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
`;

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: white;
    padding: 1.25rem;
    border-radius: 16px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
    @media (min-width: 1024px) {
        flex-direction: row;
        align-items: center;
    }
`;

const SearchInputWrapper = styled.div`
    position: relative;
    flex: 2;
    min-width: 250px;
`;

const SearchInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 1rem 0.75rem 2.6rem;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    font-size: 0.95rem;
    background-color: #f8fafc;
    transition: all 0.2s;
    outline: none;
    &:focus {
        border-color: #3b82f6;
        background: white;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
`;

const Select = styled.select`
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    background-color: #f8fafc;
    color: #334155;
    outline: none;
    flex: 1;
    font-size: 0.9rem;
    cursor: pointer;
    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        background: white;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    margin-bottom: 2rem;
    @media (max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1rem 1.25rem;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
    }
    th {
        background: #f8fafc;
        color: #475569;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.78rem;
        letter-spacing: 0.5px;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tbody tr:hover {
        background-color: #f8fafc;
    }
`;

/* Botones de acción idénticos a los de Inventario */
const ActionButton = styled.button`
    padding: 0.55rem 0.85rem;
    border-radius: 10px;
    border: 1px solid;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
    &.abono {
        background: #f0fdf4;
        border-color: #bbf7d0;
        color: #15803d;
        &:hover:not(:disabled) { background: #dcfce7; border-color: #86efac; }
    }
    &.adjust {
        background: white;
        border-color: #cbd5e1;
        color: #475569;
        &:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; color: #1e293b; }
    }
    &.edit {
        background: #f0f9ff;
        border-color: #bae6fd;
        color: #0284c7;
        &:hover:not(:disabled) { background: #e0f2fe; border-color: #7dd3fc; color: #0369a1; }
    }
    &.delete {
        background: #fef2f2;
        border-color: #fecaca;
        color: #ef4444;
        &:hover:not(:disabled) { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
    }
    &.label {
        background: #f5f3ff;
        border-color: #ddd6fe;
        color: #7c3aed;
        &:hover:not(:disabled) { background: #ede9fe; border-color: #c4b5fd; color: #6d28d9; }
    }
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`;

const MobileContainer = styled.div`
    display: none;
    flex-direction: column;
    gap: 1rem;
    @media (max-width: 992px) {
        display: flex;
    }
`;

const ClientCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export default function ClientesYCreditos() {
    const { clients, user, token, isLoading, refreshClients, allUsers, hasPermission, requireActionPermission } = useAuth();
    const { isCajaOpen, refreshSession } = useCaja();

    const canCreateEdit = hasPermission('clientes.crear_editar');
    const canAbonar = hasPermission('clientes.registrar_abono');
    const canDelete = hasPermission('clientes.eliminar');
    const canViewPurchases = hasPermission('clientes.ver_compras');

    const [modal, setModal] = useState({ name: null, data: null, initialTab: 'creditos' });
    const [ticketToPrint, setTicketToPrint] = useState(null);
    const [alertState, setAlertState] = useState({ open: false, title: '', message: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const showAlert = useCallback(({ title, message }) => {
        setAlertState({ open: true, title: title || 'Aviso', message: message || '' });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState({ open: false, title: '', message: '' });
    }, []);

    const handleDelete = async (cliente) => {
        if (!requireActionPermission('clientes.eliminar', 'Eliminar Cliente')) return;
        if (cliente.saldo_pendiente > 0) {
            toast.error("El cliente tiene saldo pendiente.");
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

    const handleOpenModal = (name, data = null, initialTab = 'creditos') => setModal({ name, data, initialTab });
    const handleCloseModal = () => setModal({ name: null, data: null, initialTab: 'creditos' });

    const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;
    const renderLimit = (limit) => (limit === null || limit === undefined) ? '∞' : formatCurrency(limit);

    const filteredClients = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return clients.filter(c => {
            if (statusFilter === 'DEBT' && !(Number(c.saldo_pendiente) > 0)) return false;
            if (statusFilter === 'CLEAN' && Number(c.saldo_pendiente) > 0) return false;

            if (!q) return true;
            return (
                (c.nombre || '').toLowerCase().includes(q) ||
                String(c.id_cliente).includes(q) ||
                (c.telefono && c.telefono.toLowerCase().includes(q)) ||
                (c.cedula && c.cedula.toLowerCase().includes(q))
            );
        });
    }, [clients, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const total = clients.length;
        const withDebt = clients.filter(c => Number(c.saldo_pendiente) > 0).length;
        const totalDebt = clients.reduce((sum, c) => sum + Number(c.saldo_pendiente || 0), 0);
        return { total, withDebt, totalDebt };
    }, [clients]);

    if (isLoading) {
        return <PageWrapper><h1>Cargando Clientes...</h1></PageWrapper>;
    }

    return (
        <PageWrapper>
            <BackButton to="/dashboard"><FaArrowLeft /> Volver al Dashboard</BackButton>

            <HeaderContainer>
                <Title><FaUsers /> Gestión de Clientes y Créditos</Title>
                <ButtonGroup>
                    <Button
                        primary
                        onClick={() => {
                            if (!requireActionPermission('clientes.crear_editar', 'Crear Nuevo Cliente')) return;
                            handleOpenModal('client');
                        }}
                    >
                        <FaPlus /> Crear Cliente {!canCreateEdit && '🔒'}
                    </Button>
                    <Button secondary onClick={refreshClients}>
                        <FaRedo /> Recargar
                    </Button>
                </ButtonGroup>
            </HeaderContainer>

            {/* KPI Section */}
            <StatsGrid>
                <StatCard $color="#3b82f6">
                    <StatInfo>
                        <span className="label">Total Clientes</span>
                        <span className="value">{stats.total}</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#eff6ff" $color="#3b82f6">
                        <FaUsers />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#ef4444">
                    <StatInfo>
                        <span className="label">Clientes con Deuda</span>
                        <span className="value">{stats.withDebt}</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#fef2f2" $color="#ef4444">
                        <FaUserCheck />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#10b981">
                    <StatInfo>
                        <span className="label">Deuda Total Acumulada</span>
                        <span className="value">{formatCurrency(stats.totalDebt)}</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#f0fdf4" $color="#10b981">
                        <FaWallet />
                    </StatIconWrapper>
                </StatCard>
            </StatsGrid>

            {/* Barra de Búsqueda y Filtros estilo Inventario */}
            <FilterContainer>
                <SearchInputWrapper>
                    <FaSearch style={{ position: 'absolute', left: 14, top: 14, color: '#94a3b8' }} />
                    <SearchInput
                        type="text"
                        placeholder="Buscar por nombre, ID, teléfono o cédula..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchInputWrapper>

                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="ALL">Todos los clientes ({clients.length})</option>
                    <option value="DEBT">Con saldo pendiente ({stats.withDebt})</option>
                    <option value="CLEAN">Al día / Sin deuda ({clients.length - stats.withDebt})</option>
                </Select>
            </FilterContainer>

            {filteredClients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    <FaUsers size={44} style={{ marginBottom: '0.75rem', opacity: 0.45 }} />
                    <h3 style={{ margin: '0 0 0.25rem', color: '#1e293b' }}>No se encontraron clientes</h3>
                    <p style={{ margin: 0 }}>Intenta buscar con otros términos.</p>
                </div>
            ) : (
                <>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Límite</th>
                                <th><FaCreditCard /> Saldo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(c => (
                                <tr key={c.id_cliente}>
                                    <td style={{ color: '#64748b', fontWeight: 600 }}>{c.id_cliente}</td>
                                    <td>
                                        <strong style={{ color: '#0f172a' }}>{c.nombre}</strong>
                                        {c.tipo_cliente && c.tipo_cliente !== 'General' && (
                                            <span style={{ marginLeft: 8, fontSize: '0.72rem', padding: '2px 7px', borderRadius: 6, background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                                                {c.tipo_cliente}
                                            </span>
                                        )}
                                    </td>
                                    <td>{c.telefono || 'N/A'}</td>
                                    <td>{renderLimit(c.limite_credito)}</td>
                                    <td style={{ fontWeight: 800, color: c.saldo_pendiente > 0 ? '#dc2626' : '#16a34a' }}>
                                        {formatCurrency(c.saldo_pendiente)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <ActionButton
                                                className="abono"
                                                disabled={!isCajaOpen || c.saldo_pendiente <= 0}
                                                onClick={() => {
                                                    if (!requireActionPermission('clientes.registrar_abono', 'Registrar Abono a Cliente')) return;
                                                    handleOpenModal('abono', c);
                                                }}
                                                title="Realizar Abono"
                                            >
                                                <FaMoneyBillWave /> Abonar {!canAbonar && '🔒'}
                                            </ActionButton>

                                            <ActionButton
                                                className="edit"
                                                onClick={() => {
                                                    if (!requireActionPermission('clientes.crear_editar', 'Editar Datos del Cliente')) return;
                                                    handleOpenModal('client', c);
                                                }}
                                                title="Editar Cliente"
                                            >
                                                <FaEdit /> Editar {!canCreateEdit && '🔒'}
                                            </ActionButton>

                                            <ActionButton
                                                className="adjust"
                                                onClick={() => handleOpenModal('historial', c, 'creditos')}
                                                title="Ver Cuenta General, Créditos y Registro de Abonos"
                                            >
                                                <FaHistory /> Cuenta / Abonos
                                            </ActionButton>

                                            <ActionButton
                                                className="label"
                                                onClick={() => {
                                                    if (!requireActionPermission('clientes.ver_compras', 'Ver Registro Completo de Compras del Cliente (Total, Año, Semanal y por Fechas)')) return;
                                                    handleOpenModal('historial', c, 'compras');
                                                }}
                                                title="Ver cuánto nos ha comprado (Total, Año, Semanal y por Fechas)"
                                            >
                                                <FaShoppingBag /> Compras {!canViewPurchases && '🔒'}
                                            </ActionButton>

                                            <ActionButton
                                                className="adjust"
                                                onClick={() => handleOpenModal('tickets', c)}
                                                title="Ver Tickets Emitidos"
                                            >
                                                <FaReceipt /> Tickets
                                            </ActionButton>

                                            <ActionButton
                                                className="delete"
                                                onClick={() => handleDelete(c)}
                                                title="Eliminar Cliente"
                                            >
                                                <FaTrash /> {!canDelete && '🔒'}
                                            </ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <MobileContainer>
                        {filteredClients.map(c => (
                            <ClientCard key={c.id_cliente}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{c.nombre}</h3>
                                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>ID: {c.id_cliente} • {c.telefono || 'Sin Teléfono'}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block' }}>SALDO</span>
                                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: c.saldo_pendiente > 0 ? '#dc2626' : '#16a34a' }}>
                                            {formatCurrency(c.saldo_pendiente)}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#475569' }}>
                                    <span><strong>Límite Crédito:</strong> {renderLimit(c.limite_credito)}</span>
                                    <span style={{ color: c.saldo_pendiente > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                                        {c.saldo_pendiente > 0 ? 'Con Deuda' : 'Al Día'}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                                    <ActionButton
                                        className="abono"
                                        disabled={!isCajaOpen || c.saldo_pendiente <= 0}
                                        onClick={() => {
                                            if (!requireActionPermission('clientes.registrar_abono', 'Registrar Abono a Cliente')) return;
                                            handleOpenModal('abono', c);
                                        }}
                                    >
                                        <FaMoneyBillWave /> Abonar {!canAbonar && '🔒'}
                                    </ActionButton>
                                    <ActionButton
                                        className="edit"
                                        onClick={() => {
                                            if (!requireActionPermission('clientes.crear_editar', 'Editar Datos del Cliente')) return;
                                            handleOpenModal('client', c);
                                        }}
                                    >
                                        <FaEdit /> Editar {!canCreateEdit && '🔒'}
                                    </ActionButton>
                                    <ActionButton
                                        className="adjust"
                                        onClick={() => handleOpenModal('historial', c, 'creditos')}
                                    >
                                        <FaHistory /> Cuenta / Abonos
                                    </ActionButton>
                                    <ActionButton
                                        className="label"
                                        onClick={() => {
                                            if (!requireActionPermission('clientes.ver_compras', 'Ver Registro Completo de Compras del Cliente')) return;
                                            handleOpenModal('historial', c, 'compras');
                                        }}
                                    >
                                        <FaShoppingBag /> Compras {!canViewPurchases && '🔒'}
                                    </ActionButton>
                                    <ActionButton
                                        className="adjust"
                                        onClick={() => handleOpenModal('tickets', c)}
                                    >
                                        <FaReceipt /> Tickets
                                    </ActionButton>
                                    <ActionButton
                                        className="delete"
                                        onClick={() => handleDelete(c)}
                                    >
                                        <FaTrash /> Eliminar {!canDelete && '🔒'}
                                    </ActionButton>
                                </div>
                            </ClientCard>
                        ))}
                    </MobileContainer>
                </>
            )}

            {modal.name === 'client' && <ClientFormModal client={modal.data} onClose={handleCloseModal} onSave={refreshClients} />}
            {modal.name === 'abono' && <AbonoCreditoModal client={modal.data} onClose={handleCloseModal} onAbonoSuccess={() => { refreshClients(); refreshSession(); toast.success('Abono registrado correctamente.'); }} showAlert={showAlert} />}
            {modal.name === 'historial' && (
                <HistorialCreditoModal
                    client={modal.data}
                    initialTab={modal.initialTab}
                    onClose={() => { handleCloseModal(); refreshClients(); }}
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
                        } catch (e) { console.error(e); return []; }
                    }}
                    onReprintTicket={(sale) => setTicketToPrint(sale)}
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
