// RUTA: src/pages/pos/components/SaleDetailView.jsx

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaUser, FaRegClock, FaDollarSign, FaCreditCard, FaPrint, FaTrashAlt, FaUndo, FaInfoCircle } from 'react-icons/fa';
import { Button as OriginalButton, InfoBox } from '../POS.styles.jsx';

// ===================== Styled Components (Sin cambios) =====================
const DetailWrapper = styled.div`
  border-left: 1px solid #e9ecef; padding-left: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem;
`;
const DetailSection = styled.div`
  background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.2rem;
  h4 { margin-top: 0; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; color: #495057; }
`;
const ProductTable = styled.table`
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
  th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #f1f1f1; }
  th { font-weight: 600; color: #6c757d; }
  td:nth-child(3), td:nth-child(4) { text-align: right; }
`;
const TotalsRow = styled.div`
  display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.95rem; font-weight: ${props => props.$bold ? '600' : 'normal'};
  border-top: ${props => props.$bordered ? '1px dashed #ccc' : 'none'}; color: ${props => props.color || 'inherit'};
  span:first-child { color: #6c757d; }
`;
const ActionsContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;
`;
const StatusBadge = styled.span`
  font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; color: white; background-color: ${props => props.color};
`;

// ===================== Componente de Vista de Detalle (Final) =====================
const SaleDetailView = ({
  sale, client, creditStatus, dailySales, isAdmin, onOpenAbonoModal,
  onCancelSale, onReturnItem, onReprintTicket, showConfirmation, showPrompt, showAlert
}) => {
  const canModifySale = useMemo(() => {
    if (!sale || !isAdmin || sale.estado !== 'COMPLETADA') return false;
    if (sale.pagoDetalles?.credito > 0) {
      const saleDate = new Date(sale.fecha);
      const hasSubsequentPayments = dailySales.some(tx => (tx.clientId === sale.clientId || tx.idCliente === sale.idCliente) && tx.estado === 'ABONO_CREDITO' && new Date(tx.fecha) > saleDate);
      return !hasSubsequentPayments;
    }
    return true;
  }, [sale, isAdmin, dailySales]);

  if (!sale) {
    return (
      <DetailWrapper style={{ justifyContent: 'center', alignItems: 'center' }}>
        <InfoBox><FaInfoCircle /> Seleccione una transacción de la lista para ver sus detalles.</InfoBox>
      </DetailWrapper>
    );
  }

  const statusInfo = {
    COMPLETADA: { text: 'COMPLETADA', color: '#28a745' },
    CANCELADA: { text: 'CANCELADA', color: '#dc3545' },
    DEVOLUCION: { text: 'DEVOLUCIÓN', color: '#ffc107' },
    ABONO_CREDITO: { text: 'ABONO A CRÉDITO', color: '#17a2b8' }
  };
  const currentStatus = statusInfo[sale.estado] || { text: sale.estado, color: '#6c757d' };
  const isSale = sale.estado === 'COMPLETADA';

  const handleReturnClick = (item) => { /* ... (sin cambios) ... */ };
  const handleCancelClick = () => { /* ... (sin cambios) ... */ };

  return (
    <DetailWrapper>
      <h3>Detalle de Transacción #{sale.id}</h3>

      {/* --- MEJORA VISUAL #1: El Estado de Cuenta ahora es el protagonista y SIEMPRE se muestra si hay un cliente. --- */}
      {client && creditStatus && (
        <InfoBox $type="info" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Estado de Cuenta: {client.nombre}</span>
            <OriginalButton $primary onClick={onOpenAbonoModal} disabled={creditStatus.currentBalance <= 0}>
              <FaDollarSign /> Registrar Abono
            </OriginalButton>
          </div>
          <TotalsRow $bold color={creditStatus.currentBalance > 0 ? '#dc3545' : '#28a745'}>
            <span>SALDO PENDIENTE TOTAL:</span>
            <span>C${creditStatus.currentBalance.toFixed(2)}</span>
          </TotalsRow>
        </InfoBox>
      )}

      {/* Detalles generales de la transacción seleccionada */}
      <DetailSection>
        <p><strong><FaUser /> Cliente:</strong> {client?.nombre || 'Cliente Genérico'}</p>
        <p><strong><FaRegClock /> Fecha:</strong> {new Date(sale.fecha).toLocaleString('es-NI')}</p>
        <p><strong>Estado:</strong> <StatusBadge color={currentStatus.color}>{currentStatus.text}</StatusBadge></p>
      </DetailSection>

      {/* --- MEJORA VISUAL #2: Los detalles de la venta (productos, pagos) solo se muestran si es una VENTA, no un abono. --- */}
      {isSale && (
        <>
          {Array.isArray(sale.items) && sale.items.length > 0 && (
            <DetailSection>
              <h4>Productos</h4>
              <ProductTable>
                <thead>
                  <tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th><th></th></tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => (
                    <tr key={item.id_producto || index}>
                      <td>{item.nombre}</td>
                      <td>{item.quantity}</td>
                      <td>C${Number(item.precio).toFixed(2)}</td>
                      <td>C${(item.quantity * item.precio).toFixed(2)}</td>
                      <td>
                        {canModifySale && (
                          <OriginalButton $warning $small onClick={() => handleReturnClick(item)}>
                            <FaUndo />
                          </OriginalButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ProductTable>
            </DetailSection>
          )}

          <DetailSection>
            <h4>Resumen Financiero de esta Venta</h4>
            {sale.subtotal !== undefined && <TotalsRow><span>Subtotal:</span><span>C${Number(sale.subtotal).toFixed(2)}</span></TotalsRow>}
            {sale.descuento > 0 && <TotalsRow><span>Descuento:</span><span style={{color: '#28a745'}}>- C${Number(sale.descuento).toFixed(2)}</span></TotalsRow>}
            <TotalsRow $bold $bordered><span>Total Transacción:</span><span>C${Math.abs(Number(sale.totalVenta)).toFixed(2)}</span></TotalsRow>
            
            {sale.pagoDetalles && (
              <div style={{marginTop: '1rem'}}>
                <h5 style={{marginBottom: '0.5rem', fontSize: '1rem'}}>Detalle del Pago:</h5>
                {sale.pagoDetalles.efectivo > 0 && <TotalsRow><span><FaDollarSign /> Efectivo Recibido:</span><span>C${Number(sale.pagoDetalles.efectivo).toFixed(2)}</span></TotalsRow>}
                {sale.pagoDetalles.tarjeta > 0 && <TotalsRow><span><FaCreditCard /> Tarjeta:</span><span>C${Number(sale.pagoDetalles.tarjeta).toFixed(2)}</span></TotalsRow>}
                {sale.pagoDetalles.credito > 0 && <TotalsRow><span><FaUser /> Crédito Otorgado:</span><span style={{color: '#dc3545'}}>C${Number(sale.pagoDetalles.credito).toFixed(2)}</span></TotalsRow>}
                {sale.pagoDetalles.vuelto > 0 && <TotalsRow><span>Vuelto Entregado:</span><span>- C${Number(sale.pagoDetalles.vuelto).toFixed(2)}</span></TotalsRow>}
              </div>
            )}
          </DetailSection>
        </>
      )}

      {/* Las acciones se muestran si la transacción no está cancelada */}
      {isAdmin && sale.estado !== 'CANCELADA' && (
        <DetailSection>
          <h4>Acciones</h4>
          <ActionsContainer>
            <OriginalButton onClick={onReprintTicket}><FaPrint /> Reimprimir Ticket</OriginalButton>
            {canModifySale && (
              <OriginalButton $cancel onClick={handleCancelClick}>
                <FaTrashAlt /> Cancelar Venta
              </OriginalButton>
            )}
          </ActionsContainer>
        </DetailSection>
      )}
    </DetailWrapper>
  );
};

export default React.memo(SaleDetailView);