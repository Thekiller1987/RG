import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FaUsers, FaCreditCard, FaTrashAlt, FaEdit, FaPlus, FaMoneyBillWave, FaArrowLeft, FaRedo, FaHistory, FaSearch, FaUserCheck, FaWallet } from 'react-icons/fa';
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
    padding: 2.5rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    @media(max-width: 992px) {
        padding: 1.5rem 1rem;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1.25rem;
    flex-wrap: wrap;
    gap: 1.25rem;
`;

const Title = styled.h1`
    font-size: 2.2rem;
    color: #212529;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    @media(max-width: 992px) {
        font-size: 1.8rem;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const Button = styled.button`
    padding: 0.65rem 1.3rem;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease-in-out;
    background: ${props => props.primary ? 'linear-gradient(135deg, #007bff, #0056b3)' : props.$delete ? 'linear-gradient(135deg, #dc3545, #b21f2d)' : props.$abono ? 'linear-gradient(135deg, #17a2b8, #117a8b)' : props.$refresh ? 'linear-gradient(135deg, #6c757d, #495057)' : 'linear-gradient(135deg, #6c757d, #495057)'};
    box-shadow: 0 4px 6px rgba(0,0,0,0.06);
    
    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        filter: brightness(1.05);
    }
    &:active:not(:disabled) {
        transform: translateY(0);
    }
    &:disabled {
        background: #adb5bd;
        box-shadow: none;
        cursor: not-allowed;
    }
`;

const BackButton = styled(Link)`
    padding: 0.65rem 1.3rem;
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
    border-radius: 8px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 6px rgba(0,0,0,0.06);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        filter: brightness(1.05);
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 2rem;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1.1rem 1.5rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tbody tr {
        transition: background 0.15s ease;
    }
    tbody tr:hover {
        background-color: #f8f9fa;
    }
`;

const MobileContainer = styled.div`
    display: none;
    flex-direction: column;
    gap: 1.25rem;
    @media(max-width: 992px) {
        display: flex;
    }
`;

const ClientCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-2px);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f1f3f5;
    padding-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
    font-size: 1.2rem;
    margin: 0;
    color: #212529;
    font-weight: 700;
`;

const CardSubtitle = styled.span`
    font-size: 0.85rem;
    color: #6c757d;
    display: block;
    margin-top: 4px;
`;

const CardBody = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
`;

const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    span.label { font-size: 0.75rem; color: #adb5bd; text-transform: uppercase; font-weight: 700; }
    span.value { font-size: 1rem; font-weight: 600; color: #495057; }
    span.balance { font-size: 1.15rem; font-weight: 800; color: ${props => props.isDebt ? '#dc3545' : '#28a745'}; }
`;

const CardActions = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px dashed #e9ecef;

    button {
        justify-content: center;
        width: 100%;
        font-size: 0.85rem;
    }
`;

/* KPI Metrics grid */
const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    border-left: 5px solid ${props => props.$color || '#007bff'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    }
`;

const StatInfo = styled.div`
    display: flex;
    flex-direction: column;
    span.label {
        font-size: 0.8rem;
        color: #868e96;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 0.25rem;
    }
    span.value {
        font-size: 1.8rem;
        font-weight: 800;
        color: #212529;
    }
`;

const StatIconWrapper = styled.div`
    background: ${props => props.$bg || '#e9f2ff'};
    color: ${props => props.$color || '#007bff'};
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
`;

/* Search Box Container */
const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 10px;
    padding: 0.6rem 1.1rem;
    margin-bottom: 2rem;
    max-width: 480px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    transition: all 0.2s ease-in-out;
    input {
        border: none;
        outline: none;
        margin-left: 0.75rem;
        width: 100%;
        font-size: 1rem;
        color: #495057;
        background: transparent;
        &::placeholder {
            color: #adb5bd;
        }
    }
    svg {
        color: #adb5bd;
        transition: color 0.2s;
    }
    &:focus-within {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        svg {
            color: #007bff;
        }
    }
`;

export default function ClientesYCreditos() {
    const { clients, user, token, isLoading, refreshClients, allUsers } = useAuth();
    const { isCajaOpen, cajaSession, setCajaSession, refreshSession } = useCaja();
    const [modal, setModal] = useState({ name: null, data: null });
    const [ticketToPrint, setTicketToPrint] = useState(null);
    const [alertState, setAlertState] = useState({ open: false, title: '', message: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const showAlert = useCallback(({ title, message }) => {
        setAlertState({ open: true, title: title || 'Aviso', message: message || '' });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertState({ open: false, title: '', message: '' });
    }, []);

    const handleDelete = async (cliente) => {
        if (cliente.saldo_pendiente > 0) {
            toast.error("El cliente tiene saldo pendiente.");
            return;
        }
        if (window.confirm("¿Seguro de eliminar este cliente?")) {
            try {
                await api.deleteClient(cliente.id_cliente, token);
                toast.success("Cliente eliminado correctamente.");
                refreshClients();
            } catch (err) {
                toast.error(err.message || "Error al eliminar cliente.");
            }
        }
    };

    const handleOpenModal = (name, data = null) => setModal({ name, data });
    const handleCloseModal = () => setModal({ name: null, data: null });

    const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;
    const renderLimit = (limit) => limit === null ? '∞' : formatCurrency(limit);

    // Filter clients based on search query
    const filteredClients = useMemo(() => {
        if (!searchQuery.trim()) return clients;
        const q = searchQuery.toLowerCase();
        return clients.filter(c => 
            c.nombre.toLowerCase().includes(q) ||
            String(c.id_cliente).includes(q) ||
            (c.telefono && c.telefono.includes(q))
        );
    }, [clients, searchQuery]);

    // Compute key statistics
    const stats = useMemo(() => {
        const total = clients.length;
        const withDebt = clients.filter(c => c.saldo_pendiente > 0).length;
        const totalDebt = clients.reduce((sum, c) => sum + (c.saldo_pendiente || 0), 0);
        return { total, withDebt, totalDebt };
    }, [clients]);

    if (isLoading) {
        return <PageWrapper><h1>Cargando...</h1></PageWrapper>;
    }

    return (
        <PageWrapper>
            <HeaderContainer>
                <Title><FaUsers /> Clientes y Créditos</Title>
                <ButtonGroup>
                    <Button primary onClick={() => handleOpenModal('client')}><FaPlus /> Crear Cliente</Button>
                    <Button $refresh onClick={refreshClients}><FaRedo /> Recargar</Button>
                    <BackButton to="/dashboard"><FaArrowLeft /> Volver</BackButton>
                </ButtonGroup>
            </HeaderContainer>

            {/* KPI Section */}
            <StatsGrid>
                <StatCard $color="#007bff">
                    <StatInfo>
                        <span className="label">Total Clientes</span>
                        <span className="value">{stats.total}</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#e9f2ff" $color="#007bff">
                        <FaUsers />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#dc3545">
                    <StatInfo>
                        <span className="label">Clientes con Deuda</span>
                        <span className="value">{stats.withDebt}</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#fdecec" $color="#dc3545">
                        <FaUserCheck />
                    </StatIconWrapper>
                </StatCard>

                <StatCard $color="#28a745">
                    <StatInfo>
                        <span className="label">Deuda Total Acumulada</span>
                        <span className="value">{formatCurrency(stats.totalDebt)}</span>
                    </StatInfo>
                    <StatIconWrapper $bg="#e8f7ee" $color="#28a745">
                        <FaWallet />
                    </StatIconWrapper>
                </StatCard>
            </StatsGrid>

            {/* Search Bar */}
            <SearchContainer>
                <FaSearch />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, ID o teléfono..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </SearchContainer>

            {filteredClients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', color: '#868e96' }}>
                    <FaUsers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No se encontraron clientes</h3>
                    <p>Intenta buscar con otros términos.</p>
                </div>
            ) : (
                <>
                    <Table>
                        <thead>
                            <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Límite</th><th><FaCreditCard /> Saldo</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(c => (
                                <tr key={c.id_cliente}>
                                    <td>{c.id_cliente}</td>
                                    <td><strong>{c.nombre}</strong></td>
                                    <td>{c.telefono || 'N/A'}</td>
                                    <td>{renderLimit(c.limite_credito)}</td>
                                    <td style={{ fontWeight: '800', color: c.saldo_pendiente > 0 ? '#dc3545' : '#28a745' }}>{formatCurrency(c.saldo_pendiente)}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button $abono disabled={!isCajaOpen || c.saldo_pendiente <= 0} onClick={() => handleOpenModal('abono', c)} title="Realizar Abono"><FaMoneyBillWave /></Button>
                                            <Button onClick={() => handleOpenModal('client', c)} title="Editar Cliente"><FaEdit /></Button>
                                            <Button primary onClick={() => handleOpenModal('historial', c)} title="Ver Historial de Créditos"><FaHistory /></Button>
                                            <Button $refresh style={{ background: '#6f42c1' }} onClick={() => handleOpenModal('tickets', c)} title="Ver Historial de Tickets"><FaMoneyBillWave /></Button>
                                            <Button $delete onClick={() => handleDelete(c)} title="Eliminar Cliente"><FaTrashAlt /></Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <MobileContainer>
                        {filteredClients.map(c => (
                            <ClientCard key={c.id_cliente}>
                                <CardHeader>
                                    <div>
                                        <CardTitle>{c.nombre}</CardTitle>
                                        <CardSubtitle>ID: {c.id_cliente} • {c.telefono || 'Sin Teléfono'}</CardSubtitle>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#adb5bd', fontWeight: '700' }}>SALDO</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: c.saldo_pendiente > 0 ? '#dc3545' : '#28a745' }}>
                                            {formatCurrency(c.saldo_pendiente)}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardBody>
                                    <InfoItem>
                                        <span className="label">Límite Crédito</span>
                                        <span className="value">{renderLimit(c.limite_credito)}</span>
                                    </InfoItem>
                                    <InfoItem>
                                        <span className="label">Estado</span>
                                        <span className="value" style={{ color: c.saldo_pendiente > 0 ? '#e03131' : '#2f9e44', fontWeight: 'bold' }}>
                                            {c.saldo_pendiente > 0 ? 'Con Deuda' : 'Al Día'}
                                        </span>
                                    </InfoItem>
                                </CardBody>

                                <CardActions>
                                    <Button $abono disabled={!isCajaOpen || c.saldo_pendiente <= 0} onClick={() => handleOpenModal('abono', c)}>
                                        <FaMoneyBillWave /> Abonar
                                    </Button>
                                    <Button onClick={() => handleOpenModal('client', c)}>
                                        <FaEdit /> Editar
                                    </Button>
                                    <Button primary onClick={() => handleOpenModal('historial', c)}>
                                        <FaHistory /> Historial
                                    </Button>
                                    <Button $refresh style={{ background: '#6f42c1' }} onClick={() => handleOpenModal('tickets', c)}>
                                        <FaMoneyBillWave /> Tickets
                                    </Button>
                                    <Button $delete style={{ gridColumn: 'span 2' }} onClick={() => handleDelete(c)}>
                                        <FaTrashAlt /> Eliminar Cliente
                                    </Button>
                                </CardActions>
                            </ClientCard>
                        ))}
                    </MobileContainer>
                </>
            )}

            {modal.name === 'client' && <ClientFormModal client={modal.data} onClose={handleCloseModal} onSave={refreshClients} />}
            {modal.name === 'abono' && <AbonoCreditoModal client={modal.data} onClose={handleCloseModal} onAbonoSuccess={() => { refreshClients(); refreshSession(); toast.success('Abono registrado correctamente.'); }} showAlert={showAlert} />}
            {modal.name === 'historial' && <HistorialCreditoModal client={modal.data} onClose={handleCloseModal} token={token} />}

            {/* Modal de Tickets (SalesHistoryModal) Integrado */}
            {modal.name === 'tickets' && (
                <SalesHistoryModal
                    onClose={handleCloseModal}
                    initialClientId={modal.data?.id_cliente} // Pass client ID to filter
                    clients={clients}
                    users={allUsers} // Pass users for seller name resolution
                    loadSales={async (date, clientId) => {
                        try {
                            // Reuse the fetchSales from api service, passing date and clientId
                            return await api.fetchSales(token, { date, clientId });
                        } catch (e) { console.error(e); return []; }
                    }}
                    onReprintTicket={(sale) => {
                        setTicketToPrint(sale); // Set ticket to print
                    }}
                />
            )}

            {/* Modal para Reimprimir Ticket */}
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

            {/* Alert Modal */}
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