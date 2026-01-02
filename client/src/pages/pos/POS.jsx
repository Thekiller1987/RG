import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaTrashAlt, FaLock,
  FaSync, FaKeyboard, FaTimes, FaClipboardList
} from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

import * as S from './POS.styles.jsx';
import * as api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { useCaja } from '../../context/CajaContext';
import { useOrders } from '../../context/OrdersContext';

import ProductPanel from './components/ProductPanel.jsx';
import CajaModal from './components/CajaModal.jsx';
import PaymentModal from './components/PaymentModal.jsx';

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const POS = () => {
  // Contextos
  const { user, products: initialProducts, token, refreshProducts } = useAuth();
  const { isCajaOpen, setIsCajaOpen, tasaDolar } = useCaja();
  const {
    orders, activeOrderId, setActiveOrderId, activeOrder,
    handleNewOrder, handleRemoveOrder, updateActiveOrder, loadOrdersFromDB,
    loadPendingOrdersFromServer
  } = useOrders();

  const userId = user?.id_usuario || user?.id;
  const currentUser = user;

  // Estados Locales
  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [modal, setModal] = useState({ name: null, data: null });
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  const searchRef = useRef(null);

  // Cálculos del Carrito Activo
  const cart = activeOrder?.items || [];
  const subtotal = cart.reduce((s, i) => s + (i.precio_venta * i.quantity), 0);
  const discountAmount = activeOrder?.discount?.type === 'percentage'
    ? (subtotal * activeOrder.discount.value / 100)
    : (activeOrder?.discount?.value || 0);
  const total = subtotal - discountAmount;

  /* -----------------------------------------------------------------
   * EFECTOS E INICIALIZACIÓN
   * ----------------------------------------------------------------- */
  useEffect(() => {
    if (initialProducts) setProductsState(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (userId) loadOrdersFromDB(userId);
  }, [userId, loadOrdersFromDB]);

  /* -----------------------------------------------------------------
   * ACCIONES Y MANEJADORES
   * ----------------------------------------------------------------- */
  const showAlert = ({ title, message }) => setAlert({ isOpen: true, title, message });
  const closeAlert = () => setAlert({ isOpen: false });
  const openModal = (name, data = null) => setModal({ name, data });
  const closeModal = () => setModal({ name: null, data: null });

  const refreshData = async () => {
    try {
      await refreshProducts();
      if (userId) await loadOrdersFromDB(userId);
    } catch (e) { console.error("Error refreshing data", e); }
  };

  const updateActiveCart = (newCart) => updateActiveOrder('items', newCart);

  const handleAddToCart = (product, quantity = 1) => {
    if (window.innerWidth <= 960) setIsMobileCartOpen(true);
    const pid = product.id_producto || product.id;
    const existing = cart.find(i => (i.id_producto || i.id) === pid);
    const newQty = (existing?.quantity || 0) + quantity;

    if (newQty > product.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `Solo hay ${product.existencia} unidades disponibles.` });
      return;
    }

    const price = existing?.precio_venta || product.venta || product.precio || 0;
    const newItem = { ...product, id: pid, id_producto: pid, quantity: newQty, precio_venta: price };

    const newCart = existing
      ? cart.map(i => (i.id_producto || i.id) === pid ? newItem : i)
      : [...cart, newItem];

    updateActiveCart(newCart);
  };

  const handleUpdateCartQuantity = (id, qty) => {
    const pid = id;
    const pRef = products.find(p => (p.id_producto || p.id) === pid) || cart.find(c => (c.id_producto || c.id) === pid);
    if (!pRef) return;

    let q = parseInt(qty, 10) || 0;
    if (q <= 0) {
      updateActiveCart(cart.filter(i => (i.id_producto || i.id) !== pid));
      return;
    }
    if (q > (pRef.existencia || 9999)) {
      q = pRef.existencia;
      showAlert({ title: "Stock", message: "Cantidad máxima alcanzada según inventario." });
    }
    updateActiveCart(cart.map(i => (i.id_producto || i.id) === pid ? { ...i, quantity: q } : i));
  };

  const handleFinishSale = async (pagoDetalles) => {
    const orderToCloseId = activeOrderId;
    const currentOrder = orders.find(o => o.id === orderToCloseId);

    if (cart.length === 0) {
      showAlert({ title: "Carrito Vacío", message: "No hay productos para facturar." });
      return false;
    }

    const payloadItems = cart.map(i => ({
      id_producto: i.id_producto || i.id,
      quantity: i.quantity,
      precio: i.precio_venta,
      nombre: i.nombre,
      codigo: i.codigo,
      costo: i.costo || 0
    }));

    const saleData = {
      totalVenta: total,
      subtotal,
      descuento: discountAmount,
      items: payloadItems,
      pagoDetalles,
      userId,
      clientId: Number(pagoDetalles.clienteId || 0),
      tasaDolarAlMomento: tasaDolar,
      originalOrderId: currentOrder?.serverSaleId || null
    };

    try {
      await api.createSale(saleData, token);
      handleRemoveOrder(orderToCloseId);
      await refreshData();
      showAlert({ title: "¡Éxito!", message: "La venta se ha registrado correctamente." });
      return true;
    } catch (err) {
      showAlert({ title: "Error en Venta", message: err.message });
      return false;
    }
  };

  /* -----------------------------------------------------------------
   * VISTA DE CAJA CERRADA
   * ----------------------------------------------------------------- */
  if (!isCajaOpen) {
    return (
      <S.PageWrapper style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <FaLock size={50} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
        <h1 style={{ color: '#64748b', margin: '0 0 0.5rem 0' }}>Caja Cerrada</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Debes realizar la apertura de caja para procesar ventas.</p>
        <S.Button primary onClick={() => openModal('caja')}><FaKeyboard /> Abrir Caja (F9)</S.Button>
        {modal.name === 'caja' && (
          <CajaModal isOpen={true} onClose={closeModal} onOpenCaja={() => setIsCajaOpen(true)} />
        )}
      </S.PageWrapper>
    );
  }

  /* -----------------------------------------------------------------
   * RENDER PRINCIPAL POS
   * ----------------------------------------------------------------- */
  return (
    <S.PageWrapper>
      <S.HeaderActions>
        <S.BackButton to="/dashboard"><FaArrowLeft /> Regresar</S.BackButton>
        <div style={{ fontWeight: '800', letterSpacing: '1px' }}>SISTEMA POS</div>
        <div className="right-actions">
          <S.Button secondary onClick={refreshData} title="Sincronizar"><FaSync /></S.Button>
          <S.Button secondary onClick={() => openModal('caja')}><FaLock /> {currentUser?.nombre_usuario || 'Usuario'}</S.Button>
          <S.Button secondary onClick={loadPendingOrdersFromServer} title="Cargar Pedidos Pendientes"><FaClipboardList /></S.Button>
        </div>
      </S.HeaderActions>

      <S.PageContentWrapper>
        {/* PANEL IZQUIERDO: PRODUCTOS */}
        <S.MainPanel>
          <ProductPanel
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            onProductClick={(p) => handleAddToCart(p, 1)}
            cartItems={cart}
            inputRef={searchRef}
          />
        </S.MainPanel>

        {/* PANEL DERECHO: CARRITO / TICKETS */}
        <S.CartPanel isOpen={isMobileCartOpen}>
          <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaShoppingCart color="#2563eb" /> Carrito
              </h3>
              {window.innerWidth <= 960 && <S.Button onClick={() => setIsMobileCartOpen(false)}><FaTimes /></S.Button>}
            </div>

            {/* Gestión de Multi-Tickets */}
            <S.TicketContainer>
              {orders.map(o => (
                <S.Button
                  key={o.id}
                  primary={o.id === activeOrderId}
                  secondary={o.id !== activeOrderId}
                  onClick={() => setActiveOrderId(o.id)}
                  style={{ fontSize: '0.75rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  {o.name}
                  <span
                    style={{ marginLeft: 5, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); handleRemoveOrder(o.id); }}
                  >
                    ×
                  </span>
                </S.Button>
              ))}
              <S.Button secondary onClick={handleNewOrder} title="Nuevo Ticket"><FaPlus /></S.Button>
            </S.TicketContainer>

            {/* Lista de Items en Carrito */}
            <div style={{ flex: 1, overflowY: 'auto', margin: '1rem 0', paddingRight: '5px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>Selecciona productos para vender</div>
              ) : (
                cart.map(item => (
                  <S.CartItemWrapper key={item.id_producto || item.id}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{item.nombre}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>C$ {fmt(item.precio_venta)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <S.QtyControl>
                        <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id_producto || item.id, item.quantity - 1)}><FaMinus size={8} /></S.RoundBtn>
                        <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id_producto || item.id, item.quantity + 1)}><FaPlus size={8} /></S.RoundBtn>
                      </S.QtyControl>
                      <S.RoundBtn onClick={() => updateActiveCart(cart.filter(x => (x.id_producto || x.id) !== (item.id_producto || item.id)))} style={{ color: '#ef4444' }}><FaTrashAlt size={12} /></S.RoundBtn>
                    </div>
                  </S.CartItemWrapper>
                ))
              )}
            </div>

            {/* Totales y Botón Cobrar */}
            <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '1rem' }}>
              <S.TotalsRow><span>Subtotal</span><span>C$ {fmt(subtotal)}</span></S.TotalsRow>
              <S.TotalsRow style={{ color: '#ef4444' }}><span>Descuento</span><span>- C$ {fmt(discountAmount)}</span></S.TotalsRow>
              <S.TotalsRow className="grand-total" style={{ fontSize: '1.4rem', marginTop: '5px' }}>
                <span>TOTAL</span><span>C$ {fmt(total)}</span>
              </S.TotalsRow>
              <S.Button
                primary
                style={{ width: '100%', marginTop: '1rem', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}
                onClick={() => openModal('payment', { total })}
                disabled={cart.length === 0}
              >
                $ COBRAR (F2)
              </S.Button>
            </div>
          </div>
        </S.CartPanel>
      </S.PageContentWrapper>

      {/* Modales y Alertas */}
      <AnimatePresence>
        {alert.isOpen && (
          <S.ModalOverlay onClick={closeAlert}>
            <S.ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>{alert.title}</h2>
              <p style={{ color: '#475569' }}>{alert.message}</p>
              <S.Button primary onClick={closeAlert} style={{ width: '100%', marginTop: '1rem' }}>Entendido</S.Button>
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {modal.name === 'payment' && (
          <PaymentModal
            isOpen={true}
            onClose={closeModal}
            total={modal.data.total}
            onFinish={handleFinishSale}
            tasaDolar={tasaDolar}
          />
        )}

        {modal.name === 'caja' && (
          <CajaModal
            isOpen={true}
            onClose={closeModal}
            isCajaOpen={isCajaOpen}
            onOpenCaja={() => setIsCajaOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Botón flotante para móviles */}
      <S.MobileCartToggle onClick={() => setIsMobileCartOpen(true)}>
        <span>🛒 Carrito ({cart.length})</span>
        <span style={{ fontWeight: 'bold' }}>C$ {fmt(total)}</span>
      </S.MobileCartToggle>
    </S.PageWrapper>
  );
};

export default POS;