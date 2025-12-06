// Archivo: client/src/pages/POS/components/ProformaEmpleadoModal.jsx

import React, { useRef } from 'react';
import { FaFileInvoice, FaDownload, FaWindowClose, FaSpinner } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

// IMPORTAR LIBRERÍAS NECESARIAS
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 

// --- ESTILOS DE BASE (Requeridos para el funcionamiento del Modal) ---
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { transform: scale(0.95); } to { transform: scale(1); }`;
const LoadingSpinner = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); 
    display: flex; justify-content: center; align-items: center; z-index: 1100; 
    animation: ${fadeIn} 0.2s;
`;
const ModalContent = styled.div`
    background: white; padding: 2.5rem; border-radius: 24px; 
    width: 95%; max-width: 680px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
    animation: ${scaleIn} 0.3s;
    max-height: 90vh; overflow-y: auto;
    
    @media (max-width: 768px) { 
        padding: 1rem;
        border-radius: 12px;
    }
`;
const Button = styled.button`
    padding: 1rem 1.5rem; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; 
    display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
    background: ${props => props.$cancel ? '#e2e8f0' : '#2563eb'};
    color: ${props => props.$cancel ? '#475569' : 'white'};
    &:hover { background: ${props => props.$cancel ? '#cbd5e1' : '#1d4ed8'}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const TotalsRow = styled.div`
    display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.95rem; 
    font-weight: ${props => props.$bold ? 'bold' : 'normal'};
    &.grand-total { border-top: 2px solid #333; font-size: 1.1rem; margin-top: 8px; padding-top: 10px; }
    .text-right { text-align: right; }
`;
const FaSpinnerAnimated = styled(FaSpinner)`animation: ${LoadingSpinner} 1s linear infinite;`;


/* =================================================================
 * DATOS DE TU NEGOCIO 
 * ================================================================= */
const COMPANY = {
    NAME: 'Multirepuestos RG',
    RUC: '1211812770001E',
    PHONE: '84031936 / 84058142',
    ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    SLOGAN: 'Tu mejor opción en repuestos de moto y carro',
    LOGO_URL: '/logos/logo_rg.png', // Asegúrate que la ruta sea accesible desde /public
};

/* =================================================================
 * ESTILOS ESPECÍFICOS DE PROFORMA (Adaptados para Mobile/PWA)
 * ================================================================= */
const ProformaWrapper = styled.div`
    width: 100%; max-width: 650px; padding: 1.5rem; background: #fff; border-radius: 8px; display: flex; flex-direction: column; gap: 1.5rem;

    /* Estilo CLAVE para ocultar los botones al generar el PDF */
    &.proforma-to-print .footer-actions {
        display: none;
    }
    @media (max-width: 768px) { padding: 1rem; gap: 1rem; }
`;

const ProformaHeader = styled.div`
    text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 1rem;
    display: flex; flex-direction: column; align-items: center;

    .logo {
        max-width: 120px; max-height: 80px; object-fit: contain; margin-bottom: 8px;
    }
    h2 { margin: 0; font-size: 1.5rem; color: #0b72b9; }
    p { margin: 0.25rem 0; font-size: 0.9rem; }
`;

const CompanyDetails = styled.div`
    font-size: 0.9rem; color: #555; border-bottom: 1px solid #eee; padding-bottom: 1rem;
    strong { color: #333; }
    @media (max-width: 768px) { font-size: 0.8rem; }
`;

const ClientDetails = styled.div`
    display: flex; justify-content: space-between; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; gap: 0.5rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; padding: 0.5rem; gap: 0.25rem; }
`;

const ClientDetailItem = styled.div`
    flex: 1 1 45%; 
    p { margin: 3px 0; font-size: 0.9rem; } 
    span { font-weight: bold; color: #000; }
    @media (max-width: 768px) { flex-basis: 100%; p { font-size: 0.85rem; } }
`;

const ProformaTable = styled.table`
    width: 100%; border-collapse: collapse;
    th, td { padding: 8px 12px; text-align: left; font-size: 0.95rem; border-bottom: 1px dashed #eee; }
    th { background-color: #f7f7f7; font-weight: bold; color: #333; }
    .text-right { text-align: right; }
    @media (max-width: 768px) {
        th, td { padding: 6px 8px; font-size: 0.8rem; }
        th:nth-child(2), td:nth-child(2) { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }
`;

const FooterDetails = styled.div`
    display: flex; justify-content: space-between; align-items: flex-start; padding-top: 1rem; gap: 1rem; flex-wrap: wrap;
    @media (max-width: 768px) { flex-direction: column; }
`;

const TotalsArea = styled.div`
    width: 260px; max-width: 100%;
    ${TotalsRow} { padding: 4px 0; }
    ${TotalsRow}.grand-total { border-top: 2px solid #333; font-size: 1.1rem; }
`;


/* =================================================================
 * COMPONENTE PRINCIPAL: ProformaEmpleadoModal
 * ================================================================= */
const ProformaEmpleadoModal = ({
    cart = [],
    total = 0,
    subtotal = 0,
    discount = 0,
    proformaFor = '',
    proformaNumber = '', 
    onClose,
    setTicketData, 
    currentUser,
    client // Objeto client que ahora incluye el teléfono
}) => {
    const [loadingPDF, setLoadingPDF] = React.useState(false);
    const proformaRef = useRef(null); 
    
    const fmt = (n) =>
        new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .format(Number(n || 0));

    const getName = (u) =>
        u?.usuarioNombre || u?.nombre || 'Empleado';

    const userName = getName(currentUser);
    const clientName = client?.nombre || proformaFor || 'Consumidor Final'; 
    const clientPhone = client?.telefono || 'N/D'; // **USO DEL TELÉFONO RECIBIDO**

    /**
     * FUNCIÓN CLAVE: Genera el PDF real usando html2canvas y jsPDF
     */
    const handleDownloadPDF = async () => {
        if (cart.length === 0) return alert("No hay artículos para generar el PDF.");
        
        setLoadingPDF(true);
        
        const input = proformaRef.current;
        const numberSuffix = proformaNumber.trim() ? `N${proformaNumber.trim()}` : `TEMP`;
        const filename = `PROFORMA_${numberSuffix}_${proformaFor.replace(/\s/g, '_')}.pdf`;

        // 2. Clonar y añadir clase para ocultar botones
        const elementToCapture = input.cloneNode(true);
        elementToCapture.classList.add('proforma-to-print');
        
        // 3. Insertar el clon en el DOM temporalmente
        document.body.appendChild(elementToCapture);

        try {
            // 4. Capturar el HTML clonado a un Canvas
            const canvas = await html2canvas(elementToCapture, {
                scale: 2, 
                useCORS: true, 
                windowWidth: elementToCapture.offsetWidth,
                windowHeight: elementToCapture.offsetHeight,
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // 5. Crear el documento PDF
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            const imgWidth = 210; 
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const pageHeight = 297; 
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Manejar paginación si es necesario
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // 6. Guardar el archivo (fuerza la descarga)
            pdf.save(filename);

            alert(`✅ Proforma ${numberSuffix} generada y descargada exitosamente.`);
            
            // Llama a la función de limpieza del componente padre
            setTicketData(); 

        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert("❌ Error al generar y descargar el PDF de la proforma. Verifique la consola.");
        } finally {
            // 7. Limpiar: Remover el clon del DOM
            if (document.body.contains(elementToCapture)) {
                document.body.removeChild(elementToCapture);
            }
            setLoadingPDF(false);
            onClose && onClose();
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                {/* Asignar la referencia al wrapper que queremos capturar */}
                <ProformaWrapper ref={proformaRef}>
                    <ProformaHeader>
                        <img src={COMPANY.LOGO_URL} alt="Logo del Negocio" className="logo" />
                        
                        <FaFileInvoice size={32} style={{ color: '#0b72b9', marginBottom: 8 }} />
                        <h2>PROFORMA {proformaNumber && `N° ${proformaNumber}`}</h2>
                        <p>Documento No Válido como Factura Fiscal</p>
                    </ProformaHeader>

                    <CompanyDetails>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            {COMPANY.NAME} - {COMPANY.SLOGAN}
                        </p>
                        <p style={{ margin: '3px 0' }}>{COMPANY.ADDRESS}</p>
                        <p style={{ margin: 0 }}>
                            Teléfonos: {COMPANY.PHONE} &nbsp;|&nbsp; RUC: {COMPANY.RUC}
                        </p>
                    </CompanyDetails>

                    <ClientDetails>
                        <ClientDetailItem>
                            <p>Emitida a nombre de: <span>{proformaFor || 'Consumidor Final'}</span></p>
                            <p>Emitida por: <span>{userName}</span></p>
                        </ClientDetailItem>
                        <ClientDetailItem>
                            <p>Teléfono cliente: <span>{clientPhone}</span></p> {/* TELÉFONO MOSTRADO */}
                            <p>Fecha: <span>{new Date().toLocaleDateString('es-NI')}</span></p>
                        </ClientDetailItem>
                    </ClientDetails>

                    <ProformaTable>
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>CANT.</th>
                                <th style={{ width: '45%' }}>DESCRIPCIÓN</th>
                                <th className="text-right" style={{ width: '25%' }}>PRECIO UNIT.</th>
                                <th className="text-right" style={{ width: '20%' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>
                                        No hay artículos.
                                    </td>
                                </tr>
                            ) : cart.map((item, idx) => {
                                const unit = parseFloat(item.precio_venta ?? item.precio ?? 0);
                                const qty = parseFloat(item.quantity ?? 0);
                                return (
                                    <tr key={idx}>
                                        <td>{qty}</td>
                                        <td>{item.nombre || 'Artículo sin nombre'}</td>
                                        <td className="text-right">C${fmt(unit)}</td>
                                        <td className="text-right">C${fmt(qty * unit)}</td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </ProformaTable>

                    <FooterDetails>
                        <div>
                            <p style={{ fontWeight: 'bold' }}>Nota:</p>
                            <p style={{ fontSize: '0.85rem' }}>{COMPANY.SLOGAN}</p>
                            <p style={{ fontSize: '0.85rem' }}>
                                Los precios de la Proforma están sujetos a cambios y disponibilidad de inventario.
                            </p>
                        </div>

                        <TotalsArea>
                            <TotalsRow>
                                <span>Subtotal:</span>
                                <span className="text-right">C${fmt(subtotal)}</span>
                            </TotalsRow>
                            {discount > 0 && (
                                <TotalsRow>
                                    <span>Descuento:</span>
                                    <span className="text-right">- C${fmt(discount)}</span>
                                </TotalsRow>
                            )}
                            <TotalsRow $bold className="grand-total">
                                <span>TOTAL ESTIMADO:</span>
                                <span className="text-right">C${fmt(total)}</span>
                            </TotalsRow>
                        </TotalsArea>
                    </FooterDetails>
                    
                    {/* Sección de botones (Clase CLAVE para ocultar en PDF) */}
                    <div className="footer-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Button $cancel onClick={onClose} style={{ flex: 1 }} disabled={loadingPDF}>
                            <FaWindowClose /> Cerrar
                        </Button>
                        <Button 
                            onClick={handleDownloadPDF} 
                            disabled={cart.length === 0 || loadingPDF} 
                            style={{ flex: 1, background: '#059669' }}
                        >
                            {loadingPDF ? <FaSpinnerAnimated /> : <FaDownload />} 
                            {loadingPDF ? 'GENERANDO PDF...' : 'DESCARGAR PROFORMA PDF'}
                        </Button>
                    </div>

                </ProformaWrapper>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ProformaEmpleadoModal;