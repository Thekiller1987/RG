import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  FaArrowLeft, FaKeyboard, FaTags, FaShoppingCart, FaPlus,
  FaTrashAlt, FaTimes, FaPercentage, FaHistory, FaLock, FaDollarSign, FaEdit, FaRedo,
  FaTags as FaTagsIcon // Renombramos FaTags para evitar conflicto en este archivo
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';
import ProductPanel from './components/ProductPanel.jsx';
import CartPanelView from './components/CartPanelView.jsx'; 
import * as S from './POS.styles.jsx';

import PaymentModal from './components/PaymentModal.jsx';
import CajaModal from './components/CajaModal.jsx';
import SalesHistoryModal from './components/SalesHistoryModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import PromptModal from './components/PromptModal.jsx';
import AlertModal from './components/AlertModal.jsx';
import ProformaModal from './components/ProformaModal.jsx';
import TicketModal from './components/TicketModal.jsx';

import {
  saveCajaSession,
  loadCajaSession,
  fetchCajaSessionFromServer,
  subscribeCajaChanges,
  loadTasaDolar,
  saveTasaDolar,
  shouldWarnCrossDay,
  getSessionOpenedDay
} from '../../utils/caja.js';

import { loadTickets, saveTickets, subscribeTicketChanges } from '../../utils/tickets.js';

/* ===== Helper: ticket vacío con id único (CANÓNICO) ===== */
const createEmptyTicket = (clientId = 0) => ({
  id: Date.now(),
  name: 'Ticket Nuevo',
  items: [],
  clientId,
  discount: { type: 'none', value: 0 }
});

/* ============================ POS Principal ============================ */
const POS = () => {
  const {
    user: currentUser,
    allUsers,
    products: initialProducts,
    clients,
    logout,
    loadMasterData,
    cajaSession: cajaSessionCtx,
    addCajaTransaction,
    setCajaSession
  } = useAuth();

  const token = localStorage.getItem('token');
  const userId = currentUser?.id_usuario || currentUser?.id;
  const isAdmin = currentUser?.rol === 'Administrador';
  const initialClientId = 0;

  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');

  // Tickets persistentes
  const initialTickets = loadTickets(userId || 'anon');
  const [orders, setOrders] = useState(initialTickets.orders);
  const [activeOrderId, setActiveOrderId] = useState(initialTickets.activeOrderId);

  // Guardar en storage cada cambio local
  useEffect(() => { if (userId) saveTickets(userId, orders, activeOrderId); }, [userId, orders, activeOrderId]);

  // Suscripción cross-tab protegida (evita bucles de estado)
  useEffect(() => {
    if (!userId) return;
    return subscribeTicketChanges(userId, (data) => {
      if (data?.orders && data?.activeOrderId != null) {
        const ordersContentChanged = 
            data.orders.length !== orders.length || 
            data.orders.some((newOrder, index) => {
                const oldOrder = orders[index];
                return !oldOrder || newOrder.id !== oldOrder.id;
            });
        
        const activeIdChanged = data.activeOrderId !== activeOrderId;

        if (ordersContentChanged || activeIdChanged) {
          console.log(`LOG [SYNC]: Recibida actualización externa. Forzando (${data.orders.length} tickets).`);
          setOrders(data.orders);
          setActiveOrderId(data.activeOrderId);
        }
      }
    });
  }, [userId, orders.length, activeOrderId]);

  const activeOrder = useMemo(
    () => orders.find(o => o.id === activeOrderId) || { items: [], clientId: initialClientId, discount: { type: 'none', value: 0 }, name: 'Ticket' },
    [orders, activeOrderId]
  );
  const cart = activeOrder.items || [];

  // Caja
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [tasaDolar, setTasaDolar] = useState(loadTasaDolar(userId, 36.60));
  const [dailySales, setDailySales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

  const [modal, setModal] = useState({ name: null, props: {} });
  const [ticketData, setTicketData] = useState({ transaction: null, creditStatus: null });

  const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
  const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
  const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
  const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);
  const showPrompt = useCallback((props) => openModal('prompt', props), [openModal]);

  // Ventas del día (MODIFICADO para aceptar una fecha, por defecto hoy)
  const loadSalesFromDB = useCallback(async (date = new Date().toISOString().split('T')[0]) => {
    if (!token) return [];
    setIsLoadingSales(true);
    console.log(`LOG: Cargando ventas para la fecha: ${date}`);
    try {
      const salesData = await api.fetchSales(token, date); 
      
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        setDailySales(Array.isArray(salesData) ? salesData : []);
      }
      return Array.isArray(salesData) ? salesData : [];

    } catch (error) {
      console.error("Error al cargar ventas:", error);
      if (error.status === 401) {
        showAlert({ title: "Sesión Expirada", message: "Tu sesión ha terminado. Serás redirigido al login." });
        setTimeout(logout, 3000);
      } else {
        showAlert({ title: "Error de Red", message: "No se pudieron cargar las ventas." });
      }
      return [];
    } finally {
      setIsLoadingSales(false);
    }
  }, [token, logout, showAlert]);

  const refreshData = useCallback(async () => {
    if (!token) return;
    await Promise.all([loadSalesFromDB(), loadMasterData(token)]);
  }, [token, loadSalesFromDB, loadMasterData]);

  // Helpers tickets
  const updateActiveOrder = (key, value) =>
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o));
  const updateActiveCart = (newItems) => updateActiveOrder('items', newItems);

  // Lógica de cierre del ticket (usada por el botón Cerrar Ticket)
  const closeTicketById = useCallback((ticketIdToClose) => {
    console.log(`LOG [CLOSE_TICKET_MANUAL]: Intentando cerrar ticket ID: ${ticketIdToClose}.`);

    setOrders(prevOrders => {
        const filtered = prevOrders.filter(o => String(o.id) !== String(ticketIdToClose));
        let newOrders = filtered;
        let nextActiveId = null;

        if (filtered.length === prevOrders.length) {
            console.log(`LOG [CLOSE_TICKET_MANUAL]: ¡Advertencia! No se encontró ticket ${ticketIdToClose} para cerrar manualmente.`);
            return prevOrders;
        }

        if (filtered.length === 0) {
            const base = createEmptyTicket(0);
            newOrders = [base];
            nextActiveId = base.id;
        } else {
            nextActiveId = filtered[0].id;
        }

        if (nextActiveId !== null) {
            setActiveOrderId(nextActiveId);
            if (userId) saveTickets(userId, newOrders, nextActiveId);
        }
        
        return newOrders;
    });

  }, [userId]); 

  const handleRemoveOrder = (id) => {
    console.log(`LOG: Llamada a handleRemoveOrder para ID: ${id}`);
    closeTicketById(id);
  };

  const handleNewOrder = () => {
    setOrders(prev => {
      const newTicket = createEmptyTicket(initialClientId);
      setActiveOrderId(newTicket.id);
      return [...prev, newTicket];
    });
  };

  const handleRenameOrder = (orderId, currentName) => {
    showPrompt({
      title: "Renombrar Ticket",
      message: `Nuevo nombre para "${currentName}":`,
      initialValue: currentName,
      inputType: 'text',
      onConfirm: (newName) => {
        if (newName && newName.trim() !== '') {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, name: newName.trim() } : o));
        }
        closeModal();
      }
    });
  };

  // Productos / carrito
  const handleAddToCart = (product, quantity = 1, priceToUse = null) => {
    const existing = cart.find(item => item.id === product.id);
    const newQty = (existing?.quantity || 0) + quantity;
    if (newQty > product.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `No puedes agregar más de ${product.existencia} unidades.` });
      return;
    }
    const finalPrice = priceToUse != null ? priceToUse : (existing?.precio_venta || product.precio);
    const newItem = { ...product, quantity: newQty, precio_venta: finalPrice };
    const newCart = existing ? cart.map(i => i.id === product.id ? newItem : i) : [...cart, newItem];
    updateActiveCart(newCart);
  };

  const handleProductClick = (product) => {
    if (product.existencia <= 0) {
      showAlert({ title: "Producto Agotado", message: `Inventario de ${product.nombre} es 0.` });
      return;
    }
    handleAddToCart(product, 1, product.precio || 0);
  };

  const handleUpdateCartQuantity = (id, newQuantity) => {
    const productData = products.find(p => p.id === id);
    if (!productData) return;
    const numQuantity = parseInt(newQuantity, 10) || 0;

    if (numQuantity <= 0) {
      updateActiveCart(cart.filter(i => i.id !== id));
      return;
    }
    if (numQuantity > productData.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `Máximo ${productData.existencia} unidades.` });
      updateActiveCart(cart.map(i => i.id === id ? { ...i, quantity: productData.existencia } : i));
      return;
    }
    updateActiveCart(cart.map(i => i.id === id ? { ...i, quantity: numQuantity } : i));
  };

  const handleSetManualPrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const productCost = Number(productData?.raw?.costo || 0);
    const currentSalePrice = item.precio_venta || item.precio;

    showPrompt({
      title: `Precio Manual para ${item.nombre}`,
      message: `Costo: C$${productCost.toFixed(2)}. Nuevo precio de venta:`,
      initialValue: Number(currentSalePrice || 0).toFixed(2),
      inputType: 'number',
      onConfirm: (value) => {
        const newPrice = parseFloat(value);
        if (isNaN(newPrice) || newPrice < 0) {
          showAlert({ title: 'Valor Inválido', message: 'El precio debe ser un número válido.' });
          return;
        }
        if (newPrice < productCost) {
          showAlert({ title: 'No permitido', message: `El precio (C$${newPrice.toFixed(2)}) no puede ser menor que el costo (C$${productCost.toFixed(2)}).` });
          return;
        }
        const newCart = cart.map(i => i.id === item.id ? { ...i, precio_venta: newPrice } : i);
        updateActiveCart(newCart);
        closeModal();
      }
    });
  };

  const handleApplyWholesalePrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const precioMayoreo = Number(productData?.raw?.mayoreo || 0);
    if (precioMayoreo > 0) {
      const newCart = cart.map(i => i.id === item.id ? { ...i, precio_venta: precioMayoreo } : i);
      updateActiveCart(newCart);
      showAlert({ title: "Precio Actualizado", message: `Mayoreo: C$${precioMayoreo.toFixed(2)} aplicado.` });
    }
  };

  const handleRevertRetailPrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const basePrice = productData?.precio || 0;
    const newCart = cart.map(i => i.id === item.id ? { ...i, precio_venta: basePrice } : i);
    updateActiveCart(newCart);
  };

  const applyOrderDiscount = () => {
    showPrompt({
      title: "Descuento a la Orden",
      message: "Ej: '10%' o '50' (C$)",
      onConfirm: (value) => {
        if (!value) { updateActiveOrder('discount', { type: 'none', value: 0 }); return; }
        if (value.includes('%')) {
          const n = parseFloat(value.replace('%', ''));
          if (!isNaN(n) && n > 0 && n <= 100) updateActiveOrder('discount', { type: 'percentage', value: n });
          else showAlert({ title: 'Inválido', message: 'Porcentaje 1-100.' });
        } else {
          const n = parseFloat(value);
          if (!isNaN(n) && n >= 0) updateActiveOrder('discount', { type: 'fixed', value: n });
          else showAlert({ title: 'Inválido', message: 'Monto >= 0.' });
        }
      }
    });
  };

  // Caja: abrir/cerrar (botones de header)
  const handleOpenCaja = async (monto, nuevaTasa) => {
    if (!userId) { showAlert({ title: "Error", message: "Usuario no identificado." }); return; }
    const newSession = {
      openedAt: new Date().toISOString(),
      openedBy: { id: currentUser.id, name: currentUser.nombre_usuario },
      initialAmount: Number(monto || 0),
      transactions: [],
      closedAt: null,
      closedBy: null,
      countedAmount: null,
      difference: null,
      notes: ''
    };
    saveCajaSession(userId, newSession);
    saveTasaDolar(userId, (nuevaTasa ?? tasaDolar));
    setCajaSession(newSession);
    setIsCajaOpen(true);
    setTasaDolar(Number(nuevaTasa ?? tasaDolar));
    closeModal();
  };

  const handleDoCloseCaja = (countedAmount) => {
    // 🚫 No permitir cerrar si hay tickets con productos
    const hasPendingTickets = orders.some(o => (o.items?.length || 0) > 0);
    if (hasPendingTickets) {
      showAlert({
        title: 'Tickets Pendientes',
        message: 'No puedes cerrar caja mientras existan tickets con productos. Cierra o vacía todos los tickets.'
      });
      return;
    }

    const current = loadCajaSession(userId) || cajaSessionCtx;
    if (!current || !userId) return;

    const movimientoNetoEfectivo = (current.transactions || []).reduce((total, tx) => {
      if (tx.type === 'venta_credito') return total;
      return total + Number(tx.pagoDetalles?.ingresoCaja || 0);
    }, 0);

    const efectivoEsperado = Number(current.initialAmount) + movimientoNetoEfectivo;
    const finalSession = {
      ...current,
      closedAt: new Date().toISOString(),
      closedBy: { id: currentUser.id, name: currentUser.nombre_usuario },
      countedAmount: Number(countedAmount),
      difference: Number(countedAmount) - efectivoEsperado,
    };

    saveCajaSession(userId, finalSession);
    setCajaSession(finalSession);
    setIsCajaOpen(false);
    closeModal();

    showAlert({
      title: "Caja Cerrada",
      message: finalSession.difference === 0
        ? 'Balance perfecto.'
        : `Diferencia: C$${finalSession.difference.toFixed(2)}`
    });
  };

  /* ============================ FACTURAR (Venta) - FIX FINAL ATÓMICO ============================ */
  const handleFinishSale = async (pagoDetalles) => {
    const orderIdToClose = activeOrderId;
    const finalClientId = pagoDetalles.clienteId;
    console.log(`LOG: Inicia handleFinishSale para ticket ID: ${orderIdToClose}`);

    if (finalClientId === 0) {
      console.error("LOG: Error - Cliente ID es 0.");
      showAlert({ title: "Error de Cliente", message: "Seleccione un cliente válido.", type: 'error' });
      return false;
    }

    const snapshotCart = (orders.find(o => o.id === orderIdToClose)?.items || []);
    if (!snapshotCart.length) {
      console.error("LOG: Error - Carrito vacío.");
      showAlert({ title: "Carrito vacío", message: "Agregue productos antes de facturar." });
      return false;
    }
    console.log(`LOG: Carrito tiene ${snapshotCart.length} items. Payload de venta listo.`);


    const itemsForSale = snapshotCart.map(({ raw, costo, existencia, ...rest }) => ({
      id: rest.id || rest.id_producto,
      quantity: Number(rest.quantity || 0),
      precio: Number(rest.precio_venta ?? rest.precio ?? 0),
    }));

    const subtotalCalc = snapshotCart.reduce(
      (s, i) => s + Number(i.precio_venta ?? i.precio ?? 0) * Number(i.quantity ?? 0),
      0
    );
    const d = orders.find(o => o.id === orderIdToClose)?.discount;
    const discountAmountCalc =
      d?.type === 'percentage'
        ? subtotalCalc * (Number(d.value) / 100)
        : d?.type === 'fixed'
          ? Math.min(subtotalCalc, Number(d.value))
          : 0;

    const totalCalc = subtotalCalc - discountAmountCalc;

    const ingresoCaja = Number(
      pagoDetalles.ingresoCaja ?? (pagoDetalles.efectivo - pagoDetalles.cambio) ?? 0
    );

    const saleToCreate = {
      totalVenta: totalCalc,
      subtotal: subtotalCalc,
      descuento: discountAmountCalc,
      items: itemsForSale,
      pagoDetalles,
      userId,
      clientId: finalClientId,
      tasaDolarAlMomento: tasaDolar
    };
    console.log("LOG: Datos de venta preparados:", saleToCreate);

    try {
      const response = await api.createSale(saleToCreate, token);
      console.log(`LOG: Venta creada con éxito. ID de respuesta: ${response?.saleId || 'N/A'}`);

      const esCredito = (pagoDetalles.credito || 0) > 0;
      addCajaTransaction({
        id: `venta-${response?.saleId || Date.now()}`,
        type: esCredito ? 'venta_credito' : 'venta_contado',
        amount: totalCalc,
        note: `Venta #${response?.saleId || ''} ${esCredito ? '(CRÉDITO)' : ''}`,
        at: new Date().toISOString(),
        pagoDetalles: { ...pagoDetalles, clienteId: finalClientId, ingresoCaja }
      });
      console.log("LOG: Transacción de caja registrada.");

      // 🚨 BLOQUE ATÓMICO DE CIERRE Y CAMBIO DE ESTADO
      
      // 1. Calcular el nuevo estado
      const filteredOrders = orders.filter(o => String(o.id) !== String(orderIdToClose));
      let newOrders = filteredOrders;
      let nextActiveId = null;

      if (filteredOrders.length === 0) {
          const base = createEmptyTicket(0);
          newOrders = [base];
          nextActiveId = base.id;
      } else {
          nextActiveId = filteredOrders[0].id;
      }

      // 2. Aplicar el estado a React
      setOrders(newOrders);
      setActiveOrderId(nextActiveId);
      
      // 3. Persistir el nuevo estado inmediatamente (lo más importante)
      if (userId) {
          console.log(`LOG [ATOMIC]: Ticket ${orderIdToClose} eliminado. Activo: ${nextActiveId}. Guardando estado.`);
          saveTickets(userId, newOrders, nextActiveId);
      }
      
      showAlert({ title: "Éxito", message: "Venta realizada con éxito 🎉" });
      console.log("LOG: Mensaje de éxito mostrado.");


      openModal('confirmation', {
        title: "Imprimir Ticket",
        message: "¿Desea imprimir el ticket?",
        onConfirm: () => {
          const tx = { ...(response?.saleData || {}), ...saleToCreate };
          setTicketData({ transaction: tx, creditStatus: null });
        }
      });

      await refreshData();
      console.log("LOG: Datos del servidor refrescados. handleFinishSale finalizado con éxito.");
      return true;
    } catch (error) {
      console.error("LOG: Error al crear la venta:", error);
      showAlert({ title: "Error", message: `La venta no se pudo guardar. ${error.message}` });
      return false;
    }
  };

  const handleCancelSale = async (saleId) => {
    if (!token) return;
    showAlert({ title: "Procesando", message: "Cancelando venta...", type: "loading" });
    const saleToReverse = dailySales.find(s => String(s.id) === String(saleId));
    try {
      await api.cancelSale(saleId, token);
      if (saleToReverse?.pagoDetalles) {
        const montoARestar = Number(saleToReverse.pagoDetalles.ingresoCaja || 0);
        if (montoARestar !== 0) {
          addCajaTransaction({
            id: `cancelacion-${saleId}`,
            type: montoARestar > 0 ? 'salida' : 'entrada',
            amount: Math.abs(montoARestar),
            note: `Cancelación Venta #${saleId}`,
            pagoDetalles: { ingresoCaja: -montoARestar }
          });
        }
      }
      showAlert({ title: "Éxito", message: `Venta #${saleId} cancelada.` });
      await refreshData();
    } catch (error) {
      showAlert({ title: "Error de Cancelación", message: `No se pudo cancelar la venta #${saleId}.`, type: "error" });
    }
  };

  const handleReturnItem = async (sale, item, quantity) => {
    if (!token) return;
    showAlert({ title: "Procesando", message: `Devolviendo ${quantity} de ${item.nombre}...`, type: "loading" });
    try {
      await api.returnItem({ saleId: sale.id, itemId: item.id_producto || item.id, quantity }, token);
      showAlert({ title: "Éxito", message: `Devolución registrada.` });
      await refreshData();
    } catch (error) {
      showAlert({ title: "Error", message: `No se pudo devolver el producto. ${error.message || ''}` });
    }
  };

  const handleAbonoSuccess = useCallback(() => {
    closeModal();
    showAlert({ title: 'Éxito', message: 'Abono registrado correctamente' });
    refreshData();
  }, [closeModal, showAlert, refreshData]);

  const handleReprintTicket = (transaction, creditStatus = null) => {
    setTicketData({ transaction, creditStatus });
  };

  // Efectos
  useEffect(() => { setProductsState(initialProducts || []); }, [initialProducts]);

  // Cargar sesión de caja vigente
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId) return;
      let session = loadCajaSession(userId) || cajaSessionCtx;
      if (!session) session = await fetchCajaSessionFromServer(userId, api);
      if (!mounted) return;
      if (session) {
        setCajaSession(session);
        setIsCajaOpen(!session.closedAt);
        setTasaDolar(loadTasaDolar(userId, tasaDolar));
      } else {
        setIsCajaOpen(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId, cajaSessionCtx, setCajaSession]);

  // Sync caja entre pestañas
  useEffect(() => {
    if (!userId) return;
    return subscribeCajaChanges(userId, (s) => {
      setCajaSession(s);
      setIsCajaOpen(!s?.closedAt);
      setTasaDolar(loadTasaDolar(userId, tasaDolar));
    });
  }, [userId, setCajaSession]);

  // Si la caja está abierta, cargar ventas del día actual
  useEffect(() => { if (isCajaOpen) loadSalesFromDB(); }, [isCajaOpen, loadSalesFromDB]);

  // Atajos (F1 enfoca el buscador sin depender de ref)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        const el = document.querySelector('input[placeholder*="Buscar producto"]');
        if (el) el.focus();
      }
      if (e.key === 'F2') { e.preventDefault(); if (cart.length > 0) openModal('payment', { total, initialClientId: activeOrder.clientId }); }
      if (e.key === 'F9') { e.preventDefault(); openModal('caja'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, openModal, activeOrder.clientId]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) =>
      sum + Number(item.precio_venta ?? item.precio ?? 0) * Number(item.quantity ?? 0), 0),
    [cart]
  );
  const discountAmount = useMemo(() => {
    if (activeOrder.discount?.type === 'percentage') return subtotal * (Number(activeOrder.discount.value) / 100);
    if (activeOrder.discount?.type === 'fixed') return Math.min(subtotal, Number(activeOrder.discount.value));
    return 0;
  }, [subtotal, activeOrder.discount]);
  
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const handleOpenHistoryModal = () => {
    // Pasamos la función de carga que acepta una fecha
    openModal('history', { loadSalesFunction: loadSalesFromDB });
  };

  const crossDay = shouldWarnCrossDay(cajaSessionCtx); // Lógica de caja
  const sessionOpenDate = getSessionOpenedDay(cajaSessionCtx); // Lógica de caja

  const headerRight = (
    <div className="right-actions">
      <S.Button
        dark
        onClick={handleOpenHistoryModal}
      >
        <FaHistory /> Historial
      </S.Button>
      <S.Button $cancel onClick={() => openModal('caja')}><FaLock /> Gestionar Caja</S.Button>
    </div>
  );

  if (!isCajaOpen) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>Caja Cerrada</h1>
        <p>La caja de <strong>{currentUser?.nombre_usuario || 'este usuario'}</strong> está cerrada.</p>
        <S.Button primary onClick={() => openModal('caja')} mt="true"> <FaKeyboard /> Abrir Mi Caja (F9) </S.Button>

        {modal.name === 'caja' && (
          <CajaModal
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={loadCajaSession(userId) || cajaSessionCtx}
            onOpenCaja={handleOpenCaja}
            onCloseCaja={handleDoCloseCaja}
            isAdmin={isAdmin}
            showConfirmation={showConfirmation}
            showAlert={showAlert}
            onClose={closeModal}
            initialTasaDolar={tasaDolar}
          />
        )}
        {modal.name === 'alert' && <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />}
        {modal.name === 'confirmation' && (
          <ConfirmationModal
            isOpen={true}
            onClose={closeModal}
            onConfirm={() => { if (modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }}
            {...modal.props}
          />
        )}
      </div>
    );
  }

  return (
    <S.PageWrapper>
      <S.HeaderActions>
        <S.BackButton to="/dashboard"><FaArrowLeft /> Volver</S.BackButton>
        <div style={{ fontSize: '0.8rem', color: '#555' }}><FaKeyboard /> Atajos: <strong>F1</strong> Buscar, <strong>F2</strong> Pagar, <strong>F9</strong> Caja</div>
        {headerRight}
      </S.HeaderActions>

      <S.PageContentWrapper>
        <ProductPanel
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onProductClick={handleProductClick}
          cartItems={cart}
        />

        {/* CONTENEDOR DEL PANEL DEL CARRITO */}
        <S.CartPanel>
          <div className="cart-fixed-top">
            {/* Mensaje de caja abierta desde ayer */}
            {crossDay && (
              <S.InfoBox style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffeeba', marginBottom: '.5rem' }}>
                Caja abierta desde {sessionOpenDate}. <strong>Se mantiene activa hasta el cierre.</strong>
              </S.InfoBox>
            )}

            <S.InfoBox $pulsate className="caja-pill">
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                CAJA: <strong>{currentUser?.nombre_usuario}</strong>
              </p>
              <p style={{ margin: 0 }}>
                Fondo: <span style={{ fontWeight: 'bold' }}>
                  C${Number(cajaSessionCtx?.initialAmount || 0).toFixed(2)}
                </span>
              </p>
            </S.InfoBox>
            
            <div className="tickets-header">
              <h3 style={{ margin: 0 }}>Tickets Activos ({orders.length})</h3>
            </div>

            <S.TicketContainer>
              {orders.map(order => (
                <S.Button
                  key={order.id}
                  style={{ backgroundColor: activeOrderId === order.id ? '#007bff' : '#6c757d', color: 'white' }}
                  onClick={() => setActiveOrderId(order.id)}
                  onDoubleClick={() => onRenameOrder(order.id, order.name)}
                >
                  {/* FIX RESPONSIVO: Asegurar que el nombre no exceda el ancho en móvil */}
                  <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.name}
                  </span>
                  ({order.items.length})
                </S.Button>
              ))}
              <S.Button primary onClick={handleNewOrder}>
                <FaPlus /> Nuevo
              </S.Button>
            </S.TicketContainer>

            {orders.length > 1 && (
              <S.Button $cancel style={{ width: '100%', marginTop: '5px' }} onClick={() => handleRemoveOrder(activeOrderId)}>
                <FaTrashAlt /> Cerrar Ticket
              </S.Button>
            )}
            
            <h2 className="cart-title" style={{ marginTop: '1rem' }}>
              {activeOrder.name} <FaShoppingCart />
            </h2>
          </div>

          {/* CLAVE: Usamos activeOrderId como 'key' para forzar la recreación de CartContentView */}
          <CartContentView
              key={activeOrderId}
              isAdmin={isAdmin}
              products={products}
              cart={cart}
              tasaDolar={tasaDolar} // Pasamos la tasa para que el subcomponente la muestre
              onUpdateQty={handleUpdateCartQuantity}
              onRemoveFromCart={(id) => updateActiveCart(cart.filter(i => i.id !== id))}
              onSetManualPrice={handleSetManualPrice}
              onApplyWholesalePrice={handleApplyWholesalePrice}
              onRevertRetailPrice={handleRevertRetailPrice}
              discountAmount={discountAmount}
              subtotal={subtotal}
              total={total}
              onApplyOrderDiscount={applyOrderDiscount}
              onOpenProforma={() => openModal('proforma')}
              onOpenPayment={() => openModal('payment', { total, initialClientId: activeOrder.clientId })}
          />
        </S.CartPanel>
      </S.PageContentWrapper>

      {/* Modales */}
      {modal.name === 'history' && (
        <SalesHistoryModal
          loadSales={modal.props.loadSalesFunction} 
          dailySales={dailySales} 
          onCancelSale={handleCancelSale}
          onReturnItem={handleReturnItem}
          onReprintTicket={handleReprintTicket}
          users={allUsers}
          clients={clients}
          isAdmin={isAdmin}
          showConfirmation={showConfirmation}
          showPrompt={showPrompt}
          showAlert={showAlert}
          onClose={closeModal}
          onAbonoSuccess={refreshData}
        />
      )}

      {modal.name === 'payment' && (
        <PaymentModal
          total={modal.props.total || total}
          tasaDolar={tasaDolar}
          clientes={clients}
          onFinishSale={handleFinishSale} 
          showAlert={showAlert}
          onClose={closeModal}
          initialClientId={String(activeOrder.clientId || 0)}
        />
      )}

      {modal.name === 'caja' && (
        <CajaModal
          currentUser={currentUser}
          isCajaOpen={isCajaOpen}
          session={loadCajaSession(userId) || cajaSessionCtx}
          onOpenCaja={handleOpenCaja}
          onCloseCaja={handleDoCloseCaja}
          isAdmin={isAdmin}
          showConfirmation={showConfirmation}
          showAlert={showAlert}
          onClose={closeModal}
          initialTasaDolar={tasaDolar}
        />
      )}

      {modal.name === 'proforma' && (
        <ProformaModal
          cart={cart}
          total={total}
          subtotal={subtotal}
          discount={discountAmount}
          client={clients.find(c => c.id_cliente === activeOrder.clientId)}
          onClose={closeModal}
        />
      )}

      {ticketData.transaction && (
        <TicketModal
          transaction={ticketData.transaction}
          creditStatus={ticketData.creditStatus}
          clients={clients}
          users={allUsers}
          onClose={() => setTicketData({ transaction: null, creditStatus: null })}
        />
      )}

      {modal.name === 'confirmation' && (
        <ConfirmationModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={() => { if (modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }}
          {...modal.props}
        />
      )}
      {modal.name === 'prompt' && (
        <PromptModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={(value) => { if (modal.props.onConfirm) modal.props.onConfirm(value); closeModal(); }}
          {...modal.props}
        />
      )}
      {modal.name === 'alert' && <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />}
    </S.PageWrapper>
  );
};

export default POS;

// =================================================================
// Subcomponente interno para el contenido del carrito (CartContentView)
// =================================================================
function CartContentView({
  isAdmin, products, cart, onUpdateQty, onRemoveFromCart, onSetManualPrice,
  onApplyWholesalePrice, onRevertRetailPrice, discountAmount, subtotal, total,
  onApplyOrderDiscount, onOpenProforma, onOpenPayment, tasaDolar
}) {
  // ELIMINAMOS EL REQUIRE Y USAMOS LAS IMPORTACIONES DEL ÁMBITO GLOBAL DEL ARCHIVO.
  // Puesto que FaEdit, FaRedo, FaTags, etc. están importados al inicio de POS.jsx,
  // el navegador puede acceder a ellos dentro de esta función anidada.
  
  return (
    <>
      <div className="cart-scroll">
        {cart.length === 0 ? (
          <p className="cart-empty">El ticket está vacío.</p>
        ) : cart.map(item => {
          const productData = products.find(p => p.id === item.id);
          const basePrice = productData?.precio || 0;
          const hasWholesalePrice = (productData?.raw?.mayoreo || 0) > 0;
          const isPriceModified = (item.precio_venta || basePrice) !== basePrice;

          return (
            <S.CartItemWrapper key={item.id}>
              <div className="item-info">
                <p className="item-name">{item.nombre}</p>
                <div className="item-details">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    max={item.existencia}
                    onChange={(e) => onUpdateQty(item.id, e.target.value)}
                  />
                  <small>x C${Number(item.precio_venta || item.precio || 0).toFixed(2)}</small>

                  {isAdmin && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                      <S.ActionButton title="Precio Manual" onClick={() => onSetManualPrice(item)}><FaEdit /></S.ActionButton>
                      {hasWholesalePrice && (
                        <S.ActionButton title="Aplicar Mayoreo" onClick={() => onApplyWholesalePrice(item)}>
                          <FaTags />
                        </S.ActionButton>
                      )}
                      {isPriceModified && (
                        <S.ActionButton title="Revertir a Precio Normal" onClick={() => onRevertRetailPrice(item)}>
                          <FaRedo />
                        </S.ActionButton>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="item-price">
                C${(Number(item.precio_venta || item.precio || 0) * Number(item.quantity || 0)).toFixed(2)}
              </p>
              <S.Button $cancel style={{ padding: '0.4rem', minWidth: 'auto', marginLeft: '1rem' }} onClick={() => onRemoveFromCart(item.id)}>
                <FaTimes />
              </S.Button>
            </S.CartItemWrapper>
          );
        })}
      </div>

      <div className="cart-fixed-bottom">
        <div>
          <S.TotalsRow><span>Subtotal:</span><span>C${subtotal.toFixed(2)}</span></S.TotalsRow>
          <S.TotalsRow
            onClick={onApplyOrderDiscount}
            style={{ cursor: 'pointer', color: discountAmount > 0 ? '#dc3545' : 'inherit' }}
          >
            <span><FaPercentage /> Descuento Total:</span>
            <span>- C${discountAmount.toFixed(2)}</span>
          </S.TotalsRow>
          <S.TotalsRow $bordered $bold className="grand-total">
            <span>TOTAL:</span><span>C${total.toFixed(2)}</span>
          </S.TotalsRow>
        </div>
        
        <S.InfoBox style={{ backgroundColor: '#fff', padding: '.5rem', borderRadius: 8 }}>
          <FaDollarSign style={{ marginRight: 5 }} /> Tasa Dólar: <strong>C${Number(tasaDolar).toFixed(2)}</strong>
        </S.InfoBox>
        
        <div className="cart-actions" style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <S.Button info onClick={onOpenProforma} disabled={cart.length === 0}>Crear Proforma</S.Button>
          <S.Button pay onClick={onOpenPayment} disabled={cart.length === 0}>Proceder al Pago (F2)</S.Button>
        </div>
      </div>
    </>
  );
}