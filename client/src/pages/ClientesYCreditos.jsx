import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaUsers, FaCreditCard, FaTrashAlt, FaEdit, FaPlus, FaMoneyBillWave, FaArrowLeft, FaRedo, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';
import ClientFormModal from './pos/components/ClientFormModal';
import AbonoCreditoModal from './pos/components/AbonoCreditoModal';
import HistorialCreditoModal from './pos/components/HistorialCreditoModal';
import AlertModal from './pos/components/AlertModal';

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

export default function ClientesYCreditos() {
    const { clients, user, token, isLoading, refreshClients, cajaSession } = useAuth();
    const [modal, setModal] = useState({ name: null, data: null });
    const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

    const showAlert = ({ title, message }) => setAlert({ isOpen: true, title, message });
    const closeAlert = () => setAlert({ isOpen: false });

    const isCajaOpen = useMemo(() => {
        return cajaSession && !cajaSession.closedAt;
    }, [cajaSession]);

    const handleDelete = async (cliente) => {
        if (cliente.saldo_pendiente > 0) {
            showAlert({ title: "No permitido", message: "El cliente tiene saldo pendiente." });
            return;
        }
        if (window.confirm("¿Seguro de eliminar este cliente?")) {
            try {
                await api.deleteClient(cliente.id_cliente, token);
                showAlert({ title: "Éxito", message: "Cliente eliminado" });
                refreshClients();
            } catch (err) {
                showAlert({ title: "Error", message: `${err.message}` });
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
                                    <Button $abono disabled={!isCajaOpen || c.saldo_pendiente <= 0} onClick={() => handleOpenModal('abono', c)}><FaMoneyBillWave /> Abono</Button>
                                    <Button onClick={() => handleOpenModal('client', c)}><FaEdit /> Editar</Button>
                                    <Button $delete onClick={() => handleDelete(c)}><FaTrashAlt /> Eliminar</Button>
                                    <Button primary onClick={() => handleOpenModal('historial', c)}><FaHistory /> Historial</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            {modal.name === 'client' && <ClientFormModal client={modal.data} onClose={handleCloseModal} onSave={refreshClients} />}
            {modal.name === 'abono' && <AbonoCreditoModal client={modal.data} onClose={handleCloseModal} onAbonoSuccess={refreshClients} showAlert={showAlert} />}
            {modal.name === 'historial' && <HistorialCreditoModal client={modal.data} onClose={handleCloseModal} token={token} />}
            
            <AlertModal isOpen={alert.isOpen} onClose={closeAlert} title={alert.title} message={alert.message} />
        </PageWrapper>
    );
}