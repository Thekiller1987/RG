import React, { useRef } from 'react';
import { FaFileInvoice, FaDownload, FaWindowClose, FaSpinner } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

// IMPORTAR LIBRERÍAS NECESARIAS
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fetchActiveCajaSessions, getCart, saveCart } from '../../../service/api'; // Import API functions

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

    // --- SEND TO CASHIER STATE ---
    const [isSending, setIsSending] = React.useState(false);
    const [showSessionSelector, setShowSessionSelector] = React.useState(false);
    const [activeSessions, setActiveSessions] = React.useState([]);
    const [ticketName, setTicketName] = React.useState('');
    const [selectedSessionId, setSelectedSessionId] = React.useState(null);

    const fmt = (n) =>
        new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            .format(Number(n || 0));

    const getName = (u) =>
        u?.usuarioNombre || u?.nombre || 'Empleado';

    const userName = getName(currentUser);
    const clientName = client?.nombre || proformaFor || 'Consumidor Final';
    const clientPhone = client?.telefono || 'N/D';

    // Initial ticket name based on client
    React.useEffect(() => {
        setTicketName(`Pedido - ${clientName}`);
    }, [clientName]);

    /**
     * FUNCIÓN CLAVE: Genera el PDF real usando html2canvas y jsPDF
     */
    const handleDownloadPDF = async () => {
        // ... (Existing PDF logic remains unchanged, just copying it for context or ensuring it's preserved if using replace) ...
        if (cart.length === 0) return;

        setLoadingPDF(true);

        const input = proformaRef.current;
        const clientCleaned = proformaFor.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const numberSuffix = proformaNumber.trim() ? `N${proformaNumber.trim()}` : `TEMP`;
        const filename = `PROFORMA_${clientCleaned}_${numberSuffix}.pdf`;

        const elementToCapture = input.cloneNode(true);
        elementToCapture.classList.add('proforma-to-print');
        document.body.appendChild(elementToCapture);

        try {
            const canvas = await html2canvas(elementToCapture, {
                scale: 2,
                useCORS: true,
                windowWidth: elementToCapture.offsetWidth,
                windowHeight: elementToCapture.offsetHeight,
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
            alert("❌ Error al generar y descargar el PDF. Verifique la consola (F12) para detalles.");
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
        try {
            const response = await fetchActiveCajaSessions();
            const sessions = response?.abiertas || [];

            if (sessions.length === 0) {
                alert("⚠️ No hay cajas abiertas en este momento. No se puede enviar el pedido.");
                setIsSending(false);
                return;
            }

            // Filter out purely system sessions if needed, or just show all
            setActiveSessions(sessions);

            // If only one session, pre-select it but still show dialog for name confirmation? 
            // User requested "que les pida solo el nombre del ticket", so let's show dialog always for name input.
            if (sessions.length > 0) {
                setSelectedSessionId(sessions[0].openedBy.id);
            }

            setShowSessionSelector(true);
            setIsSending(false);

        } catch (error) {
            console.error("Error fetching sessions:", error);
            alert("❌ Error al buscar cajas activas.");
            setIsSending(false);
        }
    };

    const confirmSendToCashier = async () => {
        if (!selectedSessionId) return alert("Seleccione una caja.");
        if (!ticketName.trim()) return alert("Ingrese un nombre para el ticket.");

        setIsSending(true);
        try {
            // 1. Get current cart of target user
            const targetCart = await getCart(selectedSessionId) || [];

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

            await saveCart(selectedSessionId, updatedCart);

            alert(`✅ Ticket "${ticketName}" enviado exitosamente a la caja.`);

            setShowSessionSelector(false);
            setTicketData(); // Clear local cart
            onClose && onClose();

        } catch (error) {
            console.error("Error sending ticket:", error);
            alert("❌ Error al enviar el ticket a la caja. Intente de nuevo.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <React.Fragment>
            <ModalOverlay style={{ zIndex: showSessionSelector ? 1099 : 1100 }}>
                <ModalContent>
                    {/* Asignar la referencia al wrapper que queremos capturar */}
                    <ProformaWrapper ref={proformaRef}>
                        {/* ... (Existing Proforma Content: Header, Details, Tables, etc.) ... */}
                        <ProformaHeader>
                            <img src={COMPANY.LOGO_URL} alt="Logo del Negocio" className="logo" />
                            <FaFileInvoice size={32} style={{ color: '#0b72b9', marginBottom: 8 }} />
                            <h2>PROFORMA {proformaNumber && `N° ${proformaNumber}`}</h2>
                            <p>Documento No Válido como Factura Fiscal</p>
                        </ProformaHeader>

                        <CompanyDetails>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{COMPANY.NAME} - {COMPANY.SLOGAN}</p>
                            <p style={{ margin: '3px 0' }}>{COMPANY.ADDRESS}</p>
                            <p style={{ margin: 0 }}>Teléfonos: {COMPANY.PHONE} &nbsp;|&nbsp; RUC: {COMPANY.RUC}</p>
                        </CompanyDetails>

                        <ClientDetails>
                            <ClientDetailItem>
                                <p>Emitida a: <span>{proformaFor || 'Consumidor Final'}</span></p>
                                <p>Por: <span>{userName}</span></p>
                            </ClientDetailItem>
                            <ClientDetailItem>
                                <p>Teléfono: <span>{clientPhone}</span></p>
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
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>No hay artículos.</td></tr>
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
                                })}
                            </tbody>
                        </ProformaTable>

                        <FooterDetails>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>Nota:</p>
                                <p style={{ fontSize: '0.85rem' }}>{COMPANY.SLOGAN}</p>
                                <p style={{ fontSize: '0.85rem' }}>Precios sujetos a cambios y stock.</p>
                            </div>
                            <TotalsArea>
                                <TotalsRow><span>Subtotal:</span><span className="text-right">C${fmt(subtotal)}</span></TotalsRow>
                                {discount > 0 && <TotalsRow><span>Descuento:</span><span className="text-right">- C${fmt(discount)}</span></TotalsRow>}
                                <TotalsRow $bold className="grand-total"><span>TOTAL:</span><span className="text-right">C${fmt(total)}</span></TotalsRow>
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
        </React.Fragment>
    );
};

export default ProformaEmpleadoModal;