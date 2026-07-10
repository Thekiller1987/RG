import React, { useRef } from 'react';
import { FaFileInvoice, FaDownload, FaWindowClose, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

// IMPORTAR LIBRERÍAS NECESARIAS
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchActiveCajaSessions, getCart, saveCart } from '../../../service/api'; // Import API functions
import { useAuth } from '../../../context/AuthContext.jsx'; // Para sesión de caja fallback
import { useSettings } from '../../../context/SettingsContext.jsx'; // Cargar configuraciones dinámicas

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
 * ESTILOS ESPECÍFICOS DE PROFORMA (Consistentes con A4 de caja)
 * ================================================================= */
const ProformaWrapper = styled.div`
    width: 100%;
    max-width: 650px;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
    color: #334155;
    box-shadow: 0 4px 20px rgba(0,0,0,.08);
    border: 1px solid #e2e8f0;

    /* Estilo CLAVE para ocultar los botones al generar el PDF */
    &.proforma-to-print .footer-actions {
        display: none;
    }
    
    @media (max-width: 768px) {
        padding: 1rem;
        gap: 1rem;
        border-radius: 8px;
    }
`;

const ProformaHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 3px solid #1e3a8a;
    padding-bottom: 1.2rem;
    margin-bottom: 1rem;

    .brand-logo-container {
        width: 140px;
        display: flex;
        justify-content: flex-start;
    }
    .logo {
        max-width: 140px;
        max-height: 90px;
        width: auto;
        height: auto;
        object-fit: contain;
    }
    .brand-info {
        text-align: right;
        flex: 1;
        max-width: 65%;
    }
    .brand-info h1 {
        font-size: 20pt;
        color: #000000;
        margin: 0 0 5px 0;
        font-weight: 800;
        line-height: 1.1;
    }
    .brand-info small {
        display: block;
        font-size: 9pt;
        color: #475569;
        margin: 2px 0;
        line-height: 1.3;
    }
    .proforma-tag {
        display: inline-block;
        font-weight: 800;
        letter-spacing: 0.5px;
        padding: 4px 10px;
        border: 2px solid #0b72b9;
        border-radius: 4px;
        color: #0b72b9;
        font-size: 0.75rem;
        text-transform: uppercase;
        margin-top: 6px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 10px;
        
        .brand-logo-container {
            justify-content: center;
        }
        .brand-info {
            text-align: center;
            max-width: 100%;
        }
        .brand-info h1 {
            font-size: 16pt;
        }
    }
`;

const MetaContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 0.5rem;

    .meta-col {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .meta-title {
        font-weight: 800;
        text-transform: uppercase;
        color: #1e3a8a;
        border-bottom: 2px solid #cbd5e1;
        margin-bottom: 8px;
        padding-bottom: 4px;
        font-size: 9pt;
        display: block;
    }
    .meta-col p {
        margin: 2px 0;
        font-size: 9pt;
        display: grid;
        grid-template-columns: 100px 1fr;
        border-bottom: 1px dashed #f1f5f9;
        padding-bottom: 2px;
    }
    .meta-label {
        font-weight: 700;
        color: #475569;
    }
    .meta-value {
        color: #0f172a;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`;

const ProformaTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #e2e8f0;
    margin-bottom: 0.5rem;

    th, td {
        padding: 10px 8px;
        text-align: left;
        font-size: 9.5pt;
    }
    th {
        background-color: #f1f5f9;
        color: #334155;
        font-weight: bold;
        border-bottom: 2px solid #cbd5e1;
        text-transform: uppercase;
        font-size: 8.5pt;
    }
    td {
        border-bottom: 1px solid #f1f5f9;
        color: #334155;
    }
    .text-right {
        text-align: right;
    }
    .col-qty {
        width: 12%;
    }
    .col-unit {
        width: 20%;
        text-align: right;
    }
    .col-total {
        width: 20%;
        text-align: right;
    }

    @media (max-width: 768px) {
        th, td {
            padding: 6px;
            font-size: 8pt;
        }
        th:nth-child(2), td:nth-child(2) {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
`;

const FooterDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    
    .note-section {
        flex: 1;
        font-size: 8.5pt;
        color: #64748b;
        p {
            margin: 3px 0;
        }
        strong {
            color: #475569;
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const TotalsArea = styled.div`
    width: 250px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .grand-total {
        border-top: 2px solid #0f172a;
        margin-top: 4px;
        padding-top: 8px;
        font-weight: 800;
        font-size: 1.15rem;
        color: #0f172a;
    }
    .badge-container {
        text-align: center;
        margin-top: 8px;
    }
    .badge {
        display: inline-block;
        font-weight: 800;
        letter-spacing: 0.5px;
        padding: 4px 8px;
        border: 2px solid #0f172a;
        border-radius: 4px;
        color: #0f172a;
        font-size: 0.65rem;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

// --- CUSTOM ALERT COMPONENT ---
const AlertModal = ({ title, message, type = 'info', onClose }) => {
    const getColor = () => {
        if (type === 'error') return '#ef4444';
        if (type === 'success') return '#10b981';
        return '#3b82f6';
    };
    const getIcon = () => {
        if (type === 'error') return <FaTimesCircle size={40} color={getColor()} />;
        if (type === 'success') return <FaCheckCircle size={40} color={getColor()} />;
        return <FaExclamationTriangle size={40} color={getColor()} />;
    };

    return (
        <ModalOverlay style={{ zIndex: 2000 }}>
            <ModalContent style={{ maxWidth: '350px', textAlign: 'center', padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>{getIcon()}</div>
                <h3 style={{ color: '#1e293b', margin: '0 0 10px 0' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px 0' }}>{message}</p>
                <Button onClick={onClose} style={{ width: '100%', padding: '12px' }}>Entendido</Button>
            </ModalContent>
        </ModalOverlay>
    );
};

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
    client
}) => {
    const [loadingPDF, setLoadingPDF] = React.useState(false);
    const proformaRef = useRef(null);

    // --- SETTINGS CONTEXT ---
    const { settings } = useSettings();

    // --- AUTH CONTEXT (para cajaSession fallback) ---
    const { cajaSession, user: authUser } = useAuth() || {};

    // --- SEND TO CASHIER STATE ---
    const [isSending, setIsSending] = React.useState(false);
    const [showSessionSelector, setShowSessionSelector] = React.useState(false);
    const [activeSessions, setActiveSessions] = React.useState([]);
    const [ticketName, setTicketName] = React.useState('');
    const [selectedSessionId, setSelectedSessionId] = React.useState(null);

    // --- CUSTOM ALERT STATE ---
    const [alertState, setAlertState] = React.useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showAlert = (title, message, type = 'info') => {
        setAlertState({ isOpen: true, title, message, type });
    };
    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
        // If success sending ticket (type is success), close main modal too and clear data
        if (alertState.type === 'success') {
            setTicketData(); // This clears the cart in parent
            onClose && onClose(); // This closes ProformaModal
        }
    };

    const fmt = (n) =>
        new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            .format(Number(n || 0));

    const getName = (u) =>
        u?.usuarioNombre || u?.nombre || 'Empleado';

    const userName = getName(currentUser);
    const clientName = client?.nombre || proformaFor || 'Consumidor Final';
    const clientPhone = client?.telefono || 'N/D';

    // Resolver URL absoluta del logo del backend
    const logoUrl = React.useMemo(() => {
        if (!settings?.empresa_logo_url) return null;
        if (settings.empresa_logo_url.startsWith('http')) return settings.empresa_logo_url;
        
        let cleanUrl = settings.empresa_logo_url;
        if (cleanUrl.startsWith('/uploads')) {
            cleanUrl = '/api' + cleanUrl;
        } else if (cleanUrl.startsWith('uploads')) {
            cleanUrl = '/api/' + cleanUrl;
        }

        const base = (import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com/api').replace(/\/api$/, '');
        return `${base}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
    }, [settings?.empresa_logo_url]);

    // Info del negocio cargada desde configuración o valores por defecto
    const companyInfo = {
        name: settings?.empresa_nombre || 'Multirepuestos RG',
        ruc: settings?.empresa_ruc || '1211812770001E',
        phone: settings?.empresa_telefono || '84031936 / 84058142',
        address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
        slogan: settings?.empresa_eslogan || 'Tu mejor opción en repuestos de moto y carro',
        logo: logoUrl || new URL('/icons/logo.png', window.location.origin).toString()
    };

    // Initial ticket name based on client
    React.useEffect(() => {
        setTicketName(`Pedido - ${clientName}`);
    }, [clientName]);

    /**
     * FUNCIÓN CLAVE: Genera el PDF real usando html2canvas y jsPDF
     */
    const handleDownloadPDF = async () => {
        if (cart.length === 0) return;

        setLoadingPDF(true);

        const input = proformaRef.current;
        const clientCleaned = clientName.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const numberSuffix = proformaNumber.trim() ? `N${proformaNumber.trim()}` : `TEMP`;
        const filename = `PROFORMA_${clientCleaned}_${numberSuffix}.pdf`;

        const elementToCapture = input.cloneNode(true);
        elementToCapture.classList.add('proforma-to-print');

        // Eliminar físicamente los botones del clon para evitar que salgan en el PDF
        const footerActions = elementToCapture.querySelector('.footer-actions');
        if (footerActions) {
            footerActions.remove();
        }
        
        // Estilos específicos para la captura A4 perfecta, consistente y fuera de pantalla
        elementToCapture.style.position = 'absolute';
        elementToCapture.style.left = '-9999px';
        elementToCapture.style.top = '0';
        elementToCapture.style.width = '794px'; // Ancho A4 en pixeles a 96 DPI
        elementToCapture.style.padding = '40px';
        elementToCapture.style.boxSizing = 'border-box';
        elementToCapture.style.background = '#ffffff';
        elementToCapture.style.boxShadow = 'none';
        elementToCapture.style.border = 'none';

        document.body.appendChild(elementToCapture);

        try {
            const canvas = await html2canvas(elementToCapture, {
                scale: 2,
                useCORS: true,
                windowWidth: 794,
            });

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            pdf.save(filename);

            setTicketData();

        } catch (error) {
            console.error("Error al generar PDF:", error);
            showAlert("Error", "❌ Error al generar y descargar el PDF.", "error");
        } finally {
            if (document.body.contains(elementToCapture)) {
                document.body.removeChild(elementToCapture);
            }
            setLoadingPDF(false);
            onClose && onClose();
        }
    };

    // --- LOGIC FOR SENDING TO CASHIER ---
    const handleStartSend = async () => {
        if (cart.length === 0) return;
        setIsSending(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetchActiveCajaSessions(token);
            let sessions = response?.abiertas || [];

            // FALLBACK: Si la API no devuelve sesiones pero el usuario tiene
            // una caja abierta en el contexto, usarla directamente
            if (sessions.length === 0 && cajaSession && !cajaSession.closedAt) {
                const userId = cajaSession.openedBy?.id || (authUser?.id_usuario ?? authUser?.id);
                const userName = cajaSession.openedBy?.name || authUser?.nombre_usuario || 'Cajero';
                sessions = [{
                    id: cajaSession.id,
                    openedAt: cajaSession.openedAt,
                    openedBy: { id: userId, name: userName }
                }];
            }

            if (sessions.length === 0) {
                showAlert("Atención", "⚠️ No hay cajas abiertas en este momento. Abre una caja primero desde el POS antes de enviar el pedido.", "warning");
                setIsSending(false);
                return;
            }

            setActiveSessions(sessions);
            if (sessions.length > 0) {
                setSelectedSessionId(sessions[0].openedBy.id);
            }

            setShowSessionSelector(true);
            setIsSending(false);

        } catch (error) {
            console.error("Error fetching sessions:", error);
            showAlert("Error", "❌ Error al buscar cajas activas.", "error");
            setIsSending(false);
        }
    };

    const confirmSendToCashier = async () => {
        if (!selectedSessionId) return showAlert("Atención", "Seleccione una caja.", "warning");
        if (!ticketName.trim()) return showAlert("Atención", "Ingrese un nombre para el ticket.", "warning");

        setIsSending(true);
        const token = localStorage.getItem('token'); // Get token
        try {
            // 1. Get current cart of target user
            const targetCart = await getCart(selectedSessionId, token) || []; // Pass token

            // 2. Create new ticket object
            const newTicket = {
                id: Date.now(), // timestamp as ID
                name: ticketName,
                items: cart,
                createdAt: new Date().toISOString(),
                createdBy: userName
            };

            // 3. Append and Save
            // Ensure targetCart is array
            const validCart = Array.isArray(targetCart) ? targetCart : [];
            const updatedCart = [...validCart, newTicket];

            await saveCart(selectedSessionId, updatedCart, token); // Pass token

            setShowSessionSelector(false); // Close selector first
            showAlert("Éxito", `✅ Ticket "${ticketName}" enviado exitosamente a la caja.`, "success");

            // Note: Data clearing happens in closeAlert now for better UX

        } catch (error) {
            console.error("Error sending ticket:", error);
            showAlert("Error", "❌ Error al enviar el ticket a la caja. Intente de nuevo.", "error");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <React.Fragment>
            <ModalOverlay style={{ zIndex: (showSessionSelector || alertState.isOpen) ? 1099 : 1100 }}>
                <ModalContent>
                    {/* Asignar la referencia al wrapper que queremos capturar */}
                    <ProformaWrapper ref={proformaRef}>
                        {/* Cabecera de la Proforma A4 */}
                        <ProformaHeader>
                            <div className="brand-logo-container">
                                <img 
                                    src={companyInfo.logo} 
                                    alt="Logo" 
                                    className="logo" 
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                            <div className="brand-info">
                                <h1>{companyInfo.name}</h1>
                                <small>{companyInfo.slogan}</small>
                                <small>RUC: {companyInfo.ruc}</small>
                                <small>Tel: {companyInfo.phone}</small>
                                <small>{companyInfo.address}</small>
                                <div>
                                    <span className="proforma-tag"><FaFileInvoice style={{ marginRight: 4, verticalAlign: 'middle' }} /> COTIZACIÓN / PROFORMA</span>
                                </div>
                            </div>
                        </ProformaHeader>

                        {/* Metadatos (Detalles y Cliente) */}
                        <MetaContainer>
                            <div className="meta-col">
                                <span className="meta-title">Detalles</span>
                                <p><span className="meta-label">Fecha:</span><span className="meta-value">{new Date().toLocaleDateString('es-NI')} {new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' })}</span></p>
                                <p><span className="meta-label">ID Temp:</span><span className="meta-value">{Date.now().toString().slice(-6)}</span></p>
                                <p><span className="meta-label">Atendido por:</span><span className="meta-value">{userName}</span></p>
                            </div>
                            <div className="meta-col">
                                <span className="meta-title">Cliente</span>
                                <p><span className="meta-label">Nombre:</span><span className="meta-value">{clientName}</span></p>
                                <p><span className="meta-label">Teléfono:</span><span className="meta-value">{clientPhone}</span></p>
                            </div>
                        </MetaContainer>

                        {/* Tabla de Artículos */}
                        <ProformaTable>
                            <thead>
                                <tr>
                                    <th className="col-qty">CANT.</th>
                                    <th>DESCRIPCIÓN</th>
                                    <th className="col-unit">PRECIO UNIT.</th>
                                    <th className="col-total">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>No hay artículos.</td></tr>
                                ) : cart.map((item, idx) => {
                                    const unit = parseFloat(item.precio_venta ?? item.precio ?? 0);
                                    const qty = parseFloat(item.quantity ?? 0);
                                    return (
                                        <tr key={idx}>
                                            <td className="col-qty">{qty}</td>
                                            <td>{item.nombre || 'Artículo sin nombre'}</td>
                                            <td className="col-unit">C$ {fmt(unit)}</td>
                                            <td className="col-total">C$ {fmt(qty * unit)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </ProformaTable>

                        {/* Pie de Página y Totales */}
                        <FooterDetails>
                            <div className="note-section">
                                <p><strong>Nota:</strong></p>
                                <p>"{companyInfo.slogan}"</p>
                                <p>Precios sujetos a cambios y stock. Válido por 3 días.</p>
                                <p style={{ whiteSpace: 'pre-line', marginTop: '5px', fontWeight: 'bold' }}>
                                    {settings?.ticket_proforma_footer || '¡Gracias por cotizar con nosotros!'}
                                </p>
                            </div>
                            <TotalsArea>
                                <TotalsRow><span>Subtotal:</span><span className="text-right">C$ {fmt(subtotal)}</span></TotalsRow>
                                {discount > 0 && <TotalsRow style={{ color: '#dc3545' }}><span>Descuento:</span><span className="text-right">- C$ {fmt(discount)}</span></TotalsRow>}
                                <TotalsRow className="grand-total"><span>TOTAL:</span><span className="text-right">C$ {fmt(total)}</span></TotalsRow>
                                <div className="badge-container">
                                    <span className="badge">DOCUMENTO NO VÁLIDO COMO FACTURA</span>
                                </div>
                            </TotalsArea>
                        </FooterDetails>

                        {/* Sección de botones */}
                        <div className="footer-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <Button $cancel onClick={onClose} style={{ flex: 1 }} disabled={loadingPDF || isSending}>
                                <FaWindowClose /> Cerrar
                            </Button>
                            <Button
                                onClick={handleStartSend}
                                disabled={cart.length === 0 || loadingPDF || isSending}
                                style={{ flex: 1, background: '#f59e0b' }} // Ambar for "Send"
                            >
                                {isSending ? <FaSpinnerAnimated /> : <FaFileInvoice />}
                                ENVIAR A CAJA
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                disabled={cart.length === 0 || loadingPDF || isSending}
                                style={{ flex: 1, background: '#059669' }}
                            >
                                {loadingPDF ? <FaSpinnerAnimated /> : <FaDownload />}
                                PDF
                            </Button>
                        </div>

                    </ProformaWrapper>
                </ModalContent>
            </ModalOverlay>

            {/* --- SESSION SELECTION MODAL --- */}
            {showSessionSelector && (
                <ModalOverlay style={{ zIndex: 1200 }}>
                    <ModalContent style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{ color: '#0f172a', marginBottom: '1rem' }}>Enviar Pedido a Caja</h3>

                        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre del Ticket:</label>
                            <input
                                type="text"
                                value={ticketName}
                                onChange={(e) => setTicketName(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Seleccionar Caja:</label>
                            <select
                                value={selectedSessionId || ''}
                                onChange={(e) => setSelectedSessionId(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            >
                                {activeSessions.map(s => (
                                    <option key={s.openedBy.id} value={s.openedBy.id}>
                                        {s.openedBy.name} - (Abierta: {new Date(s.openedAt).toLocaleTimeString()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button $cancel onClick={() => setShowSessionSelector(false)} style={{ flex: 1 }}>Cancelar</Button>
                            <Button onClick={confirmSendToCashier} disabled={isSending} style={{ flex: 1 }}>
                                {isSending ? <FaSpinnerAnimated /> : 'Enviar Ticket'}
                            </Button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* --- CUSTOM ALERT MODAL --- */}
            {alertState.isOpen && (
                <AlertModal
                    title={alertState.title}
                    message={alertState.message}
                    type={alertState.type}
                    onClose={closeAlert}
                />
            )}
        </React.Fragment>
    );
};

export default ProformaEmpleadoModal;