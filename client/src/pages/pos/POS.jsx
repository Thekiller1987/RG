// client/src/pages/pos/POS.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef, useDeferredValue } from 'react';
import {
  FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaTrashAlt, FaLock,
  FaHistory, FaEdit, FaSync, FaSearch, FaBarcode, FaFont, FaKeyboard,
  FaDollarSign, FaTimes, FaClipboardList
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import * as S from './POS.styles.jsx';
import * as api from '../../service/api';
import { useAuth } from '../../context/AuthContext';
import { useCaja } from '../../context/CajaContext';
import { useOrders } from '../../context/OrdersContext';

import ProductPanel from './components/ProductPanel.jsx';
import CajaModal from './components/CajaModal.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import SalesHistoryModal from './components/SalesHistoryModal.jsx';

import {
  saveCajaSession,
  fetchCajaSessionFromServer,
  subscribeCajaChanges,
  addCajaTransaction
} from '../../service/storage';

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const POS = () => {
  const { user, products: initialProducts, token, refreshProducts } = useAuth();
  const { isCajaOpen, setIsCajaOpen, setCajaSession, tasaDolar, setTasaDolar } = useCaja();
  const {
    orders, setOrders, activeOrderId, setActiveOrderId, activeOrder,
    handleNewOrder, handleRemoveOrder, updateActiveOrder, loadOrdersFromDB,
    loadPendingOrdersFromServer
  } = useOrders();

  const userId = user?.id_usuario || user?.id;
  const currentUser = user;

  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [modal, setModal] = useState({ name: null, data: null });
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  const searchRef = useRef(null);

  const cart = activeOrder.items || [];
  const subtotal = cart.reduce((s, i) => s + (i.precio_venta * i.quantity), 0);
  const discountAmount = activeOrder.discount?.type === 'percentage'
    ? (subtotal * activeOrder.discount.value / 100)
    : (activeOrder.discount?.value || 0);
  const total = subtotal - discountAmount;

  /* -----------------------------------------------------------------
   * LÓGICA INICIAL
   * ----------------------------------------------------------------- */
  useEffect(() => {
    if (initialProducts) setProductsState(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (userId) loadOrdersFromDB(userId);
  }, [userId, loadOrdersFromDB]);

  /* -----------------------------------------------------------------
   * ACCIONES
   * ----------------------------------------------------------------- */
  const showAlert = ({ title, message }) => setAlert({ isOpen: true, title, message });
  const closeAlert = () => setAlert({ isOpen: false });
  const openModal = (name, data = null) => setModal({ name, data });
  const closeModal = () => setModal({ name: null, data: null });

  const refreshData = async () => {
    try { await refreshProducts(); await loadOrdersFromDB(userId); } catch (e) { }
  };

  const updateActiveCart = (newCart) => updateActiveOrder('items', newCart);

  const handleAddToCart = (product, quantity = 1) => {
    if (window.innerWidth <= 960) setIsMobileCartOpen(true);
    const pid = product.id_producto || product.id;
    const existing = cart.find(i => (i.id_producto || i.id) === pid);
    const newQty = (existing?.quantity || 0) + quantity;

    if (newQty > product.existencia) {
      showAlert({ title: "Stock", message: `Solo hay ${product.existencia} disponibles.` });
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
      showAlert({ title: "Stock", message: "Cantidad máxima alcanzada" });
    }
    updateActiveCart(cart.map(i => (i.id_producto || i.id) === pid ? { ...i, quantity: q } : i));
  };

  const handleFinishSale = async (pagoDetalles) => {
    const orderToCloseId = activeOrderId;
    const currentOrder = orders.find(o => o.id === orderToCloseId);
    if (cart.length === 0) { showAlert({ title: "Vacío", message: "El carrito está vacío." }); return false; }

    const payloadItems = cart.map(i => ({
      id_producto: i.id_producto || i.id,
      quantity: i.quantity, precio: i.precio_venta,
      nombre: i.nombre, codigo: i.codigo, costo: i.costo
    }));

    const saleData = {
      totalVenta: total, subtotal, descuento: discountAmount, items: payloadItems,
      pagoDetalles, userId, clientId: Number(pagoDetalles.clienteId || 0),
      tasaDolarAlMomento: tasaDolar, originalOrderId: currentOrder.serverSaleId
    };

    try {
      const resp = await api.createSale(saleData, token);
      handleRemoveOrder(orderToCloseId);
      await refreshData();
      showAlert({ title: "Exito", message: "Venta registrada." });
      return true;
    } catch (err) {
      showAlert({ title: "Error", message: err.message });
      return false;
    }
  };

  /* -----------------------------------------------------------------
   * RENDER
   * ----------------------------------------------------------------- */
  if (!isCajaOpen) {
    return (
      <S.PageWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#64748b' }}>Caja Cerrada</h1>
        <p>Abre la caja para vender.</p>
        <S.Button primary onClick={() => openModal('caja')}><FaKeyboard /> Abrir Caja (F9)</S.Button>
        {modal.name === 'caja' && <CajaModal isOpen={true} onClose={closeModal} onOpenCaja={() => setIsCajaOpen(true)} />}
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.HeaderActions>
        <S.BackButton to="/dashboard"><FaArrowLeft /> Regresar</S.BackButton>
        <div style={{ fontWeight: '800' }}>PUNTO DE VENTA</div>
        <div className="right-actions">
          <S.Button secondary onClick={refreshData}><FaSync /></S.Button>
          <S.Button secondary onClick={() => openModal('caja')}><FaLock /> {currentUser?.nombre_usuario}</S.Button>
          <S.Button secondary onClick={loadPendingOrdersFromServer} title="Cargar Pedidos"><FaClipboardList /></S.Button>
        </div>
      </S.HeaderActions>

      <S.PageContentWrapper>
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

        <S.CartPanel isOpen={isMobileCartOpen}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}><FaShoppingCart color="#2563eb" /> Carrito</h3>
              {window.innerWidth <= 960 && <S.Button onClick={() => setIsMobileCartOpen(false)}><FaTimes /></S.Button>}
            </div>

            <S.TicketContainer>
              {orders.map(o => (
                <S.Button
                  key={o.id} primary={o.id === activeOrderId} secondary={o.id !== activeOrderId}
                  onClick={() => setActiveOrderId(o.id)} style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                >
                  {o.name}
                  <span style={{ marginLeft: 5, opacity: 0.5 }} onClick={(e) => { e.stopPropagation(); handleRemoveOrder(o.id); }}>×</span>
                </S.Button>
              ))}
              <S.Button secondary onClick={handleNewOrder}><FaPlus /></S.Button>
            </S.TicketContainer>

            <div style={{ flex: 1, overflowY: 'auto', margin: '1rem 0' }}>
              {cart.map(item => (
                <S.CartItemWrapper key={item.id_producto || item.id}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>C$ {fmt(item.precio_venta)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <S.QtyControl>
                      <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id_producto || item.id, item.quantity - 1)}><FaMinus size={8} /></S.RoundBtn>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id_producto || item.id, item.quantity + 1)}><FaPlus size={8} /></S.RoundBtn>
                    </S.QtyControl>
                    <S.RoundBtn onClick={() => updateActiveCart(cart.filter(x => (x.id_producto || x.id) !== (item.id_producto || item.id)))} style={{ color: '#ef4444' }}><FaTrashAlt size={12} /></S.RoundBtn>
                  </div>
                </S.CartItemWrapper>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <S.TotalsRow><span>Subtotal</span><span>C$ {fmt(subtotal)}</span></S.TotalsRow>
              <S.TotalsRow className="grand-total"><span>TOTAL</span><span>C$ {fmt(total)}</span></S.TotalsRow>
              <S.Button
                primary style={{ width: '100%', marginTop: '1rem', padding: '16px', fontSize: '1.1rem' }}
                onClick={() => openModal('payment', { total })}
                disabled={cart.length === 0}
              >
                $ COBRAR (F2)
              </S.Button>
            </div>
          </div>
        </S.CartPanel>
      </S.PageContentWrapper>

      <AnimatePresence>
        {alert.isOpen && (
          <S.ModalOverlay onClick={closeAlert}>
            <S.ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
              <h2>{alert.title}</h2><p>{alert.message}</p>
              <S.Button primary onClick={closeAlert} style={{ width: '100%' }}>Aceptar</S.Button>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
        {modal.name === 'payment' && (
          <PaymentModal
            isOpen={true} onClose={closeModal} total={modal.data.total}
            onFinish={handleFinishSale} tasaDolar={tasaDolar}
          />
        )}
        {modal.name === 'caja' && (
          <CajaModal
            isOpen={true} onClose={closeModal} isCajaOpen={isCajaOpen}
            onOpenCaja={() => setIsCajaOpen(true)}
          />
        )}
      </AnimatePresence>
      <S.MobileCartToggle onClick={() => setIsMobileCartOpen(true)}>
        <span>🛒 Ver Carrito ({cart.length})</span>
        <span>C$ {fmt(total)}</span>
      </S.MobileCartToggle>
    </S.PageWrapper>
  );
};

export default POS;