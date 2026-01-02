/* =================================================================
 * 1. IMPORTACIONES
 * ================================================================= */

// React Hooks
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

// Iconos
import {
  FaArrowLeft, FaKeyboard, FaTags, FaShoppingCart, FaPlus, FaMinus,
  FaTrashAlt, FaTimes, FaPercentage, FaHistory, FaLock, FaDollarSign, FaEdit, FaRedo,
  FaSignInAlt, FaSignOutAlt, FaPrint,
  FaBarcode, FaAlignLeft,
  FaClipboardList, FaFileInvoiceDollar, FaChevronDown
} from 'react-icons/fa';

// Contextos, APIs y Utilidades
import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';

// Componentes Estilizados y de Modal
import ProductPanel from './components/ProductPanel.jsx';
import * as S from './POS.styles.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import CajaModal from './components/CajaModal.jsx';
import SalesHistoryModal from './components/SalesHistoryModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import PromptModal from './components/PromptModal.jsx';
import AlertModal from './components/AlertModal.jsx';
import ProformaModal from './components/ProformaModal.jsx';
import TicketModal from './components/TicketModal.jsx';

// Utilidades
import { normalizeSale } from './printing/printUtils'; // Asumimos que existen
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

const createEmptyTicket = (clientId = 0) => ({
  id: Date.now(),
  name: 'Ticket Nuevo',
  items: [],
  clientId,
  discount: { type: 'none', value: 0 },
  serverSaleId: null
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

  // Estado para visibilidad del carrito en móvil
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Gestión de Caja y Ventas
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [tasaDolar, setTasaDolar] = useState(loadTasaDolar(userId, 36.60));
  const [dailySales, setDailySales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

  // Gestión de Modales
  const [modal, setModal] = useState({ name: null, props: {} });
  const [ticketData, setTicketData] = useState({ transaction: null, creditStatus: null, shouldOpen: false });

  // Lista de Pedidos Pendientes para cargar
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

  // Sincronización básica de sesión caja
  const reloadCajaSession = useCallback(async () => {
    if (!userId || !token) return;
    try {
      const serverSession = await api.getCajaSession(userId, token);
      if (serverSession) {
        setCajaSession(serverSession);
        saveCajaSession(userId, serverSession);
      }
    } catch (error) { }
  }, [userId, token, setCajaSession]);

  // Carga de pedidos pendientes del servidor (para importar al POS)
  const loadPendingOrdersFromServer = async () => {
    if (!token) { showAlert({ title: "Error", message: "No hay token de autenticación." }); return; }
    openModal('alert', { title: "Cargando", message: "Buscando pedidos pendientes...", type: "loading" });

    try {
      let allPedidos = [];
      try {
        const pedidosResponse = await api.fetchOrders(token);
        if (Array.isArray(pedidosResponse)) allPedidos = pedidosResponse;
        else if (pedidosResponse?.data && Array.isArray(pedidosResponse.data)) allPedidos = pedidosResponse.data;
        else if (pedidosResponse?.orders && Array.isArray(pedidosResponse.orders)) allPedidos = pedidosResponse.orders;
      } catch (e) { }

      const pendientes = allPedidos.filter(p => {
        if (!p || typeof p !== 'object') return false;
        const state = String(p.estado || p.status || '').toUpperCase().trim();
        const tot = Number(p.total || p.monto_total || 0);
        const abo = Number(p.abonado || p.pagado || 0);
        const sal = tot - abo;
        return (
          (state.includes('PENDIENTE') || state.includes('APARTADO') || state.includes('CREDITO') || sal > 0.5) &&
          !state.includes('CANCELADO') && !state.includes('ANULADO') && !state.includes('COMPLETADO')
        );
      });

      // Intentar buscar también en ventas si no hay pedidos (legacy fallback)
      if (pendientes.length === 0) {
        try {
          const vResp = await api.fetchSales(token);
          let allVentas = Array.isArray(vResp) ? vResp : (vResp?.data || []);
          const vPend = allVentas.filter(v => {
            const st = String(v.estado || v.status || '').toUpperCase().trim();
            const tot = Number(v.total || v.total_venta || 0);
            const pag = Number(v.monto_pagado || v.abonado || 0);
            const sal = tot - pag;
            return (st.includes('PENDIENTE') || st.includes('APARTADO') || sal > 0.5) &&
              !st.includes('CANCELADO') && !st.includes('COMPLETADO');
          });
          if (vPend.length > 0) pendientes.push(...vPend);
        } catch (e) { }
      }

      setPendingOrdersList(pendientes);
      closeModal();

      if (pendientes.length === 0) {
        showAlert({ title: "Sin Pendientes", message: "No se encontraron pedidos o ventas pendientes.", type: "info" });
      } else {
        openModal('pendingOrders');
      }

    } catch (e) {
      closeModal();
      showAlert({ title: "Error de Conexión", message: `No se pudieron cargar los pedidos: ${e.message}` });
    }
  };

  const handleLoadPendingToPOS = (pendingSale) => {
    const tot = Number(pendingSale.total || pendingSale.total_venta || pendingSale.monto_total || 0);
    const abo = Number(pendingSale.abonado || pendingSale.pagado || 0);
    const sal = tot - abo;
    const cliName = pendingSale.cliente?.nombre || pendingSale.clienteNombre || `Pedido #${pendingSale.id}`;
    const cliId = pendingSale.cliente?.id_cliente || pendingSale.clienteId || 0;

    if (sal <= 0.5 && !(String(pendingSale.estado).toUpperCase().includes('PENDIENTE') || String(pendingSale.estado).toUpperCase().includes('APARTADO'))) {
      showAlert({ title: "Pedido Cerrado", message: `El pedido #${pendingSale.id} ya está pagado.`, type: "warning" });
      if (typeof closeModal === 'function') closeModal();
      return;
    }

    const itemsSrc = pendingSale.items || pendingSale.detalles || pendingSale.productos || [];
    const cartItems = itemsSrc.map(i => {
      const pid = String(i.id_producto || i.producto_id || i.id);
      const catProd = products.find(p => String(p.id) === pid || String(p.codigo) === String(i.codigo || i.codigo_producto));
      const price = Number(i.precio || i.precio_unitario || i.precio_venta || catProd?.precio_venta || 0);
      if (price === 0 || Number(i.cantidad || 0) === 0) return null;
      const finalId = catProd?.id || pid;

      return {
        id: finalId, id_producto: finalId,
        nombre: i.nombre || i.producto || i.descripcion || catProd?.nombre || 'Producto Desconocido',
        codigo: i.codigo || catProd?.codigo,
        quantity: Number(i.cantidad || 1),
        precio_venta: price,
        existencia: catProd?.existencia || 9999,
        costo: catProd?.costo || i.costo || 0,
        originalOrderItem: i
      };
    }).filter(Boolean);

    if (cartItems.length === 0) {
      showAlert({ title: "Pedido Vacío", message: "Este pedido no tiene productos válidos.", type: "error" });
      if (typeof closeModal === 'function') closeModal();
      return;
    }

    const newTicketId = Date.now();
    const newTicket = {
      id: newTicketId, name: cliName, items: cartItems, clientId: cliId,
      serverSaleId: pendingSale.id, originalOrderData: pendingSale, discount: { type: 'none', value: 0 },
      createdAt: new Date().toISOString(), isPendingOrder: true
    };
    setOrders(prev => [...prev, newTicket]);
    setActiveOrderId(newTicketId);
    if (typeof closeModal === 'function') closeModal();
    showAlert({ title: "✅ Cargado", message: `Pedido #${pendingSale.id} cargado. Saldo: C$${fmt(sal)}`, type: "success" });
  };


  /* -----------------------------------------------------------------
   * 3.6. EFECTOS
   * ----------------------------------------------------------------- */
  useEffect(() => { if (userId) saveTickets(userId, orders, activeOrderId); }, [userId, orders, activeOrderId]);

  // Auto-llenar nombre en Proformas
  useEffect(() => {
    const tx = ticketData.transaction;
    if (!tx) return;
    if (tx.isProforma && (!tx.id || !tx.usuarioNombre)) {
      setTicketData(prev => ({ ...prev, transaction: { ...tx, id: tx.id || nextProformaNumber(), usuarioNombre: tx.usuarioNombre || currentUser?.nombre_usuario || 'Cajero', } }));
    }
  }, [ticketData.transaction, currentUser, setTicketData]);

  // Limpiar ticket tras impresión
  useEffect(() => {
    const handleAfterPrint = () => { setTicketData({ transaction: null, creditStatus: null, shouldOpen: false }); };
    if (ticketData.shouldOpen) { window.addEventListener('afterprint', handleAfterPrint); }
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [ticketData.shouldOpen]);

  // Sincronizar tickets entre pestañas
  useEffect(() => {
    if (!userId) return;
    return subscribeTicketChanges(userId, (data) => {
      if (data?.orders && data?.activeOrderId != null) {
        setOrders(data.orders);
        setActiveOrderId(data.activeOrderId);
      }
    });
  }, [userId]);

  // Cargar ventas si caja abierta
  useEffect(() => { if (isCajaOpen) loadSalesFromDB(); }, [isCajaOpen, loadSalesFromDB]);

  // Actualizar productos al inicio
  useEffect(() => { setProductsState(initialProducts || []); }, [initialProducts]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') { e.preventDefault(); (searchRef.current || document.querySelector('input[placeholder*="Buscar"]'))?.focus(); }
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
    const newSession = { openedAt: new Date().toISOString(), openedBy: toUserRef(currentUser, userId), initialAmount: Number(monto || 0), transactions: [], closedAt: null };
    saveCajaSession(userId, newSession);
    saveTasaDolar(userId, (nuevaTasa ?? tasaDolar));
    setCajaSession(newSession);
    setIsCajaOpen(true);
    setTasaDolar(Number(nuevaTasa ?? tasaDolar));
    closeModal();
    try { await api.openCajaSession({ userId, ...newSession, tasaDolar: Number(nuevaTasa ?? tasaDolar) }, token); } catch (e) { }
  };

  const handleDoCloseCaja = async (countedAmount) => {
    if (orders.some(o => (o.items?.length || 0) > 0)) { showAlert({ title: 'Pendiente', message: 'Cierra los tickets pendientes antes de cerrar caja.' }); return; }
    const current = cajaSessionCtx;
    if (!current || !userId) return;

    // Calcular efectivo esperado
    const movimientoNetoEfectivo = (current.transactions || []).reduce((total, tx) => {
      let pd = tx.pagoDetalles || {};
      if (typeof pd === 'string') try { pd = JSON.parse(pd); } catch { pd = {}; }

      const type = (tx.type || '').toLowerCase();
      let realCash = 0;

      if (type.startsWith('venta')) {
        if (pd.efectivo !== undefined) {
          // Lógica nueva: lo que entró fisico
          const inCash = Number(pd.efectivo || 0); const outCash = Number(pd.cambio || 0);
          const inDol = Number(pd.dolares || 0) * Number(pd.tasa || tx.tasaDolarAlMomento || 1);
          realCash = (inCash + inDol) - outCash;
        } else {
          // fallback
          realCash = Number(tx.amount || 0) - (Number(pd.tarjeta || 0) + Number(pd.transferencia || 0) + Number(pd.credito || 0));
        }
      } else {
        // Entradas/Salidas directas
        realCash = Number(pd.ingresoCaja !== undefined ? pd.ingresoCaja : (tx.amount || 0));
        if ((type === 'salida' || type.includes('devolucion')) && realCash > 0) realCash = -realCash;
      }
      return total + realCash;
    }, 0);

    const esperado = Number(current.initialAmount) + movimientoNetoEfectivo;
    const finalSession = { ...current, closedAt: new Date().toISOString(), closedBy: toUserRef(currentUser, userId), countedAmount: Number(countedAmount), difference: Number(countedAmount) - esperado };

    saveCajaSession(userId, finalSession);
    setCajaSession(finalSession);
    setIsCajaOpen(false);
    closeModal();
    try { await api.closeCajaSession({ userId, countedAmount: Number(countedAmount), closedAt: finalSession.closedAt, closedBy: finalSession.closedBy, difference: finalSession.difference, expectedAmount: esperado }, token); } catch (e) { }
    showAlert({ title: "Caja Cerrada", message: finalSession.difference === 0 ? 'Balance perfecto. ✅' : `Diferencia: C$${fmt(finalSession.difference)} ⚠️` });
  };

  const handleRegisterTransaction = async (type, amount, note) => {
    if (!userId || !amount) { showAlert({ title: "Error", message: "Usuario no identificado." }); return; }
    const amountVal = Number(amount);
    const ingresoCaja = type === 'entrada' ? amountVal : -amountVal;
    const tx = { id: `${type}-${Date.now()}`, type, amount: amountVal, note: note || (type === 'entrada' ? 'Entrada' : 'Salida'), at: new Date().toISOString(), pagoDetalles: { ingresoCaja } };
    addCajaTransaction(tx);
    try { await api.addCajaTx({ userId, tx }, token); } catch (e) { }
    showAlert({ title: "Éxito", message: `${type === 'entrada' ? 'Entrada' : 'Salida'}: C$${fmt(amount)}` });
  };

  // Sync caja loop
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const s = await fetchCajaSessionFromServer(userId, api);
      if (s) { setCajaSession(s); setIsCajaOpen(!s.closedAt); setTasaDolar(loadTasaDolar(userId, s.tasaDolar || tasaDolar)); saveCajaSession(userId, s); }
      else { const l = loadCajaSession(userId); if (l && !l.closedAt) { setCajaSession(l); setIsCajaOpen(true); } }
    })();
    return subscribeCajaChanges(userId, (s) => { if (s) { setCajaSession(s); setIsCajaOpen(!s.closedAt); setTasaDolar(loadTasaDolar(userId, s.tasaDolar || tasaDolar)); } });
  }, [userId]);


  /* -----------------------------------------------------------------
   * 3.8. LÓGICA DE ÓRDENES Y CARRITO
   * ----------------------------------------------------------------- */
  const updateActiveOrder = (key, value) => { setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o)); };
  const updateActiveCart = (newItems) => updateActiveOrder('items', newItems);

  const handleRemoveOrder = (id) => {
    setOrders(prev => {
      const filtered = prev.filter(o => o.id !== id);
      if (filtered.length === 0) {
        const n = createEmptyTicket(0);
        setActiveOrderId(n.id);
        return [n];
      }
      if (activeOrderId === id) setActiveOrderId(filtered[0].id);
      return filtered;
    });
  };

  const handleNewOrder = () => {
    setOrders(prev => {
      const n = createEmptyTicket(activeOrder.clientId || 0);
      setActiveOrderId(n.id);
      return [...prev, n];
    });
  };

  const handleRenameOrder = (id, oldName) => {
    showPrompt({ title: "Renombrar", message: "Nuevo nombre:", initialValue: oldName, inputType: 'text', onConfirm: (val) => { if (val) setOrders(prev => prev.map(o => o.id === id ? { ...o, name: val } : o)); closeModal(); } });
  };

  const applyOrderDiscount = () => {
    showPrompt({
      title: "Descuento (%)", message: "Porcentaje:", inputType: 'number', onConfirm: (val) => {
        const n = parseFloat(val);
        if (!isNaN(n) && n >= 0 && n <= 100) { updateActiveOrder('discount', { type: 'percentage', value: n }); showAlert({ title: "Aplicado", message: `${n}% descuento` }); }
        else showAlert({ title: "Error", message: "0-100%" });
        closeModal();
      }
    });
  };

  const handleAddToCart = (product, quantity = 1) => {
    if (window.innerWidth <= 960) setIsMobileCartOpen(true);

    const existing = cart.find(i => i.id === product.id);
    const newQty = (existing?.quantity || 0) + quantity;
    if (newQty > product.existencia) { showAlert({ title: "Stock", message: `Solo hay ${product.existencia}` }); return; }

    const price = existing?.precio_venta || product.precio;
    const newItem = { ...product, quantity: newQty, precio_venta: price };

    const newCart = existing ? cart.map(i => i.id === product.id ? newItem : i) : [...cart, newItem];
    updateActiveCart(newCart);
  };

  const handleProductClick = (p) => {
    if (p.existencia <= 0) { showAlert({ title: "Agotado", message: "Sin stock" }); return; }
    handleAddToCart(p, 1);
  };

  const handleUpdateCartQuantity = (id, qty) => {
    const pRef = products.find(p => p.id === id) || cart.find(c => c.id === id);
    if (!pRef) return;
    let q = parseInt(qty, 10) || 0;
    if (q <= 0) { updateActiveCart(cart.filter(i => i.id !== id)); return; }
    if (q > (pRef.existencia || 9999)) { q = pRef.existencia; showAlert({ title: "Stock", message: "Máximo alcanzado" }); }

    updateActiveCart(cart.map(i => i.id === id ? { ...i, quantity: q } : i));
  };

  const handleSetManualPrice = (item) => {
    const pData = products.find(p => p.id === item.id) || item;
    const costo = Number(pData.costo || 0);
    showPrompt({
      title: "Precio Manual", message: `Costo: C$${fmt(costo)}. Nuevo precio:`, initialValue: item.precio_venta, inputType: 'number', onConfirm: (val) => {
        const p = parseFloat(val);
        if (p < costo) { showAlert({ title: "Error", message: "Precio menor al costo" }); return; }
        updateActiveCart(cart.map(i => i.id === item.id ? { ...i, precio_venta: p } : i));
        closeModal();
      }
    });
  };

  // Finalizar Venta
  const handleFinishSale = async (pagoDetalles) => {
    const orderToCloseId = activeOrderId;
    const currentOrder = orders.find(o => o.id === orderToCloseId);

    const isCredit = ['mixto', 'credito_total'].includes(pagoDetalles.tipoVenta) || Number(pagoDetalles.credito || 0) > 0;
    if (isCredit && !pagoDetalles.clienteId) { showAlert({ title: "Error", message: "Selecciona un cliente para crédito." }); return false; }

    if (cart.length === 0) { showAlert({ title: "Vacío", message: "Carrito vacío" }); return false; }

    // Preparar payload
    const payloadItems = cart.map(i => ({
      id: i.id, id_producto: i.id, quantity: i.quantity, precio: i.precio_venta,
      nombre: i.nombre, codigo: i.codigo, costo: i.costo, existencia: i.existencia
    }));

    const sub = cart.reduce((s, i) => s + (i.precio_venta * i.quantity), 0);
    const disc = discountAmount;
    const tot = sub - disc;

    const cashIn = Number(pagoDetalles.efectivo || 0) + (Number(pagoDetalles.dolares || 0) * tasaDolar) - Number(pagoDetalles.cambio || 0);
    const ingresoCaja = Math.max(0, cashIn) + Number(pagoDetalles.tarjeta || 0) + Number(pagoDetalles.transferencia || 0) + Number(pagoDetalles.otros || 0);

    const saleData = {
      totalVenta: tot, subtotal: sub, descuento: disc, items: payloadItems,
      pagoDetalles: { ...pagoDetalles, ingresoCaja },
      userId, clientId: Number(pagoDetalles.clienteId || 0), tasaDolarAlMomento: tasaDolar,
      originalOrderId: currentOrder.serverSaleId
    };

    try {
      const resp = await api.createSale(saleData, token);

      // Registrar en caja local
      const txCaja = {
        id: `venta-${resp.saleId || Date.now()}`,
        type: isCredit ? 'venta_credito' : 'venta_contado',
        amount: ingresoCaja,
        note: `Venta #${resp.saleId}`,
        at: new Date().toISOString(),
        pagoDetalles: saleData.pagoDetalles,
        items: payloadItems
      };
      addCajaTransaction(txCaja);
      try { await api.addCajaTx({ userId, tx: txCaja }, token); } catch { };

      // Cerrar ticket
      handleRemoveOrder(orderToCloseId);
      await refreshData();

      showAlert({ title: "Venta Exitosa", message: "Venta guardada." });

      // Impresión
      if (pagoDetalles.shouldPrintNow) {
        const printData = {
          ...saleData, ...resp.saleData, id: resp.saleId || resp.result?.id,
          usuarioNombre: currentUser.nombre_usuario, items: payloadItems
        };
        setTicketData({ transaction: printData, shouldOpen: true, printMode: '80' });
      }
      return true;

    } catch (err) {
      showAlert({ title: "Error", message: err.message });
      return false;
    }
  };

  /* -----------------------------------------------------------------
   * 4. RENDER VISTA CAJA CERRADA
   * ----------------------------------------------------------------- */
  if (!isCajaOpen) {
    return (
      <S.PageWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#64748b' }}>Caja Cerrada</h1>
        <p>Debes abrir caja para vender.</p>
        <S.Button primary onClick={() => openModal('caja')}><FaKeyboard /> Abrir Caja (F9)</S.Button>
        {modal.name === 'caja' && <CajaModal isOpen={true} isCajaOpen={false} onClose={closeModal} onOpenCaja={handleOpenCaja} session={cajaSessionCtx} />}
      </S.PageWrapper>
    );
  }

  /* -----------------------------------------------------------------
   * 5. RENDER PRINCIPAL
   * ----------------------------------------------------------------- */
  const cartItemCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <S.PageWrapper>
      {/* HEADER */}
      <S.HeaderActions>
        <S.BackButton to="/dashboard"><FaArrowLeft /> Regresar</S.BackButton>
        <div style={{ fontWeight: 'bold', color: '#334155' }}>Punto de Venta</div>
        <div className="right-actions">
          <S.Button secondary onClick={refreshData} title="Refrescar">↻</S.Button>
          <S.Button secondary onClick={() => openModal('caja')} title="Caja">
            <FaLock /> {currentUser?.nombre_usuario}
          </S.Button>
          <S.Button secondary onClick={() => openModal('history')} title="Historial"><FaHistory /></S.Button>
          <S.Button secondary onClick={loadPendingOrdersFromServer} title="Cargar Pedido"><FaClipboardList /></S.Button>
        </div>
      </S.HeaderActions>

      <S.PageContentWrapper>

        {/* PRODUCTOS */}
        <S.MainPanel>
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
        </S.MainPanel>

        {/* CARRITO (Panel Lateral o Bottom Sheet en móvil) */}
        <S.CartPanel isOpen={isMobileCartOpen}>

          {/* Header Móvil del Carrito */}
          <div style={{ display: window.innerWidth <= 960 ? 'flex' : 'none', justifyContent: 'space-between', marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Tu Carrito</h3>
            <S.Button secondary onClick={() => setIsMobileCartOpen(false)}><FaTimes /> Cerrar</S.Button>
          </div>

          <div className="cart-fixed-top">
            {/* Tabs de Tickets */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Tickets Abiertos:</span>
              <S.Button secondary onClick={handleNewOrder} style={{ padding: '4px 8px', fontSize: '0.8rem' }}><FaPlus /> Nuevo</S.Button>
            </div>
            <S.TicketContainer>
              {orders.map(o => (
                <S.Button
                  key={o.id}
                  onClick={() => setActiveOrderId(o.id)}
                  primary={o.id === activeOrderId}
                  secondary={o.id !== activeOrderId}
                  style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: '32px' }}
                >
                  {o.name}
                  {orders.length > 1 && <span style={{ marginLeft: 5, opacity: 0.6 }} onClick={(e) => { e.stopPropagation(); handleRemoveOrder(o.id) }}>×</span>}
                </S.Button>
              ))}
            </S.TicketContainer>

            {shouldWarnCrossDay(cajaSessionCtx) && (
              <div style={{ background: '#fff3cd', color: '#856404', padding: '5px', fontSize: '0.8rem', borderRadius: 6, marginBottom: 5 }}>
                ⚠️ Caja de fecha anterior abierta.
              </div>
            )}

            {/* Título Ticket Actual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 0' }}>
              <FaShoppingCart color="#3b82f6" />
              <span style={{ fontWeight: 'bold' }}>{activeOrder.name}</span>
              <FaEdit style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => handleRenameOrder(activeOrder.id, activeOrder.name)} />
              <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 'auto' }}>{cartItemCount} ítems</span>
            </div>
          </div>

          {/* Lista Scrollable */}
          <div className="cart-scroll">
            {cart.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#cbd5e1' }}>
                <FaShoppingCart size={40} style={{ marginBottom: 10 }} />
                <p>Carrito vacío</p>
              </div>
            ) : (
              cart.map(item => (
                <S.CartItemWrapper key={item.id}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      C$ {fmt(item.precio_venta)}
                      {item.originalOrderItem && <span style={{ color: '#f59e0b', marginLeft: 5 }}>★</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>C$ {fmt(item.precio_venta * item.quantity)}</div>
                    <S.QtyControl>
                      <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}><FaMinus size={8} /></S.RoundBtn>
                      <span style={{ width: 18, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                      <S.RoundBtn onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}><FaPlus size={8} /></S.RoundBtn>
                    </S.QtyControl>
                    <S.RoundBtn onClick={() => updateActiveCart(cart.filter(x => x.id !== item.id))} style={{ color: '#ef4444' }}>
                      <FaTrashAlt size={10} />
                    </S.RoundBtn>
                    {isAdmin && <S.RoundBtn onClick={() => handleSetManualPrice(item)} style={{ color: '#f59e0b' }}><FaDollarSign size={10} /></S.RoundBtn>}
                  </div>
                </S.CartItemWrapper>
              ))
            )}
          </div>

          {/* Footer Fijo */}
          <div className="cart-fixed-bottom">
            {activeOrder.discount?.value > 0 && (
              <S.InfoBox>
                <span>Desc: {activeOrder.discount.value}{activeOrder.discount.type === 'percentage' ? '%' : ''}</span>
                <span>-C$ {fmt(discountAmount)}</span>
                <FaTimes onClick={() => updateActiveOrder('discount', { type: 'none', value: 0 })} style={{ cursor: 'pointer' }} />
              </S.InfoBox>
            )}

            <S.TotalsRow>
              <span>Subtotal</span>
              <span>C$ {fmt(subtotal)}</span>
            </S.TotalsRow>
            <S.TotalsRow className="grand-total">
              <span>TOTAL</span>
              <span>C$ {fmt(total)}</span>
            </S.TotalsRow>

            <div className="cart-actions">
              <S.Button secondary onClick={applyOrderDiscount} disabled={!cart.length}><FaPercentage /> Desc</S.Button>
              <S.Button danger onClick={() => updateActiveCart([])} disabled={!cart.length}><FaTrashAlt /> Vaciar</S.Button>
            </div>

            <S.Button primary onClick={() => openModal('payment', { total, initialClientId: activeOrder.clientId })} disabled={!cart.length} style={{ width: '100%', marginTop: 10, padding: 15, fontSize: '1.1rem' }}>
              <FaDollarSign /> COBRAR (F2)
            </S.Button>
          </div>
        </S.CartPanel>

      </S.PageContentWrapper>

      {/* FAB MÓVIL */}
      <S.MobileCartToggle onClick={() => setIsMobileCartOpen(true)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaShoppingCart /> <span>Ver Pedido</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 10, fontSize: '0.8rem' }}>{cartItemCount}</span>
        </div>
        <span>C$ {fmt(total)} <FaChevronDown style={{ transform: 'rotate(180deg)', marginLeft: 5 }} /></span>
      </S.MobileCartToggle>

      {/* MODALES GLOBALES */}
      {modal.name === 'caja' && <CajaModal isOpen={true} onClose={closeModal} session={cajaSessionCtx} isCajaOpen={isCajaOpen} onOpenCaja={handleOpenCaja} onCloseCaja={handleDoCloseCaja} onRegisterTransaction={handleRegisterTransaction} />}
      {modal.name === 'payment' && <PaymentModal isOpen={true} onClose={closeModal} total={modal.props.total} initialClientId={modal.props.initialClientId} cartSnapshot={cart} orderSubtotal={subtotal} orderDiscountAmount={discountAmount} onFinishSale={handleFinishSale} showAlert={showAlert} tasaDolar={tasaDolar} clientes={clients} users={allUsers} />}
      {modal.name === 'history' && <SalesHistoryModal isOpen={true} onClose={closeModal} dailySales={dailySales} loadSales={loadSalesFromDB} onCancelSale={handleCancelSale} onReturnItem={handleReturnItem} onReprintTicket={handleReprintTicket} />}
      {modal.name === 'pendingOrders' && (
        <S.ModalOverlay onClick={closeModal}>
          <S.ModalContent onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>Pedidos Pendientes</h3><S.Button secondary onClick={closeModal}>✕</S.Button></div>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {pendingOrdersList.map(p => (
                <div key={p.id} onClick={() => handleLoadPendingToPOS(p)} style={{ padding: 10, borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong>#{p.id}</strong> {p.cliente?.nombre}<br /><span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(p.created_at || p.fecha).toLocaleDateString()}</span></div>
                  <div style={{ textAlign: 'right', fontWeight: 'bold' }}>C$ {fmt(p.total || p.total_venta)}<br /><span style={{ fontSize: '0.8rem', color: p.estado.includes('PENDIENTE') ? '#f59e0b' : '#10b981' }}>{p.estado}</span></div>
                </div>
              ))}
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
      {modal.name === 'alert' && <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />}
      {modal.name === 'prompt' && <PromptModal isOpen={true} onClose={closeModal} {...modal.props} />}
      {modal.name === 'confirmation' && <ConfirmationModal isOpen={true} onClose={closeModal} {...modal.props} />}

      {ticketData.shouldOpen && <TicketModal isOpen={true} onClose={() => setTicketData({ transaction: null, shouldOpen: false })} transaction={ticketData.transaction} printMode={ticketData.printMode} />}

    </S.PageWrapper>
  );
};

export default POS;