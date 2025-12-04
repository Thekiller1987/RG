/* =================================================================
 * 1. IMPORTACIONES
 * ================================================================= */

// React Hooks
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

// Iconos
import {
  FaArrowLeft, FaKeyboard, FaTags, FaShoppingCart, FaPlus,
  FaTrashAlt, FaTimes, FaPercentage, FaHistory, FaLock, FaDollarSign, FaEdit, FaRedo,
  FaSignInAlt, FaSignOutAlt, FaPrint,
  FaBarcode, FaAlignLeft, 
  FaClipboardList, FaFileInvoiceDollar // <--- ICONOS PARA GESTIÓN DE PEDIDOS
} from 'react-icons/fa';

// Contextos, APIs y Utilidades
import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';

// Componentes Estilizados y de Modal
import ProductPanel from './components/ProductPanel.jsx';
import * as S from './POS.styles.jsx'; // Estilos
import PaymentModal from './components/PaymentModal.jsx';
import CajaModal from './components/CajaModal.jsx';
import SalesHistoryModal from './components/SalesHistoryModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import PromptModal from './components/PromptModal.jsx';
import AlertModal from './components/AlertModal.jsx';
import ProformaModal from './components/ProformaModal.jsx';
import TicketModal from './components/TicketModal.jsx';

// Utilidades de Impresión
import { buildTicketHTML, normalizeSale, printHTML } from './printing/printUtils';

// Utilidades de Caja y Tickets
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

/* =================================================================
 * 2. FUNCIONES HELPER FUERA DEL COMPONENTE
 * ================================================================= */

// correlativo simple y persistente para proformas
const nextProformaNumber = () => {
  const key = 'proforma_seq';
  const base = 1760000000000;
  const curr = Number(localStorage.getItem(key) || base);
  const next = curr + 1;
  localStorage.setItem(key, String(next));
  return next;
};

const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

/**
 * Crea un ticket vacío.
 * SE AGREGA: serverSaleId para saber si este ticket viene de un pedido pendiente.
 */
const createEmptyTicket = (clientId = 0) => ({
  id: Date.now(),
  name: 'Ticket Nuevo',
  items: [],
  clientId,
  discount: { type: 'none', value: 0 },
  serverSaleId: null // <--- IMPORTANTE: ID del pedido original si existe
});

const toUserRef = (u, fallbackId = null) => ({
  id: u?.id_usuario ?? u?.id ?? fallbackId,
  name:
    u?.name ??
    u?.nombre ??
    u?.nombre_usuario ??
    u?.username ??
    (u?.id_usuario || u?.id ? `Usuario ${u?.id_usuario ?? u?.id}` : 'Usuario'),
});


/* =================================================================
 * 3. COMPONENTE PRINCIPAL POS (Punto de Venta)
 * ================================================================= */
const POS = () => {
  /* -----------------------------------------------------------------
   * 3.1. CONTEXTO Y CONSTANTES INICIALES
   * ----------------------------------------------------------------- */
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

  /* -----------------------------------------------------------------
   * 3.2. ESTADO LOCAL (STATE)
   * ----------------------------------------------------------------- */
  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description');
  const searchRef = useRef(null);

  // Gestión de Tickets/Órdenes
  const initialTickets = loadTickets(userId || 'anon');
  const [orders, setOrders] = useState(initialTickets.orders);
  const [activeOrderId, setActiveOrderId] = useState(initialTickets.activeOrderId);

  // Gestión de Caja y Ventas
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [tasaDolar, setTasaDolar] = useState(loadTasaDolar(userId, 36.60));
  const [dailySales, setDailySales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

  // Gestión de Modales
  const [modal, setModal] = useState({ name: null, props: {} });
  const [ticketData, setTicketData] = useState({ transaction: null, creditStatus: null, shouldOpen: false });

  // ESTADO NUEVO: Lista de Pedidos Pendientes para cargar
  const [pendingOrdersList, setPendingOrdersList] = useState([]);

  /* -----------------------------------------------------------------
   * 3.3. FUNCIONES DE UTILIDAD PARA MODALES
   * ----------------------------------------------------------------- */
  const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
  const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
  const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
  const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);
  const showPrompt = useCallback((props) => openModal('prompt', props), [openModal]);

  /* -----------------------------------------------------------------
   * 3.4. CÁLCULOS MEMORIZADOS
   * ----------------------------------------------------------------- */
  const activeOrder = useMemo(
    () => orders.find(o => o.id === activeOrderId) || createEmptyTicket(initialClientId),
    [orders, activeOrderId]
  );
  const cart = activeOrder.items || [];

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

  /* -----------------------------------------------------------------
   * 3.5. LÓGICA DE CAJA (Carga de Ventas)
   * ----------------------------------------------------------------- */
  const loadSalesFromDB = useCallback(async (date) => {
    if (!token) return [];
    setIsLoadingSales(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const effectiveDate = (date === undefined) ? today : date;
      const salesData = await api.fetchSales(token, effectiveDate);

      if (effectiveDate === today) {
        setDailySales(Array.isArray(salesData) ? salesData : []);
      }
      return Array.isArray(salesData) ? salesData : [];
    } catch (error) {
      if (error?.status === 401) {
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

  const reloadCajaSession = useCallback(async () => {
    if (!userId || !token) return;
    try {
      const serverSession = await api.getCajaSession(userId, token);
      if (serverSession) {
        setCajaSession(serverSession);
        saveCajaSession(userId, serverSession);
      }
    } catch (error) {
      console.error("Error recargando caja:", error);
    }
  }, [userId, token, setCajaSession]);

  /* -----------------------------------------------------------------
   * 3.5.5 LÓGICA DE CARGA DE PEDIDOS/APARTADOS PENDIENTES
   * ----------------------------------------------------------------- */
  
  // 1. Carga los pedidos desde el servidor
  const loadPendingOrdersFromServer = async () => {
    if (!token) return;
    showAlert({ title: "Cargando", message: "Buscando pedidos pendientes...", type: "loading" });
    try {
        const allSales = await api.fetchSales(token); 
        // Filtramos solo pendientes o apartados con saldo
        const pendientes = Array.isArray(allSales) 
            ? allSales.filter(s => s.estado === 'pendiente' || (s.saldo_pendiente > 0 && s.estado !== 'cancelado'))
            : [];
        
        setPendingOrdersList(pendientes);
        closeModal(); // Cerrar loading modal
        
        if (pendientes.length === 0) {
            showAlert({ title: "Aviso", message: "No hay pedidos pendientes." });
        } else {
            openModal('pendingOrders'); // Abrimos el modal de selección
        }
    } catch (e) {
        closeModal();
        showAlert({ title: "Error", message: "No se pudieron cargar los pedidos." });
    }
  };

  // 2. Vuelca el pedido seleccionado al POS para cobrarlo
  const handleLoadPendingToPOS = (pendingSale) => {
      // Convertir items del pedido a items del carrito
      const cartItems = (pendingSale.items || []).map(i => {
          // Buscamos el producto en el catálogo actual para tener existencia actualizada
          const catProd = products.find(p => p.id === (i.id_producto || i.id));
          return {
              ...i,
              id: i.id_producto || i.id, 
              nombre: i.nombre || i.producto || catProd?.nombre,
              quantity: Number(i.cantidad || i.quantity),
              precio_venta: Number(i.precio || i.precio_venta),
              existencia: catProd?.existencia || 9999, 
              ...catProd 
          };
      });

      // Actualizar el ticket activo con los datos del pedido
      setOrders(prev => prev.map(o => o.id === activeOrderId ? {
          ...o,
          items: cartItems,
          clientId: pendingSale.cliente?.id_cliente || pendingSale.clienteId || 0,
          name: `Cobro Pedido #${pendingSale.id}`,
          serverSaleId: pendingSale.id, // <--- GUARDAMOS EL ID ORIGINAL
          discount: { type: 'none', value: 0 } 
      } : o));

      closeModal();
      showAlert({ title: "Cargado", message: `Pedido #${pendingSale.id} cargado. Presiona F2 para cobrar.` });
  };

  /* -----------------------------------------------------------------
   * 3.6. EFECTOS
   * ----------------------------------------------------------------- */
  useEffect(() => { if (userId) saveTickets(userId, orders, activeOrderId); }, [userId, orders, activeOrderId]);

  useEffect(() => {
    const tx = ticketData.transaction;
    if (!tx) return;
    if (tx.isProforma && (!tx.id || !tx.usuarioNombre)) {
      setTicketData(prev => ({
        ...prev,
        transaction: {
          ...tx,
          id: tx.id || nextProformaNumber(),
          usuarioNombre: tx.usuarioNombre || currentUser?.nombre_usuario || 'Cajero',
        }
      }));
    }
  }, [ticketData.transaction, currentUser, setTicketData]);

  useEffect(() => {
    const handleAfterPrint = () => {
      setTicketData({ transaction: null, creditStatus: null, shouldOpen: false });
    };
    if (ticketData.shouldOpen) {
      window.addEventListener('afterprint', handleAfterPrint);
    }
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [ticketData.shouldOpen]);

  useEffect(() => {
    if (!userId) return;
    return subscribeTicketChanges(userId, (data) => {
      if (data?.orders && data?.activeOrderId != null) {
        const ordersContentChanged =
          data.orders.length !== orders.length ||
          data.orders.some((n, i) => !orders[i] || n.id !== orders[i].id);
        const activeIdChanged = data.activeOrderId !== activeOrderId;

        if (ordersContentChanged || activeIdChanged) {
          setOrders(data.orders);
          setActiveOrderId(data.activeOrderId);
        }
      }
    });
  }, [userId, orders.length, activeOrderId]);

  useEffect(() => { if (isCajaOpen) loadSalesFromDB(); }, [isCajaOpen, loadSalesFromDB]);
  useEffect(() => { setProductsState(initialProducts || []); }, [initialProducts]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        (searchRef.current || document.querySelector('input[placeholder*="Buscar producto"]'))?.focus();
      }
      if (e.key === 'F2') { e.preventDefault(); if (cart.length > 0) openModal('payment', { total, initialClientId: activeOrder.clientId }); }
      if (e.key === 'F9') { e.preventDefault(); openModal('caja'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, openModal, activeOrder.clientId, total]);

  /* -----------------------------------------------------------------
   * 3.7. LÓGICA DE CAJA
   * ----------------------------------------------------------------- */
  const handleOpenCaja = async (monto, nuevaTasa) => {
    if (!userId) { showAlert({ title: "Error", message: "Usuario no identificado." }); return; }
    const newSession = {
      openedAt: new Date().toISOString(),
      openedBy: toUserRef(currentUser, userId),
      initialAmount: Number(monto || 0),
      transactions: [],
      closedAt: null,
      closedBy: null,
      countedAmount: null,
      difference: null,
      notes: '',
    };
    saveCajaSession(userId, newSession);
    saveTasaDolar(userId, (nuevaTasa ?? tasaDolar));
    setCajaSession(newSession);
    setIsCajaOpen(true);
    setTasaDolar(Number(nuevaTasa ?? tasaDolar));
    closeModal();
    try { await api.openCajaSession({ userId, ...newSession, tasaDolar: Number(nuevaTasa ?? tasaDolar) }, token); } catch (e) {}
  };

  const handleDoCloseCaja = async (countedAmount) => {
    const hasPendingTickets = orders.some(o => (o.items?.length || 0) > 0);
    if (hasPendingTickets) {
      showAlert({ title: 'Tickets Pendientes', message: 'No puedes cerrar caja mientras existan tickets con productos.' });
      return;
    }
    const current = cajaSessionCtx;
    if (!current || !userId) return;
    const movimientoNetoEfectivo = (current.transactions || []).reduce((total, tx) => {
      if (tx.type === 'venta_credito') return total;
      const ingreso = Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0);
      if (tx.type === 'entrada') return total + Math.abs(ingreso);
      if (tx.type === 'salida') return total - Math.abs(ingreso);
      return total + ingreso;
    }, 0);
    const efectivoEsperado = Number(current.initialAmount) + movimientoNetoEfectivo;
    const finalSession = {
      ...current,
      closedAt: new Date().toISOString(),
      closedBy: toUserRef(currentUser, userId),
      countedAmount: Number(countedAmount),
      difference: Number(countedAmount) - efectivoEsperado,
    };
    saveCajaSession(userId, finalSession);
    setCajaSession(finalSession);
    setIsCajaOpen(false);
    closeModal();
    try {
      await api.closeCajaSession({
        userId,
        countedAmount: Number(countedAmount),
        closedAt: finalSession.closedAt,
        closedBy: finalSession.closedBy,
      }, token);
    } catch (e) {}
    showAlert({
      title: "Caja Cerrada",
      message: finalSession.difference === 0 ? 'Balance perfecto. ✅' : `Diferencia: C$${fmt(finalSession.difference)} ⚠️`
    });
  };

  const handleRegisterTransaction = async (type, amount, note) => {
    if (!userId || !amount) { showAlert({ title: "Error", message: "Usuario no identificado." }); return; }
    const amountVal = Number(amount);
    const ingresoCaja = type === 'entrada' ? amountVal : -amountVal;
    const tx = {
      id: `${type}-${Date.now()}`,
      type,
      amount: amountVal,
      note: note || (type === 'entrada' ? 'Entrada de Dinero' : 'Salida de Dinero'),
      at: new Date().toISOString(),
      pagoDetalles: { ingresoCaja }
    };
    addCajaTransaction(tx);
    try { await api.addCajaTx({ userId, tx }, token); } catch (e) {}
    showAlert({ title: "Éxito", message: `${type === 'entrada' ? 'Entrada' : 'Salida'}: C$${fmt(amount)}` });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId) return;
      const server = await fetchCajaSessionFromServer(userId, api);
      if (!mounted) return;
      if (server) {
        setCajaSession(server);
        setIsCajaOpen(!server.closedAt);
        setTasaDolar(loadTasaDolar(userId, server.tasaDolar || tasaDolar));
        saveCajaSession(userId, server);
      } else {
        const local = loadCajaSession(userId);
        if (local && !local.closedAt) {
          setCajaSession(local);
          setIsCajaOpen(true);
          setTasaDolar(loadTasaDolar(userId, tasaDolar));
        }
      }
    })();
    return () => { mounted = false; };
  }, [userId, setCajaSession, tasaDolar]);

  useEffect(() => {
    if (!userId) return;
    return subscribeCajaChanges(userId, (s) => {
      if (!s) return;
      setCajaSession(s);
      setIsCajaOpen(!s.closedAt);
      setTasaDolar(loadTasaDolar(userId, s.tasaDolar || tasaDolar));
    });
  }, [userId, setCajaSession, tasaDolar]);

  useEffect(() => {
    if (!userId) return;
    const id = setInterval(async () => {
      try {
        const server = await api.getCajaSession(userId, token);
        if (server) {
          if (!isCajaOpen || server.openedAt !== cajaSessionCtx?.openedAt) {
            setCajaSession(server);
            setIsCajaOpen(!server.closedAt);
            saveCajaSession(userId, server);
          }
        }
      } catch { }
    }, 5000);
    return () => clearInterval(id);
  }, [userId, token, setCajaSession, isCajaOpen, cajaSessionCtx]);


  /* -----------------------------------------------------------------
   * 3.8. LÓGICA DE ÓRDENES/TICKETS
   * ----------------------------------------------------------------- */
  const updateActiveOrder = (key, value) =>
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o));

  const updateActiveCart = (newItems) => updateActiveOrder('items', newItems);

  const closeTicketById = useCallback((ticketIdToClose) => {
    setOrders(prevOrders => {
      const filtered = prevOrders.filter(o => String(o.id) !== String(ticketIdToClose));
      let newOrders = filtered;
      let nextActiveId = null;
      if (filtered.length === prevOrders.length) return prevOrders;
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

  const handleRemoveOrder = (id) => closeTicketById(id);

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

  const applyOrderDiscount = () => {
    showPrompt({
      title: "Descuento a la Orden (%)",
      message: "Ingrese el porcentaje (Ej: 10 para 10%):",
      inputType: 'number',
      onConfirm: (value) => {
        if (!value) {
          updateActiveOrder('discount', { type: 'none', value: 0 });
          return;
        }
        const n = parseFloat(value);
        if (!isNaN(n) && n > 0 && n <= 100) {
          updateActiveOrder('discount', { type: 'percentage', value: n });
          showAlert({ title: "Descuento Aplicado", message: `Se aplicó un ${n}% de descuento.` });
        } else {
          showAlert({ title: 'Inválido', message: 'Por favor ingrese un porcentaje entre 1 y 100.' });
        }
      }
    });
  };

  /* -----------------------------------------------------------------
   * 3.9. LÓGICA DEL CARRITO (Cart)
   * ----------------------------------------------------------------- */
  const handleAddToCart = (product, quantity = 1, priceToUse = null) => {
    const existing = cart.find(item => item.id === product.id);
    const newQty = (existing?.quantity || 0) + quantity;

    if (newQty > product.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `No puedes agregar más de ${product.existencia} unidades.` });
      return;
    }

    const finalPrice = priceToUse != null ? priceToUse : (existing?.precio_venta || product.precio);
    const newItem = { ...product, quantity: newQty, precio_venta: finalPrice };

    const newCart = existing
      ? cart.map(i => (i.id === product.id ? newItem : i))
      : [...cart, newItem];

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
    const refProd = productData || cart.find(c => c.id === id); 
    if (!refProd) return;
    
    const numQuantity = parseInt(newQuantity, 10) || 0;

    if (numQuantity <= 0) {
      updateActiveCart(cart.filter(i => i.id !== id));
      return;
    }

    if (numQuantity > (refProd.existencia || 9999)) {
      showAlert({ title: "Stock Insuficiente", message: `Máximo ${refProd.existencia} unidades.` });
      updateActiveCart(cart.map(i => (i.id === id ? { ...i, quantity: refProd.existencia } : i)));
      return;
    }

    updateActiveCart(cart.map(i => (i.id === id ? { ...i, quantity: numQuantity } : i)));
  };

  const handleSetManualPrice = (item) => {
    const productData = products.find(p => p.id === item.id) || item;
    const productCost = Number(productData?.raw?.costo || productData?.costo || 0);
    const currentSalePrice = item.precio_venta || item.precio;

    showPrompt({
      title: `Precio Manual para ${item.nombre}`,
      message: `Costo: C$${fmt(productCost)}. Nuevo precio de venta:`,
      initialValue: Number(currentSalePrice || 0).toFixed(2),
      inputType: 'number',
      onConfirm: (value) => {
        const newPrice = parseFloat(value);
        if (isNaN(newPrice) || newPrice < 0) {
          showAlert({ title: 'Valor Inválido', message: 'El precio debe ser un número válido.' });
          return;
        }
        if (newPrice < productCost) {
          showAlert({ title: 'No permitido', message: `El precio (C$${fmt(newPrice)}) no puede ser menor que el costo (C$${fmt(productCost)}).` });
          return;
        }
        const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: newPrice } : i));
        updateActiveCart(newCart);
        closeModal();
      }
    });
  };

  const handleApplyWholesalePrice = (item) => {
    const productData = products.find(p => p.id === item.id) || item;
    const precioMayoreo = Number(productData?.raw?.mayoreo || productData?.mayoreo || 0);
    if (precioMayoreo > 0) {
      const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: precioMayoreo } : i));
      updateActiveCart(newCart);
      showAlert({ title: "Precio Actualizado", message: `Mayoreo: C$${fmt(precioMayoreo)} aplicado.` });
    }
  };

  const handleRevertRetailPrice = (item) => {
    const productData = products.find(p => p.id === item.id) || item;
    const basePrice = productData?.precio || 0;
    const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: basePrice } : i));
    updateActiveCart(newCart);
    showAlert({ title: "Precio Revertido", message: `Precio base: C$${fmt(basePrice)} aplicado.` });
  };

  /* -----------------------------------------------------------------
   * 3.10. LÓGICA DE VENTA, CANCELACIÓN Y DEVOLUCIÓN
   * ----------------------------------------------------------------- */
  const askForPrint = useCallback((txToPrint) => {
    showAlert({
      title: "Imprimir Factura",
      message: "¿Desea imprimir la factura?",
      type: "custom",
      buttons: [
        {
          label: "80 mm (Recibo)",
          action: () => {
            setTicketData({ transaction: txToPrint, creditStatus: null, shouldOpen: true, printMode: '80' });
            closeModal();
          },
          isPrimary: true
        },
        {
          label: "A4 (Completo)",
          action: () => {
            setTicketData({ transaction: txToPrint, creditStatus: null, shouldOpen: true, printMode: 'A4' });
            closeModal();
          }
        },
        { label: "No", action: closeModal, isCancel: true }
      ]
    });
  }, [closeModal, showAlert]);

  const openTicketWith = (tx, payload = {}) => {
    setTicketData(prev => ({
      transaction: {
        ...tx,
        usuarioNombre:
          tx?.usuarioNombre ||
          currentUser?.nombre_usuario ||
          currentUser?.name ||
          currentUser?.displayName ||
          'Usuario',
        userId: tx?.userId ?? currentUser?.id_usuario ?? currentUser?.id,
        isProforma: Boolean(payload?.isProforma ?? tx?.isProforma),
        proformaNombre: payload?.proformaFor ?? tx?.proformaNombre,
        id: tx?.id ?? tx?.saleId ?? (tx?.isProforma ? `P-${Date.now()}` : undefined),
      },
      creditStatus: null,
      shouldOpen: true,
      printMode: payload?.printMode || '80',
    }));
  };

  // Manejo de Finalización de Venta (Cobro)
  const handleFinishSale = async (pagoDetalles) => {
    const orderIdToClose = activeOrderId;
    const currentActiveOrder = orders.find(o => o.id === orderIdToClose);

    const isVentaConCredito =
      ['mixto', 'credito_total'].includes(pagoDetalles?.tipoVenta) ||
      (Number(pagoDetalles?.credito || 0) > 0);
    const finalClientId = Number(pagoDetalles?.clienteId || 0);

    if (isVentaConCredito && finalClientId === 0) {
      showAlert({ title: 'Cliente Requerido', message: 'Debe seleccionar un cliente para ventas a crédito o mixtas.', type: 'error' });
      return false;
    }

    const snapshotCart = (currentActiveOrder?.items || []);
    if (!snapshotCart.length) {
      showAlert({ title: "Carrito vacío", message: "Agregue productos antes de facturar." });
      return false;
    }

    const itemsForSale = snapshotCart.map(({ raw, costo, existencia, ...rest }) => ({
      id: rest.id || rest.id_producto,
      quantity: Number(rest.quantity || 0),
      precio: Number(rest.precio_venta ?? rest.precio ?? 0),
    }));

    const subtotalCalc = snapshotCart.reduce((s, i) => s + Number(i.precio_venta ?? i.precio ?? 0) * Number(i.quantity ?? 0), 0);
    const d = currentActiveOrder?.discount;
    const discountAmountCalc =
      d?.type === 'percentage' ? subtotalCalc * (Number(d.value) / 100)
        : d?.type === 'fixed' ? Math.min(subtotalCalc, Number(d.value))
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
      tasaDolarAlMomento: tasaDolar,
      // IMPORTANTE: Enviamos el ID del pedido original para que el backend lo cierre
      originalOrderId: currentActiveOrder?.serverSaleId || null 
    };

    try {
      const response = await api.createSale(saleToCreate, token);

      // REGISTRO DE CAJA (ENTRADA DE DINERO EN TURNO ACTUAL)
      const esCredito = (pagoDetalles.credito || 0) > 0;
      const cajaTx = {
        id: `venta-${response?.saleId || Date.now()}`,
        type: esCredito ? 'venta_credito' : 'venta_contado',
        amount: totalCalc,
        note: `Venta #${response?.saleId || ''} ${esCredito ? '(CRÉDITO)' : ''} ${saleToCreate.originalOrderId ? `(Pago Pedido #${saleToCreate.originalOrderId})` : ''}`,
        at: new Date().toISOString(),
        pagoDetalles: { ...pagoDetalles, clienteId: finalClientId, ingresoCaja }
      };
      
      addCajaTransaction(cajaTx);
      
      try { 
          await api.addCajaTx({ userId, tx: cajaTx }, token); 
      } catch (cajaError) { 
          console.error("Error sincronizando caja:", cajaError);
      }

      // Limpieza del ticket activo
      const filtered = orders.filter(o => String(o.id) !== String(orderIdToClose));
      let newOrders = filtered;
      let nextActiveId = null;
      if (filtered.length === 0) {
        const base = createEmptyTicket(0);
        newOrders = [base];
        nextActiveId = base.id;
      } else {
        nextActiveId = filtered[0].id;
      }
      setOrders(newOrders);
      setActiveOrderId(nextActiveId);
      if (userId) saveTickets(userId, newOrders, nextActiveId);

      // Impresión
      const txToPrint = {
        ...(response?.saleData || {}),
        items: response?.saleData?.items || itemsForSale,
        pagoDetalles: response?.saleData?.pagoDetalles || saleToCreate.pagoDetalles,
        subtotal: response?.saleData?.subtotal ?? subtotalCalc,
        descuento: response?.saleData?.descuento ?? discountAmountCalc,
        total_venta: response?.saleData?.total_venta ?? totalCalc,
        totalVenta: response?.saleData?.totalVenta ?? totalCalc,
        userId: currentUser?.id_usuario || currentUser?.id,
        usuarioNombre: currentUser?.nombre_usuario || currentUser?.name,
      };

      showAlert({ title: "Éxito", message: "Venta realizada y dinero ingresado a caja." });
      setTimeout(() => askForPrint(txToPrint), 0);

      await refreshData();
      return true;
    } catch (error) {
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
          const tx = {
            id: `cancelacion-${saleId}`,
            type: montoARestar > 0 ? 'salida' : 'entrada',
            amount: Math.abs(montoARestar),
            note: `Cancelación Venta #${saleId}`,
            pagoDetalles: { ingresoCaja: -montoARestar }
          };
          addCajaTransaction(tx);
          try { await api.addCajaTx({ userId, tx }, token); } catch { }
        }
      }
      showAlert({ title: "Éxito", message: `Venta #${saleId} cancelada. 💸` });
      await refreshData();
    } catch (error) {
      showAlert({ title: "Error de Cancelación", message: `No se pudo cancelar la venta #${saleId}.`, type: "error" });
    }
  };

  const handleReturnItem = async (sale, item, qty) => {
    if (!token) return;

    const userIdLocal = currentUser?.id_usuario ?? currentUser?.id ?? JSON.parse(localStorage.getItem('me') || '{}')?.id_usuario ?? JSON.parse(localStorage.getItem('me') || '{}')?.id;
    const quantity = Number(qty);
    const productId = item.id ?? item.id_producto;
    const unitPrice = Number(item.precio ?? item.precio_unitario ?? item.precio_venta ?? 0);

    if (!sale?.id || !item || !Number.isFinite(quantity) || quantity <= 0 || !userIdLocal) {
      showAlert({ title: "Error", message: "Datos de devolución incompletos o inválidos." });
      return;
    }

    const body = {
      originalSaleId: sale.id,
      item: { id: productId, id_producto: productId, precio: unitPrice > 0 ? unitPrice : undefined, nombre: item.nombre ?? item.descripcion ?? item.producto ?? '' },
      quantity,
      userId: userIdLocal
    };

    showAlert({ title: "Procesando", message: `Devolviendo ${quantity} de ${item.nombre || 'producto'}...`, type: "loading" });
    try {
      await api.returnItem(body, token);
      showAlert({ title: "Éxito", message: `Devolución registrada. ↩️` });
      await refreshData();
    } catch (error) {
      const msg = (error?.message || '').includes('Faltan datos')
        ? 'Faltan datos para la devolución. Verifica usuario, venta, producto y cantidad.'
        : (error?.message || 'No se pudo devolver el producto.');
      showAlert({ title: "Error", message: msg });
    }
  };

  const handleReprintTicket = (transaction, creditStatus = null) => {
    askForPrint(transaction);
  };

  const handleOpenHistoryModal = () => openModal('history', { loadSalesFunction: loadSalesFromDB });

  const handleOpenProformaFlow = () => {
    showPrompt({
      title: 'Crear Proforma',
      message: '¿A nombre de quién se emite la proforma?',
      inputType: 'text',
      initialValue: '',
      onConfirm: (nombre) => {
        const proformaNumero = nextProformaNumber();

        openModal('proforma', {
          proformaFor: (nombre || '').trim(),
          currentUser,
          setTicketData: (payload = {}) => {
            const baseTx = payload?.transaction || {};
            const tx = {
              ...baseTx,
              isProforma: true,
              id: baseTx.id ?? proformaNumero,
              proformaNombre: (nombre || '').trim(),
              usuarioNombre: baseTx.usuarioNombre
                ?? currentUser?.nombre_usuario
                ?? currentUser?.name
                ?? 'Cajero',
            };
            openTicketWith(tx, payload);
          }
        });
      }
    });
  };

  /* -----------------------------------------------------------------
   * 3.11. RENDERIZADO
   * ----------------------------------------------------------------- */

  const crossDay = shouldWarnCrossDay(cajaSessionCtx);
  const sessionOpenDate = getSessionOpenedDay(cajaSessionCtx);

  if (!isCajaOpen) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>Caja Cerrada</h1>
        <p>La caja de <strong>{currentUser?.nombre_usuario || 'este usuario'}</strong> está cerrada.</p>
        <S.Button primary onClick={() => openModal('caja')} mt="true"><FaKeyboard /> Abrir Mi Caja (F9)</S.Button>

        {modal.name === 'caja' && (
          <CajaModal
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={cajaSessionCtx}
            onOpenCaja={handleOpenCaja}
            onCloseCaja={handleDoCloseCaja}
            onRegisterTransaction={handleRegisterTransaction}
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

        <div className="right-actions">
           {/* BOTÓN NUEVO: CARGAR PEDIDOS PENDIENTES */}
          <S.Button info onClick={loadPendingOrdersFromServer}>
             <FaClipboardList /> Cargar Pedido
          </S.Button>

          <S.Button dark onClick={handleOpenHistoryModal}>
            <FaHistory /> Historial
          </S.Button>
          <S.Button $cancel onClick={() => openModal('caja')}>
            <FaLock /> Gestionar Caja
          </S.Button>
        </div>
      </S.HeaderActions>

      <S.PageContentWrapper>

        <ProductPanel
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          onProductClick={handleProductClick}
          cartItems={cart}
          inputRef={searchRef}
        />

        <S.CartPanel>
          <div className="cart-fixed-top">

            {crossDay && (
              <S.InfoBox style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffeeba', marginBottom: '.5rem' }}>
                Caja abierta desde {sessionOpenDate}. <strong>Se mantiene activa hasta el cierre.</strong>
              </S.InfoBox>
            )}

            <S.InfoBox className="caja-pill">
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                CAJA: <strong>{currentUser?.nombre_usuario}</strong>
              </p>
              <p style={{ margin: 0 }}>
                Fondo Inicial: <span style={{ fontWeight: 'bold' }}>
                  C${fmt(cajaSessionCtx?.initialAmount || 0)}
                </span>
              </p>
            </S.InfoBox>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <S.Button info onClick={() => showPrompt({
                title: 'Entrada de dinero',
                message: 'Monto a ingresar a caja:',
                inputType: 'number',
                initialValue: '0',
                onConfirm: (val) => {
                  const amount = Number(val);
                  if (!Number.isFinite(amount) || amount <= 0) {
                    showAlert({ title: 'Monto inválido', message: 'Ingresa un número mayor a 0' });
                    return;
                  }
                  showPrompt({
                    title: 'Nota (opcional)',
                    message: 'Describe esta entrada',
                    inputType: 'text',
                    initialValue: 'Entrada de Dinero',
                    onConfirm: (note) => handleRegisterTransaction('entrada', amount, note || 'Entrada de Dinero')
                  });
                }
              })}
              >
                <FaSignInAlt /> Entrada
              </S.Button>

              <S.Button $cancel onClick={() => showPrompt({
                title: 'Salida de dinero',
                message: 'Monto a retirar de caja:',
                inputType: 'number',
                initialValue: '0',
                onConfirm: (val) => {
                  const amount = Number(val);
                  if (!Number.isFinite(amount) || amount <= 0) {
                    showAlert({ title: 'Monto inválido', message: 'Ingresa un número mayor a 0' });
                    return;
                  }
                  showPrompt({
                    title: 'Nota (opcional)',
                    message: 'Describe esta salida',
                    inputType: 'text',
                    initialValue: 'Salida de Dinero',
                    onConfirm: (note) => handleRegisterTransaction('salida', amount, note || 'Salida de Dinero')
                  });
                }
              })}
              >
                <FaSignOutAlt /> Salida
              </S.Button>
            </div>

            <div className="tickets-header">
              <h3 style={{ margin: 0 }}>Tickets Activos ({orders.length})</h3>
              <S.Button primary onClick={handleNewOrder} style={{ marginLeft: 'auto' }}>
                <FaPlus /> Nuevo
              </S.Button>
            </div>

            <S.TicketContainer>
              {orders.map(order => (
                <S.Button
                  key={order.id}
                  style={{ backgroundColor: activeOrderId === order.id ? '#007bff' : '#6c757d', color: 'white' }}
                  onClick={() => setActiveOrderId(order.id)}
                  onDoubleClick={() => handleRenameOrder(order.id, order.name)}
                  title={order.name}
                >
                  <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.name}
                  </span>
                  {' '}({order.items.length})
                </S.Button>
              ))}
            </S.TicketContainer>

            {orders.length > 1 && (
              <S.Button $cancel style={{ width: '100%', marginTop: '5px' }} onClick={() => handleRemoveOrder(activeOrderId)}>
                <FaTrashAlt /> Cerrar Ticket
              </S.Button>
            )}

            <h2 className="cart-title" style={{ marginTop: '1rem' }}>
              <FaShoppingCart />
              <span className="cart-title-name" title={activeOrder.name}>{activeOrder.name}</span>
              <span className="cart-title-count">({cart.length})</span>
            </h2>
          </div>

          <CartContentView
            key={activeOrderId}
            isAdmin={isAdmin}
            products={products}
            cart={cart}
            tasaDolar={tasaDolar}
            onUpdateQty={handleUpdateCartQuantity}
            onRemoveFromCart={(id) => updateActiveCart(cart.filter(i => i.id !== id))}
            onSetManualPrice={handleSetManualPrice}
            onApplyWholesalePrice={handleApplyWholesalePrice}
            onRevertRetailPrice={handleRevertRetailPrice}
            discountAmount={discountAmount}
            subtotal={subtotal}
            total={total}
            onApplyOrderDiscount={applyOrderDiscount}
            onOpenProforma={handleOpenProformaFlow}
            onOpenPayment={() => openModal('payment', { total, initialClientId: activeOrder.clientId })}
          />
        </S.CartPanel>
      </S.PageContentWrapper>

      {/* MODAL NUEVO: LISTA DE PEDIDOS PENDIENTES */}
      {modal.name === 'pendingOrders' && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
             <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                 <h3>Seleccionar Pedido Pendiente</h3>
                 <p style={{fontSize: '0.9rem', color: '#666'}}>Seleccione un pedido para cargarlo al POS y cobrarlo.</p>
                 
                 {pendingOrdersList.length === 0 ? (
                     <p>No hay pedidos pendientes.</p>
                 ) : (
                     <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px'}}>
                         <thead>
                             <tr style={{background: '#f8f9fa', textAlign: 'left'}}>
                                 <th style={{padding: '8px'}}>ID</th>
                                 <th style={{padding: '8px'}}>Cliente</th>
                                 <th style={{padding: '8px'}}>Fecha</th>
                                 <th style={{padding: '8px'}}>Total</th>
                                 <th style={{padding: '8px'}}>Acción</th>
                             </tr>
                         </thead>
                         <tbody>
                             {pendingOrdersList.map(order => (
                                 <tr key={order.id} style={{borderBottom: '1px solid #eee'}}>
                                     <td style={{padding: '8px'}}>#{order.id}</td>
                                     <td style={{padding: '8px'}}>{order.cliente?.nombre || order.clienteNombre || 'Consumidor Final'}</td>
                                     <td style={{padding: '8px'}}>{new Date(order.fecha_creacion || order.fecha).toLocaleDateString()}</td>
                                     <td style={{padding: '8px'}}>C${fmt(order.total_venta || order.total)}</td>
                                     <td style={{padding: '8px'}}>
                                         <S.Button primary style={{padding: '5px 10px', fontSize: '0.8rem'}} onClick={() => handleLoadPendingToPOS(order)}>
                                             Cargar
                                         </S.Button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 )}
                 <div style={{marginTop: '20px', textAlign: 'right'}}>
                     <S.Button $cancel onClick={closeModal}>Cerrar</S.Button>
                 </div>
             </div>
         </div>
      )}

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
        />
      )}

      {modal.name === 'payment' && (
        <PaymentModal
          total={modal.props.total || total}
          tasaDolar={tasaDolar}
          clientes={clients}
          users={allUsers}
          onFinishSale={handleFinishSale}
          showAlert={showAlert}
          onClose={closeModal}
          initialClientId={String(activeOrder.clientId || 0)}
          cartSnapshot={cart}
          orderSubtotal={subtotal}
          orderDiscountAmount={discountAmount}
        />
      )}

      {modal.name === 'caja' && (
        <CajaModal
          currentUser={currentUser}
          isCajaOpen={isCajaOpen}
          session={cajaSessionCtx}
          onOpenCaja={handleOpenCaja}
          onCloseCaja={handleDoCloseCaja}
          onRegisterTransaction={handleRegisterTransaction}
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
          proformaFor={modal.props.proformaFor || ''}
          onClose={closeModal}
          setTicketData={setTicketData}
          currentUser={currentUser}
        />
      )}

      {ticketData.transaction && (
        <TicketModal
          transaction={ticketData.transaction}
          creditStatus={ticketData.creditStatus}
          clients={clients}
          users={allUsers}
          isOpen={ticketData.shouldOpen}
          onClose={() => setTicketData({ transaction: null, creditStatus: null, shouldOpen: false })}
          printMode={ticketData.printMode}
          currentUser={currentUser}
        />
      )}

      {ticketData.shouldOpen && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10000 }}>
          <S.Button $cancel onClick={() => setTicketData({ transaction: null, creditStatus: null, shouldOpen: false })}>
            <FaTimes /> Cerrar vista previa
          </S.Button>
        </div>
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

/* =================================================================
 * 4. SUBCOMPONENTE CartContentView
 * ================================================================= */
function CartContentView({
  isAdmin, products, cart, onUpdateQty, onRemoveFromCart, onSetManualPrice,
  onApplyWholesalePrice, onRevertRetailPrice, discountAmount, subtotal, total,
  onApplyOrderDiscount, onOpenProforma, onOpenPayment, tasaDolar
}) {
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

          const code =
            item.codigo?.toString() ||
            item.codigo_barras?.toString() ||
            item.barcode?.toString() ||
            item.id_producto?.toString() ||
            item.id?.toString() ||
            '';

          const unit = Number(item.precio_venta || item.precio || 0);
          const totalLine = unit * Number(item.quantity || 0);

          return (
            <S.CartItemWrapper key={item.id}>
              <div className="item-qty">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  max={item.existencia}
                  onChange={(e) => onUpdateQty(item.id, e.target.value)}
                />
              </div>

              <div className="item-info" style={{ display: 'grid', gap: 6, width: '100%' }}>
                <p className="item-name" title={item.nombre}
                  style={{ margin: 0, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2 }}>
                  {item.nombre}
                </p>

                <div className="item-meta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: -2 }}>
                  {code && <span>Código: <strong>{code}</strong></span>}
                  <span>Stock: <strong>{item.existencia}</strong></span>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6 }}>
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

              <div className="item-unit">C${fmt(unit)} <span style={{ color: '#6c757d' }}>/u</span></div>
              <div className="item-total">C${fmt(totalLine)}</div>

              <S.Button $cancel style={{ padding: '0.4rem', minWidth: 'auto', marginLeft: '1rem' }} onClick={() => onRemoveFromCart(item.id)}>
                <FaTimes />
              </S.Button>
            </S.CartItemWrapper>
          );
        })}
      </div>

      <div className="cart-fixed-bottom">
        <div>
          <S.TotalsRow><span>Subtotal:</span><span>C${fmt(subtotal)}</span></S.TotalsRow>
          <S.TotalsRow
            onClick={onApplyOrderDiscount}
            style={{ cursor: 'pointer', color: discountAmount > 0 ? '#dc3545' : 'inherit' }}
          >
            <span><FaPercentage /> Descuento Total:</span>
            <span>- C${fmt(discountAmount)}</span>
          </S.TotalsRow>
          <S.TotalsRow $bordered $bold className="grand-total">
            <span>TOTAL:</span><span>C${fmt(total)}</span>
          </S.TotalsRow>
        </div>

        <S.InfoBox style={{ backgroundColor: '#fff', padding: '.5rem', borderRadius: 8 }}>
          <FaDollarSign style={{ marginRight: 5 }} /> Tasa Dólar: <strong>C${fmt(tasaDolar)}</strong>
        </S.InfoBox>

        <div className="cart-actions" style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <S.Button info onClick={onOpenProforma} disabled={cart.length === 0}>Crear Proforma</S.Button>
          <S.Button pay onClick={onOpenPayment} disabled={cart.length === 0}>Proceder al Pago (F2)</S.Button>
        </div>
      </div>
    </>
  );
}