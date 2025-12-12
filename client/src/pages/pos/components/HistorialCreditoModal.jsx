// src/pages/pos/components/HistorialCreditoModal.jsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { FaTimes, FaMoneyBillWave, FaCreditCard, FaSpinner, FaFileInvoiceDollar, FaArrowLeft, FaPrint } from "react-icons/fa";
import * as api from "../../../service/api";
import TicketModal from "./TicketModal";
import { useAuth } from "../../../context/AuthContext";

const ModalOverlay = styled.div` position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;`;
const ModalContent = styled.div` background: #f4f7f6; color: #333; border-radius: 10px; width: 900px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.1);`;
const Header = styled.div` padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; `;
const Title = styled.h2`margin: 0; font-size: 1.5rem;`;
const CloseButton = styled.button`background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; &:hover{color:#333;}`;
const Body = styled.div`padding: 1.5rem; overflow-y: auto;`;
const SummaryContainer = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; `;
const SummaryCard = styled.div` background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 5px solid ${props => props.color || '#ccc'}; h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #666; text-transform: uppercase; } p { margin: 0; font-size: 1.75rem; font-weight: bold; color: ${props => props.color || '#333'}; } `;
const Timeline = styled.div`padding: 0; margin: 0;`;
const TimelineItem = styled.div`
  display: flex; gap: 1rem; margin-bottom: 1rem;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  .icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; background: ${props => props.type === 'credito' ? '#dc3545' : '#28a745'}; }
  .content { flex: 1; padding-bottom: 1.5rem; border-bottom: 1px solid #e9ecef; p { margin: 0.25rem 0; } .amount { font-size: 1.2rem; font-weight: bold; color: ${props => props.type === 'credito' ? '#dc3545' : '#28a745'};} .meta { font-size: 0.8rem; color: #6c757d; } }
  &:hover { background-color: ${props => props.isClickable ? '#f0f0f0' : 'transparent'}; border-radius: 8px; }
`;
const SpinAnimation = styled(FaSpinner)` animation: spin 1s linear infinite; @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `;
const CenteredMessage = styled.div` text-align: center; padding: 2rem; color: #6c757d; `;
const DetailContainer = styled.div` background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);`;
const SummaryRow = styled.div` display: flex; justify-content: space-between; font-size: 1.1rem; padding: 0.8rem 0; border-bottom: 1px solid #f0f0f0; span:first-child { color: #6c757d; } span:last-child { font-weight: bold; } &:last-child{ border-bottom: none; }`;
const DetailHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
const Button = styled.button` padding: 0.6rem 1.2rem; border: none; border-radius: 6px; font-weight: bold; color: white; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; background: ${props => props.primary ? '#007bff' : '#6c757d'}; &:hover{ opacity: 0.9; }`;

const AbonoDetailView = ({ item, client, onBack, onPrint }) => {
    const montoAbonado = item.monto;
    const nuevoSaldo = Number(client.saldo_pendiente || 0);
    const saldoAnterior = nuevoSaldo + montoAbonado;

    return (
        <DetailContainer>
            <DetailHeader>
                <h3 style={{ margin: 0 }}>Detalle del Abono</h3>
                <Button onClick={onBack}><FaArrowLeft /> Volver al Historial</Button>
            </DetailHeader>
            <SummaryRow><span>Saldo Anterior:</span><span>C${saldoAnterior.toFixed(2)}</span></SummaryRow>
            <SummaryRow style={{ color: '#28a745' }}><span>Monto Abonado:</span><span>C${montoAbonado.toFixed(2)}</span></SummaryRow>
            <SummaryRow style={{ fontSize: '1.4rem' }}><span>Nuevo Saldo:</span><span>C${nuevoSaldo.toFixed(2)}</span></SummaryRow>
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <Button primary onClick={onPrint}><FaPrint /> Imprimir Recibo</Button>
            </div>
        </DetailContainer>
    );
};

export default function HistorialCreditoModal({ client, onClose, token }) {
    const [loading, setLoading] = useState(true);
    const [historial, setHistorial] = useState([]);
    const [error, setError] = useState(null);
    const { allUsers } = useAuth();
    const [selectedItem, setSelectedItem] = useState(null);
    const [showTicket, setShowTicket] = useState(false);

    const fetchHistorial = useCallback(async () => {
        if (!client) return;
        setLoading(true); setError(null);
        try {
            const [creditos, abonos] = await Promise.all([api.getCreditosByClient(client.id_cliente, token), api.getAbonosByClient(client.id_cliente, token)]);
            const creditosFormateados = (creditos || []).map(c => {
                // Parseo robusto de pagoDetalles para obtener el valor REAL del crédito (sin prima)
                let pd = c.pagoDetalles || {};
                if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch (e) { pd = {}; } }

                const montoCredito = pd.credito ? Number(pd.credito) : Number(c.total);

                return {
                    id: `c-${c.id_venta}`,
                    fecha: new Date(c.fecha),
                    tipo: 'credito',
                    descripcion: `Compra a crédito (Venta #${c.id_venta})`,
                    monto: montoCredito,
                    userId: c.id_usuario
                };
            });
            const abonosFormateados = (abonos || []).map(a => ({ id: `a-${a.id_abono}`, fecha: new Date(a.fecha), tipo: 'abono', descripcion: `Abono registrado`, monto: Number(a.monto), userId: a.id_usuario }));
            const historialCompleto = [...creditosFormateados, ...abonosFormateados].sort((a, b) => b.fecha - a.fecha);
            setHistorial(historialCompleto);
        } catch (err) { console.error("Error cargando historial:", err); setError("No se pudo cargar el historial del cliente."); }
        finally { setLoading(false); }
    }, [client, token]);

    useEffect(() => { fetchHistorial(); }, [fetchHistorial]);

    const summary = useMemo(() => {
        const totalCredito = historial.filter(h => h.tipo === 'credito').reduce((sum, h) => sum + h.monto, 0);
        const totalAbono = historial.filter(h => h.tipo === 'abono').reduce((sum, h) => sum + h.monto, 0);
        return { totalCredito, totalAbono };
    }, [historial]);

    const formatCurrency = (amount) => `C$${Number(amount || 0).toFixed(2)}`;
    const handleSelectItem = (item) => { if (item.tipo === 'abono') { setSelectedItem(item); } };

    if (!client) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Header>
                    <Title>Historial de {client.nombre}</Title>
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                </Header>
                <Body>
                    {loading && <CenteredMessage><SpinAnimation size={30} /> <p>Cargando...</p></CenteredMessage>}
                    {error && <CenteredMessage style={{ color: 'red' }}>{error}</CenteredMessage>}
                    {!loading && !error && (
                        <>
                            {selectedItem ? (
                                <AbonoDetailView item={selectedItem} client={client} onBack={() => setSelectedItem(null)} onPrint={() => setShowTicket(true)} />
                            ) : (
                                <>
                                    <SummaryContainer>
                                        <SummaryCard color="#dc3545"><h3>Total Crédito</h3><p>{formatCurrency(summary.totalCredito)}</p></SummaryCard>
                                        <SummaryCard color="#28a745"><h3>Total Abonado</h3><p>{formatCurrency(summary.totalAbono)}</p></SummaryCard>
                                        <SummaryCard color="#007bff"><h3>Saldo Actual</h3><p>{formatCurrency(client.saldo_pendiente)}</p></SummaryCard>
                                    </SummaryContainer>
                                    <Timeline>
                                        {historial.length > 0 ? (
                                            historial.map(item => {
                                                const isClickable = item.tipo === 'abono';
                                                // ======================= MEJORA: BUSCAR NOMBRE DE USUARIO =======================
                                                const user = allUsers.find(u => (u.id_usuario ?? u.id) === item.userId);
                                                return (
                                                    <TimelineItem key={item.id} type={item.tipo} isClickable={isClickable} onClick={() => handleSelectItem(item)}>
                                                        <div className="icon">{item.tipo === 'credito' ? <FaCreditCard /> : <FaMoneyBillWave />}</div>
                                                        <div className="content">
                                                            {/* MEJORA: Se quitan los signos +/- para mayor claridad */}
                                                            <p className="amount">{formatCurrency(item.monto)}</p>
                                                            <p>{item.descripcion}</p>
                                                            <p className="meta">{item.fecha.toLocaleString('es-NI')} por <strong>{user?.nombre_usuario || 'Sistema'}</strong></p>
                                                        </div>
                                                    </TimelineItem>
                                                )
                                            })
                                        ) : (<CenteredMessage><FaFileInvoiceDollar size={40} /><p>No hay movimientos para mostrar.</p></CenteredMessage>)}
                                    </Timeline>
                                </>
                            )}
                        </>
                    )}
                </Body>
            </ModalContent>

            {showTicket && selectedItem && (
                <TicketModal
                    transaction={{ estado: 'ABONO_CREDITO', totalVenta: selectedItem.monto, fecha: selectedItem.fecha, id: selectedItem.id.split('-')[1], clientId: client.id_cliente, userId: selectedItem.userId }}
                    creditStatus={{ remainingBalance: Number(client.saldo_pendiente || 0) }}
                    clients={[client]}
                    users={allUsers}
                    onClose={() => setShowTicket(false)}
                />
            )}
        </ModalOverlay>
    );
}