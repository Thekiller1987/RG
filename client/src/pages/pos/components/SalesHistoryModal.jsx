// src/pages/pos/components/SalesHistoryModal.jsx

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaHistory, FaWindowClose, FaRegClock, FaUsers, FaFilter, FaSearch, FaAngleLeft, FaAngleRight, FaHandHoldingUsd } from 'react-icons/fa';
import { ModalOverlay, ModalContent as OriginalModalContent, Button as OriginalButton, SearchInput, InfoBox } from '../POS.styles.jsx';
// ELIMINADO: Ya no necesitamos la función que calculaba mal el saldo.
// import { calculateClientCreditStatus } from './calculateClientCreditStatus.js';
import AbonoCreditoModal from './AbonoCreditoModal';
import SaleDetailView from './SaleDetailView';

// --- Styled Components (Sin cambios) ---
const ModalContent = styled(OriginalModalContent)` width: 95%; max-width: 1400px; height: 90vh; display: flex; flex-direction: column; padding: 1.5rem; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #dee2e6; `;
const FilterGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; `;
const MainContent = styled.div` display: grid; grid-template-columns: 400px 1fr; gap: 1.5rem; flex-grow: 1; overflow: hidden; `;
const TransactionList = styled.div` display: flex; flex-direction: column; overflow: hidden; background-color: #f8f9fa; border-radius: 8px; padding: 1rem; `;
const ListItemsWrapper = styled.div` flex-grow: 1; overflow-y: auto; `;
const PaginationControls = styled.div` display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e9ecef; `;
const SaleListItemContainer = styled.div` padding: 0.8rem 1rem; border-left: 5px solid ${props => props.borderColor}; border-radius: 6px; margin-bottom: 0.75rem; cursor: pointer; background-color: ${props => (props.isSelected ? '#e0eaff' : '#fff')}; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); transition: background-color 0.2s, box-shadow 0.2s; &:hover { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); } `;
const AbonoDetailContainer = styled.div` background-color: #fff; border-radius: 8px; padding: 1.5rem; overflow-y: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); `;
const DetailSection = styled.div` margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e9ecef; &:last-child { border-bottom: none; margin-bottom: 0; } `;
const InfoGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; `;
const InfoItem = styled.div` font-size: 0.9rem; strong { display: block; color: #6c757d; margin-bottom: 4px; } `;
const SummaryRow = styled.div` display: flex; justify-content: space-between; font-size: 1rem; padding: 0.6rem 0; span:first-child { color: #6c757d; } span:last-child { font-weight: bold; } `;

// ======================= VISTA DE ABONO CON LA FÓRMULA CORRECTA =======================
const AbonoDetailView = ({ sale, client, user, onReprintTicket }) => {
    const montoAbonado = Math.abs(Number(sale.totalVenta || 0));
    
    // El "Nuevo Saldo" es el saldo actual y definitivo del cliente que viene de la BD.
    const nuevoSaldo = Number(client?.saldo_pendiente || 0);

    // El "Saldo Anterior" era el saldo actual MÁS lo que se abonó en esta transacción.
    const saldoAnterior = nuevoSaldo + montoAbonado;

    return (
        <AbonoDetailContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Detalle de Abono</h3>
                <OriginalButton onClick={() => onReprintTicket(sale)}>Imprimir Recibo</OriginalButton>
            </div>
            <DetailSection>
                <InfoGrid>
                    <InfoItem><strong>Recibo #:</strong> {sale.id}</InfoItem>
                    <InfoItem><strong>Fecha:</strong> {new Date(sale.fecha).toLocaleString('es-NI')}</InfoItem>
                    <InfoItem><strong>Cliente:</strong> {client?.nombre || 'N/A'}</InfoItem>
                    <InfoItem><strong>Atendido por:</strong> {user?.nombre_usuario || 'N/A'}</InfoItem>
                </InfoGrid>
            </DetailSection>
            <DetailSection>
                <h4>Resumen de Crédito</h4>
                <SummaryRow><span>Saldo Anterior:</span><span>C${saldoAnterior.toFixed(2)}</span></SummaryRow>
                <SummaryRow style={{ color: '#dc3545' }}><span>Monto Abonado:</span><span>- C${montoAbonado.toFixed(2)}</span></SummaryRow>
                <SummaryRow style={{ borderTop: '1px solid #eee', paddingTop: '0.8rem', fontSize: '1.2rem' }}><span>Nuevo Saldo:</span><span>C${nuevoSaldo.toFixed(2)}</span></SummaryRow>
            </DetailSection>
        </AbonoDetailContainer>
    );
};

const SaleListItem = React.memo(({ sale, isSelected, onSelect, safeUsers, safeClients }) => {
    const statusColors = { COMPLETADA: '#28a745', CANCELADA: '#dc3545', DEVOLUCION: '#ffc107', ABONO_CREDITO: '#17a2b8' };
    const userName = useMemo(() => safeUsers.find(u => (u.id_usuario ?? u.id) == sale.userId)?.nombre_usuario ?? 'N/A', [safeUsers, sale.userId]);
    const clientName = useMemo(() => safeClients.find(c => c.id_cliente === (sale.clientId || sale.idCliente))?.nombre || '', [safeClients, sale.clientId, sale.idCliente]);
    const isAbono = sale.estado === 'ABONO_CREDITO';

    return (
        <SaleListItemContainer onClick={() => onSelect(sale)} isSelected={isSelected} borderColor={statusColors[sale.estado] || '#6c757d'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{isAbono ? <FaHandHoldingUsd style={{ marginRight: '8px' }}/> : `#${sale.id} - `}{isAbono ? 'ABONO A CRÉDITO' : sale.estado.replace('_', ' ')}</span>
                <span>C${Math.abs(Number(sale.totalVenta || 0)).toFixed(2)}</span>
            </div>
            <small style={{ display: 'block', color: '#6c757d', marginTop: '4px' }}>{new Date(sale.fecha).toLocaleDateString('es-NI')} - {isAbono ? `Cliente: ${clientName}` : `Vendedor: ${userName}`}</small>
        </SaleListItemContainer>
    );
});

const ITEMS_PER_PAGE = 10;
const SalesHistoryModal = ({ dailySales = [], onCancelSale, onReturnItem, onClose, isAdmin, users = [], clients = [], showConfirmation, showPrompt, showAlert, onReprintTicket, onAbonoSuccess }) => {
    const [selectedSale, setSelectedSale] = useState(null);
    const [showAbonoModal, setShowAbonoModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(new Date().toISOString().substring(0, 10));
    const [filterUser, setFilterUser] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const safeUsers = useMemo(() => (Array.isArray(users) ? users : []), [users]);
    const safeClients = useMemo(() => (Array.isArray(clients) ? clients : []), [clients]);

    const filteredSales = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const results = (dailySales || []).filter(sale => {
            const saleDate = (sale.fecha || '').substring(0, 10);
            const clientId = sale.clientId || sale.idCliente;
            const clientName = safeClients.find(c => c.id_cliente === clientId)?.nombre || '';
            return ((!filterDate || saleDate === filterDate) && (!filterUser || sale.userId == filterUser) && (!filterStatus || sale.estado === filterStatus) && (!lowerSearchTerm || String(sale.id).includes(lowerSearchTerm) || clientName.toLowerCase().includes(lowerSearchTerm)));
        });
        return results.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }, [dailySales, filterDate, filterUser, filterStatus, searchTerm, safeClients]);

    const paginatedSales = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSales.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredSales, currentPage]);

    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

    React.useEffect(() => {
        setCurrentPage(1);
        setSelectedSale(filteredSales.length > 0 ? filteredSales[0] : null);
    }, [filterDate, filterUser, filterStatus, searchTerm, dailySales]);
    
    const handleAbonoSuccess = () => {
        setShowAbonoModal(false);
        showAlert({ title: 'Éxito', message: 'Abono registrado correctamente' });
        if (onAbonoSuccess) onAbonoSuccess();
    };
    
    return (
        <ModalOverlay>
            <ModalContent>
                <Header><h2><FaHistory /> Historial de Transacciones</h2><OriginalButton $cancel onClick={onClose}><FaWindowClose /></OriginalButton></Header>
                <FilterGrid>
                    <div><label><FaSearch /> Buscar ID/Cliente:</label><SearchInput type="text" placeholder="ID o nombre" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    <div><label><FaRegClock /> Fecha:</label><SearchInput type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} /></div>
                    {isAdmin && (<div><label><FaUsers /> Usuario:</label><SearchInput as="select" value={filterUser} onChange={e => setFilterUser(e.target.value)}><option value="">Todos</option>{safeUsers.map(u => <option key={u.id_usuario ?? u.id} value={u.id_usuario ?? u.id}>{u.nombre_usuario ?? u.nombre}</option>)}</SearchInput></div>)}
                    <div><label><FaFilter /> Estado:</label><SearchInput as="select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="">Todos</option><option value="COMPLETADA">Completadas</option><option value="CANCELADA">Canceladas</option><option value="DEVOLUCION">Devoluciones</option><option value="ABONO_CREDITO">Abonos</option></SearchInput></div>
                </FilterGrid>
                <MainContent>
                    <TransactionList>
                        <ListItemsWrapper>
                            {paginatedSales.length > 0 ? (
                                paginatedSales.map(sale => (<SaleListItem key={sale.id} sale={sale} isSelected={selectedSale?.id === sale.id} onSelect={setSelectedSale} safeUsers={safeUsers} safeClients={safeClients}/>))
                            ) : ( <p style={{textAlign: 'center', color: '#6c757d', marginTop: '2rem'}}>No se encontraron transacciones.</p>)}
                        </ListItemsWrapper>
                        {totalPages > 1 && (
                            <PaginationControls>
                                <OriginalButton onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FaAngleLeft /></OriginalButton>
                                <span>Página {currentPage} de {totalPages}</span>
                                <OriginalButton onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><FaAngleRight /></OriginalButton>
                            </PaginationControls>
                        )}
                    </TransactionList>

                    {(() => {
                        if (!selectedSale) return <div />;

                        const clientForDetails = safeClients.find(c => c.id_cliente === (selectedSale.clientId || selectedSale.idCliente));

                        if (selectedSale.estado === 'ABONO_CREDITO') {
                            return (
                                <AbonoDetailView
                                    sale={selectedSale}
                                    client={clientForDetails}
                                    user={safeUsers.find(u => (u.id_usuario ?? u.id) == selectedSale.userId)}
                                    onReprintTicket={() => onReprintTicket(selectedSale)}
                                />
                            );
                        }

                        // Para todo lo demás, se usa tu SaleDetailView original
                        return (
                            <SaleDetailView
                                sale={selectedSale}
                                client={clientForDetails}
                                creditStatus={null} // Ya no usamos el cálculo viejo
                                dailySales={dailySales}
                                isAdmin={isAdmin}
                                onOpenAbonoModal={() => setShowAbonoModal(true)}
                                onCancelSale={() => onCancelSale(selectedSale.id)}
                                onReturnItem={onReturnItem}
                                onReprintTicket={() => onReprintTicket(selectedSale)}
                                showConfirmation={showConfirmation}
                                showPrompt={showPrompt}
                                showAlert={showAlert}
                            />
                        );
                    })()}
                </MainContent>
                {showAbonoModal && selectedSale && (
                    <AbonoCreditoModal client={safeClients.find(c => c.id_cliente === (selectedSale.clientId || selectedSale.idCliente))} onClose={() => setShowAbonoModal(false)} onAbonoSuccess={handleAbonoSuccess} showAlert={showAlert}/>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default React.memo(SalesHistoryModal);