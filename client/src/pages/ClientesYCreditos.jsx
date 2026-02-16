import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaUsers, FaCreditCard, FaTrashAlt, FaEdit, FaPlus, FaMoneyBillWave, FaArrowLeft, FaRedo, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import ClientFormModal from './pos/components/ClientFormModal';
import AbonoCreditoModal from './pos/components/AbonoCreditoModal';
import HistorialCreditoModal from './pos/components/HistorialCreditoModal';
import SalesHistoryModal from './pos/components/SalesHistoryModal';
import TicketModal from './pos/components/TicketModal';

const PageWrapper = styled.div`
    padding: 2rem 4rem;
    background: #f8f9fa;
    min-height: 100vh;
    @media(max-width: 992px) {
        padding: 1rem;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
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
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    color: white;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    background: ${props => props.primary ? '#007bff' : props.$delete ? '#dc3545' : props.$abono ? '#17a2b8' : props.$refresh ? '#6c757d' : '#6c757d'};
    &:hover:not(:disabled) {
        opacity: 0.85;
    }
    &:disabled {
        background: #adb5bd;
        cursor: not-allowed;
    }
`;

const BackButton = styled(Link)`
    padding: 0.7rem 1.3rem;
    background-color: #6c757d;
    color: white;
    border-radius: 8px;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    &:hover {
        background-color: #5a6268;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
    @media(max-width: 992px) {
        display: none;
    }
    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
        vertical-align: middle;
    }
    th {
        background: #f8f9fa;
        color: #495057;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
    }
`;

const MobileContainer = styled.div`
    display: none;
    flex-direction: column;
    gap: 1rem;
    @media(max-width: 992px) {
        display: flex;
    }
`;

const ClientCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f1f3f5;
    padding-bottom: 0.75rem;
    margin-bottom: 0.25rem;
`;

const CardTitle = styled.h3`
    font-size: 1.1rem;
    margin: 0;
    color: #343a40;
    font-weight: 700;
`;

const CardSubtitle = styled.span`
    font-size: 0.85rem;
    color: #868e96;
    display: block;
    margin-top: 4px;
`;

const CardBody = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
`;

const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    span.label { font-size: 0.75rem; color: #adb5bd; text-transform: uppercase; font-weight: 600; }
    span.value { font-size: 1rem; font-weight: 600; color: #495057; }
    span.balance { font-size: 1.1rem; font-weight: 700; color: ${props => props.isDebt ? '#dc3545' : '#28a745'}; }
`;

const CardActions = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px dashed #e9ecef;

    button {
        justify-content: center;
        width: 100%;
        font-size: 0.85rem;
    }
`;

export default function ClientesYCreditos() {
    const { clients, user, token, isLoading, refreshClients, cajaSession, allUsers } = useAuth();
    const [modal, setModal] = useState({ name: null, data: null });
    const [ticketToPrint, setTicketToPrint] = useState(null);

    const isCajaOpen = useMemo(() => {
        return cajaSession && !cajaSession.closedAt;
    }, [cajaSession]);

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

            <Table>
                <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Límite</th><th><FaCreditCard /> Saldo</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {clients.map(c => (
                        <tr key={c.id_cliente}>
                            <td>{c.id_cliente}</td>
                            <td>{c.nombre}</td>
                            <td>{c.telefono || 'N/A'}</td>
                            <td>{renderLimit(c.limite_credito)}</td>
                            <td style={{ fontWeight: 'bold', color: c.saldo_pendiente > 0 ? '#dc3545' : '#28a745' }}>{formatCurrency(c.saldo_pendiente)}</td>
                            <td>
                                <ButtonGroup>
                                    <Button $abono disabled={!isCajaOpen || c.saldo_pendiente <= 0} onClick={() => handleOpenModal('abono', c)} title="Realizar Abono"><FaMoneyBillWave /></Button>
                                    <Button onClick={() => handleOpenModal('client', c)} title="Editar Cliente"><FaEdit /></Button>
                                    <Button primary onClick={() => handleOpenModal('historial', c)} title="Ver Historial"><FaHistory /></Button>
                                    <Button $refresh style={{ background: '#6f42c1' }} onClick={() => handleOpenModal('tickets', c)} title="Ver Tickets"><FaMoneyBillWave /></Button>
                                    <Button $delete onClick={() => handleDelete(c)} title="Eliminar Cliente"><FaTrashAlt /></Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <MobileContainer>
                {clients.map(c => (
                    <ClientCard key={c.id_cliente}>
                        <CardHeader>
                            <div>
                                <CardTitle>{c.nombre}</CardTitle>
                                <CardSubtitle>ID: {c.id_cliente} • {c.telefono || 'Sin Teléfono'}</CardSubtitle>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.75rem', color: '#adb5bd', fontWeight: '600' }}>SALDO</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: c.saldo_pendiente > 0 ? '#dc3545' : '#28a745' }}>
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
                                <span className="value" style={{ color: c.saldo_pendiente > 0 ? '#e03131' : '#2f9e44' }}>
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

            {modal.name === 'client' && <ClientFormModal client={modal.data} onClose={handleCloseModal} onSave={refreshClients} />}
            {modal.name === 'abono' && <AbonoCreditoModal client={modal.data} onClose={handleCloseModal} onAbonoSuccess={refreshClients} showAlert={showAlert} />}
            {modal.name === 'historial' && <HistorialCreditoModal client={modal.data} onClose={handleCloseModal} token={token} />}

            {/* Modal de Tickets (SalesHistoryModal) Integrado */}
            {modal.name === 'tickets' && (
                <SalesHistoryModal
                    onClose={handleCloseModal}
                    initialClientId={modal.data?.id_cliente} // Pass client ID to filter
                    clients={clients}
                    users={allUsers} // Pass users for seller name resolution
                    loadSales={async (date) => {
                        try {
                            // Reuse the fetchSales from api service
                            return await api.fetchSales(token, date);
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
        </PageWrapper>
    );
}