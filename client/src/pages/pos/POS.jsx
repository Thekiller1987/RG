import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';
import { FaShoppingCart, FaCreditCard, FaPrint, FaStore, FaPlus, FaLock, FaHistory, FaTrashAlt, FaLockOpen, FaTimes, FaUserTag, FaPercentage, FaKeyboard, FaExchangeAlt, FaDollarSign, FaTags, FaArrowLeft, FaEdit, FaRedo, FaExclamationTriangle } from 'react-icons/fa'; 
import * as S from './POS.styles.jsx'; 
import PaymentModal from './components/PaymentModal.jsx';
import CajaModal from './components/CajaModal.jsx';
import SalesHistoryModal from './components/SalesHistoryModal.jsx';
import ConfirmationModal from './components/ConfirmationModal.jsx';
import PromptModal from './components/PromptModal.jsx';
import AlertModal from './components/AlertModal.jsx';
import ProformaModal from './components/ProformaModal.jsx';
import TicketModal from './components/TicketModal.jsx';
import { saveCajaSession } from '../../utils/caja.js';

// Constante para limitar la carga inicial y los resultados amplios
const PRODUCTS_PER_PAGE = 100;

const POS = () => {
    const { user: currentUser, allUsers, products: initialProducts, clients, logout, loadMasterData, cajaSession, addCajaTransaction, setCajaSession } = useAuth();
    
    const token = localStorage.getItem('token');
    const userId = currentUser?.id_usuario || currentUser?.id;
    const isAdmin = currentUser?.rol === 'Administrador';
    
    const initialClientId = 0; 
    const [products, setProductsState] = useState(initialProducts || []);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [orders, setOrders] = useState([{ id: 1, name: 'Ticket 1', items: [], clientId: initialClientId, discount: { type: 'none', value: 0 } }]);
    const [activeOrderId, setActiveOrderId] = useState(1);
    const searchInputRef = useRef(null);
    const [isCajaOpen, setIsCajaOpen] = useState(false);
    const [tasaDolar, setTasaDolar] = useState(36.60);
    const [dailySales, setDailySales] = useState([]);
    const [isLoadingSales, setIsLoadingSales] = useState(false);
    const [modal, setModal] = useState({ name: null, props: {} });
    const [ticketData, setTicketData] = useState({ transaction: null, creditStatus: null });

    const openModal = useCallback((name, props = {}) => setModal({ name, props }), []);
    const closeModal = useCallback(() => setModal({ name: null, props: {} }), []);
    const showAlert = useCallback((props) => openModal('alert', props), [openModal]);
    const showConfirmation = useCallback((props) => openModal('confirmation', props), [openModal]);
    const showPrompt = useCallback((props) => openModal('prompt', props), [openModal]);

    // -----------------------------------------------------
    // MOVIMIENTO DE FUNCIONES PARA RESOLVER EL ReferenceError
    // -----------------------------------------------------

    const loadSalesFromDB = useCallback(async () => {
        if (!token) return;
        setIsLoadingSales(true);
        try {
            const salesData = await api.fetchSales(token); 
            setDailySales(salesData || []);
        } catch (error) {
            if (error.status === 401) {
                showAlert({ title: "Sesión Expirada", message: "Tu sesión ha terminado. Serás redirigido al login." });
                setTimeout(logout, 3000);
            } else {
                showAlert({ title: "Error de Red", message: "No se pudieron cargar las ventas del día." });
            }
        } finally { setIsLoadingSales(false); }
    }, [token, logout, showAlert]);

    const refreshData = useCallback(async () => {
        if (!token) return;
        await Promise.all([loadSalesFromDB(), loadMasterData(token)]);
    }, [token, loadSalesFromDB, loadMasterData]);
    
    // -----------------------------------------------------
    // FIN DEL MOVIMIENTO
    // -----------------------------------------------------


    const updateActiveOrder = (key, value) => { setOrders(orders.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o)); };
    const updateActiveCart = (newItems) => { updateActiveOrder('items', newItems); };

    const handleRemoveOrder = (id) => {
        const remaining = orders.filter(o => o.id !== id);
        if (remaining.length === 0) {
            setOrders([{ id: 1, name: 'Ticket 1', items: [], clientId: initialClientId, discount: { type: 'none', value: 0 } }]);
            setActiveOrderId(1);
        } else {
            setOrders(remaining);
            if (activeOrderId === id) setActiveOrderId(remaining[0].id);
        }
    };

    const handleNewOrder = () => {
        const newId = (orders.length > 0 ? Math.max(...orders.map(o => o.id)) : 0) + 1;
        setOrders(prev => [...prev, { id: newId, name: `Ticket ${newId}`, items: [], clientId: initialClientId, discount: { type: 'none', value: 0 } }]);
        setActiveOrderId(newId);
    };

    const handleRenameOrder = (orderId, currentName) => {
        showPrompt({
            title: "Renombrar Ticket",
            message: `Ingrese el nuevo nombre para "${currentName}":`,
            initialValue: currentName,
            inputType: 'text', 
            onConfirm: (newName) => {
                if (newName && newName.trim() !== '') {
                    setOrders(orders.map(o => o.id === orderId ? { ...o, name: newName.trim() } : o));
                }
                closeModal(); 
            }
        });
    };
    
    const activeOrder = useMemo(() => orders.find(o => o.id === activeOrderId) || { items: [], clientId: initialClientId, discount: { type: 'none', value: 0 } }, [orders, activeOrderId]);
    const cart = activeOrder.items;

    const handleAddToCart = (product, quantity = 1, priceToUse = null) => {
        const existing = cart.find(item => item.id === product.id);
        const newQty = (existing?.quantity || 0) + quantity;
        if (newQty > product.existencia) {
            showAlert({ title: "Stock Insuficiente", message: `No puedes agregar más de ${product.existencia} unidades.` });
            return;
        }
        let finalPrice = priceToUse !== null ? priceToUse : (existing?.precio_venta || product.precio);
        const newItem = { ...product, quantity: newQty, precio_venta: finalPrice, };
        const newCart = existing ? cart.map(item => item.id === product.id ? newItem : item) : [...cart, newItem];
        updateActiveCart(newCart);
    };

    const handleProductClick = (product) => {
        const precioVenta = product.precio || 0; 
        
        // 🚨 LÓGICA: Si está agotado, muestra alerta y no agrega 🚨
        if (product.existencia <= 0) {
            showAlert({ title: "Producto Agotado", message: `El inventario de ${product.nombre} es de 0 unidades. No se puede añadir a la venta.`, type: 'error' });
            return;
        }

        handleAddToCart(product, 1, precioVenta); 
    };

    const handleUpdateCartQuantity = (id, newQuantity) => {
        const productData = products.find(p => p.id === id);
        if (!productData) return;
        const numQuantity = parseInt(newQuantity) || 0;
        if (numQuantity <= 0) {
            handleRemoveFromCart(id);
            return;
        }
        if (numQuantity > productData.existencia) {
            showAlert({ title: "Stock Insuficiente", message: `No puedes agregar más de ${productData.existencia} unidades.` });
            updateActiveCart(cart.map(item => item.id === id ? { ...item, quantity: productData.existencia } : item));
            return;
        }
        updateActiveCart(cart.map(item => item.id === id ? { ...item, quantity: numQuantity } : item));
    };

    const handleRemoveFromCart = (id) => {
        updateActiveCart(cart.filter(item => item.id !== id));
    };

    // ======================= INICIO: LÓGICA DE PRECIOS =======================
    
    const handleSetManualPrice = (item) => {
        const productData = products.find(p => p.id === item.id);
        const productCost = Number(productData?.raw?.costo || 0);
        const currentSalePrice = item.precio_venta || item.precio;

        showPrompt({
            title: `Precio Manual para ${item.nombre}`,
            message: `Costo del producto: C$${productCost.toFixed(2)}. Ingrese el nuevo precio de venta:`,
            initialValue: currentSalePrice.toFixed(2),
            inputType: 'number',
            onConfirm: (value) => {
                const newPrice = parseFloat(value);
                
                if (isNaN(newPrice) || newPrice < 0) {
                    showAlert({ title: 'Valor Inválido', message: 'El precio debe ser un número válido.', type: 'error' });
                    return;
                }

                if (newPrice < productCost) {
                    showAlert({ title: 'Precio no Permitido', message: `El precio (C$${newPrice.toFixed(2)}) no puede ser menor que el costo (C$${productCost.toFixed(2)}).`, type: 'error' });
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
            showAlert({ title: "Precio Actualizado", message: `Se aplicó el precio de mayoreo de C$${precioMayoreo.toFixed(2)}.`, type: 'success' });
        }
    };

    const handleRevertToRetailPrice = (item) => {
        const productData = products.find(p => p.id === item.id);
        const basePrice = productData?.precio || 0;
        
        const newCart = cart.map(i => i.id === item.id ? { ...i, precio_venta: basePrice } : i);
        updateActiveCart(newCart);
    };
    // ======================= FIN: LÓGICA DE PRECIOS =======================

    const applyOrderDiscount = () => { 
        showPrompt({
            title: "Aplicar Descuento a la Orden Total",
            message: "Ingrese un valor (ej: '10%' para porcentaje, '50' para monto fijo en C$).",
            onConfirm: (value) => {
                if (!value) { updateActiveOrder('discount', { type: 'none', value: 0 }); return; }
                if (value.includes('%')) {
                    const percentage = parseFloat(value.replace('%', ''));
                    if (!isNaN(percentage) && percentage > 0 && percentage <= 100) { updateActiveOrder('discount', { type: 'percentage', value: percentage }); } 
                    else { showAlert({ title: 'Valor Inválido', message: 'El porcentaje debe estar entre 1 y 100.' }); }
                } else {
                    const fixed = parseFloat(value);
                    if (!isNaN(fixed) && fixed >= 0) { updateActiveOrder('discount', { type: 'fixed', value: fixed }); } 
                    else { showAlert({ title: 'Valor Inválido', message: 'El monto fijo debe ser un número mayor o igual a 0.' }); }
                }
            }
        });
    };

    const handleOpenCaja = (monto, nuevaTasa) => {
        if (!userId) { showAlert({ title: "Error", message: "No se pudo identificar al usuario." }); return; }
        const newSession = { openedAt: new Date().toISOString(), openedBy: { id: currentUser.id, name: currentUser.nombre_usuario }, initialAmount: Number(monto || 0), transactions: [], closedAt: null, closedBy: null, countedAmount: null, difference: null, notes: '' };
        saveCajaSession(userId, newSession);
        localStorage.setItem(`tasa_dolar_${userId}`, String(nuevaTasa || tasaDolar));
        setCajaSession(newSession);
        setTasaDolar(Number(nuevaTasa || tasaDolar));
        closeModal();
    };
    
    const handleDoCloseCaja = (countedAmount) => {
        if (!cajaSession || !userId) return;
        const finalSession = { ...cajaSession };
        
        // 🚨 CÁLCULO DE CAJA CORREGIDO 🚨
        const movimientoNetoEfectivo = (finalSession.transactions || []).reduce((total, tx) => {
            if (tx.type === 'venta_credito') {
                return total;
            }
            // Aquí es donde se usa el 'ingresoCaja' de la transacción (debe ser solo efectivo)
            return total + Number(tx.pagoDetalles?.ingresoCaja || 0);
        }, 0);

        const efectivoEsperado = Number(finalSession.initialAmount) + movimientoNetoEfectivo;
        finalSession.closedAt = new Date().toISOString();
        finalSession.closedBy = { id: currentUser.id, name: currentUser.nombre_usuario };
        finalSession.countedAmount = Number(countedAmount);
        finalSession.difference = Number(countedAmount) - efectivoEsperado;
        saveCajaSession(userId, finalSession);
        setCajaSession(finalSession);
        closeModal();
        showAlert({ title: "Caja Cerrada", message: `Caja cerrada con ${finalSession.difference === 0 ? 'un balance perfecto' : `una diferencia de C$${finalSession.difference.toFixed(2)}`}.`});
    };

    const handleFinishSale = async (pagoDetalles) => {
        const finalClientId = pagoDetalles.clienteId; 
        if (finalClientId === 0) {
            showAlert({ title: "Error de Cliente", message: "Debe seleccionar un cliente válido para finalizar la venta.", type: 'error' });
            return;
        }
        const itemsForSale = cart.map(({ raw, costo, existencia, ...rest }) => ({ ...rest, precio_unitario: rest.precio_venta || rest.precio }));
        const subtotal = cart.reduce((sum, item) => sum + (Number(item.precio_venta || item.precio || 0) * Number(item.quantity || 0)), 0);
        const discountAmount = (() => {
            if (activeOrder.discount?.type === 'percentage') return subtotal * (Number(activeOrder.discount.value) / 100);
            if (activeOrder.discount?.type === 'fixed') return Math.min(subtotal, Number(activeOrder.discount.value));
            return 0;
        })();
        const total = subtotal - discountAmount;
        
        // Asumimos que PaymentModal devuelve 'ingresoCaja' como el neto de efectivo (Efectivo - Cambio)
        const ingresoCajaParaTransaccion = Number(pagoDetalles.ingresoCaja || (pagoDetalles.efectivo - pagoDetalles.cambio) || 0);

        const saleToCreate = { totalVenta: total, subtotal: subtotal, descuento: discountAmount, items: itemsForSale, pagoDetalles, userId, clientId: finalClientId, tasaDolarAlMomento: tasaDolar };

        try {
            const response = await api.createSale(saleToCreate, token);
            showAlert({ title: "Éxito", message: "Venta registrada correctamente." });
            const esCredito = (pagoDetalles.credito || 0) > 0;
            
            // Usamos el ingresoCaja calculado solo con efectivo
            const transactionDetails = { 
                ...pagoDetalles, 
                clienteId: finalClientId, 
                // Esto es lo que va a la caja y excluye Transferencia/Tarjeta
                ingresoCaja: ingresoCajaParaTransaccion 
            };
            
            addCajaTransaction({ 
                id: `venta-${response.saleId || Date.now()}`, 
                type: esCredito ? 'venta_credito' : 'venta_contado', 
                amount: total, 
                note: `Venta #${response.saleId} ${esCredito ? '(CRÉDITO)' : ''}`, 
                at: new Date().toISOString(), 
                pagoDetalles: transactionDetails 
            });
            
            updateActiveOrder('clientId', initialClientId); 
            // Usamos refreshData para recargar todo
            await refreshData(); 
            handleRemoveOrder(activeOrderId); 
            closeModal();
            showConfirmation({
                title: "Imprimir Ticket",
                message: "¿Desea imprimir el ticket para esta venta?",
                onConfirm: () => { handleReprintTicket({ ...response.saleData, ...saleToCreate }); }
            });
        } catch (error) {
            console.error("Error Crítico al guardar venta:", error);
            showAlert({ title: "Error Crítico", message: `La venta no se pudo guardar. ${error.message}` });
        }
    };

    const handleCancelSale = async (saleId) => {
        if (!token) return;
        showAlert({ title: "Procesando", message: "Cancelando venta...", type: "loading" });
        const saleToReverse = dailySales.find(s => s.id == saleId); 
        try {
            await api.cancelSale(saleId, token); 
            if (saleToReverse?.pagoDetalles) {
                const montoARestar = Number(saleToReverse.pagoDetalles.ingresoCaja || 0);
                if (montoARestar !== 0) {
                    addCajaTransaction({ id: `cancelacion-${saleId}`, type: montoARestar > 0 ? 'salida' : 'entrada', amount: Math.abs(montoARestar), note: `Cancelación Venta #${saleId}`, pagoDetalles: { ingresoCaja: -montoARestar } });
                }
            }
            showAlert({ title: "Éxito", message: `Venta #${saleId} cancelada.` });
            // Usamos refreshData para recargar todo
            await refreshData(); 
        } catch (error) {
            console.error("Error al cancelar venta:", error);
            showAlert({ title: "Error de Cancelación", message: `No se pudo cancelar la venta #${saleId}.`, type: "error" });
        }
    };
    
    const handleReturnItem = async (sale, item, quantity) => {
        if (!token) return;
        showAlert({ title: "Procesando", message: `Devolviendo ${quantity} de ${item.nombre}...`, type: "loading" });
        try {
            await api.returnItem({ saleId: sale.id, itemId: item.id_producto || item.id, quantity }, token); 
            showAlert({ title: "Éxito", message: `Devolución registrada.` });
            // Usamos refreshData para recargar todo
            await refreshData(); 
        } catch (error) {
            console.error("Error al devolver producto:", error);
            showAlert({ title: "Error de Devolución", message: `No se pudo devolver el producto. ${error.message || ''}`, type: "error" });
        }
    };

    // Nueva función para manejar el éxito del abono y recargar los datos
    const handleAbonoSuccess = useCallback(() => {
        closeModal();
        showAlert({ title: 'Éxito', message: 'Abono registrado correctamente' });
        refreshData();
    }, [closeModal, showAlert, refreshData]);

    const handleReprintTicket = (transaction, creditStatus = null) => { setTicketData({ transaction, creditStatus }); };
    
    useEffect(() => {
        if (cajaSession) {
            setIsCajaOpen(!cajaSession.closedAt);
            setTasaDolar(Number(localStorage.getItem(`tasa_dolar_${userId}`) || 36.60));
        } else { setIsCajaOpen(false); }
    }, [cajaSession, userId]);
    
    useEffect(() => { setProductsState(initialProducts || []); }, [initialProducts]);
    
    // Al cargar el POS (si la caja está abierta), cargamos las ventas
    useEffect(() => { if (isCajaOpen) loadSalesFromDB(); }, [isCajaOpen, loadSalesFromDB]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'F1') { e.preventDefault(); searchInputRef.current?.focus(); }
            if (e.key === 'F2') { e.preventDefault(); if(cart.length > 0) openModal('payment', { initialClientId: activeOrder.clientId }); }
            if (e.key === 'F9') { e.preventDefault(); openModal('caja'); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart, openModal, activeOrder.clientId]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (Number(item.precio_venta || item.precio || 0) * Number(item.quantity || 0)), 0), [cart]);
    const discountAmount = useMemo(() => {
        if (activeOrder.discount?.type === 'percentage') return subtotal * (Number(activeOrder.discount.value) / 100);
        if (activeOrder.discount?.type === 'fixed') return Math.min(subtotal, Number(activeOrder.discount.value));
        return 0;
    }, [subtotal, activeOrder.discount]);
    const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);
    
    // --------------------------------------------------------------------------
    // 🚀 LÓGICA DE CARGA CONDICIONAL Y BÚSQUEDA (CORRECCIÓN DE DELAY) 🚀
    // --------------------------------------------------------------------------
    const filteredProducts = useMemo(() => {
        if (!products) return [];
        const term = searchTerm.toLowerCase().trim();

        // 1. Si no hay término de búsqueda o es muy corto, mostramos solo los primeros N productos
        if (!term || term.length < 3) {
            // Solo devolvemos los primeros 100 productos (para una carga inicial rápida)
            return products.slice(0, PRODUCTS_PER_PAGE);
        }

        // 2. Si hay un término de búsqueda suficiente (3+ caracteres), filtramos la lista completa
        const results = products.filter(p => 
            (p.nombre || '').toLowerCase().includes(term) || 
            (p.codigo || '').toLowerCase().includes(term)
        );

        // 3. Limitamos el número de resultados para evitar renderizados masivos, incluso en la búsqueda
        return results.slice(0, 500); // Mostramos un máximo de 500 resultados de búsqueda
    }, [searchTerm, products]);
    
    const totalResults = useMemo(() => {
        if (!products) return 0;
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            return products.length;
        }
        return products.filter(p => 
            (p.nombre || '').toLowerCase().includes(term) || 
            (p.codigo || '').toLowerCase().includes(term)
        ).length;
    }, [searchTerm, products]);
    // --------------------------------------------------------------------------
    
    if (!isCajaOpen) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ color: '#dc3545' }}><FaLock /> Caja Cerrada</h1>
                <p>La caja de <strong>{currentUser?.nombre_usuario || 'este usuario'}</strong> está cerrada.</p>
                <S.Button primary onClick={() => openModal('caja')} mt="true"><FaLockOpen /> Abrir Mi Caja</S.Button>
                {modal.name === 'caja' && <CajaModal currentUser={currentUser} isCajaOpen={isCajaOpen} session={cajaSession} onOpenCaja={handleOpenCaja} onCloseCaja={handleDoCloseCaja} isAdmin={isAdmin} showConfirmation={showConfirmation} showAlert={showAlert} onClose={closeModal} initialTasaDolar={tasaDolar} />}
                {modal.name === 'alert' && <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />}
                {modal.name === 'confirmation' && <ConfirmationModal isOpen={true} onClose={closeModal} onConfirm={() => { if (modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }} {...modal.props} />}
            </div>
        );
    }

    return (
        <S.PageWrapper>
            <S.HeaderActions>
                <S.BackButton to="/dashboard"><FaArrowLeft /> Volver</S.BackButton>
                
                <div style={{ fontSize: '0.8rem', color: '#555' }}><FaKeyboard /> Atajos: <strong>F1</strong> Buscar, <strong>F2</strong> Pagar, <strong>F9</strong> Caja</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <S.InfoBox style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '5px' }}>
                        <FaDollarSign style={{ marginRight: '5px', color: '#28a745' }} /> Tasa Dólar: **C${tasaDolar.toFixed(2)}**
                    </S.InfoBox>
                    <S.Button dark onClick={() => openModal('history')}><FaHistory /> Historial</S.Button>
                    <S.Button $cancel onClick={() => openModal('caja')}><FaLock /> Gestionar Caja</S.Button>
                </div>
            </S.HeaderActions>
            <S.PageContentWrapper>
                <S.MainPanel>
                    <S.SearchInput ref={searchInputRef} placeholder="Buscar producto (mín. 3 letras/números, F1)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 1rem 0' }}><FaStore /> Productos ({filteredProducts.length} de {totalResults})</h3>
                        
                        {/* Mensaje de advertencia si el término es muy corto o hay demasiados resultados */}
                        {(searchTerm.length < 3 && totalResults > PRODUCTS_PER_PAGE) && (
                            <S.InfoBox style={{ marginBottom: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba' }}>
                                <FaExclamationTriangle style={{ marginRight: '5px' }} />
                                Escriba **3 o más caracteres** para buscar en los {totalResults} productos. Mostrando los primeros {PRODUCTS_PER_PAGE}.
                            </S.InfoBox>
                        )}

                        <S.ProductGrid>
                            {filteredProducts.map(p =>
                                <S.ProductCard 
                                    key={p.id} 
                                    onClick={() => handleProductClick(p)} 
                                    // 🚨 CLAVE: outofstock para estilos rojos cuando existencia es 0 🚨
                                    outofstock={p.existencia <= 0}
                                >
                                    <S.StockBadge 
                                        lowstock={p.existencia < 10 && p.existencia > 0} 
                                        // 🚨 CLAVE: outofstock para estilos rojos en badge 🚨
                                        outofstock={p.existencia <= 0}
                                    >
                                        {p.existencia}
                                    </S.StockBadge>
                                    <div className="image-placeholder">{(p.nombre || '').charAt(0)}</div>
                                    <div className="info"> <p>{p.nombre}</p> <div className="price">C${Number(p.precio || 0).toFixed(2)}</div> {p.raw?.mayoreo > 0 && <small style={{color: '#007bff'}}><FaTags /> Mayoreo: C$${Number(p.raw.mayoreo).toFixed(2)}</small>}</div>
                                </S.ProductCard>
                            )}
                            {filteredProducts.length === 0 && searchTerm.length >= 3 && (
                                <p style={{ color: '#6c757d', textAlign: 'center', gridColumn: 'span 4' }}>No se encontraron productos con el término "{searchTerm}".</p>
                            )}
                        </S.ProductGrid>
                    </div>
                </S.MainPanel>
                <S.CartPanel>
                    
                    {/* BLOQUE 1: INFO CAJA (FIJO) */}
                    <S.InfoBox $pulsate>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>CAJA: <strong>{currentUser?.nombre_usuario}</strong></p>
                        <p style={{ margin: 0 }}>Fondo: <span style={{ fontWeight: 'bold' }}>C${Number(cajaSession?.initialAmount || 0).toFixed(2)}</span></p>
                    </S.InfoBox>
                    
                    {/* BLOQUE 2: TICKETS ACTIVOS (AHORA USA TicketContainer y es FIJO) */}
                    <div style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Tickets Activos ({orders.length})</h3>
                        <S.TicketContainer>
                            {orders.map(order => (
                                <S.Button 
                                    key={order.id} 
                                    style={{ backgroundColor: activeOrderId === order.id ? '#007bff' : '#6c757d', color: 'white' }} 
                                    onClick={() => setActiveOrderId(order.id)} 
                                    onDoubleClick={() => handleRenameOrder(order.id, order.name)}
                                >
                                    {order.name} ({order.items.length})
                                </S.Button>
                            ))}
                            <S.Button primary onClick={handleNewOrder}><FaPlus /> Nuevo</S.Button>
                        </S.TicketContainer>
                        
                        {orders.length > 1 && (
                            <div style={{ marginTop: '10px' }}>
                                <S.Button $cancel style={{ width: '100%' }} onClick={() => handleRemoveOrder(activeOrderId)}><FaTrashAlt /> Cerrar Ticket</S.Button>
                            </div>
                        )}
                    </div>
                    
                    {/* BLOQUE 3: ENCABEZADO DEL CARRITO (FIJO) */}
                    <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 0 }}>{activeOrder.name} <FaShoppingCart /></h2>
                    
                    {/* BLOQUE 4: LISTA DE PRODUCTOS (SCROLLABLE) */}
                    <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                        
                        {cart.length === 0 ? <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '3rem' }}>El ticket está vacío.</p> : cart.map(item => {
                            const productData = products.find(p => p.id === item.id);
                            const basePrice = productData?.precio || 0;
                            const hasWholesalePrice = (productData?.raw?.mayoreo || 0) > 0;
                            const isPriceModified = (item.precio_venta || basePrice) !== basePrice;

                            return (
                                <S.CartItemWrapper key={item.id}>
                                    <div className="item-info">
                                        <p className="item-name">{item.nombre}</p>
                                        <div className="item-details">
                                            <input type="number" value={item.quantity} onChange={e => handleUpdateCartQuantity(item.id, e.target.value)} min="1" max={item.existencia} />
                                            <small>x C$**{Number(item.precio_venta || item.precio || 0).toFixed(2)}**</small>
                                            
                                            {isAdmin && (
                                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                                                    <S.ActionButton title="Precio Manual" onClick={() => handleSetManualPrice(item)}><FaEdit /></S.ActionButton>
                                                    {hasWholesalePrice && <S.ActionButton title="Aplicar Mayoreo" onClick={() => handleApplyWholesalePrice(item)}><FaTags /></S.ActionButton>}
                                                    {isPriceModified && <S.ActionButton title="Revertir a Precio Normal" onClick={() => handleRevertToRetailPrice(item)}><FaRedo /></S.ActionButton>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="item-price">C${(Number(item.precio_venta || item.precio || 0) * Number(item.quantity || 0)).toFixed(2)}</p>
                                    <S.Button $cancel style={{ padding: '0.4rem', minWidth: 'auto', marginLeft: '1rem' }} onClick={() => handleRemoveFromCart(item.id)}><FaTimes /></S.Button>
                                </S.CartItemWrapper>
                            )
                        })}

                    </div>
                    
                    {/* BLOQUE 5: TOTALES Y BOTONES DE PAGO (FIJO) */}
                    <div>
                        <S.TotalsRow><span>Subtotal:</span><span>C${subtotal.toFixed(2)}</span></S.TotalsRow>
                        <S.TotalsRow onClick={applyOrderDiscount} style={{ cursor: 'pointer', color: discountAmount > 0 ? '#dc3545' : 'inherit' }}>
                            <span><FaPercentage /> Descuento Total:</span>
                            <span>- C${discountAmount.toFixed(2)}</span>
                        </S.TotalsRow>
                        <S.TotalsRow $bordered $bold className="grand-total"><span>TOTAL:</span><span>C${total.toFixed(2)}</span></S.TotalsRow>
                    </div>
                    <S.Button info mt="true" onClick={() => openModal('proforma')} disabled={cart.length === 0}><FaPrint /> Crear Proforma</S.Button>
                    <S.Button pay mt="true" onClick={() => openModal('payment', { initialClientId: activeOrder.clientId })} disabled={cart.length === 0}><FaCreditCard /> Proceder al Pago (F2)</S.Button>
                </S.CartPanel>
            </S.PageContentWrapper>

            {/* AÑADIDO: Pasamos onAbonoSuccess al modal de historial */}
            {modal.name === 'history' && <SalesHistoryModal dailySales={dailySales} onCancelSale={handleCancelSale} onReturnItem={handleReturnItem} onReprintTicket={handleReprintTicket} users={allUsers} clients={clients} isAdmin={isAdmin} showConfirmation={showConfirmation} showPrompt={showPrompt} showAlert={showAlert} onClose={closeModal} onAbonoSuccess={refreshData} />} 
            {modal.name === 'payment' && <PaymentModal total={total} tasaDolar={tasaDolar} clientes={clients} onFinishSale={handleFinishSale} showAlert={showAlert} onClose={closeModal} initialClientId={String(activeOrder.clientId || 0)}/>}
            {modal.name === 'caja' && <CajaModal currentUser={currentUser} isCajaOpen={isCajaOpen} session={cajaSession} onOpenCaja={handleOpenCaja} onCloseCaja={handleDoCloseCaja} isAdmin={isAdmin} showConfirmation={showConfirmation} showAlert={showAlert} onClose={closeModal} initialTasaDolar={tasaDolar} />}
            {modal.name === 'proforma' && <ProformaModal cart={cart} total={total} subtotal={subtotal} discount={discountAmount} client={clients.find(c => c.id_cliente === activeOrder.clientId)} onClose={closeModal} />}
            {ticketData.transaction && <TicketModal transaction={ticketData.transaction} creditStatus={ticketData.creditStatus} clients={clients} users={allUsers} onClose={() => setTicketData({ transaction: null, creditStatus: null })} />}
            {modal.name === 'confirmation' && <ConfirmationModal isOpen={true} onClose={closeModal} onConfirm={() => { if (modal.props.onConfirm) modal.props.onConfirm(); closeModal(); }} {...modal.props} />}
            {modal.name === 'prompt' && <PromptModal isOpen={true} onClose={closeModal} onConfirm={(value) => { if (modal.props.onConfirm) modal.props.onConfirm(value); closeModal(); }} {...modal.props} />}
            {modal.name === 'alert' && <AlertModal isOpen={true} onClose={closeModal} {...modal.props} />}
        </S.PageWrapper>
    );
};

export default POS;