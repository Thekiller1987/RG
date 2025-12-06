  // client/src/pages/POS/components/ProformaModal.jsx
  import React from 'react';
  import { FaFileInvoice, FaPrint, FaWindowClose } from 'react-icons/fa';
  import styled from 'styled-components';
  import { ModalOverlay, ModalContent, Button, TotalsRow } from '../POS.styles.jsx';
  import AlertModal from './AlertModal.jsx';
  import { useAuth } from '../../../context/AuthContext.jsx';

  /* =================================================================
  * DATOS DE TU NEGOCIO (para el encabezado descriptivo de la proforma)
  * ================================================================= */
  const COMPANY = {
    NAME: 'Multirepuestos RG',
    RUC: '1211812770001E',
    PHONE: '84031936 / 84058142',
    ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
    SLOGAN: 'Tu mejor opción en repuestos de moto y carro',
  };

  /* =================================================================
  * ESTILOS LOCALES
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

    h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #0b72b9;
    }
    p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }
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

  /* =================================================================
  * COMPONENTE PRINCIPAL
  * ================================================================= */
  const ProformaModal = ({
    cart = [],
    total = 0,
    subtotal = 0,
    discount = 0,
    proformaFor = '',
    onClose,
    setTicketData,
    currentUser,
    client
  }) => {
    const [modal, setModal] = React.useState({ name: null, props: {} });
    const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });

    const fmt = (n) =>
      new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .format(Number(n || 0));

    const openModal  = React.useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = React.useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert  = React.useCallback((props) => openModal('alert', props), [openModal]);

    // -------- Resolver nombre del operador con fallbacks (¡adiós "Cajero POS"!)
    const getName = (u) =>
      u?.usuarioNombre ||
      u?.nombre_usuario ||
      u?.name ||
      u?.nombre ||
      u?.displayName ||
      u?.username ||
      null;

    let lsUser = null;
    try { lsUser = JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { /* noop */ }

    const userName =
      getName(currentUser) ||
      getName(authUser)   ||
      getName(lsUser)     ||
      'Cajero POS';

    // -------- Datos del cliente mostrado en la proforma
    const clientName  = client?.nombre  || 'Consumidor Final';
    const clientPhone = client?.telefono || 'N/D';

    /**
     * Prepara la transacción de proforma y abre el TicketModal con el modo elegido.
     */
    const handlePrintProforma = React.useCallback((printMode) => {
      const proformaTransaction = {
        isProforma: true,
        proformaNombre: proformaFor,         // “A nombre de”
        // Datos del vendedor/cajero
        userId: (currentUser?.id_usuario ?? currentUser?.id ?? authUser?.id_usuario ?? authUser?.id),
        usuarioNombre: userName,
        // Carrito y totales
        items: cart,
        subtotal,
        descuento: discount,
        totalVenta: total,
        // Metadatos
        saleId: Date.now(),                  // id temporal
        fecha: new Date().toISOString(),
        shouldPrintNow: true                 // auto-impresión en TicketModal
      };

      setTicketData({
        transaction: proformaTransaction,
        creditStatus: null,
        shouldOpen: true,
        printMode                          // '80' | 'A4'
      });

      onClose && onClose();
    }, [cart, subtotal, discount, total, proformaFor, setTicketData, onClose, currentUser, authUser, userName]);

    /**
     * Diálogo para elegir formato de impresión (usa el mismo AlertModal del POS).
     */
    const askForProformaPrint = React.useCallback(() => {
      showAlert({
        title: 'Imprimir Proforma',
        message: '¿En qué formato desea imprimir la Proforma?',
        type: 'custom',
        buttons: [
          {
            label: '80 mm (Recibo)',
            action: () => { handlePrintProforma('80'); closeModal(); },
            isPrimary: true
          },
          {
            label: 'A4 (Completo)',
            action: () => { handlePrintProforma('A4'); closeModal(); }
          },
          { label: 'Cancelar', action: closeModal, isCancel: true }
        ]
      });
    }, [showAlert, closeModal, handlePrintProforma]);

    return (
      <ModalOverlay>
        <ModalContent style={{ maxWidth: '680px', width: '95%' }}>
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
                    const qty  = Number(item.quantity ?? 0);
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
              <Button $cancel onClick={onClose} style={{ flex: 1 }}>
                <FaWindowClose /> Cerrar
              </Button>
              <Button pay onClick={askForProformaPrint} disabled={cart.length === 0} style={{ flex: 1 }}>
                <FaPrint /> Imprimir Proforma
              </Button>
            </div>
          </ProformaWrapper>
        </ModalContent>

        {modal.name === 'alert' && (
          <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />
        )}
      </ModalOverlay>
    );
  };

  export default ProformaModal;
