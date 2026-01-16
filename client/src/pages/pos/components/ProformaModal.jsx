import React, { useState, useCallback, useEffect } from 'react';
import { FaFileInvoice, FaPrint, FaWindowClose, FaReceipt } from 'react-icons/fa';
import styled, { css, createGlobalStyle } from 'styled-components';
import { ModalOverlay, ModalContent, Button, TotalsRow } from '../POS.styles.jsx';
import AlertModal from './AlertModal.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

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

// Ruta valida de logo
const getLogoPath = () => new URL('/icons/logo.png', window.location.origin).toString();

/* ========= ESTILO GLOBAL DE IMPRESIÓN ========= */
const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 999999 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .no-print { display: none !important; }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;

/* ======================= ESTILOS DE TICKET/VISUALIZACIÓN ======================= */
const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  width: 310px;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.compact { padding: 8px 6px; }

  /* Encabezado */
  .brand {
    text-align: center;
    border-bottom: 1px dashed #333;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .brand h1 {
    margin: 6px 0 2px;
    font-size: 1.35rem;
    font-weight: 700;
    color: #0b72b9; /* Azul de RG */
    line-height: 1.25;
  }
  .brand small {
    color: #555;
    display: block;
    margin: 3px 0;
    line-height: 1.35;
    white-space: normal;
    word-break: break-word;
  }

  .meta {
    font-size: .9rem;
    margin-bottom: 12px;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;
  }
  .meta p {
    margin: 2px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 4px 8px;
    font-weight: 400;
  }
  .meta-label { font-weight: 700; }
  .meta-value { font-weight: 400; }

  table.items { width: 100%; border-collapse: collapse; font-size: .9rem; table-layout: fixed; }
  table.items th, table.items td { padding: 6px 4px; vertical-align: top; word-wrap: break-word; }
  table.items th {
    border-bottom: 2px solid #333;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #1e3a8a;
  }
  &.compact table.items th, &.compact table.items td { padding: 4px 2px; }
  .text-right { text-align: right; }
  .col-qty { width: 15%; text-align: center; }
  .col-unit { width: 25%; text-align: right; }
  .col-total { width: 25%; text-align: right; }
  table.items td:nth-child(2) { white-space: normal; text-align: left; }

  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .badge {
    display: inline-block; font-weight: 700; letter-spacing: .5px;
    padding: 6px 10px; border: 2px solid #0b72b9; border-radius: 4px;
    margin: 10px auto; text-align: center; color: #0b72b9;
    font-size: 0.8rem;
  }
  .thanks {
    text-align: center; font-size: .85rem; border-top: 1px dashed #333;
    padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4;
  }

  @media print {
    &.print-80 {
      width: 80mm !important;
      font-family: 'Consolas', monospace !important;
      padding: 6px 4px !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 8pt;
    }
    &.print-a4 {
      width: 190mm !important;
      font-size: 10pt !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      max-height: 277mm !important;
      overflow: hidden !important;
    }
    &.compact { font-size: 7.5pt; }
  }
`;

const Wrapper = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const TicketLogo = styled.img`
  width: 120px;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 6px;
  border-radius: 6px;
`;

const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; letter-spacing: .4px; padding: 4px 8px; border-radius: 4px;
  font-size: 0.85rem;
  background: #e8f4ff; color: #0b72b9; border: 1px solid #b9defc;
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`;

/* =================================================================
 * COMPONENTE PRINCIPAL (ProformaModal)
 * ================================================================= */
const ProformaModal = ({
  cart = [],
  total = 0,
  subtotal = 0,
  discount = 0,
  proformaFor = '',
  onClose,
  currentUser,
  client
}) => {
  // Estado para controlar el modal de "seleccionar tipo de impresión" (80mm vs A4) - opcional si queremos forzar 80mm
  // Pero mantendremos la UI similar al TicketModal: mostrar preview y botones arriba.

  const { user: authUser } = (typeof useAuth === 'function' ? useAuth() : { user: null });

  // Resolver nombre de quien emite
  const getName = (u) => u?.usuarioNombre || u?.nombre_usuario || u?.name || u?.nombre || u?.username || null;
  let lsUser = null;
  try { lsUser = JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { }
  const userName = getName(currentUser) || getName(authUser) || getName(lsUser) || 'Cajero POS';

  // Datos cliente
  const clientName = client?.nombre || 'Consumidor Final';
  const proformaDate = new Date().toLocaleString('es-NI');

  // Helpers de formato
  const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

  // Lógica Imprimir
  const doPrint = useCallback((mode = '80') => {
    const node = document.getElementById('print-wrapper-proforma');
    if (!node) return;
    const htmlToPrint = node.outerHTML;

    const printStyles = `
      @charset "UTF-8";
      @page {
        size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'};
        margin: ${mode === 'A4' ? '8mm' : '0'};
      }
      html, body {
        background: #fff;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color: #000 !important;
      }
      #print-wrapper-proforma, #print-wrapper-proforma * {
        color: #000 !important;
        font-weight: 700 !important; /* Fuerza Negrita como se pidió */
        text-shadow: none !important;
        box-shadow: none !important;
      }
      #print-wrapper-proforma {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        ${mode === 'A4'
        ? `width: 190mm !important; max-height: 277mm !important; overflow: hidden !important; font-family: Arial, Helvetica, sans-serif !important; font-size: 10pt !important;`
        : `width: 80mm !important; padding: 6px 4px !important; font-family: Consolas, 'Courier New', monospace !important; font-size: 8pt !important;`
      }
      }
      .brand h1 { font-size: ${mode === 'A4' ? '16pt' : '12pt'}; margin: 6px 0 2px; }
      .brand small, .meta p, .thanks { font-size: ${mode === 'A4' ? '10pt' : '8pt'}; }
      table.items { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: ${mode === 'A4' ? '10pt' : '8pt'}; }
      table.items th, table.items td { padding: 4px 2px; border-bottom: 1px dashed #eee; word-wrap: break-word; vertical-align: top; }
      .col-qty { width: 12%; text-align: center; }
      .col-unit, .col-total { width: 22%; text-align: right; }
      .totals { border-top: 2px solid #333; padding-top: 5px; }
      .grand-total { font-size: ${mode === 'A4' ? '14pt' : '12pt'}; font-weight: 900 !important; }
      
      /* Encabezado limpio */
      .brand { padding-bottom: 10px !important; margin-bottom: 10px !important; border-bottom: 1px dashed #333 !important; }
      .brand img { width: ${mode === 'A4' ? '200px' : '280px'} !important; height: auto !important; }

      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `;

    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>PROFORMA - ${COMPANY.NAME}</title>
          <style>${printStyles}</style>
        </head>
        <body>${htmlToPrint}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.onload = function () {
      setTimeout(() => { w.print(); }, 250);
    };
    w.onafterprint = () => {
      try { w.close(); } catch { }
    };
  }, []);

  const compact = cart.length <= 2;

  return (
    <ModalOverlay className="no-print">
      <GlobalPrintStyle />
      {/* Usamos un Ancho máximo similar al TicketModal para consistencia visual */}
      <ModalContent className="no-print" style={{ maxWidth: 520, width: '96%', padding: '1.2rem', background: '#fff' }}>
        <HeaderBar>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <FaReceipt /> Vista Proforma
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => doPrint('80')}>Ticket 80mm</Button>
            <Button onClick={() => doPrint('A4')}><FaFileInvoice /> A4</Button>
            <Button $cancel onClick={onClose}><FaWindowClose /></Button>
          </div>
        </HeaderBar>

        <Wrapper>
          <PrintWrapper
            id="print-wrapper-proforma"
            className={`print-area print-80 ${compact ? 'compact' : ''}`}
          >
            {/* Encabezado */}
            <div className="brand">
              <TicketLogo
                src={getLogoPath()}
                alt="Logo"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <h1>{COMPANY.NAME}</h1>
              <small>{COMPANY.SLOGAN}</small>
              <small>RUC: {COMPANY.RUC}</small>
              <small>Tel: {COMPANY.PHONE}</small>
              <small>Dir: {COMPANY.ADDRESS}</small>
              <div style={{ marginTop: 8 }}>
                <Tag><FaFileInvoice /> PROFORMA</Tag>
              </div>
            </div>

            {/* Meta */}
            <div className="meta">
              <p><span className="meta-label">Fecha:</span><span className="meta-value">{proformaDate}</span></p>
              <p><span className="meta-label">A nombre de:</span><span className="meta-value">{proformaFor || clientName}</span></p>
              <p><span className="meta-label">Atendido por:</span><span className="meta-value">{userName}</span></p>
              <p><span className="meta-label">ID Temp:</span><span className="meta-value">{Date.now().toString().slice(-6)}</span></p>
            </div>

            {/* Tabla */}
            <table className="items">
              <thead>
                <tr>
                  <th className="col-qty">Cant.</th>
                  <th>Descripción</th>
                  <th className="text-right col-unit">P. Unit.</th>
                  <th className="text-right col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#777' }}>Sin ítems</td></tr>
                ) : (
                  cart.map((item, idx) => {
                    const unit = Number(item.precio_venta ?? item.precio ?? 0);
                    const qty = Number(item.quantity ?? 0);
                    const rowTotal = unit * qty;
                    return (
                      <tr key={idx}>
                        <td className="col-qty">{qty}</td>
                        <td>{item.nombre || item.descripcion || 'Item'}</td>
                        <td className="text-right col-unit">C${fmt(unit)}</td>
                        <td className="text-right col-total">C${fmt(rowTotal)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Totales */}
            <div className="totals">
              <TotalsRow><span>Subtotal:</span><span>C${fmt(subtotal)}</span></TotalsRow>
              {discount > 0 && (
                <TotalsRow style={{ color: '#dc3545' }}><span>Descuento:</span><span>- C${fmt(discount)}</span></TotalsRow>
              )}
              <TotalsRow className="grand-total" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: 5, borderTop: '2px solid black' }}>
                <span>TOTAL:</span><span>C${fmt(total)}</span>
              </TotalsRow>

              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <span className="badge">DOCUMENTO NO VÁLIDO COMO FACTURA</span>
                <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#666' }}>
                  Precios sujetos a cambio y disponibilidad. Válido por 3 días.
                </p>
              </div>
            </div>

            {/* Pie */}
            <div className="thanks">
              <p>"{COMPANY.SLOGAN}"</p>
              <p>¡Gracias por cotizar con nosotros!</p>
            </div>
          </PrintWrapper>
        </Wrapper>

      </ModalContent>
    </ModalOverlay>
  );
};

export default ProformaModal;
