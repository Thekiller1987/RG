import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../service/api.js';
import { 
    FaShoppingCart, FaClipboardList, FaSearch, FaUserTag, FaTrashAlt, FaPlus, FaMinus, 
    FaMoneyBillWave, FaBoxOpen, FaEye, FaTag, FaArrowLeft, FaFileInvoiceDollar, 
    FaCheckCircle, FaClipboardCheck
} from 'react-icons/fa';
import PaymentModal from './pos/components/PaymentModal.jsx'; 
import ConfirmationModal from './pos/components/ConfirmationModal.jsx'; 
import TicketModal from './pos/components/TicketModal.jsx'; 
import PromptModal from './pos/components/PromptModal.jsx'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

/* =======================================
 * CONFIGURACIÓN Y ESTILOS
 * ======================================= */
const API_URL = '/api'; 
const ENDPOINT_ABIERTAS_ACTIVAS = `${API_URL}/caja/abiertas/activas`;

const fmt = (n) => `C$${Number(n ?? 0).toFixed(2)}`;
const resolveName = (x) => (x?.name || x?.nombre || x?.nombre_usuario || 'Usuario');

const styles = { 
    container: { padding: '10px', fontFamily: 'Roboto, sans-serif', background: '#e9ecef', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    tabs: { display: 'flex', marginBottom: '15px', background: 'white', padding: '5px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflowX: 'auto' },
    tab: { padding: '10px 15px', cursor: 'pointer', borderRadius: '6px', marginRight: '5px', transition: 'all 0.3s ease', whiteSpace: 'nowrap' },
    activeTab: { background: '#007bff', color: 'white', fontWeight: 'bold' },
    panel: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        '@media (max-width: 768px)': { 
            gridTemplateColumns: '1fr' 
        }
    },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px', boxSizing: 'border-box' },
    button: { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '5px 0', fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s ease' },
    productContainer: { maxHeight: '35vh', overflowY: 'auto', marginTop: '10px', paddingRight: '5px' },
    clientContainer: { maxHeight: '20vh', overflowY: 'auto', paddingRight: '5px' },
    productItem: { 
        padding: '10px', marginBottom: '6px', borderRadius: '5px', cursor: 'pointer', background: '#f9f9f9', 
        borderLeft: '4px solid #007bff00', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px', borderBottom: '1px solid #eee', background: '#fafafa', borderRadius: '4px' },
    totalBar: { background: '#007bff', color: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold' },
    primaryButton: { background: '#007bff', color: 'white', '&:hover': { background: '#0056b3' } },
    successButton: { background: '#28a745', color: 'white', '&:hover': { background: '#1e7e34' } },
    dangerButton: { background: '#dc3545', color: 'white', '&:hover': { background: '#bd2130' } },
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modalContent: {
      background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', 
      width: '90%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    },
};


/* =======================================
 * 2. COMPONENTE PRINCIPAL PedidosYApartados
 * ======================================= */
const PedidosYApartados = () => {
    const navigate = useNavigate(); 
    
    const { currentUser, clients, products: allProducts, token } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [temporaryTag, setTemporaryTag] = useState(''); 
    
    const [modal, setModal] = useState({ name: null, props: {} });
    const [ticketData, setTicketData] = useState({ transaction: null, shouldOpen: false, printMode: '80' });
    
    // Lista de todas las cajas activas disponibles para seleccionar
    const [activeCajas, setActiveCajas] = useState([]); 
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentModal, setPaymentModal] = useState({ open: false, order: null });

    const tasaDolar = 1; 

    // Define roles
    const rolesCajeroAdmin = useMemo(() => ['Administrador', 'Contador', 'Encargado de Finanzas', 'Cajero'], []);
    const canCollectPayment = useMemo(() => rolesCajeroAdmin.includes(currentUser?.rol), [currentUser]);
    const canViewAllOrders = useMemo(() => rolesCajeroAdmin.includes(currentUser?.rol), [currentUser]);
    const isCajeroOrAdmin = useMemo(() => rolesCajeroAdmin.includes(currentUser?.rol), [currentUser]);

    // Helper para cerrar el modal genérico
    const closeGenericModal = () => setModal({ name: null, props: {} });
    
    // Helper para mostrar alertas
    const showAlert = useCallback((props) => setModal({ name: 'alert', props }), []);

    /* ---- TICKET/IMPRESIÓN LOGIC ---- */

    const openTicketWithOrder = useCallback((order, printMode = '80') => {
        const transaction = {
            id: order.id_pedido, 
            saleId: order.id_pedido,
            items: order.items,
            subtotal: order.subtotal,
            descuento: 0, 
            total_venta: order.total,
            clienteId: order.cliente_id,
            clienteNombre: order.cliente_nombre,
            usuarioNombre: order.vendedor,
            tipoVenta: order.tipo,
            tasaDolarAlMomento: tasaDolar,
            isProforma: order.tipo === 'apartado' || order.tipo === 'pedido',
            pagoDetalles: { efectivo: 0, tarjeta: 0, credito: 0, cambio: 0, ingresoCaja: 0 },
            notes: order.etiqueta || '',
            at: order.created_at || new Date().toISOString() 
        };

        setTicketData({ 
            transaction, 
            shouldOpen: true, 
            printMode 
        });
    }, [tasaDolar]);

    const askForPrintOrder = useCallback((order) => {
        const orderType = order.tipo || 'Pedido';
        const saleId = order.id_pedido;

        const closeModals = () => setTicketData({ transaction: null, shouldOpen: false });
        
        showAlert({
            title: `Imprimir ${orderType} #${saleId}`,
            message: "¿Desea imprimir el comprobante de este pedido?",
            type: "custom",
            buttons: [
                { 
                    label: "80 mm (Recibo)", 
                    action: () => {
                        openTicketWithOrder(order, '80');
                        closeGenericModal();
                    }, 
                    isPrimary: true 
                },
                { 
                    label: "A4 (Completo)", 
                    action: () => {
                        openTicketWithOrder(order, 'A4');
                        closeGenericModal();
                    } 
                },
                { label: "No / Cerrar", action: closeModals, isCancel: true }
            ]
        });

    }, [openTicketWithOrder, showAlert]);

    /* ---- CARGA DE DATOS Y ESTADO DE CAJA ---- */

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const ordersData = await api.fetchOrders(token);
            const validOrders = (ordersData || []).filter(order => 
                order.cliente_nombre && order.vendedor && order.total > 0
            );
            setAllOrders(validOrders);
        } catch (error) {
            console.error('Error cargando órdenes:', error);
            showAlert({ title: "Error", message: "No se pudieron cargar las órdenes pendientes." });
        } finally {
            setLoading(false);
        }
    }, [token, showAlert]);

    // Función para cargar TODAS las cajas activas disponibles para selección
    const loadActiveCajas = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(ENDPOINT_ABIERTAS_ACTIVAS, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            // Adaptar la respuesta del servidor al formato de opciones para el modal
            const cajas = (response.data?.abiertas || [])
                .filter(c => !c.closedAt) // Solo cajas abiertas
                .map(c => ({
                    value: String(c.id_caja || c.id), // Asegurar que sea string para el select
                    label: `Caja #${c.id_caja || c.id} - ${resolveName(c.openedBy)}`
                }));
            
            setActiveCajas(cajas);
        } catch (error) {
            console.error('Error cargando cajas activas:', error);
            showAlert({ title: "Error", message: "No se pudo cargar la lista de cajas activas. No podrá crear pedidos." });
            setActiveCajas([]);
        }
    }, [token, showAlert]);

    useEffect(() => {
        if (currentUser) {
            loadOrders();
            loadActiveCajas(); 
        }
    }, [loadOrders, loadActiveCajas, currentUser]);

    /* ---- AUTOSLECCIÓN DE CLIENTE CONTADO ---- */
    useEffect(() => {
        if (clients.length > 0 && !selectedCustomer) {
            const contado = clients.find(c => (c.nombre || '').toLowerCase().includes('final') || (c.nombre || '').toLowerCase().includes('contado'));
            if (contado) {
                setSelectedCustomer(contado);
            }
        }
    }, [clients, selectedCustomer]);

    /* ---- FILTRO DE ÓRDENES POR USUARIO/ROL (se mantiene) ---- */
    useEffect(() => {
        const pendingOrders = allOrders.filter(o => o.estado !== 'completado');

        if (canViewAllOrders) {
            setFilteredOrders(pendingOrders);
        } else {
            setFilteredOrders(
                pendingOrders.filter(order => String(order.usuario_id) === String(currentUser?.id_usuario))
            );
        }
    }, [allOrders, canViewAllOrders, currentUser?.id_usuario]);


    /* ---- Handlers de Interacción / Carrito ---- */
    
    const filteredProducts = useMemo(() => allProducts.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo?.toString().includes(searchTerm)
    ), [allProducts, searchTerm]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0), [cart]);
    const total = subtotal; 

    // **LÓGICA DE CARRITO CORREGIDA Y SIMPLIFICADA**
    const handleAddToCart = useCallback((product) => {
        const stock = product.existencia ?? 0;
        if (stock <= 0) {
            showAlert({ title: 'Producto Agotado', message: 'No hay stock disponible para este producto.' });
            return;
        }
        
        const productIdKey = product.id_producto; 
        const price = product.precio_venta ?? product.precio ?? 0;

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id_producto === productIdKey);
            
            if (existingIndex !== -1) {
                const existing = prev[existingIndex];
                const newQuantity = existing.cantidad + 1;
                
                if (newQuantity > stock) {
                    showAlert({ title: 'Stock Insuficiente', message: `Máximo ${stock} unidades.` });
                    return prev;
                }
                
                return prev.map((item, index) =>
                    index === existingIndex
                        ? { ...item, cantidad: newQuantity }
                        : item
                );
            }
            // Si es un ítem nuevo
            return [...prev, {
                ...product,
                cantidad: 1,
                precio_unitario: price,
                id_producto: productIdKey,
                // Normaliza campos para el backend:
                nombre: product.nombre,
                // Asegura que el precio de venta sea el que usamos
                precio: price 
            }];
        });
    }, [showAlert]);

    // Lógica para actualizar cantidad del carrito
    const handleUpdateQuantity = useCallback((productId, newQuantity) => {
        const numQuantity = parseInt(newQuantity, 10) || 0;

        if (numQuantity < 1) {
            setCart(prev => prev.filter(item => item.id_producto !== productId));
            return;
        }

        const productData = allProducts.find(p => p.id_producto === productId);
        if (numQuantity > (productData?.existencia ?? 0)) {
            showAlert({ title: "Stock Insuficiente", message: `Máximo ${productData.existencia} unidades disponibles.` });
            return;
        }

        setCart(prev =>
            prev.map(item =>
                item.id_producto === productId
                    ? { ...item, cantidad: numQuantity, subtotal: item.precio_unitario * numQuantity }
                    : item
            )
        );
    }, [allProducts, showAlert]);

    /* ---- Lógica de Creación de Pedido Personalizado (Función Principal) ---- */
    
    const handleCreateOrderFlow = () => {
        if (!selectedCustomer) {
            showAlert({ title: 'Cliente Requerido', message: 'Selecciona un cliente para crear el pedido.' });
            return;
        }
        if (cart.length === 0) {
            showAlert({ title: 'Carrito Vacío', message: 'Agrega productos al carrito primero.' });
            return;
        }
        if (activeCajas.length === 0) {
             showAlert({ title: 'Caja Inactiva', message: 'No hay cajas activas disponibles. Por favor, abre una caja en el POS principal.' });
             return;
        }
        
        // 1. Abrir Modal de Selección de Caja y Nombre
        setModal({
            name: 'prompt_name_caja',
            props: {
                title: 'Crear Ticket Personalizado',
                message: (
                    <>
                        <p style={{marginBottom: '15px'}}>Selecciona una caja activa y asigna un nombre/referencia al ticket.</p>
                        
                        <label htmlFor="cajaSelect" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Caja a Asignar:
                        </label>
                        <select 
                            id="cajaSelect" 
                            style={styles.input}
                            defaultValue={activeCajas[0]?.value} 
                        >
                            {activeCajas.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="ticketName" style={{ display: 'block', margin: '15px 0 5px', fontWeight: 'bold' }}>
                            Nombre del Ticket/Referencia:
                        </label>
                        <input 
                            type="text" 
                            id="ticketName" 
                            placeholder={`Ej: ${selectedCustomer.nombre} - ${new Date().toLocaleTimeString()}`} 
                            defaultValue={selectedCustomer.nombre || ''}
                            style={styles.input}
                        />
                    </>
                ),
                // Usamos onConfirm para manejar la lógica de los campos
                onConfirm: (value) => {
                    // Accedemos a los valores del DOM dentro de onConfirm (Necesario cuando PromptModal es genérico)
                    const nameInput = document.getElementById('ticketName');
                    const cajaSelect = document.getElementById('cajaSelect');

                    const newName = nameInput?.value?.trim() || `Pedido para ${selectedCustomer.nombre}`;
                    const selectedCajaId = Number(cajaSelect?.value);

                    if (!selectedCajaId) {
                         showAlert({ title: "Error", message: "Debes seleccionar una caja activa." });
                         return;
                    }
                    
                    // Llamada a la función final de creación
                    handleCreateOrder('pedido', newName, selectedCajaId);
                    closeGenericModal();
                },
                inputType: 'custom',
                closeLabel: 'Cancelar',
                confirmLabel: 'Crear Pedido'
            }
        });
    };

    /* ---- Crear Orden (Función Final) ---- */
    const handleCreateOrder = async (tipo, pedidoName, idCaja) => {
        try {
            const orderData = {
                cliente_id: selectedCustomer.id_cliente,
                tipo: tipo,
                estado: 'pendiente',
                total: total,
                subtotal: subtotal,
                
                // Nuevos/Corregidos campos sensibles al backend
                abonado: 0, 
                etiqueta: temporaryTag || pedidoName, 
                nombre_pedido: pedidoName, 
                id_caja: idCaja, // <--- ID de Caja seleccionado
                
                items: cart.map(item => ({
                    producto_id: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.precio_unitario * item.cantidad,
                    nombre: item.nombre
                })),
                usuario_id: currentUser.id_usuario,
                vendedor: currentUser.nombre_usuario,
                cliente_nombre: selectedCustomer.nombre
            };

            const createdOrder = await api.createOrder(orderData, token);
            
            showAlert({ title: "Éxito", message: `Pedido #${createdOrder.id_pedido} creado exitosamente.` });
            
            const orderWithDetails = { 
                ...orderData, 
                id_pedido: createdOrder.id_pedido, 
                created_at: new Date().toISOString(), 
                tipo 
            };
            askForPrintOrder(orderWithDetails); 

            setCart([]);
            setTemporaryTag(''); 
            loadOrders();
            setActiveTab(1);
            
        } catch (error) {
            let errorMessage = error.response?.data?.message || error.message || 'Error desconocido.';
            showAlert({ title: 'Error al crear la orden', message: errorMessage });
        }
    };

    /* ---- Handlers de Órdenes Existentes ---- */
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm(`⚠️ ¿Estás seguro de que quieres CANCELAR la Orden #${orderId}? Esta acción no se puede deshacer y borrará el ticket.`)) {
            return;
        }
        setLoading(true);
        try {
            await api.cancelOrder(orderId, token); 
            showAlert({ title: "Cancelado", message: `Orden #${orderId} cancelada/eliminada correctamente.` });
            loadOrders();
        } catch (error) {
            console.error('Error al cancelar orden:', error);
            showAlert({ title: "Error", message: 'Error al cancelar la orden: ' + (error.message || 'Desconocido') });
        } finally {
            setLoading(false);
        }
    };
    
    const handleFinishSaleFromModal = async (pagoDetalles) => {
        const orderToProcess = paymentModal.order;

        if (!orderToProcess) throw new Error("No hay orden para procesar.");

        try {
            const saleData = {
                totalVenta: orderToProcess.total,
                subtotal: orderToProcess.subtotal,
                descuento: 0, 
                items: orderToProcess.items.map(item => ({
                    id: item.producto_id,
                    quantity: item.cantidad,
                    precio: item.precio_unitario
                })),
                pagoDetalles: {
                    ...pagoDetalles,
                    clientId: orderToProcess.cliente_id,
                    userId: currentUser.id_usuario,
                    // Asegurar que la caja se pase desde la orden para la transacción
                    id_caja: orderToProcess.id_caja 
                },
                userId: currentUser.id_usuario,
                clientId: orderToProcess.cliente_id,
                origen: orderToProcess.tipo === 'apartado' ? 'apartado' : 'pedido',
                pedido_id: orderToProcess.id_pedido
            };

            const response = await api.createSale(saleData, token);
            
            setPaymentModal({ open: false, order: null });
            showAlert({ title: 'Cobro Exitoso', message: 'Venta registrada en el sistema.' });
            loadOrders();

        } catch (error) {
            console.error('Error al procesar pago:', error);
            showAlert({ title: "Error en el Pago", message: 'No se pudo registrar la venta: ' + (error.message || 'Desconocido') });
            throw new Error('Error al registrar la venta en el sistema: ' + (error.message || 'Desconocido'));
        }
    };

    /* =======================================
     * 3. RENDERIZADO DEL COMPONENTE
     * ======================================= */
    
    const currentCajaStatus = activeCajas.find(c => String(c.value) === String(currentUser?.caja_activa)) || activeCajas[0]; // Intenta usar la caja activa del usuario (si está en el contexto) o la primera disponible.

    return (
        <div style={styles.container}>
            
            <div style={styles.header}>
                <button 
                    style={{...styles.button, ...styles.primaryButton, padding: '10px 15px', marginRight: '10px'}} 
                    onClick={() => navigate('/dashboard')}
                >
                    <FaArrowLeft /> Dashboard
                </button>
                <h1 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                    <FaClipboardList /> Gestión de Órdenes (Pedidos)
                </h1>
                <span style={{ 
                    background: activeCajas.length > 0 ? '#28a745' : '#dc3545', 
                    color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' 
                }}>
                    CAJAS ACTIVAS: {activeCajas.length}
                </span>
            </div>

            <div style={styles.tabs}>
                <div 
                    style={{...styles.tab, ...(activeTab === 0 ? styles.activeTab : {})}}
                    onClick={() => setActiveTab(0)}
                >
                    <FaShoppingCart /> Nuevo Ticket (Pedido)
                </div>
                <div 
                    style={{...styles.tab, ...(activeTab === 1 ? styles.activeTab : {})}}
                    onClick={() => setActiveTab(1)}
                >
                    <FaBoxOpen /> Órdenes Pendientes ({filteredOrders.length})
                </div>
            </div>

            {/* Panel de Nuevo Ticket */}
            {activeTab === 0 && (
                <div style={styles.panel}>
                    
                    {/* Columna Izquierda (Productos y Clientes) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={styles.card}>
                            <h3 style={{ marginTop: 0, color: '#333' }}><FaSearch /> Buscar Productos</h3>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.input}
                            />
                            
                            <div style={styles.productContainer}>
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id_producto}
                                        style={styles.productItem}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{product.nombre}</div>
                                        <div style={{ textAlign: 'right', fontSize: '13px' }}>
                                            <span style={{ color: '#007bff', fontWeight: 'bold' }}>{fmt(product.precio_venta || product.precio)}</span>
                                            <span style={{ color: '#666', marginLeft: '10px' }}>Stock: {product.existencia ?? 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={{ marginTop: 0, color: '#333' }}><FaUserTag /> Cliente Seleccionado</h3>
                            <div style={styles.clientContainer}>
                                {clients.map(client => (
                                    <div
                                        key={client.id_cliente}
                                        style={{
                                            ...styles.productItem,
                                            justifyContent: 'flex-start',
                                            gap: '10px',
                                            background: selectedCustomer?.id_cliente === client.id_cliente ? '#e3f2fd' : '#f9f9f9',
                                            borderLeft: selectedCustomer?.id_cliente === client.id_cliente ? '4px solid #007bff' : '4px solid #007bff00'
                                        }}
                                        onClick={() => setSelectedCustomer(client)}
                                    >
                                        <FaCheckCircle color={selectedCustomer?.id_cliente === client.id_cliente ? '#28a745' : '#ccc'} size="1.2em" />
                                        <div style={{ fontWeight: 'bold' }}>{client.nombre}</div>
                                        <span style={{ fontSize: '12px', color: '#666' }}>({client.telefono})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha (Etiqueta, Carrito y Totales) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={styles.card}>
                            <h3 style={{ marginTop: 0, color: '#333' }}><FaTag /> Etiqueta/Nota Temporal</h3>
                            <input
                                type="text"
                                placeholder="Ej: Pago pendiente, Llama antes de entregar..."
                                value={temporaryTag}
                                onChange={(e) => setTemporaryTag(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={{...styles.card, flexGrow: 1}}>
                            <h3 style={{ marginTop: 0, color: '#333' }}><FaShoppingCart /> Carrito</h3>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {cart.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                                        El carrito está vacío. Agrega productos.
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id_producto} style={styles.cartItem}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{item.nombre}</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {fmt(item.precio_unitario)} x {item.cantidad} = <strong style={{ color: '#333' }}>{fmt(item.precio_unitario * item.cantidad)}</strong>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <button 
                                                    style={{...styles.button, background: '#dc3545', color: 'white', padding: '5px 10px', width: '30px', height: '30px'}}
                                                    onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad - 1)}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span style={{ minWidth: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{item.cantidad}</span>
                                                <button 
                                                    style={{...styles.button, background: '#28a745', color: 'white', padding: '5px 10px', width: '30px', height: '30px'}}
                                                    onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad + 1)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={styles.totalBar}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ffffff33', paddingBottom: '5px', marginBottom: '5px' }}>
                                <span>Subtotal:</span>
                                <span>{fmt(subtotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '5px' }}>
                                <span>TOTAL:</span>
                                <span>{fmt(total)}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{...styles.button, ...styles.primaryButton, flex: 1}}
                                onClick={handleCreateOrderFlow}
                                disabled={!selectedCustomer || cart.length === 0 || activeCajas.length === 0}
                            >
                                <FaFileInvoiceDollar /> Crear Pedido (Ticket)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Panel de Órdenes Existentes */}
            {activeTab === 1 && (
                <div style={styles.card}>
                    <h3 style={{ marginTop: 0, color: '#333' }}><FaBoxOpen /> Órdenes Pendientes</h3>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Cargando órdenes...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                            No hay órdenes pendientes asignadas.
                        </div>
                    ) : (
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {filteredOrders.map(order => (
                                <div
                                    key={order.id_pedido}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        marginBottom: '10px',
                                        background: 'white',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{order.tipo?.toUpperCase()} #{order.id_pedido}</strong>
                                            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                                                Cliente: <strong>{order.cliente_nombre}</strong> | Total: <strong>{fmt(order.total)}</strong> | Vendedor: {order.vendedor}
                                                {order.etiqueta && (
                                                    <span style={{ display: 'block', color: '#007bff', fontWeight: 'bold', fontSize: '12px' }}>
                                                        <FaTag /> {order.etiqueta}
                                                    </span>
                                                )}
                                                {order.id_caja && (
                                                    <span style={{ display: 'block', color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}>
                                                        <FaClipboardCheck /> Caja ID: {order.id_caja}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                style={{...styles.button, background: '#007bff', color: 'white', padding: '8px'}}
                                                onClick={() => setSelectedOrder(order)}
                                                title="Ver detalles"
                                            >
                                                <FaEye />
                                            </button>
                                            <button 
                                                style={{...styles.button, background: '#dc3545', color: 'white', padding: '8px'}}
                                                onClick={() => handleDeleteOrder(order.id_pedido)}
                                                title="Cancelar/Eliminar orden"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                            {canCollectPayment && order.estado === 'pendiente' && (
                                                <button 
                                                    style={{...styles.button, ...styles.successButton, padding: '8px'}}
                                                    onClick={() => setPaymentModal({ open: true, order })}
                                                    title="Procesar pago (Caja)"
                                                >
                                                    <FaMoneyBillWave /> Cobrar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Detalles */}
            {selectedOrder && (
                <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                            Detalles de Orden #{selectedOrder.id_pedido}
                        </h2>
                        
                        <div style={styles.card}>
                            <p><strong>Cliente:</strong> {selectedOrder.cliente_nombre}</p>
                            <p><strong>Total:</strong> {fmt(selectedOrder.total)}</p>
                            <p><strong>Caja Asignada:</strong> {selectedOrder.id_caja || 'N/A'}</p>
                            <p><strong>Etiqueta/Nota:</strong> {selectedOrder.etiqueta || 'N/A'}</p>
                            <p><strong>Fecha:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                        </div>
                        
                        <h3 style={{ color: '#333' }}>Productos:</h3>
                        <div style={styles.card}>
                            {selectedOrder.items?.map((item, index) => (
                                <div key={index} style={{ 
                                    padding: '8px 0', 
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{item.nombre}</span>
                                    <span>
                                        {item.cantidad} x {fmt(item.precio_unitario)} = 
                                        <strong> {fmt(item.subtotal)}</strong>
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            style={{...styles.button, ...styles.primaryButton, marginTop: '15px', width: '100%'}}
                            onClick={() => setSelectedOrder(null)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* MODALES GENÉRICOS/TRANSACCIONALES */}

            {/* Modal de Pago */}
            {paymentModal.open && paymentModal.order && (
                <PaymentModal
                    total={paymentModal.order.total}
                    tasaDolar={tasaDolar}
                    onClose={() => setPaymentModal({ open: false, order: null })}
                    onFinishSale={handleFinishSaleFromModal}
                    clientes={clients}
                    cartSnapshot={paymentModal.order.items} 
                    currentUserId={currentUser.id_usuario}
                    initialClientId={String(paymentModal.order.cliente_id)}
                    orderSubtotal={paymentModal.order.subtotal}
                    showAlert={showAlert}
                />
            )}
            
            {/* Modal de Alerta/Confirmación (usado para impresión y errores) */}
            {modal.name === 'alert' && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={closeGenericModal}
                    {...modal.props}
                />
            )}
            
            {/* Modal de Prompt (Nombrar Pedido/Seleccionar Caja) */}
            {modal.name === 'prompt_name_caja' && (
                <PromptModal
                    isOpen={true}
                    onClose={closeGenericModal}
                    // Importante: No pasamos 'value' aquí, ya que los campos son custom
                    onConfirm={modal.props.onConfirm}
                    title={modal.props.title}
                    message={modal.props.message}
                    inputType={modal.props.inputType}
                    closeLabel={modal.props.closeLabel}
                    confirmLabel={modal.props.confirmLabel}
                />
            )}

            {/* Modal de Ticket (Vista Previa de Impresión) */}
            {ticketData.transaction && (
                <TicketModal
                    transaction={ticketData.transaction}
                    creditStatus={null}
                    clients={clients}
                    users={null} 
                    isOpen={ticketData.shouldOpen}
                    onClose={() => setTicketData({ transaction: null, shouldOpen: false })}
                    printMode={ticketData.printMode}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default PedidosYApartados;