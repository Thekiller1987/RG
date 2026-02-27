import React, { useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaPrint, FaWindowClose, FaFileInvoiceDollar } from 'react-icons/fa';
import { ModalOverlay, ModalContent, Button } from '../POS.styles.jsx';
import { useSettings } from '../../../context/SettingsContext.jsx';

/* ========= ESTILO GLOBAL ========= */
const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area { position: absolute !important; left: 0 !important; top: 0 !important; z-index: 999999 !important; margin: 0 !important; padding: 0 !important; }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
`;

const PrintWrapper = styled.div`
  font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
  color: #000;
  background: #fff;
  width: 100%;
  margin: 0 auto;
  padding: 14px 12px;
  box-shadow: 0 0 10px rgba(0,0,0,.08);
  border: 1px solid #eee;
  border-radius: 8px;

  &.print-80 {
    width: 80mm !important;
    padding: 6px 4px !important;
    border: none !important;
    box-shadow: none !important;
    font-size: 8pt;
  }
  &.print-a4 {
    width: 190mm !important;
    font-size: 10pt !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }

  .brand { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 12px; }
  .brand-logo-container { display: flex; justify-content: center; margin-bottom: 8px; }
  .brand h1 { margin: 4px 0 3px; font-size: 1.3rem; font-weight: 800; color: #0b0b0b; line-height: 1.2; font-family: 'League Spartan', 'Inter', sans-serif; }
  .brand small { color: #444; display: block; margin: 2px 0; font-size: 0.78rem; border-bottom: none; }

  .meta { font-size: .88rem; margin-bottom: 12px; border-bottom: 1px dashed #aaa; padding-bottom: 8px; }
  .meta p { margin: 3px 0; display: flex; justify-content: space-between; gap: 4px 8px; font-weight: 400; }
  .meta-label { font-weight: 700; color: #111; }
  .meta-value { font-weight: 800; color: #333; }
  .meta-value.red { color: #d32f2f; }
  .meta-value.green { color: #388e3c; }

  table { width: 100%; border-collapse: collapse; font-size: .85rem; margin-bottom: 15px; }
  th, td { padding: 6px 4px; vertical-align: middle; border-bottom: 1px dashed #ccc; }
  th { border-bottom: 2px solid #222; font-weight: 800; text-align: left; }
  td.right, th.right { text-align: right; }
  td.center, th.center { text-align: center; }

  .summary { border-top: 2px solid #111; padding-top: 10px; margin-top: 10px; font-size: 1rem; }
  .summary p { display: flex; justify-content: space-between; margin: 4px 0; font-weight: 600; }
  .summary p.total { font-size: 1.2rem; font-weight: 800; color: #d32f2f; border-top: 1px dashed #111; padding-top: 6px; }

  .footer { text-align: center; margin-top: 20px; font-size: 0.8rem; font-style: italic; color: #555; border-top: 1px dashed #ccc; padding-top: 10px; }
`;

const TicketLogo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  border-radius: 6px;
  .print-a4 & { width: 130px; height: auto; }
`;

const StatementModal = ({
    statementData,
    onClose,
}) => {
    const { settings } = useSettings();
    const { cliente, historial } = statementData;

    const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

    const companyInfo = {
        name: settings?.empresa_nombre || 'Multirepuestos RG',
        ruc: settings?.empresa_ruc || '1211812770001E',
        phone: settings?.empresa_telefono || '84031936 / 84058142',
        address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
        slogan: settings?.empresa_eslogan || 'Tu mejor opción en repuestos',
        logo: settings?.empresa_logo_url || new URL('/icons/logo.png', window.location.origin).toString()
    };

    const doPrint = useCallback((mode = '80') => {
        const node = document.getElementById('print-wrapper-statement');
        if (!node) return;
        const htmlToPrint = node.outerHTML;

        const fontImport = `@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap');`;

        const printStyles = `
      @charset "UTF-8";
      ${fontImport}
      @page { size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'}; margin: ${mode === 'A4' ? '12mm' : '0'}; }
      html, body {
        background: #fff; margin: 0 !important; padding: 0 !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
        color: #000 !important; font-weight: 800 !important;
        font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
      }
      #print-wrapper-statement {
        box-shadow: none !important; border: none !important; margin: 0 !important;
        font-family: 'League Spartan', 'Inter', system-ui, sans-serif !important;
        color: #000 !important; font-weight: 800 !important; font-size: 10pt !important;
        ${mode === 'A4'
                ? `width: 100% !important; padding: 0 !important; font-size: 10pt !important;`
                : `width: 80mm !important; padding: 6px 4px !important; font-size: 9pt !important;`
            }
      }
      #print-wrapper-statement * { color: #000 !important; font-weight: 800 !important; }
      .brand { text-align: center !important; border-bottom: 2px solid #000 !important; padding-bottom: 6px !important; margin-bottom: 6px !important; }
      .brand h1 { font-size: 18pt !important; letter-spacing: 0.5px !important; margin: 0 0 4px !important; }
      .brand-logo-container { display: flex !important; justify-content: center !important; margin-bottom: 4px !important; }
      .brand-logo-container img { width: ${mode === 'A4' ? '130px' : '80px'} !important; height: ${mode === 'A4' ? 'auto' : '80px'} !important; object-fit: contain !important; }
      .meta p { display: flex !important; justify-content: space-between !important; margin: 2px 0 !important; }
      table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 10px !important; }
      th { border-bottom: 2px solid #000 !important; font-size: 9pt !important; text-align: left !important; }
      td { border-bottom: 1px dashed #000 !important; font-size: 9pt !important; }
      .right { text-align: right !important; }
      .summary .total { font-size: 14pt !important; border-top: 2px solid #000 !important; margin-top: 6px !important; padding-top: 4px !important; }
      .footer { text-align: center !important; margin-top: 15px !important; font-size: 8pt !important; border-top: 1px dashed #000 !important; padding-top: 8px !important; }
      
      ${mode === 'A4' ? `
        .brand { display: flex !important; justify-content: space-between !important; align-items: flex-start !important; text-align: left !important; border-bottom: 3px solid #1e3a8a !important; margin-bottom: 25px !important; padding-bottom: 15px !important; }
        .brand-logo-container { width: 140px !important; justify-content: flex-start !important; order: 1 !important; }
        .brand-info { flex: 1 !important; text-align: right !important; order: 2 !important; }
        .brand h1 { font-size: 22pt !important; color: #1e3a8a !important; margin: 0 0 5px 0 !important; }
        .brand small { display: block !important; font-size: 9pt !important; margin: 2px 0 !important; color: #000 !important; }
        .meta { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 30px !important; border: 1px solid #000 !important; padding: 15px !important; margin-bottom: 20px !important; border-radius: 8px !important; }
        table { border: 1px solid #000 !important; }
        th, td { padding: 8px !important; }
      ` : ''}
    `;

        const w = window.open('', '_blank', 'width=900,height=700');
        if (!w) return;
        w.document.write(`<!DOCTYPE html><html><head><title>ESTADO DE CUENTA - ${companyInfo.name}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
        w.document.close();
        w.focus();
        w.onload = function () {
            setTimeout(() => {
                w.print();
                setTimeout(() => {
                    w.close();
                }, 500);
            }, 400);
        };
    }, [companyInfo]);

    return (
        <ModalOverlay onClick={onClose}>
            <GlobalPrintStyle />
            <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', background: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FaFileInvoiceDollar /> Estado de Cuenta
                    </h2>
                    <Button $cancel onClick={onClose} style={{ padding: '6px 12px', minWidth: 'auto' }}>
                        <FaWindowClose size={18} />
                    </Button>
                </div>

                <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <PrintWrapper id="print-wrapper-statement">
                            <div className="brand">
                                <div className="brand-logo-container">
                                    <TicketLogo src={companyInfo.logo} alt="Logo" style={{ filter: 'grayscale(100%) contrast(150%)' }} />
                                </div>
                                <div className="brand-info">
                                    <h1>{companyInfo.name}</h1>
                                    <small>RUC: {companyInfo.ruc}</small>
                                    <small>Tel: {companyInfo.phone}</small>
                                    <small>{companyInfo.address}</small>
                                    <small style={{ fontWeight: 'bold', marginTop: '6px', fontSize: '1rem', textTransform: 'uppercase' }}>ESTADO DE CUENTA</small>
                                </div>
                            </div>

                            <div className="meta">
                                <p><span className="meta-label">Cliente:</span> <span className="meta-value">{cliente.nombre}</span></p>
                                <p><span className="meta-label">ID:</span> <span className="meta-value">{cliente.id}</span></p>
                                <p><span className="meta-label">Teléfono:</span> <span className="meta-value">{cliente.telefono || 'N/A'}</span></p>
                                <p><span className="meta-label">Fecha Emisión:</span> <span className="meta-value">{new Date().toLocaleString('es-NI')}</span></p>
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Ref / Descripción</th>
                                        <th className="right">Crédito</th>
                                        <th className="right">Abono</th>
                                        <th className="right">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.map((tx, idx) => (
                                        <tr key={idx}>
                                            <td>{new Date(tx.fecha).toLocaleDateString('es-NI')}</td>
                                            <td style={{ fontSize: '0.8rem' }}>{tx.descripcion}</td>
                                            <td className="right" style={{ color: '#d32f2f' }}>{tx.impacto > 0 ? fmt(tx.monto) : ''}</td>
                                            <td className="right" style={{ color: '#388e3c' }}>{tx.impacto < 0 ? fmt(tx.monto) : ''}</td>
                                            <td className="right" style={{ fontWeight: 'bold' }}>{fmt(tx.saldo)}</td>
                                        </tr>
                                    ))}
                                    {historial.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="center" style={{ padding: '15px' }}>
                                                Sin movimientos registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="summary">
                                <p><span>Límite de Crédito:</span> <span>{cliente.limite_credito === null ? 'Ilimitado' : 'C$' + fmt(cliente.limite_credito)}</span></p>
                                <p className="total"><span>SALDO PENDIENTE:</span> <span>C$ {fmt(cliente.saldo_calculado)}</span></p>
                            </div>

                            <div className="footer">
                                Documento no válido como factura. <br />
                                Gracias por preferir a {companyInfo.name}
                            </div>
                        </PrintWrapper>
                    </div>
                </div>

                <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Button $cancel onClick={onClose}>Cerrar</Button>
                    <Button style={{ background: '#212529', color: 'white' }} onClick={() => doPrint('80')}><FaPrint /> Imprimir Ticket (80mm)</Button>
                    <Button primary onClick={() => doPrint('A4')}><FaPrint /> Imprimir Carta (A4)</Button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default StatementModal;
