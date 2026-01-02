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

  const openModal = React.useCallback((name, props = {}) => setModal({ name, props }), []);
  const closeModal = React.useCallback(() => setModal({ name: null, props: {} }), []);
  const showAlert = React.useCallback((props) => openModal('alert', props), [openModal]);

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
    getName(authUser) ||
    getName(lsUser) ||
    'Cajero POS';

  // -------- Datos del cliente mostrado en la proforma
  const clientName = client?.nombre || 'Consumidor Final';
  const clientPhone = client?.telefono || 'N/D';

  /**
   * Prepara la transacción de proforma y abre el TicketModal con el modo elegido.
   */
  /**
   * Imprime la proforma directamente generado un HTML en ventana nueva.
   */
  const handlePrintProforma = React.useCallback((mode) => {
    const win = window.open('', '_blank');
    if (!win) return;

    const isA4 = mode === 'A4';
    const dateStr = new Date().toLocaleString('es-NI');

    const css = `
        body { margin: 0; padding: 10px; font-family: ${isA4 ? 'Arial, sans-serif' : "'Courier New', monospace"}; color: #000; font-size: 12px; }
        .container { max-width: ${isA4 ? '750px' : '280px'}; margin: 0 auto; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
        .client-info { margin-bottom: 10px; padding: 5px; border: 1px solid #ddd; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
        th { border-bottom: 1px solid #000; text-align: left; padding: 2px; }
        td { border-bottom: 1px dashed #ccc; padding: 4px 2px; vertical-align: top; }
        .totals { margin-top: 10px; border-top: 1px solid #000; padding-top: 5px; }
        .row { display: flex; justify-content: space-between; margin: 2px 0; }
        .footer { margin-top: 20px; text-align: center; font-size: 10px; font-style: italic; }
      `;

    const rows = cart.map(item => {
      const unit = Number(item.precio_venta ?? item.precio ?? 0);
      const qty = Number(item.quantity ?? 0);
      return `
          <tr>
            <td>${qty}</td>
            <td>${item.nombre}</td>
            <td class="text-right">${fmt(unit)}</td>
            <td class="text-right">${fmt(qty * unit)}</td>
          </tr>
        `;
    }).join('');

    const html = `
        <html>
        <head><title>Proforma</title><style>${css}</style></head>
        <body>
          <div class="container">
            <div class="header text-center">
              <h2 style="margin:0">${COMPANY.NAME}</h2>
              <div style="font-size:10px">${COMPANY.SLOGAN}</div>
              <div>${COMPANY.ADDRESS}</div>
              <div>RUC: ${COMPANY.RUC} | Tel: ${COMPANY.PHONE}</div>
              <h3 style="margin:5px 0; border:1px solid #000; display:inline-block; padding:2px 8px;">PROFORMA</h3>
            </div>

            <div class="client-info">
              <div><strong>Cliente:</strong> ${proformaFor || clientName}</div>
              <div><strong>Teléfono:</strong> ${clientPhone}</div>
              <div><strong>Atendió:</strong> ${userName}</div>
              <div><strong>Fecha:</strong> ${dateStr}</div>
            </div>

            <table>
              <thead><tr><th style="width:10%">Cant</th><th style="width:50%">Desc</th><th class="text-right">Unit</th><th class="text-right">Total</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>

            <div class="totals">
              <div class="row"><span>Subtotal:</span><span>C$ ${fmt(subtotal)}</span></div>
              ${discount > 0 ? `<div class="row"><span>Descuento:</span><span>- C$ ${fmt(discount)}</span></div>` : ''}
              <div class="row bold" style="font-size:14px"><span>TOTAL:</span><span>C$ ${fmt(total)}</span></div>
            </div>

            <div class="footer">
              <p>*** Documento No Válido como Factura ***</p>
              <p>Precios sujetos a cambios. Validez: 3 días.</p>
            </div>
            
            <script>
               window.onload = function() { window.print(); window.close(); };
            </script>
          </div>
        </body>
        </html>
      `;

    win.document.write(html);
    win.document.close();
    onClose && onClose();
  }, [cart, subtotal, discount, total, proformaFor, userName, clientName, clientPhone, onClose]);

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
