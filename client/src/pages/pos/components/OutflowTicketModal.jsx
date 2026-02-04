import React, { useState, useEffect, useCallback } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import { FaPrint, FaWindowClose, FaReceipt, FaTruck, FaFileInvoice } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const COMPANY = {
  NAME: 'Multirepuestos RG',
  RUC: '1211812770001E',
  PHONE: '84031936 / 84058142',
  ADDRESS: 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
  SLOGAN: 'Repuestos de confianza al mejor precio — calidad que mantiene tu motor en marcha.',
};

const getLogoPath = () => new URL('/icons/logo.png', window.location.origin).toString();

// ================== ESTILOS GLOBALES / POS (Porteados para que funcione standalone) ==================
const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1100;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column;
  overflow: hidden;
  max-width: 520px;
  width: 96%;
  padding: 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex; align-items: center; gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  ${props => props.$cancel ? `
    background: #fee2e2; color: #b91c1c;
    &:hover { background: #fecaca; }
  ` : `
    background: #0f172a; color: white;
    &:hover { background: #334155; transform: translateY(-1px); }
  `}
`;

// ================== ESTILOS DE TICKET (Igual a TicketModal) ==================
const PrintWrapper = styled.div`
  font-family: 'Consolas','Courier New',monospace;
  color: #000;
  background: #fff;
  margin: 0 auto;
  padding: 12px 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;
  width: 310px; /* Previsualización por defecto tipo 80mm */

  &.compact { padding: 8px 6px; }

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
    color: #1e3a8a;
    line-height: 1.25;
  }
  .brand small {
    color: #555;
    display: block;
    margin: 3px 0;
    line-height: 1.35;
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
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .meta-label { font-weight: 700; }
  .meta-value { text-align: right; max-width: 65%; }

  table.items { width: 100%; border-collapse: collapse; font-size: .85rem; table-layout: fixed; }
  table.items th, table.items td { padding: 4px 2px; vertical-align: top; word-wrap: break-word; }
  table.items th {
    border-bottom: 2px solid #333;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #1e3a8a;
    text-align: left;
  }
  .text-right { text-align: right; }
  .col-qty { width: 12%; text-align: center; }
  .col-code { width: 22%; } /* Columna extra para Código */
  .col-price { width: 25%; text-align: right; } /* Mostrar Precio unitario */

  .totals { border-top: 2px solid #333; padding-top: 6px; margin-top: 12px; }
  .grand-total { font-size: 1.1rem; font-weight: 900; border-top: 2px solid #333; padding-top: 5px; display: flex; justify-content: space-between; margin-top: 5px; }

  .thanks {
    text-align: center; font-size: .85rem; border-top: 1px dashed #333;
    padding-top: 10px; margin-top: 12px; color: #444; line-height: 1.4;
  }
  
  .tag {
    display: inline-block; padding: 4px 8px; border-radius: 4px; 
    background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;
    font-weight: 700; font-size: 0.8rem; margin-top: 5px;
  }

  /* Clases para modo impresión dinámica (se inyectan en ventana nueva) */
  &.print-a4 { width: 190mm !important; font-size: 10pt !important; }
  &.print-80 { width: 80mm !important; font-size: 8pt !important; }
`;

const TicketLogo = styled.img`
  width: 120px;
  max-width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 6px;
`;

const HeaderBar = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: .75rem;
`;

const OutflowTicketModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

  // Lógica de impresión (Ventana Nueva para control total A4 vs 80mm)
  const doPrint = useCallback((mode = '80') => {
    const node = document.getElementById('print-wrapper-outflow');
    if (!node) return;

    const htmlToPrint = node.outerHTML;

    // Estilos exactos para A4 vs 80mm
    const printStyles = `
      @page {
        size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'};
        margin: ${mode === 'A4' ? '10mm' : '0'};
      }
      body { margin: 0; padding: 0; font-family: 'Consolas', monospace; }
      #print-wrapper-outflow {
        width: ${mode === 'A4' ? '100%' : '80mm'} !important;
        max-width: ${mode === 'A4' ? '190mm' : '80mm'} !important;
        margin: 0 auto !important;
        border: none !important;
        box-shadow: none !important;
        font-size: ${mode === 'A4' ? '11pt' : '8pt'} !important;
        padding: ${mode === 'A4' ? '0' : '5px'} !important;
      }
      .brand h1 { font-size: ${mode === 'A4' ? '18pt' : '12pt'} !important; }
      .brand img { width: ${mode === 'A4' ? '250px' : '150px'} !important; }
      table.items { font-size: ${mode === 'A4' ? '10pt' : '8pt'} !important; }
      .grand-total { font-size: ${mode === 'A4' ? '16pt' : '12pt'} !important; }
      
      /* Ocultar scrollbars */
      ::-webkit-scrollbar { display: none; }
    `;

    const w = window.open('', '_blank', `width=${mode === 'A4' ? 900 : 400},height=700`);
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Imprimir Comprobante - ${mode}</title>
          <style>${printStyles}</style>
        </head>
        <body>${htmlToPrint}</body>
      </html>
    `);
    w.document.close();

    w.onload = () => {
      setTimeout(() => {
        w.focus();
        w.print();
      }, 500);
    };
  }, []);

  // Auto-print al abrir (por defecto 80mm, configurable)
  useEffect(() => {
    if (isOpen) {
      // Opcional: Descomentar para auto-imprimir
      // setTimeout(() => doPrint('80'), 800);
    }
  }, [isOpen, doPrint]);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <HeaderBar className="no-print">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaTruck /> Salida Exitosa
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button onClick={() => doPrint('80')} title="Imprimir Ticket 80mm">
                  <FaPrint /> 80mm
                </Button>
                <Button onClick={() => doPrint('A4')} title="Imprimir Carta A4">
                  <FaFileInvoice /> A4
                </Button>
                <Button $cancel onClick={onClose}>
                  <FaWindowClose />
                </Button>
              </div>
            </HeaderBar>

            {/* VISUALIZACIÓN PREVIA (Estilo Ticket) */}
            <div style={{ display: 'flex', justifyContent: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>

              <PrintWrapper id="print-wrapper-outflow">
                <div className="brand">
                  <TicketLogo src={getLogoPath()} alt="Logo" onError={(e) => e.target.style.display = 'none'} />
                  <h1>{COMPANY.NAME}</h1>
                  <small>{COMPANY.SLOGAN}</small>
                  <small>RUC: {COMPANY.RUC}</small>
                  <small>{COMPANY.ADDRESS}</small>
                  <div className="tag">COMPROBANTE DE SALIDA</div>
                </div>

                <div className="meta">
                  <p><span className="meta-label">Fecha:</span> <span className="meta-value">{new Date(transaction.fecha).toLocaleString()}</span></p>
                  <p><span className="meta-label">N° Comprobante:</span> <span className="meta-value">{transaction.id}</span></p>

                  {/* Muestra MOTIVO que viene en clienteNombre por el truco del controlador, o directo de motivo */}
                  <p><span className="meta-label">Motivo/Ref:</span> <span className="meta-value">{transaction.clienteNombre?.replace('MOTIVO: ', '') || transaction.motivo}</span></p>

                  <p><span className="meta-label">Autorizado por:</span> <span className="meta-value">{transaction.usuarioNombre}</span></p>
                </div>

                <table className="items">
                  <thead>
                    <tr>
                      <th className="col-qty">Cant</th>
                      <th className="col-code">Cód.</th>
                      <th>Desc.</th>
                      <th className="text-right">Costo U.</th>
                      <th className="text-right">P. Venta</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.items.map((item, i) => (
                      <tr key={i}>
                        <td className="col-qty">{item.quantity}</td>
                        <td className="col-code">{item.codigo || '-'}</td>
                        <td>{item.nombre}</td>
                        <td className="text-right">{fmt(item.cost)}</td>
                        <td className="text-right">{fmt(item.unit)}</td>
                        <td className="text-right">{fmt(item.unit * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="totals">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Items Totales:</span>
                    <span>{transaction.totalItems}</span>
                  </div>

                  {/* Mostrar Costo Total (Interno) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', fontStyle: 'italic', marginTop: '4px' }}>
                    <span>Costo Total (Interno):</span>
                    <span>C$ {fmt(transaction.totalCosto)}</span>
                  </div>

                  <div className="grand-total">
                    <span>TOTAL VALORIZADO:</span>
                    <span>C$ {fmt(transaction.totalVenta)}</span>
                  </div>
                </div>

                <div className="thanks">
                  <p>Registro Interno de Inventario</p>
                  <p>__________________________</p>
                  <p>Firma Responsable</p>
                </div>
              </PrintWrapper>

            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default OutflowTicketModal;
