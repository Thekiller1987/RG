import React, { useState } from 'react';
import { FaReceipt, FaWindowClose, FaPrint } from 'react-icons/fa';
// Eliminamos ModalContent as BaseModalContent
import { ModalOverlay, Button, TotalsRow, ModalContent } from '../POS.styles.jsx'; 
import styled, { css } from 'styled-components';
// Importamos el nuevo modal de opciones de impresión
import PrintOptionsModal from './PrintOptionsModal.jsx';

// CORRECCIÓN: Usamos una ruta absoluta /logo.jpeg, asumiendo que el archivo está en /public.
const getLogoPath = () => '/logo.jpeg'; 

// === El contenedor de la UI vuelve a ser un simple div dentro del ModalOverlay ===
// Se eliminan ModalScreenContent y BaseModalContent

// ======================= ESTILOS DE IMPRESIÓN MEJORADOS =======================
const PrintWrapper = styled.div`
    /* Estilos para la vista en pantalla (dentro del modal) */
    font-family: 'Consolas', 'Courier New', monospace;
    color: #000;
    background: #fff;
    width: 310px; /* Ancho para la vista previa en pantalla */
    margin: 0 auto;
    padding: 10px; /* Padding para la vista previa */
    box-shadow: 0 0 10px rgba(0,0,0,0.1);

    /* Estilos que se aplican SOLO al imprimir */
    @media print {
        /* Oculta todo en la página por defecto */
        body > *:not(.print-area) {
            display: none !important;
        }
        .print-area, .print-area * {
            visibility: visible;
        }
        
        /* CORRECCIÓN: Aseguramos que el BODY no tenga márgenes que causen salto */
        body.print-active {
            margin: 0 !important;
            padding: 0 !important;
        }
        
        /* === IMPRESORA TÉRMICA (80mm) - Predeterminado === */
        @page:not(.print-a4) {
            size: 80mm auto; /* Ancho de POS, altura automática */
            margin: 0; /* MARGEN CERO para evitar el salto de página */
        }
        .print-area:not(.print-a4) {
            width: 80mm !important; 
            padding: 0;
            margin: 0; /* MARGEN CERO */
            font-size: 10pt;
            box-shadow: none !important;
        }

        /* === IMPRESORA NORMAL (A4 - Adaptación) === */
        @page.print-a4 {
            size: A4 portrait;
            margin: 10mm;
        }
        .print-area.print-a4 {
            width: 100% !important;
            max-width: 780px; /* Limitar el ancho en A4 para que no sea gigante */
            font-size: 12pt;
        }

        /* Común a ambos */
        .print-area {
            position: absolute;
            top: 0;
            left: 0;
        }
        .no-print {
            display: none !important;
        }
        body, .print-area {
            background: white;
            color: black;
            box-shadow: none;
            border: none;
        }
        /* Asegurar que las tablas se vean bien en A4 */
        table {
            table-layout: auto !important;
            width: 100% !important;
        }
    }
`;
// =================================================================================

const PrintHeader = styled.header` 
    text-align: center; 
    margin-bottom: 15px; 
    border-bottom: 1px dashed #333; 
    padding-bottom: 8px; 
    h2, p { margin: 2px 0; } 
    h2 { font-size: 1.5em; color: #343a40; }
`;

const TicketLogo = styled.img`
    width: 100%;
    max-width: 150px;
    height: auto;
    display: block;
    margin: 0 auto 10px auto;
`;

const ItemTable = styled.table` 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 1rem; 
    font-size: 0.9em; 
    table-layout: fixed; /* Ayuda a controlar el ancho de columna en POS */
    th, td { 
        padding: 4px 2px; 
        text-align: left; 
        vertical-align: top; 
        word-break: break-word;
    } 
    th { 
        border-bottom: 1px solid #333; 
        font-weight: bold;
    } 
    .text-right { text-align: right; }
    .col-qty { width: 15%; }
    .col-price { width: 25%; }
    .col-total { width: 25%; }
`;

const PrintFooter = styled.footer` 
    text-align: center; 
    font-size: 0.8em; 
    border-top: 1px dashed #333; 
    padding-top: 5px; 
    margin-top: 10px; 
`;
const SectionTitle = styled.p` 
    font-weight: bold; 
    text-transform: uppercase; 
    border-bottom: 1px dashed #333; 
    padding: 5px 0; 
    margin: 10px 0; 
    text-align: center; 
`;
const CreditSummary = styled.div` 
    margin-top: 15px; 
    border-top: 1px solid #333; 
    padding-top: 10px; 
`;

const TicketModal = ({ transaction, onClose, clients = [], users = [] }) => {
    if (!transaction) return null;
    
    const [showOptionsModal, setShowOptionsModal] = useState(false); 

    const handlePrintDirect = () => {
        const printArea = document.getElementById('print-wrapper-ticket');
        if (printArea) {
            
            // Forzamos el formato POS (80mm) quitando la clase A4
            printArea.classList.remove('print-a4');

            document.body.classList.add('print-active');
            printArea.classList.add('print-area');
            
            window.print();
            
            printArea.classList.remove('print-area');
            document.body.classList.remove('print-active');
        }
    };
    
    // Función de gatillo, solo muestra el modal de opciones (si es que la volvemos a usar)
    const handlePrintClick = () => {
        // En este momento, ya que la seleccionamos, solo llamamos a la impresión directa
        handlePrintDirect();
    };

    // Funciones para obtener nombres (implementación simplificada)
    const getClientName = () => clients.find(c => c.id_cliente === (transaction.clientId || transaction.idCliente))?.nombre || 'Consumidor Final';
    const getUserName = () => users.find(u => (u.id_usuario ?? u.id) == transaction.userId)?.nombre_usuario ?? 'N/A';

    const renderTicketContent = () => {
        const { estado, totalVenta, fecha, id, items, subtotal, descuento } = transaction;
        const logoUrl = getLogoPath(); // Obtenemos la ruta del logo

        if (estado === 'ABONO_CREDITO') {
            const montoAbonado = Math.abs(Number(totalVenta));
            const client = clients.find(c => c.id_cliente === (transaction.clientId || transaction.idCliente));
            const nuevoSaldo = Number(client?.saldo_pendiente || 0);
            const saldoAnterior = nuevoSaldo + montoAbonado;
            
            return (
                <>
                    <PrintHeader>
                        <TicketLogo src={logoUrl} alt="Logo de Repuestos" onError={(e) => { e.target.style.display = 'none'; }} />
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
                    {/* El logo ahora usa la ruta estática /logo.jpeg, asumiendo que el archivo está en /public */}
                    <TicketLogo src={logoUrl} alt="Logo de Repuestos" onError={(e) => { e.target.style.display = 'none'; }} />
                    <h2>MultirepuestosRG</h2>
                    <p>Factura de Venta {estado === 'DEVOLUCION' && '(Con Devolución)'}</p>
                    <p>Fecha: {new Date(fecha).toLocaleString('es-NI', { hour12: true })}</p>
                    <p>Factura #{id}</p>
                    <p>Cliente: {getClientName()}</p>
                    <p>Atendido por: {getUserName()}</p>
                </PrintHeader>
                <ItemTable>
                    <thead>
                        <tr>
                            <th className="col-qty">Cant.</th>
                            <th>Descripción</th>
                            <th className="text-right col-price">P. Unit.</th> {/* Etiqueta corregida */}
                            <th className="text-right col-total">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(items || []).map(item => {
                            // CORRECCIÓN DE PRECIOS: Se agrega `item.precio` como fallback final 
                            // en caso de que ni precio_unitario ni precio_venta existan, 
                            // y para asegurar que el precio se refleje.
                            const unitPrice = Number(item.precio_unitario || item.precio_venta || item.precio || 0);
                            const lineTotal = item.quantity * unitPrice;

                            return (
                                <tr key={item.id_producto || item.id}>
                                    <td>{item.quantity}</td>
                                    <td>{item.nombre}</td>
                                    <td className="text-right">C${unitPrice.toFixed(2)}</td> {/* Valor unitario corregido */}
                                    <td className="text-right">C${lineTotal.toFixed(2)}</td> {/* Total de línea corregido */}
                                </tr>
                            );
                        })}
                    </tbody>
                </ItemTable>
                <div style={{borderTop: '1px dashed #333', paddingTop: '0.5rem'}}>
                    <TotalsRow><span>Subtotal:</span><span>C${Number(subtotal || 0).toFixed(2)}</span></TotalsRow>
                    {descuento > 0 && (<TotalsRow><span>Descuento:</span><span>- C${Number(descuento).toFixed(2)}</span></TotalsRow>)}
                    <TotalsRow $bold className="grand-total" style={{ borderTop: '1px solid #333' }}><span>TOTAL:</span><span>C${Number(totalVenta).toFixed(2)}</span></TotalsRow>
                </div>
            </>
        );
    };

    return (
        <ModalOverlay className="no-print">
            {/* RESTAURACIÓN: Volvemos a usar el ModalContent estándar */}
            <ModalContent className="no-print" style={{ maxWidth: '450px', padding: '1.5rem', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2><FaReceipt /> Vista de Impresión</h2>
                    <Button $cancel onClick={onClose}><FaWindowClose /></Button>
                </div>
                
                {/* Contenedor principal para la vista previa y la impresión */}
                <PrintWrapper id="print-wrapper-ticket">
                    {renderTicketContent()}
                    <PrintFooter>
                        <p>¡Gracias por su preferencia!</p>
                        <p>Tienda MultirepuestosRG</p>
                    </PrintFooter>
                </PrintWrapper>
                
                {/* MODIFICADO: Llama a handlePrintDirect (80mm) */}
                <Button pay mt="true" style={{width: '100%', minHeight: '48px'}} onClick={handlePrintClick}>
                    <FaPrint /> Imprimir Factura (80mm)
                </Button>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TicketModal;
