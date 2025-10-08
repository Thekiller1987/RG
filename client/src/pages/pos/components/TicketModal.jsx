// src/pages/pos/components/TicketModal.jsx

import React from 'react';
import { FaReceipt, FaWindowClose, FaPrint } from 'react-icons/fa';
import { ModalOverlay, Button, TotalsRow } from '../POS.styles.jsx';
import styled from 'styled-components';

// ======================= ESTILOS DE IMPRESIÓN MEJORADOS =======================
const PrintWrapper = styled.div`
    /* Estilos para la vista en pantalla (dentro del modal) */
    font-family: 'Consolas', 'Courier New', monospace;
    color: #000;
    background: #fff;
    width: 310px; /* Ancho para la vista previa en pantalla */
    margin: 0 auto;

    /* Estilos que se aplican SOLO al imprimir */
    @media print {
        /* Oculta todo en la página por defecto */
        body > *:not(.print-area) {
            display: none;
        }
        .print-area, .print-area * {
            visibility: visible;
        }
        /* Posiciona el ticket en la esquina de la página de impresión y le da el ancho correcto */
        .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 80mm; /* Ancho de impresora térmica */
            padding: 0;
            margin: 0;
        }
        /* Elementos que no deben salir en el ticket impreso */
        .no-print {
            display: none;
        }
        /* Define el tamaño del papel y los márgenes para la impresora */
        @page {
            size: 80mm auto; /* Ancho de POS, altura automática */
            margin: 3mm; 
        }
        /* Estilos base para el cuerpo del ticket impreso */
        body {
            background: white;
            color: black;
            font-size: 10pt;
        }
        /* Elimina sombras y bordes innecesarios en la impresión */
        div, & {
            box-shadow: none;
            border: none;
            width: 100%;
        }
    }
`;
// =================================================================================

const PrintHeader = styled.header` text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #333; padding-bottom: 5px; h2, p { margin: 2px 0; } `;
const ItemTable = styled.table` width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.9em; th, td { padding: 4px 2px; text-align: left; vertical-align: top; } th { border-bottom: 1px solid #333; } .text-right { text-align: right; } `;
const PrintFooter = styled.footer` text-align: center; font-size: 0.8em; border-top: 1px dashed #333; padding-top: 5px; margin-top: 10px; `;
const SectionTitle = styled.p` font-weight: bold; text-transform: uppercase; border-bottom: 1px dashed #333; padding: 5px 0; margin: 10px 0; text-align: center; `;
const CreditSummary = styled.div` margin-top: 15px; border-top: 1px solid #333; padding-top: 10px; `;

const TicketModal = ({ transaction, onClose, clients = [], users = [] }) => {
    if (!transaction) return null;

    const handlePrint = () => {
        const printArea = document.getElementById('print-wrapper-ticket');
        if (printArea) {
            // Añadimos una clase al body para un control más estricto
            document.body.classList.add('print-active');
            printArea.classList.add('print-area');
            window.print();
            printArea.classList.remove('print-area');
            document.body.classList.remove('print-active');
        }
    };

    const getClientName = () => { /* ... (sin cambios) ... */ };
    const getUserName = () => { /* ... (sin cambios) ... */ };

    const renderTicketContent = () => {
        const { estado, totalVenta, fecha, id, items, subtotal, descuento } = transaction;

        if (estado === 'ABONO_CREDITO') {
            const montoAbonado = Math.abs(Number(totalVenta));
            const client = clients.find(c => c.id_cliente === (transaction.clientId || transaction.idCliente));
            const nuevoSaldo = Number(client?.saldo_pendiente || 0);
            const saldoAnterior = nuevoSaldo + montoAbonado;
            
            return (
                <>
                    <PrintHeader>
                        <h2>MultirepuestosRG</h2>
                        <p><strong>RECIBO DE ABONO A CRÉDITO</strong></p>
                        <p>Fecha: {new Date(fecha).toLocaleString('es-NI', { hour12: true })}</p>
                        <p>Recibo #{id}</p>
                        <p>Cliente: {getClientName()}</p>
                        <p>Atendido por: {getUserName()}</p>
                    </PrintHeader>
                    <CreditSummary>
                        <SectionTitle>Resumen de Crédito</SectionTitle>
                        {client ? (
                            <>
                                <TotalsRow><span>Saldo Anterior:</span><span>C${saldoAnterior.toFixed(2)}</span></TotalsRow>
                                <TotalsRow $bold style={{ color: '#28a745' }}><span>SU ABONO:</span><span>C${montoAbonado.toFixed(2)}</span></TotalsRow>
                                <TotalsRow $bold style={{ borderTop: '1px dashed #333', paddingTop: '5px', marginTop: '5px', fontSize: '1.2em' }}><span>Nuevo Saldo Pendiente:</span><span>C${nuevoSaldo.toFixed(2)}</span></TotalsRow>
                            </>
                        ) : ( <TotalsRow $bold style={{ fontSize: '1.2em' }}><span>TOTAL ABONADO:</span><span>C${montoAbonado.toFixed(2)}</span></TotalsRow> )}
                    </CreditSummary>
                </>
            );
        }
        
        return (
             <>
                <PrintHeader>
                    <h2>MultirepuestosRG</h2>
                    <p>Factura de Venta {estado === 'DEVOLUCION' && '(Con Devolución)'}</p>
                    <p>Fecha: {new Date(fecha).toLocaleString('es-NI', { hour12: true })}</p>
                    <p>Factura #{id}</p>
                    <p>Cliente: {getClientName()}</p>
                    <p>Atendido por: {getUserName()}</p>
                </PrintHeader>
                <ItemTable>
                    <thead><tr><th>Cant.</th><th>Desc.</th><th className="text-right">Precio</th><th className="text-right">Total</th></tr></thead>
                    <tbody>
                        {(items || []).map(item => (
                            <tr key={item.id_producto || item.id}>
                                <td>{item.quantity}</td>
                                <td>{item.nombre}</td>
                                <td className="text-right">C${Number(item.precio_unitario || item.precio_venta).toFixed(2)}</td>
                                <td className="text-right">C${(item.quantity * Number(item.precio_unitario || item.precio_venta)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </ItemTable>
                <div style={{borderTop: '1px solid #333', paddingTop: '0.5rem'}}>
                    <TotalsRow><span>Subtotal:</span><span>C${Number(subtotal || 0).toFixed(2)}</span></TotalsRow>
                    {descuento > 0 && (<TotalsRow><span>Descuento:</span><span>- C${Number(descuento).toFixed(2)}</span></TotalsRow>)}
                    <TotalsRow $bold className="grand-total"><span>TOTAL:</span><span>C${Number(totalVenta).toFixed(2)}</span></TotalsRow>
                </div>
            </>
        );
    };

    return (
        <ModalOverlay className="no-print">
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: 'auto', minWidth: '350px' }}>
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2><FaReceipt /> Vista de Impresión</h2>
                    <Button $cancel onClick={onClose}><FaWindowClose /></Button>
                </div>
                
                <PrintWrapper id="print-wrapper-ticket">
                    {renderTicketContent()}
                    <PrintFooter>
                        <p>¡Gracias por su preferencia!</p>
                        <p>MultirepuestosRG - Su mejor opción.</p>
                    </PrintFooter>
                </PrintWrapper>
                
                <Button primary mt style={{width: '100%'}} className="no-print" onClick={handlePrint}>
                    <FaPrint /> Imprimir
                </Button>
            </div>
        </ModalOverlay>
    );
};

export default TicketModal;