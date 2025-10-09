import React from 'react';
import { FaFileInvoice, FaWindowClose, FaPrint } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button, TotalsRow } from '../POS.styles.jsx';
import styled from 'styled-components';

const PrintWrapper = styled.div`
    @media print {
        .no-print { display: none; }
        @page {
            size: 80mm auto; /* Ancho para ticket térmico */
            margin: 0;
        }
        body {
            background: white;
            color: black;
            font-size: 10pt; /* Tamaño de fuente para impresora térmica */
            padding: 5mm;
        }
    }
`;

const PrintHeader = styled.header`
    text-align: center;
    margin-bottom: 1rem;
    border-bottom: 1px dashed #333;
    padding-bottom: 0.5rem;
    h2, h3, p { margin: 2px 0; }
`;

const ItemTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    th, td { padding: 4px 2px; text-align: left; }
    th { border-bottom: 1px solid #333; }
    .text-right { text-align: right; }
    .col-qty { width: 15%; }
    .col-price { width: 25%; }
    .col-subtotal { width: 30%; }
`;

const PrintFooter = styled.footer`
    text-align: center;
    color: #555;
    font-size: 0.8em;
    border-top: 1px dashed #333;
    padding-top: 0.5rem;
    margin-top: 1rem;
`;

const ProformaModal = ({ cart, total, onClose }) => {
    const handlePrint = () => window.print();

    return (
        <ModalOverlay className="no-print">
            <ModalContent>
                <PrintWrapper>
                    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2><FaFileInvoice /> Vista de Proforma</h2>
                        <Button $cancel onClick={onClose}><FaWindowClose /></Button>
                    </div>

                    <PrintHeader>
                        <h2>MultirepuestosRG</h2>
                        <h3>Cotización / Proforma</h3>
                        <p>Fecha: {new Date().toLocaleDateString('es-NI')}</p>
                    </PrintHeader>

                    <ItemTable>
                        <thead>
                            <tr>
                                <th className="col-qty">Cant.</th>
                                <th>Producto</th>
                                <th className="text-right col-price">P. Unit</th>
                                <th className="text-right col-subtotal">Subt.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td>{item.quantity}</td>
                                    <td>{item.nombre}</td>
                                    <td className="text-right">C${item.precio.toFixed(2)}</td>
                                    <td className="text-right">C${(item.precio * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </ItemTable>
                    
                    <TotalsRow $bold className="grand-total" style={{justifyContent: 'flex-end', fontSize: '1.2em'}}>
                        <span>TOTAL:</span>
                        <span>C${total.toFixed(2)}</span>
                    </TotalsRow>
                    
                    <PrintFooter>
                        <p>Precios sujetos a cambio. Válido por 24 horas.</p>
                    </PrintFooter>
                    
                    <Button primary mt style={{width: '100%'}} className="no-print" onClick={handlePrint}>
                        <FaPrint /> Imprimir Proforma
                    </Button>
                </PrintWrapper>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ProformaModal;