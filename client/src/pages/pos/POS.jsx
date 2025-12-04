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
  FaBarcode, FaAlignLeft // <--- AGREGADO: Iconos para el botón de búsqueda
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

// Utilidades de Impresión (aunque importadas, no se usan directamente en el cuerpo principal de POS)
import { buildTicketHTML, normalizeSale, printHTML } from './printing/printUtils';

// Utilidades de Caja y Tickets (manejo de datos locales y sync)
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
  const base = 1760000000000;   // base alta para que siempre aumente
  const curr = Number(localStorage.getItem(key) || base);
  const next = curr + 1;
  localStorage.setItem(key, String(next));
  return next;
};

/**
 * Helper: Formatea un número a un string en formato de moneda (C$ con 2 decimales).
 * @param {number} n - El número a formatear.
 * @returns {string} El número formateado.
 */
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

/**
 * Helper: Crea la estructura de un ticket de venta vacío.
 * @param {number} [clientId=0] - El ID del cliente inicial (0 por defecto = Consumidor Final).
 * @returns {object} El objeto ticket vacío.
 */
const createEmptyTicket = (clientId = 0) => ({
  id: Date.now(),
  name: 'Ticket Nuevo',
  items: [],
  clientId,
  discount: { type: 'none', value: 0 }
});

/**
 * Normaliza el usuario a la forma { id, name }.
 * Evita que el backend/cliente invente "Usuario X".
 */
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

  // Acceso a datos y funciones de autenticación
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

  // Constantes derivadas del contexto y almacenamiento local
  const token = localStorage.getItem('token');
  const userId = currentUser?.id_usuario || currentUser?.id;
  const isAdmin = currentUser?.rol === 'Administrador';
  const initialClientId = 0; // ID por defecto para "Consumidor Final"

  /* -----------------------------------------------------------------
   * 3.2. ESTADO LOCAL (STATE)
   * ----------------------------------------------------------------- */

  // Productos y búsqueda
  const [products, setProductsState] = useState(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('description'); // <--- AGREGADO: Estado para el tipo de búsqueda
  const searchRef = useRef(null); // Para enfocar el input de búsqueda

  // Gestión de Tickets/Órdenes (Persistente localmente)
  const initialTickets = loadTickets(userId || 'anon');
  const [orders, setOrders] = useState(initialTickets.orders);
  const [activeOrderId, setActiveOrderId] = useState(initialTickets.activeOrderId);

  // Gestión de Caja y Ventas
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [tasaDolar, setTasaDolar] = useState(loadTasaDolar(userId, 36.60)); // Carga local, con fallback
  const [dailySales, setDailySales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

  // Gestión de Modales
  const [modal, setModal] = useState({ name: null, props: {} });
  const [ticketData, setTicketData] = useState({ transaction: null, creditStatus: null, shouldOpen: false });

  /* -----------------------------------------------------------------
   * 3.3. FUNCIONES DE UTILIDAD PARA MODALES (Callbacks memorizados)
   * ----------------------------------------------------------------- */

  const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
  const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
  const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
  const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);
  const showPrompt = useCallback((props) => openModal('prompt', props), [openModal]);

  /* -----------------------------------------------------------------
   * 3.4. CÁLCULOS MEMORIZADOS (useMemo)
   * ----------------------------------------------------------------- */

  // Obtiene la orden activa del estado `orders`
  const activeOrder = useMemo(
    () => orders.find(o => o.id === activeOrderId) || { items: [], clientId: initialClientId, discount: { type: 'none', value: 0 }, name: 'Ticket Nuevo' },
    [orders, activeOrderId]
  );
  const cart = activeOrder.items || [];

  // Cálculos de Totales del Carrito
  const subtotal = useMemo(
    () => cart.reduce((sum, item) =>
      sum + Number(item.precio_venta ?? item.precio ?? 0) * Number(item.quantity ?? 0), 0),
    [cart]
  );
  
  // Cálculo del monto de descuento
  const discountAmount = useMemo(() => {
    if (activeOrder.discount?.type === 'percentage') return subtotal * (Number(activeOrder.discount.value) / 100);
    if (activeOrder.discount?.type === 'fixed') return Math.min(subtotal, Number(activeOrder.discount.value));
    return 0;
  }, [subtotal, activeOrder.discount]);
  
  // Cálculo del Total Final
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  /* -----------------------------------------------------------------
   * 3.5. LÓGICA DE CAJA (Carga de Ventas - MOVIMIENTO HACIA ARRIBA)
   * ----------------------------------------------------------------- */

  /**
   * Carga las ventas del día desde el servidor.
   * @param {string} [date] - Fecha específica para cargar ventas.
   * @returns {Array} Las ventas cargadas.
   */
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

  // ▼▼▼ AGREGA ESTA FUNCIÓN NUEVA AQUÍ ▼▼▼
  const reloadCajaSession = useCallback(async () => {
    if (!userId || !token) return;
    try {
        // Pedimos al servidor la sesión actualizada con el nuevo saldo
        const serverSession = await api.getCajaSession(userId, token);
        if (serverSession) {
            setCajaSession(serverSession); // Actualiza el contexto (lo que ve el modal)
            saveCajaSession(userId, serverSession); // Guarda en localstorage
        }
    } catch (error) {
        console.error("Error recargando caja:", error);
    }
  }, [userId, token, setCajaSession]);
  // ▲▲▲ FIN DE LO AGREGADO ▲▲▲;

  /* -----------------------------------------------------------------
   * 3.6. EFECTOS (useEffect) y Sincronización
   * ----------------------------------------------------------------- */

  // Persistir tickets localmente cada vez que cambian
  useEffect(() => { if (userId) saveTickets(userId, orders, activeOrderId); }, [userId, orders, activeOrderId]);

  // Completa datos faltantes si alguna proforma llega sin número o sin cajero
  useEffect(() => {
    const tx = ticketData.transaction;
    if (!tx) return;

    if (tx.isProforma && (!tx.id || !tx.usuarioNombre)) {
      setTicketData(prev => ({
        ...prev,
        transaction: {
          ...tx,
          id: tx.id || nextProformaNumber(),
          usuarioNombre:
            tx.usuarioNombre
            || currentUser?.nombre_usuario
            || currentUser?.name
            || 'Cajero',
        }
      }));
    }
  }, [ticketData.transaction, currentUser, setTicketData]);

  // 🔒 Auto-cerrar la vista previa de ticket después de imprimir
  useEffect(() => {
    const handleAfterPrint = () => {
      setTicketData({ transaction: null, creditStatus: null, shouldOpen: false });
    };
    if (ticketData.shouldOpen) {
      window.addEventListener('afterprint', handleAfterPrint);
    }
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [ticketData.shouldOpen]);

  // Sincronización de tickets entre pestañas (misma máquina/usuario)
  useEffect(() => {
    if (!userId) return;
    return subscribeTicketChanges(userId, (data) => {
      if (data?.orders && data?.activeOrderId != null) {
        // Lógica para evitar actualizaciones innecesarias (deep comparison parcial)
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

  // Cargar ventas diarias cuando se abre la caja
  useEffect(() => { if (isCajaOpen) loadSalesFromDB(); }, [isCajaOpen, loadSalesFromDB]);

  // Sincronizar estado de productos con el contexto
  useEffect(() => { setProductsState(initialProducts || []); }, [initialProducts]);

  // Atajos de teclado (F1 para buscar, F2 para pagar, F9 para caja)
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
  }, [cart, openModal, activeOrder.clientId, total]); // Dependencias importantes: carrito, modales, total

  /* -----------------------------------------------------------------
   * 3.7. LÓGICA DE CAJA (Apertura, Cierre, Sincronización)
   * ----------------------------------------------------------------- */
  
  /**
   * Abre la sesión de caja (local y servidor).
   * @param {number} monto - Monto inicial de caja.
   * @param {number} nuevaTasa - Tasa de dólar actual.
   */
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

    // 1) Guardar estado localmente (para sync entre pestañas)
    saveCajaSession(userId, newSession);
    saveTasaDolar(userId, (nuevaTasa ?? tasaDolar));
    setCajaSession(newSession);
    setIsCajaOpen(true);
    setTasaDolar(Number(nuevaTasa ?? tasaDolar));
    closeModal();

    // 2) Sincronizar con el servidor
    try {
      await api.openCajaSession({ userId, ...newSession, tasaDolar: Number(nuevaTasa ?? tasaDolar) }, token);
    } catch (e) {
      showAlert({ title: 'Aviso', message: 'Caja abierta localmente, pero no se pudo sincronizar con el servidor.' });
    }
  };

  /**
   * Cierra la sesión de caja (local y servidor).
   * @param {number} countedAmount - Monto contado al cierre.
   */
  const handleDoCloseCaja = async (countedAmount) => {
    // Validación de tickets pendientes
    const hasPendingTickets = orders.some(o => (o.items?.length || 0) > 0);
    if (hasPendingTickets) {
      showAlert({ title: 'Tickets Pendientes', message: 'No puedes cerrar caja mientras existan tickets con productos. Cierra o vacía todos los tickets.' });
      return;
    }

    const current = cajaSessionCtx; // Usar el estado del contexto
    if (!current || !userId) return;

    // Cálculo del efectivo esperado
    const movimientoNetoEfectivo = (current.transactions || []).reduce((total, tx) => {
      if (tx.type === 'venta_credito') return total; // No afectan el efectivo
      const ingreso = Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0); // Utiliza ingresoCaja si existe
      if (tx.type === 'entrada') return total + Math.abs(ingreso); // Suma entradas
      if (tx.type === 'salida') return total - Math.abs(ingreso); // Resta salidas
      return total + ingreso; // Venta de contado
    }, 0);

    const efectivoEsperado = Number(current.initialAmount) + movimientoNetoEfectivo;
    
    // Sesión de cierre
    const finalSession = {
      ...current,
      closedAt: new Date().toISOString(),
      closedBy: toUserRef(currentUser, userId),
      countedAmount: Number(countedAmount),
      difference: Number(countedAmount) - efectivoEsperado,
    };

    // 1) Guardar estado localmente (para sync entre pestañas)
    saveCajaSession(userId, finalSession);
    setCajaSession(finalSession);
    setIsCajaOpen(false);
    closeModal();

    // 2) Sincronizar con el servidor  ✅ incluye closedBy (arreglo clave)
    try {
      await api.closeCajaSession({
        userId,
        countedAmount: Number(countedAmount),
        closedAt: finalSession.closedAt,
        closedBy: finalSession.closedBy, // ← requerido por tu backend
      }, token);
    } catch (e) {
      showAlert({ title: 'Aviso', message: 'Caja cerrada localmente, pero no se pudo sincronizar el cierre con el servidor.' });
    }

    showAlert({
      title: "Caja Cerrada",
      message: finalSession.difference === 0 ? 'Balance perfecto. ✅' : `Diferencia: C$${fmt(finalSession.difference)} ⚠️`
    });
  };

  /**
   * Registra una transacción (entrada/salida de dinero) en caja.
   * @param {'entrada'|'salida'} type - Tipo de transacción.
   * @param {number} amount - Monto.
   * @param {string} note - Nota/descripción.
   */
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
      pagoDetalles: { ingresoCaja } // Detalle del movimiento de efectivo
    };
    
    addCajaTransaction(tx); // Actualiza contexto (y localstorage)
    
    // Sincronizar con el servidor
    try {
      await api.addCajaTx({ userId, tx }, token);
    } catch (e) {
      showAlert({ title: "Aviso", message: "Transacción registrada localmente. No se pudo sincronizar con el servidor." });
    }
    showAlert({ title: "Éxito", message: `${type === 'entrada' ? 'Entrada' : 'Salida'}: C$${fmt(amount)}` });
  };
  
  // Lógica robusta de carga de caja inicial (servidor, luego sync local)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userId) return;

      // 1. Cargar desde el Servidor
      const server = await fetchCajaSessionFromServer(userId, api);
      if (!mounted) return;

      if (server) {
        setCajaSession(server);
        setIsCajaOpen(!server.closedAt);
        // Usar tasa del servidor si está disponible, sino la local (por si la sesión es nueva)
        setTasaDolar(loadTasaDolar(userId, server.tasaDolar || tasaDolar)); 
        saveCajaSession(userId, server); // Sincroniza el local con el server
      } else {
        // Si no hay sesión en el servidor, comprueba si hay una local para reanudar (solo si el servidor no responde)
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

  // Suscripción local para cambios en la caja (entre pestañas)
  useEffect(() => {
    if (!userId) return;
    return subscribeCajaChanges(userId, (s) => {
      if (!s) return;
      setCajaSession(s);
      setIsCajaOpen(!s.closedAt);
      setTasaDolar(loadTasaDolar(userId, s.tasaDolar || tasaDolar));
    });
  }, [userId, setCajaSession, tasaDolar]);

  // Polling para cambios de caja en el servidor
  useEffect(() => {
    if (!userId) return;
    const id = setInterval(async () => {
      try {
        const server = await api.getCajaSession(userId, token);
        if (server) {
          // Solo actualiza el estado si la caja no está ya abierta localmente con datos recientes
          if (!isCajaOpen || server.openedAt !== cajaSessionCtx?.openedAt) {
            setCajaSession(server);
            setIsCajaOpen(!server.closedAt);
            saveCajaSession(userId, server);
          }
        }
      } catch {} // Ignora errores de polling
    }, 5000); // Cada 5 segundos
    return () => clearInterval(id);
  }, [userId, token, setCajaSession, isCajaOpen, cajaSessionCtx]);


  /* -----------------------------------------------------------------
   * 3.8. LÓGICA DE ÓRDENES/TICKETS
   * ----------------------------------------------------------------- */

  /**
   * Actualiza una propiedad del ticket activo.
   * @param {string} key - Clave a actualizar.
   * @param {*} value - Nuevo valor.
   */
  const updateActiveOrder = (key, value) =>
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o));
    
  // Helper para actualizar el carrito (items) del ticket activo
  const updateActiveCart = (newItems) => updateActiveOrder('items', newItems);

  /**
   * Cierra un ticket por ID, activa el siguiente o crea uno nuevo si no hay.
   * @param {string|number} ticketIdToClose - ID del ticket a cerrar.
   */
  const closeTicketById = useCallback((ticketIdToClose) => {
    setOrders(prevOrders => {
      const filtered = prevOrders.filter(o => String(o.id) !== String(ticketIdToClose));
      let newOrders = filtered;
      let nextActiveId = null;

      if (filtered.length === prevOrders.length) return prevOrders; // No se cerró nada

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

  // Handlers para la gestión de tickets
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

 /**
   * Aplica un descuento al total de la orden activa.
   * MODIFICADO: Ahora es EXCLUSIVAMENTE por PORCENTAJE.
   */
  const applyOrderDiscount = () => {
    showPrompt({
      title: "Descuento a la Orden (%)",
      message: "Ingrese el porcentaje (Ej: 10 para 10%):",
      inputType: 'number', // Forzamos teclado numérico
      onConfirm: (value) => {
        // Si no escribe nada o cancela, quitamos el descuento
        if (!value) { 
            updateActiveOrder('discount', { type: 'none', value: 0 }); 
            return; 
        }

        // Convertimos lo escrito a número
        const n = parseFloat(value);

        // Validamos que sea un número lógico para porcentaje (entre 0 y 100)
        if (!isNaN(n) && n > 0 && n <= 100) {
          // FORZAMOS que el tipo sea 'percentage'
          updateActiveOrder('discount', { type: 'percentage', value: n });
          
          // Opcional: Mostrar confirmación visual
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
  
  /**
   * Agrega un producto al carrito o incrementa su cantidad.
   * @param {object} product - Datos del producto.
   * @param {number} [quantity=1] - Cantidad a añadir.
   * @param {number} [priceToUse=null] - Precio manual a usar (si es diferente).
   */
  const handleAddToCart = (product, quantity = 1, priceToUse = null) => {
    const existing = cart.find(item => item.id === product.id);
    const newQty = (existing?.quantity || 0) + quantity;
    
    // Validación de stock
    if (newQty > product.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `No puedes agregar más de ${product.existencia} unidades.` });
      return;
    }
    
    // Calcula el precio final (mantiene el precio de venta si ya fue establecido manualmente)
    const finalPrice = priceToUse != null ? priceToUse : (existing?.precio_venta || product.precio);
    const newItem = { ...product, quantity: newQty, precio_venta: finalPrice };
    
    const newCart = existing 
      ? cart.map(i => (i.id === product.id ? newItem : i)) 
      : [...cart, newItem];
      
    updateActiveCart(newCart);
  };
  
  // Handler para click en un producto (generalmente añade 1 unidad)
  const handleProductClick = (product) => {
    if (product.existencia <= 0) {
      showAlert({ title: "Producto Agotado", message: `Inventario de ${product.nombre} es 0.` });
      return;
    }
    handleAddToCart(product, 1, product.precio || 0);
  };

  /**
   * Actualiza la cantidad de un ítem en el carrito.
   * @param {number} id - ID del producto.
   * @param {string|number} newQuantity - Nueva cantidad.
   */
  const handleUpdateCartQuantity = (id, newQuantity) => {
    const productData = products.find(p => p.id === id);
    if (!productData) return;
    const numQuantity = parseInt(newQuantity, 10) || 0;

    // Eliminar si es 0 o menos
    if (numQuantity <= 0) {
      updateActiveCart(cart.filter(i => i.id !== id));
      return;
    }
    
    // Validación de stock
    if (numQuantity > productData.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `Máximo ${productData.existencia} unidades.` });
      // Limita la cantidad al stock disponible
      updateActiveCart(cart.map(i => (i.id === id ? { ...i, quantity: productData.existencia } : i)));
      return;
    }
    
    // Actualiza la cantidad
    updateActiveCart(cart.map(i => (i.id === id ? { ...i, quantity: numQuantity } : i)));
  };

  /**
   * Permite establecer un precio de venta manual (solo Admin).
   * @param {object} item - Ítem del carrito.
   */
  const handleSetManualPrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const productCost = Number(productData?.raw?.costo || 0);
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
        // Validación de costo (no se puede vender por debajo del costo)
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

  /**
   * Aplica el precio de mayoreo al ítem.
   * @param {object} item - Ítem del carrito.
   */
  const handleApplyWholesalePrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const precioMayoreo = Number(productData?.raw?.mayoreo || 0);
    if (precioMayoreo > 0) {
      const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: precioMayoreo } : i));
      updateActiveCart(newCart);
      showAlert({ title: "Precio Actualizado", message: `Mayoreo: C$${fmt(precioMayoreo)} aplicado.` });
    }
  };

  /**
   * Revierte el precio de venta al precio base.
   * @param {object} item - Ítem del carrito.
   */
  const handleRevertRetailPrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const basePrice = productData?.precio || 0;
    const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: basePrice } : i));
    updateActiveCart(newCart);
    showAlert({ title: "Precio Revertido", message: `Precio base: C$${fmt(basePrice)} aplicado.` });
  };

  /* -----------------------------------------------------------------
   * 3.10. LÓGICA DE VENTA, CANCELACIÓN Y DEVOLUCIÓN
   * ----------------------------------------------------------------- */
  
  // ** NUEVA FUNCIÓN: Pregunta por el formato de impresión **
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

  // =============================================================
  // Helper centralizado para abrir ticket con usuario correcto
  // =============================================================
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

  /**
   * Maneja el proceso final de venta (después del modal de pago).
   * @param {object} pagoDetalles - Detalles del pago.
   * @returns {boolean} `true` si la venta fue exitosa.
   */
  const handleFinishSale = async (pagoDetalles) => {
    const orderIdToClose = activeOrderId;

    // --- Validaciones iniciales ---
    const isVentaConCredito =
        ['mixto', 'credito_total'].includes(pagoDetalles?.tipoVenta) ||
        (Number(pagoDetalles?.credito || 0) > 0);
    const finalClientId = Number(pagoDetalles?.clienteId || 0);

    // Exigir cliente para crédito
    if (isVentaConCredito && finalClientId === 0) {
        showAlert({ title: 'Cliente Requerido', message: 'Debe seleccionar un cliente para ventas a crédito o mixtas.', type: 'error' });
        return false;
    }

    const snapshotCart = (orders.find(o => o.id === orderIdToClose)?.items || []);
    if (!snapshotCart.length) {
        showAlert({ title: "Carrito vacío", message: "Agregue productos antes de facturar." });
        return false;
    }
    // -------------------------------

    // --- Preparación de la Venta ---
    // Items a vender (filtrando datos internos del POS)
    const itemsForSale = snapshotCart.map(({ raw, costo, existencia, ...rest }) => ({
        id: rest.id || rest.id_producto,
        quantity: Number(rest.quantity || 0),
        precio: Number(rest.precio_venta ?? rest.precio ?? 0),
    }));

    // Recálculo de totales
    const subtotalCalc = snapshotCart.reduce((s, i) => s + Number(i.precio_venta ?? i.precio ?? 0) * Number(i.quantity ?? 0), 0);
    const d = orders.find(o => o.id === orderIdToClose)?.discount;
    const discountAmountCalc =
        d?.type === 'percentage' ? subtotalCalc * (Number(d.value) / 100)
        : d?.type === 'fixed' ? Math.min(subtotalCalc, Number(d.value))
        : 0;
    const totalCalc = subtotalCalc - discountAmountCalc;

    // Cálculo del efectivo que ingresa a caja
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
    // -------------------------------

    // --- Envío al Servidor y Cierre Local ---
    try {
        const response = await api.createSale(saleToCreate, token);

        // 1. Registrar Transacción de Caja (local y servidor)
        const esCredito = (pagoDetalles.credito || 0) > 0;
        const cajaTx = {
            id: `venta-${response?.saleId || Date.now()}`,
            type: esCredito ? 'venta_credito' : 'venta_contado',
            amount: totalCalc,
            note: `Venta #${response?.saleId || ''} ${esCredito ? '(CRÉDITO)' : ''}`,
            at: new Date().toISOString(),
            pagoDetalles: { ...pagoDetalles, clienteId: finalClientId, ingresoCaja }
        };
        addCajaTransaction(cajaTx);
        try { await api.addCajaTx({ userId, tx: cajaTx }, token); } catch { } // Server sync

        // 2. Cerrar ticket activo
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

        // 3. Preparar datos para impresión y mostrar éxito
        const txToPrint = {
            ...(response?.saleData || {}),
            items: response?.saleData?.items || itemsForSale,
            pagoDetalles: response?.saleData?.pagoDetalles || saleToCreate.pagoDetalles,
            subtotal: response?.saleData?.subtotal ?? subtotalCalc,
            descuento: response?.saleData?.descuento ?? discountAmountCalc,
            total_venta: response?.saleData?.total_venta ?? totalCalc,
            totalVenta: response?.saleData?.totalVenta ?? totalCalc,
            // Añadir datos de usuario y cliente a la transacción para TicketModal
            userId: currentUser?.id_usuario || currentUser?.id,
            usuarioNombre: currentUser?.nombre_usuario || currentUser?.name,
        };

showAlert({ title: "Éxito", message: "Venta realizada con éxito" });

        // 4. Preguntar por impresión (NUEVO FLUJO)
       setTimeout(() => askForPrint(txToPrint), 0);

        

        await refreshData();
        return true;
    } catch (error) {
        showAlert({ title: "Error", message: `La venta no se pudo guardar. ${error.message}` });
        return false;
    }
  };

  /**
   * Abre el modal de ticket para impresión.
   * @param {object} payload - Datos de la transacción a imprimir.
   */
  const safeOpenTicket = (payload) => {
    try {
      // Abre el modal de confirmación con las opciones de impresión
      askForPrint(payload);
    } catch (e) {
      showAlert({ title: 'Aviso', message: 'No se pudo abrir el ticket para impresión. Puedes reimprimir desde Historial.' });
    }
  };

  /**
   * Cancela una venta (requiere ser Admin y ajusta el efectivo de caja).
   * @param {number} saleId - ID de la venta a cancelar.
   */
  const handleCancelSale = async (saleId) => {
    // ... (Toda la lógica de cancelación se mantiene sin cambios)
    if (!token) return;
    showAlert({ title: "Procesando", message: "Cancelando venta...", type: "loading" });
    const saleToReverse = dailySales.find(s => String(s.id) === String(saleId));
    
    try {
      await api.cancelSale(saleId, token);
      
      // Ajuste de caja por el ingreso de la venta cancelada
      if (saleToReverse?.pagoDetalles) {
        const montoARestar = Number(saleToReverse.pagoDetalles.ingresoCaja || 0);
        if (montoARestar !== 0) {
          const tx = {
            id: `cancelacion-${saleId}`,
            // Si el monto era positivo (entrada), la cancelación es 'salida' (negativo)
            type: montoARestar > 0 ? 'salida' : 'entrada', 
            amount: Math.abs(montoARestar),
            note: `Cancelación Venta #${saleId}`,
            pagoDetalles: { ingresoCaja: -montoARestar } // El ingreso se revierte
          };
          addCajaTransaction(tx);
          try { await api.addCajaTx({ userId, tx }, token); } catch {}
        }
      }
      showAlert({ title: "Éxito", message: `Venta #${saleId} cancelada. 💸` });
      await refreshData();
    } catch (error) {
      showAlert({ title: "Error de Cancelación", message: `No se pudo cancelar la venta #${saleId}.`, type: "error" });
    }
  };

  /**
   * Maneja la devolución de un ítem de una venta previa.
   * @param {object} sale - Objeto de la venta original.
   * @param {object} item - Objeto del ítem a devolver.
   * @param {number} qty - Cantidad a devolver.
   */
  const handleReturnItem = async (sale, item, qty) => {
    if (!token) return;

    const userIdLocal = currentUser?.id_usuario ?? currentUser?.id ?? JSON.parse(localStorage.getItem('me') || '{}')?.id_usuario ?? JSON.parse(localStorage.getItem('me') || '{}')?.id;
    const quantity = Number(qty);
    const productId = item.id ?? item.id_producto;
    const unitPrice = Number(item.precio ?? item.precio_unitario ?? item.precio_venta ?? 0);

    // Validaciones
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

  // Handler para la reimpresión del ticket (desde historial)
  const handleReprintTicket = (transaction, creditStatus = null) => {
    // Muestra el modal de opciones de impresión al reimprimir
    askForPrint(transaction); 
  };
  
  // Handler para recargar datos después de un abono a crédito
  const handleAbonoSuccess = useCallback(() => {
    closeModal();
    showAlert({ title: 'Éxito', message: 'Abono registrado correctamente' });
    refreshData();
  }, [closeModal, showAlert, refreshData]);

  // Handler para abrir el modal de historial de ventas
  const handleOpenHistoryModal = () => openModal('history', { loadSalesFunction: loadSalesFromDB });
  
  // Flujo para crear una proforma (con correlativo y cajero)
  const handleOpenProformaFlow = () => {
    showPrompt({
      title: 'Crear Proforma',
      message: '¿A nombre de quién se emite la proforma?',
      inputType: 'text',
      initialValue: '',
      onConfirm: (nombre) => {
        const proformaNumero = nextProformaNumber(); // ← genera correlativo

        // Abrimos el modal de Proforma pero “envolvemos” setTicketData
        openModal('proforma', {
          proformaFor: (nombre || '').trim(),
          currentUser, // por si el modal lo necesita
          setTicketData: (payload = {}) => {
            const baseTx = payload?.transaction || {};
            const tx = {
              ...baseTx,
              isProforma: true,
              id: baseTx.id ?? proformaNumero, // ← fuerza nro proforma
              proformaNombre: (nombre || '').trim(),
              usuarioNombre: baseTx.usuarioNombre
                ?? currentUser?.nombre_usuario
                ?? currentUser?.name
                ?? 'Cajero',
            };

            // 🔁 Reemplazo del bloque pedido:
            // setTicketData({ ... })  →  openTicketWith(tx, payload)
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

  // Vista de Caja Cerrada
  if (!isCajaOpen) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>Caja Cerrada</h1>
        <p>La caja de <strong>{currentUser?.nombre_usuario || 'este usuario'}</strong> está cerrada.</p>
        <S.Button primary onClick={() => openModal('caja')} mt="true"><FaKeyboard /> Abrir Mi Caja (F9)</S.Button>

        {/* Modales disponibles cuando la caja está cerrada (Caja, Alerta, Confirmación) */}
        {modal.name === 'caja' && (
          <CajaModal
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={cajaSessionCtx} // Usamos el contexto
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

  // Vista Principal del POS (Caja Abierta)
  return (
    <S.PageWrapper>
      
      {/* Encabezado y Acciones Principales */}
      <S.HeaderActions>
        <S.BackButton to="/dashboard"><FaArrowLeft /> Volver</S.BackButton>
        <div style={{ fontSize: '0.8rem', color: '#555' }}><FaKeyboard /> Atajos: <strong>F1</strong> Buscar, <strong>F2</strong> Pagar, <strong>F9</strong> Caja</div>

        <div className="right-actions">
          <S.Button dark onClick={handleOpenHistoryModal}>
            <FaHistory /> Historial
          </S.Button>
          <S.Button $cancel onClick={() => openModal('caja')}>
            <FaLock /> Gestionar Caja
          </S.Button>
        </div>
      </S.HeaderActions>

      <S.PageContentWrapper>
        
        {/* Panel Izquierdo: Productos */}
        <ProductPanel
          products={products}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          // --- PROPS NUEVOS PASADOS AL PANEL ---
          searchType={searchType}
          setSearchType={setSearchType}
          // -------------------------------------
          onProductClick={handleProductClick}
          cartItems={cart}
          inputRef={searchRef}
        />

        {/* Panel Derecho: Carrito/Caja */}
        <S.CartPanel>
          <div className="cart-fixed-top">
            
            {/* Aviso de cambio de día */}
            {crossDay && (
              <S.InfoBox style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffeeba', marginBottom: '.5rem' }}>
                Caja abierta desde {sessionOpenDate}. <strong>Se mantiene activa hasta el cierre.</strong>
              </S.InfoBox>
            )}

            {/* Estado de Caja */}
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

            {/* Botones de Entrada/Salida de Dinero */}
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

            {/* Gestión de Tickets Activos */}
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

            {/* Título del Carrito Activo */}
            <h2 className="cart-title" style={{ marginTop: '1rem' }}>
              <FaShoppingCart />
              <span className="cart-title-name" title={activeOrder.name}>{activeOrder.name}</span>
              <span className="cart-title-count">({cart.length})</span>
            </h2>
          </div>

          {/* Contenido Dinámico del Carrito */}
          <CartContentView
            key={activeOrderId} // Clave para forzar re-render si el ticket cambia
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

      {/* Modales (Condicionales para no renderizar innecesariamente) */}
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
          users={allUsers}
          onFinishSale={handleFinishSale}
          showAlert={showAlert}
          onClose={closeModal}
          initialClientId={String(activeOrder.clientId || 0)}
          // Datos del carrito para el resumen e impresión
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
          setTicketData={setTicketData} // (el modal puede ignorarlo si usa el wrapper)
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
          currentUser={currentUser}   // ← clave
        />
      )}

      {/* 🧲 Botón flotante para cerrar manualmente la vista previa del ticket */}
      {ticketData.shouldOpen && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 10000 }}>
          <S.Button $cancel onClick={() => setTicketData({ transaction: null, creditStatus: null, shouldOpen: false })}>
            <FaTimes /> Cerrar vista previa
          </S.Button>
        </div>
      )}

      {/* Modales genéricos: siempre deben ser los últimos para aparecer encima de todo */}
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
 * 4. SUBCOMPONENTE CartContentView (Para el panel derecho del carrito)
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
          const isPriceModified = (item.precio_venta || basePrice) !== basePrice; // Precio manual o mayoreo aplicado

          // Búsqueda de código para mostrar
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
              
              {/* Columna 1: Cantidad */}
              <div className="item-qty">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  max={item.existencia}
                  onChange={(e) => onUpdateQty(item.id, e.target.value)}
                />
              </div>

              {/* Columna 2: Info del Producto y Acciones Admin */}
              <div className="item-info" style={{ display: 'grid', gap: 6, width: '100%' }}>
                <p className="item-name" title={item.nombre}
                  style={{ margin: 0, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2 }}>
                  {item.nombre}
                </p>

                <div className="item-meta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: -2 }}>
                  {code && <span>Código: <strong>{code}</strong></span>}
                  <span>Stock: <strong>{item.existencia}</strong></span>
                </div>

                {/* Acciones solo para Administrador */}
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

              {/* Columna 3: Precio Unitario */}
              <div className="item-unit">C${fmt(unit)} <span style={{ color: '#6c757d' }}>/u</span></div>
              
              {/* Columna 4: Total de Línea */}
              <div className="item-total">C${fmt(totalLine)}</div>

              {/* Columna 5: Botón Eliminar */}
              <S.Button $cancel style={{ padding: '0.4rem', minWidth: 'auto', marginLeft: '1rem' }} onClick={() => onRemoveFromCart(item.id)}>
                <FaTimes />
              </S.Button>
            </S.CartItemWrapper>
          );
        })}
      </div>

      {/* Pie de Carrito (Totales y Pago) */}
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

        {/* Tasa Dólar */}
        <S.InfoBox style={{ backgroundColor: '#fff', padding: '.5rem', borderRadius: 8 }}>
          <FaDollarSign style={{ marginRight: 5 }} /> Tasa Dólar: <strong>C${fmt(tasaDolar)}</strong>
        </S.InfoBox>

        {/* Acciones Finales */}
        <div className="cart-actions" style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <S.Button info onClick={onOpenProforma} disabled={cart.length === 0}>Crear Proforma</S.Button>
          <S.Button pay onClick={onOpenPayment} disabled={cart.length === 0}>Proceder al Pago (F2)</S.Button>
        </div>
      </div>
    </>
  );
}