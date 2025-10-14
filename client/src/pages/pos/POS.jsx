// client/src/pages/POS/POS.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  FaArrowLeft, FaKeyboard, FaTags, FaShoppingCart, FaPlus,
  FaTrashAlt, FaTimes, FaPercentage, FaHistory, FaLock, FaDollarSign, FaEdit, FaRedo,
  FaSignInAlt, FaSignOutAlt, FaPrint 
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';
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

import { buildTicketHTML, normalizeSale, printHTML } from './printing/printUtils';

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

/* ===== número bonito ===== */
const fmt = (n) =>
  new Intl.NumberFormat('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n || 0));

/* ===== Helper: ticket vacío (estándar) ===== */
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
  const searchRef = useRef(null);

  // Tickets persistentes
  const initialTickets = loadTickets(userId || 'anon');
  const [orders, setOrders] = useState(initialTickets.orders);
  const [activeOrderId, setActiveOrderId] = useState(initialTickets.activeOrderId);

  useEffect(() => { if (userId) saveTickets(userId, orders, activeOrderId); }, [userId, orders, activeOrderId]);

  // Sync tickets cross-tab (misma máquina)
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

  const activeOrder = useMemo(
    () => orders.find(o => o.id === activeOrderId) || { items: [], clientId: initialClientId, discount: { type: 'none', value: 0 }, name: 'Ticket Nuevo' },
    [orders, activeOrderId]
  );
  const cart = activeOrder.items || [];

  // Caja
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [tasaDolar, setTasaDolar] = useState(loadTasaDolar(userId, 36.60));
  const [dailySales, setDailySales] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);

  const [modal, setModal] = useState({ name: null, props: {} });
  const [ticketData, setTicketData] = useState({ transaction: null, creditStatus: null, shouldOpen: false });

  const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
  const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
  const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
  const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);
  const showPrompt = useCallback((props) => openModal('prompt', props), [openModal]);

  // Carga ventas
  const loadSalesFromDB = useCallback(async (date) => {
    if (!token) return [];
    setIsLoadingSales(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const effectiveDate = (date === undefined) ? today : date; // respeta null
      const salesData = await api.fetchSales(token, effectiveDate);

      if (effectiveDate === today) {
        setDailySales(Array.isArray(salesData) ? salesData : []);
      }
      return Array.isArray(salesData) ? salesData : [];
    } catch (error) {
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

  // Carrito
  const handleAddToCart = (product, quantity = 1, priceToUse = null) => {
    const existing = cart.find(item => item.id === product.id);
    const newQty = (existing?.quantity || 0) + quantity;
    if (newQty > product.existencia) {
      showAlert({ title: "Stock Insuficiente", message: `No puedes agregar más de ${product.existencia} unidades.` });
      return;
    }
    const finalPrice = priceToUse != null ? priceToUse : (existing?.precio_venta || product.precio);
    const newItem = { ...product, quantity: newQty, precio_venta: finalPrice };
    const newCart = existing ? cart.map(i => (i.id === product.id ? newItem : i)) : [...cart, newItem];
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
      updateActiveCart(cart.map(i => (i.id === id ? { ...i, quantity: productData.existencia } : i)));
      return;
    }
    updateActiveCart(cart.map(i => (i.id === id ? { ...i, quantity: numQuantity } : i)));
  };

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
    const productData = products.find(p => p.id === item.id);
    const precioMayoreo = Number(productData?.raw?.mayoreo || 0);
    if (precioMayoreo > 0) {
      const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: precioMayoreo } : i));
      updateActiveCart(newCart);
      showAlert({ title: "Precio Actualizado", message: `Mayoreo: C$${fmt(precioMayoreo)} aplicado.` });
    }
  };

  const handleRevertRetailPrice = (item) => {
    const productData = products.find(p => p.id === item.id);
    const basePrice = productData?.precio || 0;
    const newCart = cart.map(i => (i.id === item.id ? { ...i, precio_venta: basePrice } : i));
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

  /* Caja */
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
      notes: '',
    };

    // 1) guardar local
    saveCajaSession(userId, newSession);
    saveTasaDolar(userId, (nuevaTasa ?? tasaDolar));
    setCajaSession(newSession);
    setIsCajaOpen(true);
    setTasaDolar(Number(nuevaTasa ?? tasaDolar));
    closeModal();

    // 2) mandar al servidor para cross-browser
    try {
      await api.openCajaSession({ userId, ...newSession, tasaDolar: Number(nuevaTasa ?? tasaDolar) }, token);
    } catch (e) {
      showAlert({ title: 'Aviso', message: 'Caja abierta localmente, pero no se pudo sincronizar con el servidor.' });
    }
  };

  const handleDoCloseCaja = async (countedAmount) => {
    const hasPendingTickets = orders.some(o => (o.items?.length || 0) > 0);
    if (hasPendingTickets) {
      showAlert({ title: 'Tickets Pendientes', message: 'No puedes cerrar caja mientras existan tickets con productos. Cierra o vacía todos los tickets.' });
      return;
    }

    const current = loadCajaSession(userId) || cajaSessionCtx;
    if (!current || !userId) return;

    const movimientoNetoEfectivo = (current.transactions || []).reduce((total, tx) => {
      if (tx.type === 'venta_credito') return total;
      const ingreso = Number(tx.pagoDetalles?.ingresoCaja || tx.amount || 0);
      if (tx.type === 'entrada') return total + ingreso;
      if (tx.type === 'salida') return total - ingreso;
      return total + ingreso;
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

    try {
      await api.closeCajaSession({ userId, countedAmount: Number(countedAmount), closedAt: finalSession.closedAt }, token);
    } catch (e) {
      showAlert({ title: 'Aviso', message: 'Caja cerrada localmente, pero no se pudo sincronizar el cierre con el servidor.' });
    }

    showAlert({
      title: "Caja Cerrada",
      message: finalSession.difference === 0 ? 'Balance perfecto.' : `Diferencia: C$${fmt(finalSession.difference)}`
    });
  };

  // Entradas / Salidas fuera del modal (sincroniza con servidor)
  const handleRegisterTransaction = async (type, amount, note) => {
    if (!userId || !amount) {
      showAlert({ title: "Error", message: "Usuario no identificado." });
      return;
    }
    const tx = {
      id: `${type}-${Date.now()}`,
      type,
      amount: Number(amount),
      note: note || (type === 'entrada' ? 'Entrada de Dinero' : 'Salida de Dinero'),
      at: new Date().toISOString(),
      pagoDetalles: { ingresoCaja: type === 'entrada' ? Number(amount) : -Number(amount) }
    };
    addCajaTransaction(tx);
    try {
      await api.addCajaTx({ userId, tx }, token);
    } catch (e) {
      showAlert({ title: "Aviso", message: "Transacción registrada localmente. No se pudo sincronizar con el servidor." });
    }
    showAlert({ title: "Éxito", message: `${type === 'entrada' ? 'Entrada' : 'Salida'}: C$${fmt(amount)}` });
  };

  /* Venta */
  const safeOpenTicket = (payload) => {
    try {
      setTicketData({ transaction: payload, creditStatus: null, shouldOpen: true });
    } catch (e) {
      showAlert({ title: 'Aviso', message: 'No se pudo abrir el ticket para impresión. Puedes reimprimir desde Historial.' });
    }
  };

 const handleFinishSale = async (pagoDetalles) => {
    const orderIdToClose = activeOrderId;

    // detectar si esta venta lleva crédito (mixto o crédito total)
    const isVentaConCredito =
        ['mixto', 'credito_total'].includes(pagoDetalles?.tipoVenta) ||
        (Number(pagoDetalles?.credito || 0) > 0);

    // cliente final (0 = Consumidor Final permitido para contado)
    const finalClientId = Number(pagoDetalles?.clienteId || 0);

    // exigir cliente SOLO cuando hay crédito
    if (isVentaConCredito && finalClientId === 0) {
        showAlert({
            title: 'Cliente Requerido',
            message: 'Debe seleccionar un cliente para ventas a crédito o mixtas.',
            type: 'error'
        });
        return false;
    }

    const snapshotCart = (orders.find(o => o.id === orderIdToClose)?.items || []);
    if (!snapshotCart.length) {
        showAlert({ title: "Carrito vacío", message: "Agregue productos antes de facturar." });
        return false;
    }

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

    try {
        const response = await api.createSale(saleToCreate, token);

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
        try { await api.addCajaTx({ userId, tx: cajaTx }, token); } catch { }

        // Cerrar ticket activo y crear uno nuevo si es necesario
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

        // Datos del ticket para la impresión (usa los datos del servidor o el fallback local)
        const txToPrint = {
            ...(response?.saleData || {}),
            items: response?.saleData?.items || itemsForSale,
            pagoDetalles: response?.saleData?.pagoDetalles || saleToCreate.pagoDetalles,
            subtotal: response?.saleData?.subtotal ?? subtotalCalc,
            descuento: response?.saleData?.descuento ?? discountAmountCalc,
            total_venta: response?.saleData?.total_venta ?? totalCalc,
            totalVenta: response?.saleData?.totalVenta ?? totalCalc,
        };

        // El modal PaymentModal ya se cerró. Ahora mostramos el éxito y preguntamos por la impresión.
        showAlert({ title: "Éxito", message: "Venta realizada con éxito 🎉" });

        if (pagoDetalles?.shouldPrintNow) {
            // Si el usuario presionó "Pagar y Preguntar"
            setTimeout(() => {
                openModal('confirmation', {
                    title: "Imprimir Ticket",
                    message: "¿Desea imprimir el ticket de venta?",
                    onConfirm: () => {
                        safeOpenTicket(txToPrint); // Llama a la lógica de reimpresión
                        closeModal(); // Cierra el modal de confirmación
                    }
                });
            }, 0);
        } else {
            // Si el usuario presionó "Solo Pagar"
            // No hacemos nada, el PaymentModal ya cerró.
        }

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
            try { await api.addCajaTx({ userId, tx }, token); } catch {}
          }
        }
        showAlert({ title: "Éxito", message: `Venta #${saleId} cancelada.` });
        await refreshData();
      } catch (error) {
        showAlert({ title: "Error de Cancelación", message: `No se pudo cancelar la venta #${saleId}.`, type: "error" });
      }
    };

    const handleReturnItem = async (sale, item, qty) => {
      if (!token) return;

      const userIdLocal =
        currentUser?.id_usuario ??
        currentUser?.id ??
        JSON.parse(localStorage.getItem('me') || '{}')?.id_usuario ??
        JSON.parse(localStorage.getItem('me') || '{}')?.id;

      const quantity = Number(qty);
      if (!sale?.id) { showAlert({ title: "Error", message: "Venta inválida." }); return; }
      if (!item) { showAlert({ title: "Error", message: "Ítem inválido." }); return; }
      if (!Number.isFinite(quantity) || quantity <= 0) {
        showAlert({ title: "Error", message: "Cantidad inválida." }); return;
      }
      if (!userIdLocal) { showAlert({ title: "Error", message: "Usuario no identificado." }); return; }

      const productId = item.id ?? item.id_producto;
      const unitPrice = Number(
        item.precio ?? item.precio_unitario ?? item.precio_venta ?? 0
      );

      const body = {
        originalSaleId: sale.id,
        item: {
          id: productId,
          id_producto: productId,
          precio: unitPrice > 0 ? unitPrice : undefined,
          nombre: item.nombre ?? item.descripcion ?? item.producto ?? ''
        },
        quantity,
        userId: userIdLocal
      };

      showAlert({ title: "Procesando", message: `Devolviendo ${quantity} de ${item.nombre || 'producto'}...`, type: "loading" });
      try {
        await api.returnItem(body, token);
        showAlert({ title: "Éxito", message: `Devolución registrada.` });
        await refreshData();
      } catch (error) {
        const msg = (error?.message || '').includes('Faltan datos')
          ? 'Faltan datos para la devolución. Verifica usuario, venta, producto y cantidad.'
          : (error?.message || 'No se pudo devolver el producto.');
        showAlert({ title: "Error", message: msg });
      }
    };

    const handleAbonoSuccess = useCallback(() => {
      closeModal();
      showAlert({ title: 'Éxito', message: 'Abono registrado correctamente' });
      refreshData();
    }, [closeModal, showAlert, refreshData]);

    const handleReprintTicket = (transaction, creditStatus = null) => {
      safeOpenTicket(transaction);
    };

    useEffect(() => { setProductsState(initialProducts || []); }, [initialProducts]);

    /* ========= Inicio de caja robusto ========= */
    useEffect(() => {
      let mounted = true;
      (async () => {
        if (!userId) return;

        let local = loadCajaSession(userId);
        if (mounted && local && !local.closedAt) {
          setCajaSession(local);
          setIsCajaOpen(true);
          setTasaDolar(loadTasaDolar(userId, tasaDolar));
        }

        const server = await fetchCajaSessionFromServer(userId, api);
        if (!mounted) return;

        if (server) {
          setCajaSession(server);
          setIsCajaOpen(!server.closedAt);
          setTasaDolar(loadTasaDolar(userId, tasaDolar));
          saveCajaSession(userId, server);
        }
      })();
      return () => { mounted = false; };
    }, [userId, setCajaSession]);

    // Suscripción local (misma máquina)
    useEffect(() => {
      if (!userId) return;
      return subscribeCajaChanges(userId, (s) => {
        if (!s) return;
        setCajaSession(s);
        setIsCajaOpen(!s.closedAt);
        setTasaDolar(loadTasaDolar(userId, tasaDolar));
      });
    }, [userId, setCajaSession]);

    // Polling
    useEffect(() => {
      if (!userId) return;
      const id = setInterval(async () => {
        try {
          const server = await api.getCajaSession(userId, token);
          if (server) {
            setCajaSession(server);
            setIsCajaOpen(!server.closedAt);
            saveCajaSession(userId, server);
          }
        } catch {}
      }, 5000);
      return () => clearInterval(id);
    }, [userId, token, setCajaSession]);

    useEffect(() => { if (isCajaOpen) loadSalesFromDB(); }, [isCajaOpen, loadSalesFromDB]);

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

    const handleOpenHistoryModal = () => openModal('history', { loadSalesFunction: loadSalesFromDB });

    // flujo proforma
    const handleOpenProformaFlow = () => {
      showPrompt({
        title: 'Crear Proforma',
        message: '¿A nombre de quién se emite la proforma?',
        inputType: 'text',
        initialValue: '',
        onConfirm: (nombre) => {
          openModal('proforma', { proformaFor: (nombre || '').trim() });
        }
      });
    };

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
              session={loadCajaSession(userId) || cajaSessionCtx}
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
                  Fondo: <span style={{ fontWeight: 'bold' }}>
                    C${fmt(cajaSessionCtx?.initialAmount || 0)}
                  </span>
                </p>
              </S.InfoBox>

              {/* Entrada/Salida */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <S.Button
                  info
                  onClick={() => showPrompt({
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

                <S.Button
                  $cancel
                  onClick={() => showPrompt({
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
          users={allUsers} // <-- IMPORTANTE: para que imprima el nombre del vendedor
          onFinishSale={handleFinishSale}
          showAlert={showAlert}
          onClose={closeModal}
          initialClientId={String(activeOrder.clientId || 0)}
          // DATOS DEL CARRITO NECESARIOS PARA CONSTRUIR EL TICKET IMPRIMIBLE
          cartSnapshot={cart}
          orderSubtotal={subtotal}
          orderDiscountAmount={discountAmount}
        />
      )}

        {modal.name === 'caja' && (
          <CajaModal
            currentUser={currentUser}
            isCajaOpen={isCajaOpen}
            session={loadCajaSession(userId) || cajaSessionCtx}
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

/* =================================================================
   Subcomponente interno para el contenido del carrito (CartContentView)
   ================================================================= */
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