// features/pos/components/CartPanelView.jsx
import React, { useMemo } from 'react';
import {
  FaShoppingCart, FaPlus, FaTrashAlt, FaTimes, FaPercentage,
  FaDollarSign, FaEdit, FaRedo, FaTags
} from 'react-icons/fa';
import * as S from '../POS.styles.jsx'; // Ruta corregida

export default function CartPanelView({
  currentUser,
  isAdmin,
  cajaSession,
  tasaDolar,
  orders,
  activeOrderId,
  onSetActiveOrder,
  onNewOrder,
  onRemoveOrder,
  onRenameOrder,
  products,
  cart,
  onUpdateQty,
  onRemoveFromCart,
  onSetManualPrice,
  onApplyWholesalePrice,
  onRevertRetailPrice,
  discountAmount,
  subtotal,
  total,
  onApplyOrderDiscount,
  onOpenProforma,
  onOpenPayment
}) {
  const activeOrder = useMemo(
    () => orders.find(o => o.id === activeOrderId) || { name: 'Ticket', items: [] },
    [orders, activeOrderId]
  );

  return (
    <S.CartPanel style={{ width: '100%', minWidth: '400px', maxWidth: '100%' }}>
      <div className="cart-fixed-top">
        {/* Info caja - Diseño limpio */}
        <S.InfoBox $pulsate className="caja-pill" style={{ marginBottom: '1rem', padding: '0.8rem', backgroundColor: '#e9f7ff', border: '1px solid #007bff' }}>
          <p style={{ margin: 0, fontWeight: '700', color: '#007bff' }}>
            CAJA: <strong>{currentUser?.nombre_usuario}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Fondo: <span style={{ fontWeight: 'bold' }}>
              C${Number(cajaSession?.initialAmount || 0).toFixed(2)}
            </span>
          </p>
        </S.InfoBox>

        {/* Tickets Activos - Barra de navegación limpia */}
        <div className="tickets-header" style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '.5rem', fontSize: '1.1rem', color: '#343a40' }}>
            Tickets Activos ({orders.length})
          </h3>

          <S.TicketContainer>
            {orders.map(order => (
              <S.Button
                key={order.id}
                style={{ 
                  backgroundColor: activeOrderId === order.id ? '#007bff' : '#6c757d', 
                  color: 'white',
                  transition: 'background-color 0.2s',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.9rem'
                }}
                onClick={() => onSetActiveOrder(order.id)}
                onDoubleClick={() => onRenameOrder(order.id, order.name)}
              >
                {/* FIX RESPONSIVO EN EL PADRE: Usar texto cortado */}
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.name}
                </span>
                ({order.items.length})
              </S.Button>
            ))}
            <S.Button primary onClick={onNewOrder} style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}>
              <FaPlus /> Nuevo
            </S.Button>
          </S.TicketContainer>

          {orders.length > 1 && (
            <div style={{ marginTop: 10 }}>
              <S.Button $cancel style={{ width: '100%' }} onClick={() => onRemoveOrder(activeOrderId)}>
                <FaTrashAlt /> Cerrar Ticket
              </S.Button>
            </div>
          )}
        </div>

        {/* Encabezado carrito */}
        <h2 className="cart-title" style={{ color: '#007bff', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          {activeOrder.name} <FaShoppingCart />
        </h2>
      </div>

      {/* Lista carrito (scrollable) */}
      <div className="cart-scroll" style={{ flexGrow: 1, overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <p className="cart-empty">El ticket está vacío.</p>
        ) : cart.map(item => {
          const productData = products.find(p => p.id === item.id);
          const basePrice = productData?.precio || 0;
          const hasWholesalePrice = (productData?.raw?.mayoreo || 0) > 0;
          const isPriceModified = (item.precio_venta || basePrice) !== basePrice;

          return (
            <S.CartItemWrapper key={item.id} style={{ borderBottom: '1px solid #f0f2f5', padding: '10px 0' }}>
              <div className="item-info">
                <p className="item-name" style={{ fontWeight: '700', color: '#343a40' }}>
                    {item.nombre}
                </p>
                <div className="item-details">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    max={item.existencia}
                    onChange={(e) => onUpdateQty(item.id, e.target.value)}
                    style={{ minHeight: '30px', padding: '4px', width: '55px' }}
                  />
                  <small style={{ color: '#6c757d' }}>x C${Number(item.precio_venta || item.precio || 0).toFixed(2)}</small>

                  {isAdmin && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                      <S.ActionButton title="Precio Manual" onClick={() => onSetManualPrice(item)}><FaEdit /></S.ActionButton>
                      {hasWholesalePrice && (
                        <S.ActionButton info title="Aplicar Mayoreo" onClick={() => onApplyWholesalePrice(item)}>
                          <FaTags />
                        </S.ActionButton>
                      )}
                      {isPriceModified && (
                        <S.ActionButton dark title="Revertir a Precio Normal" onClick={() => onRevertRetailPrice(item)}>
                          <FaRedo />
                        </S.ActionButton>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="item-price" style={{ color: '#dc3545', fontWeight: '800', fontSize: '1.2rem' }}>
                C${(Number(item.precio_venta || item.precio || 0) * Number(item.quantity || 0)).toFixed(2)}
              </p>
              <S.Button $cancel style={{ padding: '0.4rem', minWidth: '30px', height: '30px', marginLeft: '1rem', borderRadius: '50%' }} onClick={() => onRemoveFromCart(item.id)}>
                <FaTimes />
              </S.Button>
            </S.CartItemWrapper>
          );
        })}
      </div>

      <div className="cart-fixed-bottom">
        {/* Totales */}
        <div style={{ padding: '0.5rem 0', borderTop: '1px solid #ddd' }}>
          <S.TotalsRow style={{ fontSize: '1rem' }}><span>Subtotal:</span><span>C${subtotal.toFixed(2)}</span></S.TotalsRow>
          <S.TotalsRow
            onClick={onApplyOrderDiscount}
            style={{ cursor: 'pointer', color: discountAmount > 0 ? '#dc3545' : 'inherit', fontSize: '1rem' }}
          >
            <span><FaPercentage /> Descuento Total:</span>
            <span>- C${discountAmount.toFixed(2)}</span>
          </S.TotalsRow>
          <S.TotalsRow $bordered $bold className="grand-total" style={{ borderTop: '2px solid #343a40', paddingTop: '10px' }}>
            <span>TOTAL:</span><span>C${total.toFixed(2)}</span>
          </S.TotalsRow>
        </div>

        {/* Tasa y Acciones */}
        <S.InfoBox style={{ backgroundColor: '#f0f2f5', padding: '.5rem', borderRadius: 8, fontSize: '0.9rem' }}>
          <FaDollarSign style={{ marginRight: 5 }} /> Tasa Dólar: <strong>C${Number(tasaDolar).toFixed(2)}</strong>
        </S.InfoBox>

        <div className="cart-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
          <S.Button info onClick={onOpenProforma} disabled={cart.length === 0} style={{ padding: '0.8rem' }}>Crear Proforma</S.Button>
          <S.Button pay onClick={onOpenPayment} disabled={cart.length === 0} style={{ padding: '0.8rem', fontWeight: 'bold' }}>Proceder al Pago (F2)</S.Button>
        </div>
      </div>
    </S.CartPanel>
  );
}