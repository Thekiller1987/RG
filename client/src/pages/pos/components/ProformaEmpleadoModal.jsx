// Archivo: client/src/pages/POS/components/ProformaEmpleadoModal.jsx
import React from 'react';
import { FaFileInvoice, FaDownload, FaWindowClose, FaSpinner } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
// Asegúrate de que las siguientes importaciones de estilos sean correctas para tu proyecto
// Si no tienes un archivo POS.styles.jsx, necesitarás definir ModalOverlay, ModalContent, Button y TotalsRow
// Usaremos estilos locales simplificados para asegurar que funcione:
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { transform: scale(0.95); } to { transform: scale(1); }`;

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
`;
const Button = styled.button`
    padding: 1rem 1.5rem; 
    border: none; 
    border-radius: 8px; 
    font-weight: 700; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 10px; 
    transition: all 0.2s;
    
    background: ${props => props.$cancel ? '#e2e8f0' : '#2563eb'};
    color: ${props => props.$cancel ? '#475569' : 'white'};
    &:hover { background: ${props => props.$cancel ? '#cbd5e1' : '#1d4ed8'}; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const TotalsRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 0.95rem;
    font-weight: ${props => props.$bold ? 'bold' : 'normal'};
    
    &.grand-total {
        border-top: 2px solid #333;
        font-size: 1.1rem;
        margin-top: 8px;
        padding-top: 10px;
    }
    
    .text-right { text-align: right; }
`;
// Fin de estilos locales simplificados


/* =================================================================
 * DATOS DE TU NEGOCIO
 * ================================================================= */
const COMPANY = {
    NAME: 'Multirepuestos RG',
    RUC: '1211812770001E',
    PHONE: '84031936 / 84058142',
    ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    SLOGAN: 'Tu mejor opción en repuestos de moto y carro',
};

/* =================================================================
 * ESTILOS LOCALES ESPECÍFICOS DE PROFORMA
 * ================================================================= */
const ProformaWrapper = styled.div`
    width: 100%;
    max-width: 650px;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const ProformaHeader = styled.div`
    text-align: center;
    border-bottom: 2px solid #ccc;
    padding-bottom: 1rem;

    h2 { margin: 0; font-size: 1.5rem; color: #0b72b9; }
    p { margin: 0.25rem 0; font-size: 0.9rem; }
`;

const CompanyDetails = styled.div`
    font-size: 0.9rem;
    color: #555;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;

    strong { color: #333; }
`;

const ClientDetails = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

const ClientDetailItem = styled.div`
    flex: 1 1 250px;
    padding: 0 1rem;
    p { margin: 3px 0; }
    span { font-weight: bold; color: #000; }
`;

const ProformaTable = styled.table`
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 8px 12px;
        text-align: left;
        font-size: 0.95rem;
        border-bottom: 1px dashed #eee;
    }

    th {
        background-color: #f7f7f7;
        font-weight: bold;
        color: #333;
    }

    .text-right { text-align: right; }
`;

const FooterDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

const TotalsArea = styled.div`
    width: 260px;
    max-width: 100%;

    ${TotalsRow} { padding: 4px 0; }

    ${TotalsRow}.grand-total {
        border-top: 2px solid #333;
        font-size: 1.1rem;
    }
`;

const LoadingSpinner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const FaSpinnerAnimated = styled(FaSpinner)`
  animation: ${LoadingSpinner} 1s linear infinite;
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
    onClose,
    setTicketData, // Se mantendrá para limpiar el carrito, pero no se usará para impresión.
    currentUser,
    client
}) => {
    const [loadingPDF, setLoadingPDF] = React.useState(false);
    
    // NOTA: Si usas useAuth, descomenta la siguiente línea y elimina el fallback de localStorage si es posible
    // const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });
    
    // Función de formato
    const fmt = (n) =>
        new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .format(Number(n || 0));

    // Función para obtener el nombre del usuario (simplificada)
    const getName = (u) =>
        u?.usuarioNombre ||
        u?.nombre_usuario ||
        u?.name ||
        u?.nombre ||
        u?.displayName ||
        u?.username ||
        'Empleado';

    let lsUser = null;
    try { lsUser = JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { /* noop */ }

    const userName = getName(currentUser) || getName(lsUser);

    const clientName = client?.nombre || 'Consumidor Final';
    const clientPhone = client?.telefono || 'N/D';

    /**
     * FUNCIÓN CLAVE: Genera el PDF usando la API y fuerza la descarga.
     */
    const handleDownloadPDF = async () => {
        if (cart.length === 0) return alert("No hay artículos para generar el PDF.");
        
        setLoadingPDF(true);
        const proformaData = {
            proformaFor,
            usuarioNombre: userName,
            items: cart.map(item => ({
                cantidad: item.quantity,
                descripcion: item.nombre,
                precio_unitario: item.precio_venta,
                total: item.quantity * item.precio_venta,
            })),
            subtotal,
            descuento: discount,
            total,
            company: COMPANY,
            cliente: { nombre: clientName, telefono: clientPhone }
        };

        try {
            // Asume que api.generateProformaPDF existe y devuelve un Blob o un enlace de descarga.
            // Para el ejemplo, simularemos la descarga. En la vida real usarías una librería como jsPDF o llamarías a tu API.
            // await api.generateProformaPDF(proformaData, token); 
            
            // Simulación de descarga:
            const filename = `PROFORMA_${proformaFor.replace(/\s/g, '_')}_${Date.now()}.pdf`;
            console.log(`Simulando la generación y descarga de: ${filename} con los datos:`, proformaData);
            alert(`✅ PDF para ${proformaFor} generado. (Debería iniciar la descarga)`);

            // Si la generación fue exitosa, limpiamos el carro en el componente padre
            setTicketData(); 

        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert("❌ Error al generar el PDF de la proforma.");
        } finally {
            setLoadingPDF(false);
            onClose && onClose();
        }
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ProformaWrapper>
                    <ProformaHeader>
                        <FaFileInvoice size={32} style={{ color: '#0b72b9', marginBottom: 8 }} />
                        <h2>PROFORMA</h2>
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
                            <p>Cliente asociado: <span>{clientName}</span></p>
                            <p>Teléfono cliente: <span>{clientPhone}</span></p>
                        </ClientDetailItem>
                        <ClientDetailItem>
                            <p>Emitida por: <span>{userName}</span></p>
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
                                        No hay artículos en el carrito para la Proforma.
                                    </td>
                                </tr>
                            ) : cart.map((item, idx) => {
                                const unit = Number(item.precio_venta ?? item.precio ?? 0);
                                const qty = Number(item.quantity ?? 0);
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

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Button $cancel onClick={onClose} style={{ flex: 1 }} disabled={loadingPDF}>
                            <FaWindowClose /> Cerrar
                        </Button>
                        <Button 
                            onClick={handleDownloadPDF} 
                            disabled={cart.length === 0 || loadingPDF} 
                            style={{ flex: 1, background: '#059669' }} // Color verde para descarga
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