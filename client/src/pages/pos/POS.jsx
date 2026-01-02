import React, { useState, useEffect, useRef } from 'react';
import {
  FaArrowLeft, FaShoppingCart, FaPlus, FaMinus, FaTrashAlt, FaLock,
  FaHistory, FaSync, FaKeyboard, FaTimes,
  FaFileInvoice, FaMoneyBillWave, FaArrowDown, FaArrowUp,
  FaPercentage, FaTag, FaEdit, FaPencilAlt
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
import SalesHistoryModal from './components/SalesHistoryModal.jsx';
import ProformaModal from './components/ProformaModal.jsx';
import PromptModal from './components/PromptModal.jsx';

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const POS = () => {
  // Contextos
  const { user, products: initialProducts, token, refreshProducts } = useAuth();
  const { isCajaOpen, setIsCajaOpen, cajaSession, setCajaSession, tasaDolar, setTasaDolar } = useCaja();
  const {
    orders, activeOrderId, setActiveOrderId, activeOrder,
    handleNewOrder, handleRemoveOrder, updateActiveOrder, loadOrdersFromDB
  } = useOrders();

  const userId = user?.id_usuario || user?.id;
  const currentUser = user;
  const isAdmin = user?.rol === 'admin';

  // Estados Locales
  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [modal, setModal] = useState({ name: null, data: null });
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });
  const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

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

  const showConfirmation = ({ title, message, onConfirm }) => {
    setConfirmation({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirmation = () => setConfirmation({ isOpen: false, title: '', message: '', onConfirm: null });

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

  // Handlers for cash entry/exit
  const handleCashEntry = () => {
    openModal('cashEntry');
  };

  const handleCashExit = () => {
    openModal('cashExit');
  };

  const processCashTransaction = async (type, amount, note) => {
    if (!amount || amount <= 0) {
      showAlert({ title: "Error", message: "Ingrese un monto válido" });
      return;
    }

    const transaction = {
      type,
      amount: parseFloat(amount),
      note,
      at: new Date().toISOString(),
      userId
    };

    // Update caja session with new transaction
    const updatedSession = {
      ...cajaSession,
      transactions: [...(cajaSession?.transactions || []), transaction]
    };

    setCajaSession(updatedSession);
    closeModal();
    showAlert({
      title: "Éxito",
      message: type === 'entrada' ? 'Entrada registrada' : 'Salida registrada'
    });
  };

  const renameTicket = (newName) => {
    if (newName && newName.trim()) {
      updateActiveOrder('name', newName.trim());
      closeModal();
      showAlert({ title: "Ticket Renombrado", message: `Nombre actualizado a: ${newName.trim()}` });
    }
  };



  // Handlers for Item Actions
  const handleUpdateItemPrice = (newItemPrice) => {
    const item = modal.data?.item;
    if (!item) return;

    const price = parseFloat(newItemPrice);
    const costo = item.costo || item.raw?.costo || 0;

    if (price < costo) {
      showAlert({ title: "Precio Inválido", message: `El precio C$${price.toFixed(2)} es menor al costo (C$${costo.toFixed(2)}).` });
      return;
    }

    const pid = item.id_producto || item.id;
    const newCart = cart.map(i => (i.id_producto || i.id) === pid ? { ...i, precio_venta: price } : i);
    updateActiveCart(newCart);
    closeModal();
  };

  const handleItemWholesale = (item) => {
    const pid = item.id_producto || item.id;
    const product = products.find(p => (p.id_producto || p.id) === pid) || item;
    const mayorista = Number(product.mayorista || product.mayoreo || 0);

    if (!mayorista) {
      showAlert({ title: "Aviso", message: "Este producto no tiene precio mayorista." });
      return;
    }

    // Toggle: if current price is equal to wholesale price (approx), switch back to retail
    const currentPrice = Number(item.precio_venta || 0);
    const isWholesale = Math.abs(currentPrice - mayorista) < 0.01;

    // Retail price fallback: product.venta, product.precio, or current item price if we are not wholesale
    const retailPrice = Number(product.venta || product.precio || (isWholesale ? item.originalPrice : item.precio_venta) || 0);

    const newPrice = isWholesale ? retailPrice : mayorista;

    const newCart = cart.map(i => (i.id_producto || i.id) === pid ? { ...i, precio_venta: newPrice } : i);
    updateActiveCart(newCart);
  };

  const handleItemDiscount = (val, type) => {
    const item = modal.data?.item;
    if (!item) return;

    const pid = item.id_producto || item.id;
    let newPrice = item.precio_venta;
    const value = parseFloat(val);

    if (isNaN(value) || value < 0) {
      showAlert({ title: "Valor Inválido", message: "Ingrese un valor de descuento válido." });
      return;
    }

    if (type === 'percentage') {
      newPrice = newPrice - (newPrice * (value / 100));
    } else {
      newPrice = newPrice - value;
    }

    // Cost check
    const costo = item.costo || item.raw?.costo || 0;
    if (newPrice < costo) {
      showAlert({ title: "Precio Inválido", message: `El descuento deja el precio (C$${newPrice.toFixed(2)}) por debajo del costo.` });
      return;
    }

    const newCart = cart.map(i => (i.id_producto || i.id) === pid ? { ...i, precio_venta: newPrice } : i);
    updateActiveCart(newCart);
    closeModal();
  };

  // Handler for global wholesale price toggle
  const toggleWholesalePrice = () => {
    const newCart = cart.map(item => {
      const product = products.find(p => (p.id_producto || p.id) === (item.id_producto || item.id));
      if (!product) return item;

      // Toggle between retail (venta) and wholesale (mayorista)
      const mayorista = Number(product.mayorista || product.mayoreo || 0);
      if (!mayorista) return item;

      const currentPrice = Number(item.precio_venta || 0);
      const isCurrentlyWholesale = Math.abs(currentPrice - mayorista) < 0.01;

      const retailPrice = Number(product.venta || product.precio || (isCurrentlyWholesale ? item.originalPrice : item.precio_venta) || 0);
      const newPrice = isCurrentlyWholesale ? retailPrice : mayorista;

      return { ...item, precio_venta: newPrice };
    });

    updateActiveCart(newCart);
    const firstProduct = products.find(p => cart[0] && ((p.id_producto || p.id) === (cart[0].id_producto || cart[0].id)));
    const isNowWholesale = newCart[0] && newCart[0].precio_venta === firstProduct?.mayorista;
    showAlert({
      title: "Precio Actualizado",
      message: isNowWholesale ? "Aplicado precio mayorista" : "Aplicado precio de venta"
    });
  };

  // Handler for discount
  const applyDiscount = (discountData) => {
    updateActiveOrder('discount', discountData);
    closeModal();
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
          <CajaModal
            isOpen={true}
            onClose={closeModal}
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={cajaSession}
            isAdmin={isAdmin}
            showAlert={showAlert}
            showConfirmation={showConfirmation}
            initialTasaDolar={tasaDolar}
            onOpenCaja={(montoInicial, tasa) => {
              const newSession = {
                openedAt: new Date().toISOString(),
                openedBy: { id: userId, name: currentUser?.nombre_usuario },
                initialAmount: montoInicial,
                tasaDolar: tasa,
                transactions: []
              };
              setCajaSession(newSession);
              setTasaDolar(tasa);
              setIsCajaOpen(true);
              closeModal();
            }}
            onCloseCaja={(montoCounted) => {
              const updatedSession = {
                ...cajaSession,
                closedAt: new Date().toISOString(),
                closedBy: { id: userId, name: currentUser?.nombre_usuario },
                closingAmount: montoCounted
              };
              setCajaSession(updatedSession);
              setIsCajaOpen(false);
              closeModal();
            }}
          />
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
          <S.Button secondary onClick={refreshData} title="Sincronizar">
            <FaSync />
          </S.Button>
          <S.Button secondary onClick={() => openModal('salesHistory')} title="Historial de Ventas">
            <FaHistory />
          </S.Button>
          <S.Button secondary onClick={() => openModal('cashEntry')} title="Entrada de Dinero">
            <FaArrowDown color="#10b981" />
          </S.Button>
          <S.Button secondary onClick={() => openModal('cashExit')} title="Salida de Dinero">
            <FaArrowUp color="#ef4444" />
          </S.Button>
          <S.Button secondary onClick={() => openModal('caja')}>
            <FaLock /> {currentUser?.nombre_usuario || 'Usuario'}
          </S.Button>
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
                  onDoubleClick={() => openModal('renameTicket')}
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

            {/* Action Buttons for Cart Management */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <S.Button
                secondary
                onClick={toggleWholesalePrice}
                title="Cambiar a Precio Mayorista"
                disabled={cart.length === 0}
                style={{ flex: 1, fontSize: '0.75rem', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
              >
                <FaTag size={12} /> Mayorista
              </S.Button>
              <S.Button
                secondary
                onClick={() => openModal('discount')}
                title="Aplicar Descuento"
                disabled={cart.length === 0}
                style={{ flex: 1, fontSize: '0.75rem', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
              >
                <FaPercentage size={12} /> Descuento
              </S.Button>
            </div>

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
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <S.RoundBtn title="Editar Precio" onClick={() => openModal('editPrice', { item })} style={{ width: 26, height: 26, background: '#f1f5f9', color: '#334155' }}>
                          <FaPencilAlt size={10} />
                        </S.RoundBtn>
                        <S.RoundBtn title="Precio Mayorista" onClick={() => handleItemWholesale(item)} style={{ width: 26, height: 26, background: '#f1f5f9', color: '#334155' }}>
                          <FaTag size={10} />
                        </S.RoundBtn>
                        <S.RoundBtn title="Descuento Item" onClick={() => openModal('itemDiscount', { item })} style={{ width: 26, height: 26, background: '#f1f5f9', color: '#334155' }}>
                          <FaPercentage size={10} />
                        </S.RoundBtn>
                      </div>
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

              {/* Botón de Proforma */}
              <S.Button
                secondary
                style={{ width: '100%', marginTop: '1rem', padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                onClick={() => openModal('proformaName')}
              >
                <FaFileInvoice /> Crear Proforma
              </S.Button>

              <S.Button
                primary
                style={{ width: '100%', marginTop: '12px', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}
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

        {confirmation.isOpen && (
          <S.ModalOverlay onClick={closeConfirmation}>
            <S.ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
              <h2 style={{ marginTop: 0 }}>{confirmation.title}</h2>
              <p style={{ color: '#475569' }}>{confirmation.message}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <S.Button onClick={closeConfirmation} style={{ flex: 1 }}>Cancelar</S.Button>
                <S.Button primary onClick={() => { confirmation.onConfirm?.(); closeConfirmation(); }} style={{ flex: 1 }}>Confirmar</S.Button>
              </div>
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
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={cajaSession}
            isAdmin={isAdmin}
            showAlert={showAlert}
            showConfirmation={showConfirmation}
            initialTasaDolar={tasaDolar}
            onOpenCaja={(montoInicial, tasa) => {
              const newSession = {
                openedAt: new Date().toISOString(),
                openedBy: { id: userId, name: currentUser?.nombre_usuario },
                initialAmount: montoInicial,
                tasaDolar: tasa,
                transactions: []
              };
              setCajaSession(newSession);
              setTasaDolar(tasa);
              setIsCajaOpen(true);
              closeModal();
            }}
            onCloseCaja={(montoCounted) => {
              const updatedSession = {
                ...cajaSession,
                closedAt: new Date().toISOString(),
                closedBy: { id: userId, name: currentUser?.nombre_usuario },
                closingAmount: montoCounted
              };
              setCajaSession(updatedSession);
              setIsCajaOpen(false);
              closeModal();
            }}
          />
        )}

        {modal.name === 'salesHistory' && (
          <SalesHistoryModal
            isOpen={true}
            onClose={closeModal}
            dailySales={[]}
            loadSales={async (date) => {
              try {
                // Correctly call fetchSales from api.js with (token, date)
                const data = await api.fetchSales(token, date);
                return data || [];
              } catch (error) {
                console.error('Error loading sales:', error);
                return [];
              }
            }}
            isAdmin={isAdmin}
            users={[user]}
            clients={[]}
            onReprintTicket={(sale) => {
              console.log('Reprint ticket:', sale);
              showAlert({ title: "Reimprimir", message: "Función de reimpresión no implementada" });
            }}
            onCancelSale={async (saleId) => {
              console.log('Cancel sale:', saleId);
              showAlert({ title: "Cancelar", message: "Función de cancelación no implementada" });
            }}
            onReturnItem={async (sale, item, qty) => {
              console.log('Return item:', sale, item, qty);
              showAlert({ title: "Devolver", message: "Función de devolución no implementada" });
            }}
            onAbonoSuccess={() => {
              console.log('Abono success');
            }}
          />
        )}

        {modal.name === 'proformaName' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Datos de Proforma"
            fields={[{ name: 'name', label: 'A nombre de:', type: 'text', placeholder: 'Nombre del Cliente (Opcional)' }]}
            onSubmit={(values) => {
              closeModal();
              setTimeout(() => openModal('proforma', { proformaFor: values.name }), 200);
            }}
            icon={<FaFileInvoice color="#0b72b9" />}
          />
        )}

        {modal.name === 'proforma' && (
          <ProformaModal
            isOpen={true}
            onClose={closeModal}
            cart={cart}
            total={total}
            subtotal={subtotal}
            discount={discountAmount}
            proformaFor={modal.data?.proformaFor}
            currentUser={currentUser}
          />
        )}

        {modal.name === 'cashEntry' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Entrada de Dinero"
            fields={[
              { name: 'amount', label: 'Monto (C$)', type: 'number', placeholder: '0.00' },
              { name: 'note', label: 'Motivo', type: 'text', placeholder: 'Descripción de la entrada' }
            ]}
            onSubmit={(values) => processCashTransaction('entrada', values.amount, values.note)}
            icon={<FaMoneyBillWave color="#10b981" />}
          />
        )}

        {modal.name === 'cashExit' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Salida de Dinero"
            fields={[
              { name: 'amount', label: 'Monto (C$)', type: 'number', placeholder: '0.00' },
              { name: 'note', label: 'Motivo', type: 'text', placeholder: 'Descripción de la salida' }
            ]}
            onSubmit={(values) => processCashTransaction('salida', values.amount, values.note)}
            icon={<FaMoneyBillWave color="#ef4444" />}
          />
        )}

        {modal.name === 'renameTicket' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Renombrar Ticket"
            fields={[
              { name: 'name', label: 'Nuevo Nombre', type: 'text', defaultValue: activeOrder?.name || 'Ticket' }
            ]}
            onSubmit={(values) => renameTicket(values.name)}
            icon={<FaEdit color="#2563eb" />}
          />
        )}

        {modal.name === 'editPrice' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Editar Precio"
            fields={[
              {
                name: 'price',
                label: `Nuevo Precio (C$) [Costo: C$${(modal.data?.item?.costo || 0).toFixed(2)}]`,
                type: 'number',
                defaultValue: modal.data?.item?.precio_venta
              }
            ]}
            onSubmit={(values) => handleUpdateItemPrice(values.price)}
            icon={<FaPencilAlt color="#f59e0b" />}
          />
        )}

        {modal.name === 'itemDiscount' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Descuento al Producto"
            fields={[
              {
                name: 'type', label: 'Tipo', type: 'select', options: [
                  { value: 'fixed', label: 'Monto Fijo (C$)' },
                  { value: 'percentage', label: 'Porcentaje (%)' }
                ], defaultValue: 'fixed'
              },
              { name: 'value', label: 'Valor', type: 'number', placeholder: '0.00' }
            ]}
            onSubmit={(values) => handleItemDiscount(values.value, values.type)}
            icon={<FaPercentage color="#2563eb" />}
          />
        )}

        {modal.name === 'discount' && (
          <PromptModal
            isOpen={true}
            onClose={closeModal}
            title="Aplicar Descuento"
            fields={[
              {
                name: 'type', label: 'Tipo', type: 'select', options: [
                  { value: 'fixed', label: 'Monto Fijo (C$)' },
                  { value: 'percentage', label: 'Porcentaje (%)' }
                ], defaultValue: 'fixed'
              },
              { name: 'value', label: 'Valor', type: 'number', placeholder: '0.00' }
            ]}
            onSubmit={(values) => {
              const discountData = {
                type: values.type,
                value: parseFloat(values.value) || 0
              };
              applyDiscount(discountData);
            }}
            icon={<FaPercentage color="#2563eb" />}
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