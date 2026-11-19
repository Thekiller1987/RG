import React, { useState, useCallback, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
    FaPrint, FaTimes, FaFileInvoiceDollar, FaCreditCard,
    FaMoneyBillWave, FaBoxOpen
} from 'react-icons/fa';
import { useSettings } from '../../../context/SettingsContext.jsx';

const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body { visibility: hidden; margin: 0; padding: 0; }
    .print-area, .print-area * { visibility: visible !important; }
    .print-area { position: absolute !important; left: 0 !important; top: 0 !important; z-index: 999999 !important; margin: 0 !important; padding: 0 !important; }
    .no-print { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9500;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: #ffffff;
  width: 780px;
  max-width: 100%;
  max-height: 92vh;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.4);
  border: 1px solid #e2e8f0;
`;

const TopHeader = styled.div`
  padding: 1.15rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const FilterToolbar = styled.div`
  padding: 0.75rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.65rem;
`;

const FilterBtn = styled.button`
  padding: 0.45rem 0.9rem;
  border-radius: 99px;
  border: 1px solid ${p => p.$active ? (p.$color || '#2563eb') : '#cbd5e1'};
  background: ${p => p.$active ? (p.$color || '#2563eb') : '#ffffff'};
  color: ${p => p.$active ? '#ffffff' : '#475569'};
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.18s;
  &:hover {
    border-color: ${p => p.$color || '#2563eb'};
  }
`;

const PrintWrapper = styled.div`
  font-family: 'League Spartan', 'Inter', system-ui, -apple-system, sans-serif;
  color: #000;
  background: #fff;
  width: 100%;
  margin: 0 auto;
  padding: 18px 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,.06);
  border: 1px solid #e2e8f0;
  border-radius: 12px;

  .brand { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 12px; }
  .brand-logo-container { display: flex; justify-content: center; margin-bottom: 8px; }
  .brand h1 { margin: 4px 0 3px; font-size: 1.35rem; font-weight: 800; color: #0b0b0b; line-height: 1.2; }
  .brand small { color: #444; display: block; margin: 2px 0; font-size: 0.8rem; }

  .meta { font-size: .88rem; margin-bottom: 12px; border-bottom: 1px dashed #aaa; padding-bottom: 8px; }
  .meta p { margin: 3px 0; display: flex; justify-content: space-between; gap: 4px 8px; }
  .meta-label { font-weight: 700; color: #111; }
  .meta-value { font-weight: 800; color: #333; }

  table { width: 100%; border-collapse: collapse; font-size: .85rem; margin-bottom: 15px; }
  th, td { padding: 7px 5px; vertical-align: middle; border-bottom: 1px dashed #ccc; }
  th { border-bottom: 2px solid #222; font-weight: 800; text-align: left; }
  td.right, th.right { text-align: right; }
  td.center, th.center { text-align: center; }

  .summary { border-top: 2px solid #111; padding-top: 10px; margin-top: 10px; font-size: 0.95rem; }
  .summary p { display: flex; justify-content: space-between; margin: 4px 0; font-weight: 600; }
  .summary p.total { font-size: 1.2rem; font-weight: 900; color: #d32f2f; border-top: 1px dashed #111; padding-top: 6px; margin-top: 6px; }

  .footer { text-align: center; margin-top: 18px; font-size: 0.8rem; font-style: italic; color: #555; border-top: 1px dashed #ccc; padding-top: 10px; }
`;

const TicketLogo = styled.img`
  max-width: 95px;
  max-height: 95px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 6px;
`;

const StatementModal = ({
    statementData,
    filterType: initialFilter = 'ALL',
    onClose,
}) => {
    const { settings } = useSettings();
    const [activeFilter, setActiveFilter] = useState(initialFilter || 'ALL');
    const [showProducts, setShowProducts] = useState(true);

    const { cliente, historial } = statementData || { cliente: {}, historial: [] };

    const fmt = (n) => new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

    const filteredHistorial = useMemo(() => {
        return (historial || []).filter(tx => {
            if (activeFilter === 'DEBT') return tx.impacto > 0;
            if (activeFilter === 'PAID') return tx.impacto < 0;
            return true;
        });
    }, [historial, activeFilter]);

    const totals = useMemo(() => {
        const totalCreditos = (historial || []).filter(t => t.impacto > 0).reduce((s, t) => s + t.monto, 0);
        const totalAbonos = (historial || []).filter(t => t.impacto < 0).reduce((s, t) => s + t.monto, 0);
        const saldoFinal = cliente?.saldo_pendiente_db !== undefined ? Number(cliente.saldo_pendiente_db) : Number(cliente?.saldo_calculado || 0);
        return { totalCreditos, totalAbonos, saldoFinal };
    }, [historial, cliente]);

    const reportTitle =
        activeFilter === 'DEBT' ? 'HISTORIAL DE DEUDAS (CRÉDITOS)' :
        activeFilter === 'PAID' ? 'HISTORIAL DE PAGOS (ABONOS)' :
        'ESTADO DE CUENTA COMPLETO';

    const logoUrl = useMemo(() => {
        if (!settings?.empresa_logo_url) return null;
        if (settings.empresa_logo_url.startsWith('http')) return settings.empresa_logo_url;
        let cleanUrl = settings.empresa_logo_url;
        if (cleanUrl.startsWith('/uploads')) cleanUrl = '/api' + cleanUrl;
        else if (cleanUrl.startsWith('uploads')) cleanUrl = '/api/' + cleanUrl;
        const base = (import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com/api').replace(/\/api$/, '');
        return `${base}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
    }, [settings?.empresa_logo_url]);

    const companyInfo = {
        name: settings?.empresa_nombre || 'Multirepuestos RG',
        ruc: settings?.empresa_ruc || '1211812770001E',
        phone: settings?.empresa_telefono || '84031936 / 84058142',
        address: settings?.empresa_direccion || 'Del portón de la normal 75 varas al este. Juigalpa, Chontales.',
        logo: logoUrl || new URL('/icons/logo.png', window.location.origin).toString()
    };

    const doPrint = useCallback((mode = '80') => {
        const node = document.getElementById('print-wrapper-statement');
        if (!node) return;
        const htmlToPrint = node.outerHTML;
        const fontImport = `@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;700;800;900&display=swap');`;

        const printStyles = `
          @charset "UTF-8";
          ${fontImport}
          @page { size: ${mode === 'A4' ? 'A4 portrait' : '80mm auto'}; margin: ${mode === 'A4' ? '12mm' : '0'}; }
          html, body {
            background: #fff; margin: 0 !important; padding: 0 !important;
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
            color: #000 !important; font-weight: 800 !important;
            font-family: 'League Spartan', 'Inter', system-ui, sans-serif;
          }
          #print-wrapper-statement {
            box-shadow: none !important; border: none !important; margin: 0 !important;
            color: #000 !important; font-weight: 800 !important;
            ${mode === 'A4'
                ? `width: 100% !important; padding: 0 !important; font-size: 10pt !important;`
                : `width: 80mm !important; padding: 6px 4px !important; font-size: 9pt !important;`
            }
          }
          #print-wrapper-statement * { color: #000 !important; font-weight: 800 !important; }
          .brand { text-align: center !important; border-bottom: 2px solid #000 !important; padding-bottom: 6px !important; margin-bottom: 6px !important; }
          .brand h1 { font-size: 18pt !important; margin: 0 0 4px !important; }
          .brand-logo-container { display: flex !important; justify-content: center !important; margin-bottom: 4px !important; }
          .brand-logo-container img { max-width: ${mode === 'A4' ? '120px' : '75px'} !important; max-height: ${mode === 'A4' ? '85px' : '75px'} !important; object-fit: contain !important; }
          .meta p { display: flex !important; justify-content: space-between !important; margin: 2px 0 !important; }
          table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 10px !important; }
          th { border-bottom: 2px solid #000 !important; font-size: 9pt !important; text-align: left !important; }
          td { border-bottom: 1px dashed #000 !important; font-size: 9pt !important; }
          .right { text-align: right !important; }
          .summary .total { font-size: 13pt !important; border-top: 2px solid #000 !important; margin-top: 6px !important; padding-top: 4px !important; }
          .footer { text-align: center !important; margin-top: 14px !important; font-size: 8pt !important; border-top: 1px dashed #000 !important; padding-top: 8px !important; }
        `;

        const w = window.open('', '_blank', 'width=900,height=700');
        if (!w) return;
        w.document.write(`<!DOCTYPE html><html><head><title>${reportTitle} - ${cliente.nombre}</title><style>${printStyles}</style></head><body>${htmlToPrint}</body></html>`);
        w.document.close();
        w.focus();
        w.onload = function () {
            setTimeout(() => {
                w.print();
                setTimeout(() => w.close(), 500);
            }, 350);
        };
    }, [reportTitle, cliente.nombre]);

    return (
        <Overlay onClick={onClose}>
            <GlobalPrintStyle />
            <ModalCard onClick={e => e.stopPropagation()}>
                <TopHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                            <FaFileInvoiceDollar />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                                {reportTitle}
                            </h2>
                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                Cliente: <strong>{cliente.nombre}</strong> (ID #{cliente.id})
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <FaTimes />
                    </button>
                </TopHeader>

                <FilterToolbar>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <FilterBtn $active={activeFilter === 'ALL'} $color="#1e293b" onClick={() => setActiveFilter('ALL')}>
                            <FaFileInvoiceDollar /> Estado Completo
                        </FilterBtn>
                        <FilterBtn $active={activeFilter === 'DEBT'} $color="#dc2626" onClick={() => setActiveFilter('DEBT')}>
                            <FaCreditCard /> Solo Deudas (Créditos)
                        </FilterBtn>
                        <FilterBtn $active={activeFilter === 'PAID'} $color="#059669" onClick={() => setActiveFilter('PAID')}>
                            <FaMoneyBillWave /> Solo Pagos (Abonos)
                        </FilterBtn>
                    </div>

                    <FilterBtn
                        $active={showProducts}
                        $color="#2563eb"
                        onClick={() => setShowProducts(v => !v)}
                    >
                        <FaBoxOpen /> {showProducts ? 'Ocultar Productos' : 'Ver Productos'}
                    </FilterBtn>
                </FilterToolbar>

                <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, background: '#f1f5f9' }}>
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
                                <small style={{ fontWeight: 'bold', marginTop: '6px', fontSize: '0.95rem', textTransform: 'uppercase' }}>
                                    {reportTitle}
                                </small>
                            </div>
                        </div>

                        <div className="meta">
                            <p><span className="meta-label">Cliente:</span> <span className="meta-value">{cliente.nombre}</span></p>
                            <p><span className="meta-label">ID Cliente:</span> <span className="meta-value">#{cliente.id}</span></p>
                            {cliente.cedula && <p><span className="meta-label">Cédula / RUC:</span> <span className="meta-value">{cliente.cedula}</span></p>}
                            <p><span className="meta-label">Teléfono:</span> <span className="meta-value">{cliente.telefono || 'N/A'}</span></p>
                            <p><span className="meta-label">Fecha de Emisión:</span> <span className="meta-value">{new Date().toLocaleString('es-NI')}</span></p>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Referencia / Descripción</th>
                                    <th className="right">Cargo (Crédito)</th>
                                    <th className="right">Abono (Pago)</th>
                                    <th className="right">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistorial.map((tx, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr>
                                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(tx.fecha).toLocaleDateString('es-NI')}</td>
                                            <td style={{ fontSize: '0.82rem', fontWeight: 700 }}>{tx.descripcion}</td>
                                            <td className="right" style={{ color: '#dc2626', fontWeight: 700 }}>{tx.impacto > 0 ? `C$${fmt(tx.monto)}` : '—'}</td>
                                            <td className="right" style={{ color: '#059669', fontWeight: 700 }}>{tx.impacto < 0 ? `C$${fmt(tx.monto)}` : '—'}</td>
                                            <td className="right" style={{ fontWeight: 800 }}>C${fmt(tx.saldo)}</td>
                                        </tr>
                                        {showProducts && tx.productos && tx.productos.length > 0 && tx.productos.map((prod, pIdx) => (
                                            <tr key={`${idx}-p-${pIdx}`} style={{ background: '#f8fafc', fontSize: '0.76rem' }}>
                                                <td></td>
                                                <td colSpan="2" style={{ paddingLeft: '1.25rem', color: '#475569' }}>
                                                    ↳ {prod.cantidad}x {prod.nombre} {prod.codigo ? `(${prod.codigo})` : ''}
                                                </td>
                                                <td className="right" style={{ color: '#64748b' }}>@ C${fmt(prod.precioUnitario)}</td>
                                                <td className="right" style={{ color: '#334155', fontWeight: 700 }}>C${fmt(prod.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {filteredHistorial.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="center" style={{ padding: '20px', color: '#64748b' }}>
                                            No hay movimientos registrados en esta vista.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="summary">
                            <p><span>Total Créditos Históricos:</span> <span>C$ {fmt(totals.totalCreditos)}</span></p>
                            <p><span>Total Abonos Realizados:</span> <span style={{ color: '#059669' }}>- C$ {fmt(totals.totalAbonos)}</span></p>
                            <p><span>Límite de Crédito Autorizado:</span> <span>{cliente.limite_credito === null ? 'Sin Límite (∞)' : `C$ ${fmt(cliente.limite_credito)}`}</span></p>
                            <p className="total">
                                <span>SALDO PENDIENTE ACTUAL:</span>
                                <span>C$ {fmt(totals.saldoFinal)}</span>
                            </p>
                        </div>

                        <div className="footer">
                            Estado de cuenta informativo — {companyInfo.name}
                        </div>
                    </PrintWrapper>
                </div>

                <div style={{ padding: '1rem 1.5rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <FilterBtn onClick={onClose}>Cerrar</FilterBtn>
                    <FilterBtn $active $color="#1e293b" onClick={() => doPrint('80')}>
                        <FaPrint /> Imprimir Ticket (80mm)
                    </FilterBtn>
                    <FilterBtn $active $color="#2563eb" onClick={() => doPrint('A4')}>
                        <FaPrint /> Imprimir Hoja Carta (A4)
                    </FilterBtn>
                </div>
            </ModalCard>
        </Overlay>
    );
};

export default StatementModal;
