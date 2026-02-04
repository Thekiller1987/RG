import React, { useEffect, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaPrint, FaWindowClose, FaReceipt, FaTruck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// ================== ESTILOS GLOBALES DE IMPRESIÓN ==================
const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 999999 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .no-print { display: none !important; }
  }
`;

// ================== ESTILOS DE UI (MODAL) ==================
const Overlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled(motion.div)`
  background: white;
  width: 90%; max-width: 600px; max-height: 90vh;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex; justify-content: space-between; align-items: center;
`;

const Title = styled.h2`
  margin: 0; font-size: 1.25rem; color: #0f172a; display: flex; align-items: center; gap: 10px;
`;

const Content = styled.div`
  padding: 2rem;
  overflow-y: auto;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
`;

const PreviewCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const TicketIcon = styled(FaReceipt)`
  font-size: 3rem; color: #3b82f6; margin-bottom: 1rem;
`;

const SuccessMessage = styled.h3`
  color: #1e293b; margin: 0 0 0.5rem 0;
`;

const SubMessage = styled.p`
  color: #64748b; margin: 0; font-size: 0.9rem;
`;

const Actions = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex; justify-content: flex-end; gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex; align-items: center; gap: 0.5rem;
  transition: all 0.2s;
  
  ${props => props.$primary ? `
    background: #3b82f6; color: white;
    &:hover { background: #2563eb; transform: translateY(-1px); }
  ` : `
    background: #e2e8f0; color: #475569;
    &:hover { background: #cbd5e1; }
  `}
`;

// ================== ESTILOS DE IMPRESIÓN (TICKET) ==================
const PrintWrapper = styled.div`
  display: none; // Oculto en pantalla normal
  font-family: 'Courier New', Courier, monospace; // Fuente monoespaciada clásica de ticket
  color: black;
  
  &.print-area { display: block; } // Visible al imprimir

  .header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed black; padding-bottom: 10px; }
  .logo { font-size: 1.5rem; font-weight: bold; margin: 0; text-transform: uppercase; }
  .info { font-size: 0.8rem; margin: 2px 0; }
  
  .meta { margin-bottom: 15px; font-size: 0.85rem; }
  .meta-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
  
  table { width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-bottom: 15px; }
  th { text-align: left; border-bottom: 1px solid black; padding: 2px 0; }
  td { padding: 2px 0; vertical-align: top; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  
  .totals { border-top: 1px dashed black; padding-top: 5px; font-size: 0.85rem; }
  .total-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
  .grand-total { font-weight: bold; font-size: 1rem; margin-top: 5px; }
  
  .footer { margin-top: 20px; text-align: center; font-size: 0.75rem; border-top: 1px dashed black; padding-top: 10px; }
`;

const OutflowTicketModal = ({ isOpen, onClose, transaction }) => {
    // Manejo de impresión
    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    // Auto-imprimir al abrir
    useEffect(() => {
        if (isOpen) {
            setTimeout(handlePrint, 500);
        }
    }, [isOpen, handlePrint]);

    if (!transaction) return null;

    // Formato moneda
    const fmt = (n) => new Intl.NumberFormat('es-NI', { style: 'currency', currency: 'NIO' }).format(n || 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <GlobalPrintStyle />

                    {/* TICKET DE IMPRESIÓN (Oculto en UI) */}
                    <PrintWrapper className="print-area">
                        <div className="header">
                            <h1 className="logo">MULTIREPUESTOS RG</h1>
                            <p className="info">COMPROBANTE DE TRASLADO / SALIDA</p>
                            <p className="info">Fecha: {new Date(transaction.fecha).toLocaleString()}</p>
                            <p className="info">Ticket #: {transaction.id}</p>
                        </div>

                        <div className="meta">
                            <div className="meta-row">
                                <strong>MOTIVO:</strong>
                                <span style={{ textAlign: 'right', maxWidth: '60%' }}>{transaction.clienteNombre?.replace('MOTIVO: ', '') || transaction.motivo}</span>
                            </div>
                            <div className="meta-row">
                                <strong>Autorizado por:</strong>
                                <span>{transaction.usuarioNombre}</span>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Cant</th>
                                    <th>Código</th>
                                    <th>Desc</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.items.map((item, i) => (
                                    <tr key={i}>
                                        <td className="text-center">{item.quantity}</td>
                                        <td>{item.codigo || '-'}</td>
                                        <td>{item.nombre}</td>
                                        <td className="text-right">{fmt(item.unit * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="totals">
                            <div className="total-row">
                                <span>Total Items:</span>
                                <span>{transaction.totalItems}</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>TOTAL VENTA:</span>
                                <span>{fmt(transaction.totalVenta)}</span>
                            </div>
                            {/* Opcional: Mostrar Costo solo si es administraciÃ³n interna */}
                            <div className="total-row" style={{ fontSize: '0.7rem', color: '#555', marginTop: '5px' }}>
                                <span>(Costo Total: {fmt(transaction.totalCosto)})</span>
                            </div>
                        </div>

                        <div className="footer">
                            <p>Registro Interno de Inventario</p>
                            <p>Firma: __________________________</p>
                        </div>
                    </PrintWrapper>

                    {/* INTERFAZ DEL MODAL (UI) */}
                    <Overlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ModalContainer
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <Header>
                                <Title><FaTruck /> Salida Procesada</Title>
                                <Button onClick={onClose}><FaWindowClose /></Button>
                            </Header>

                            <Content>
                                <PreviewCard>
                                    <TicketIcon />
                                    <SuccessMessage>¡Salida registrada con éxito!</SuccessMessage>
                                    <SubMessage>El inventario ha sido actualizado correctamente.</SubMessage>
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'left', width: '100%' }}>
                                        <p><strong>ID:</strong> {transaction.id}</p>
                                        <p><strong>Motivo:</strong> {transaction.clienteNombre?.replace('MOTIVO: ', '')}</p>
                                        <p><strong>Total Items:</strong> {transaction.totalItems}</p>
                                        <p><strong>Monto Total:</strong> {fmt(transaction.totalVenta)}</p>
                                    </div>
                                </PreviewCard>
                            </Content>

                            <Actions>
                                <Button onClick={onClose}>Cerrar</Button>
                                <Button $primary onClick={handlePrint}><FaPrint /> Imprimir Comprobante</Button>
                            </Actions>
                        </ModalContainer>
                    </Overlay>
                </>
            )}
        </AnimatePresence>
    );
};

export default OutflowTicketModal;
