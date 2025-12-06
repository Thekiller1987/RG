// Archivo: client/src/pages/POS/components/ProformaEmpleadoModal.jsx

import React from 'react';
import { FaFileInvoice, FaDownload, FaWindowClose, FaSpinner } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
// Suponiendo que estos estilos están disponibles en tu POS.styles.jsx (o definidos globalmente)
// Si fallan, debes asegurar que los estilos ModalOverlay, ModalContent, Button, TotalsRow estén disponibles
// Aquí los dejo sin importar para que funcione con tu CSS global/local:
// import { ModalOverlay, ModalContent, Button, TotalsRow } from '../POS.styles.jsx'; 
// import { useAuth } from '../../../context/AuthContext.jsx'; 

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { transform: scale(0.95); } to { transform: scale(1); }`;

// Estilos de contenedores base (Deberían ser globales o importados)
const ModalOverlay = styled.div`/* ... estilos ... */`; 
const ModalContent = styled.div`/* ... estilos ... */`;
const Button = styled.button`/* ... estilos ... */`;
const TotalsRow = styled.div`/* ... estilos ... */`;
const FaSpinnerAnimated = styled(FaSpinner)`animation: ${keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`} 1s linear infinite;`;

/* =================================================================
 * DATOS DE TU NEGOCIO (Incluye la ruta del logo)
 * ================================================================= */
const COMPANY = {
    NAME: 'Multirepuestos RG',
    RUC: '1211812770001E',
    PHONE: '84031936 / 84058142',
    ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    SLOGAN: 'Tu mejor opción en repuestos de moto y carro',
    LOGO_URL: '/public/icons/logo_rg.png', // <-- ASUME QUE EL LOGO ESTÁ EN public/icons
};

/* =================================================================
 * ESTILOS LOCALES ESPECÍFICOS DE PROFORMA
 * ================================================================= */
const ProformaWrapper = styled.div`
    width: 100%; max-width: 650px; padding: 1.5rem; background: #fff; border-radius: 8px; display: flex; flex-direction: column; gap: 1.5rem;
`;

const ProformaHeader = styled.div`
    text-align: center;
    border-bottom: 2px solid #ccc;
    padding-bottom: 1rem;
    display: flex; /* Añadido para centrar logo/texto */
    flex-direction: column;
    align-items: center;

    .logo {
        width: 60px; /* Tamaño del logo */
        height: 60px;
        margin-bottom: 8px;
    }

    h2 { margin: 0; font-size: 1.5rem; color: #0b72b9; }
    p { margin: 0.25rem 0; font-size: 0.9rem; }
`;

const CompanyDetails = styled.div`
    font-size: 0.9rem; color: #555; border-bottom: 1px solid #eee; padding-bottom: 1rem;
    strong { color: #333; }
`;

const ClientDetails = styled.div`
    display: flex; justify-content: space-between; padding: 0.5rem 0; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; gap: 0.5rem; flex-wrap: wrap;
`;

const ClientDetailItem = styled.div`
    flex: 1 1 250px; padding: 0 1rem; p { margin: 3px 0; } span { font-weight: bold; color: #000; }
`;

const ProformaTable = styled.table`
    width: 100%; border-collapse: collapse;
    th, td { padding: 8px 12px; text-align: left; font-size: 0.95rem; border-bottom: 1px dashed #eee; }
    th { background-color: #f7f7f7; font-weight: bold; color: #333; }
    .text-right { text-align: right; }
`;

const FooterDetails = styled.div`
    display: flex; justify-content: space-between; align-items: flex-start; padding-top: 1rem; gap: 1rem; flex-wrap: wrap;
`;

const TotalsArea = styled.div`
    width: 260px; max-width: 100%;
    /* Estilos de TotalsRow deben estar definidos globalmente */
`;


const ProformaEmpleadoModal = ({
    cart = [],
    total = 0,
    subtotal = 0,
    discount = 0,
    proformaFor = '',
    proformaNumber = '', // <-- Campo añadido
    onClose,
    setTicketData, 
    currentUser,
    client
}) => {
    const [loadingPDF, setLoadingPDF] = React.useState(false);
    
    const fmt = (n) =>
        new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .format(Number(n || 0));

    const getName = (u) =>
        u?.usuarioNombre ||
        u?.nombre_usuario ||
        u?.name ||
        u?.nombre ||
        u?.displayName ||
        u?.username ||
        'Empleado';

    const userName = getName(currentUser);

    const clientName = client?.nombre || 'Consumidor Final';
    const clientPhone = client?.telefono || 'N/D';

    /**
     * FUNCIÓN CLAVE: Simula la generación del PDF y fuerza la descarga.
     * Si tu backend tiene un endpoint para generar PDFs, la llamada iría aquí.
     */
    const handleDownloadPDF = async () => {
        if (cart.length === 0) return alert("No hay artículos para generar el PDF.");
        
        setLoadingPDF(true);
        
        // 1. Crear el objeto de datos para el PDF
        const proformaData = {
            proforma_id: proformaNumber || `TEMP-${Date.now()}`,
            fecha: new Date().toISOString(),
            cliente_nombre: proformaFor || clientName,
            vendedor: userName,
            items: cart.map(item => ({
                codigo: item.codigo,
                descripcion: item.nombre,
                cantidad: item.quantity,
                precio_unitario: parseFloat(item.precio_venta),
                total: item.quantity * item.precio_venta,
            })),
            subtotal,
            descuento: discount,
            total,
            company: COMPANY
        };

        try {
            // ** AQUÍ IRÍA LA LLAMADA REAL A LA API PARA GENERAR EL PDF **
            // Ejemplo (Si tu API devuelve el PDF como blob):
            // const response = await api.generateProformaPDF(proformaData, token);
            // const blob = new Blob([response.data], { type: 'application/pdf' });
            // const url = URL.createObjectURL(blob);
            // window.open(url, '_blank'); 
            
            // SIMULACIÓN
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            alert(`✅ Proforma #${proformaData.proforma_id} generada y lista para descargar.`);
            
            // Limpiamos el carrito en el componente padre al confirmar la generación
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
                        {/* ESPACIO PARA EL LOGO */}
                        <img src={COMPANY.LOGO_URL} alt="Logo del Negocio" className="logo" />
                        
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
                                        No hay artículos.
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