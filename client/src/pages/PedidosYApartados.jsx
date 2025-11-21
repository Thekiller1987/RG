import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../service/api.js';
import { FaShoppingCart, FaClipboardList, FaSearch, FaUserTag, FaTrashAlt, FaPlus, FaMinus, FaMoneyBillWave, FaBoxOpen, FaEye, FaUsers, FaTag } from 'react-icons/fa';
import PaymentModal from './pos/components/PaymentModal.jsx'; 

/* =======================================
 * 1. ESTILOS RESPONSIVE (PWA)
 * ======================================= */
const styles = {
    // Estilos Base
    container: { padding: '10px', fontFamily: 'Roboto, sans-serif', background: '#e9ecef', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    tabs: { display: 'flex', marginBottom: '15px', background: 'white', padding: '5px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflowX: 'auto' },
    tab: { padding: '10px 15px', cursor: 'pointer', borderRadius: '6px', marginRight: '5px', transition: 'all 0.3s ease', whiteSpace: 'nowrap' },
    activeTab: { background: '#007bff', color: 'white', fontWeight: 'bold' },
    // Media Query para Responsiveness (Grid 2 columnas -> 1 columna)
    panel: { 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } 
    },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px', boxSizing: 'border-box' },
    button: { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '5px 0', fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s ease' },
    // Específicos
    productContainer: { maxHeight: '35vh', overflowY: 'auto', marginTop: '10px' },
    clientContainer: { maxHeight: '20vh', overflowY: 'auto' },
    productItem: { padding: '10px', marginBottom: '6px', borderRadius: '5px', cursor: 'pointer', background: '#f9f9f9', borderLeft: '4px solid #007bff00' },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee', background: '#fafafa', borderRadius: '4px' },
    totalBar: { background: '#007bff', color: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '1.2rem' },
    // Colores de Botones
    primaryButton: { background: '#007bff', color: 'white', '&:hover': { background: '#0056b3' } },
    successButton: { background: '#28a745', color: 'white', '&:hover': { background: '#1e7e34' } },
    dangerButton: { background: '#dc3545', color: 'white', '&:hover': { background: '#bd2130' } },
};

// Función para formatear moneda de forma segura
const fmt = (n) => `C$${Number(n ?? 0).toFixed(2)}`;

/* =======================================
 * 2. COMPONENTE PRINCIPAL
 * ======================================= */
const PedidosYApartados = () => {
    const { user: currentUser, clients, products: allProducts, token } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentModal, setPaymentModal] = useState({ open: false, order: null });
    const [loading, setLoading] = useState(false);
    const [temporaryTag, setTemporaryTag] = useState(''); 
    
    const tasaDolar = 1; 

    // Define roles
    const rolesCajeroAdmin = useMemo(() => ['Administrador', 'Contador', 'Encargado de Finanzas', 'Cajero'], []);
    const canCollectPayment = useMemo(() => rolesCajeroAdmin.includes(currentUser?.rol), [currentUser, rolesCajeroAdmin]);
    const canViewAllOrders = useMemo(() => rolesCajeroAdmin.includes(currentUser?.rol), [currentUser, rolesCajeroAdmin]);

    /* ---- Cargar Órdenes ---- */
    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const ordersData = await api.fetchOrders(token);
            
            // --- CORRECCIÓN DE ÓRDENES FANTASMA: Se filtran las órdenes con datos esenciales faltantes ---
            const validOrders = (ordersData || []).filter(order => 
                order.cliente_nombre && order.vendedor && order.total > 0
            );
            setAllOrders(validOrders);
        } catch (error) {
            console.error('Error cargando órdenes:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    /* ---- AUTOSLECCIÓN DE CLIENTE CONTADO ---- */
    useEffect(() => {
        if (clients.length > 0 && !selectedCustomer) {
            const contado = clients.find(c => (c.nombre || '').toLowerCase().includes('contado'));
            if (contado) {
                setSelectedCustomer(contado);
            }
        }
    }, [clients, selectedCustomer]);

    /* ---- FILTRO DE ÓRDENES POR USUARIO ---- */
    useEffect(() => {
        const pendingOrders = allOrders.filter(o => o.estado !== 'completado');

        if (canViewAllOrders) {
            setFilteredOrders(pendingOrders);
        } else {
            setFilteredOrders(
                pendingOrders.filter(order => order.usuario_id === currentUser?.id_usuario)
            );
        }
    }, [allOrders, canViewAllOrders, currentUser?.id_usuario]);


    /* ---- Derivados y Cálculos ---- */
    const filteredProducts = useMemo(() => allProducts.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo?.toString().includes(searchTerm)
    ), [allProducts, searchTerm]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0), [cart]);
    const total = subtotal; 

    /* ---- Manejo de Carrito (Lógica de añadir/quitar/actualizar) ---- */
    const handleAddToCart = useCallback((product) => {
        if ((product.existencia ?? 0) <= 0) {
            alert('Producto agotado');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id_producto === product.id_producto);
            const stock = product.existencia ?? 0;
            const price = product.precio_venta ?? product.precio ?? 0;

            if (existing) {
                if (existing.cantidad >= stock) {
                    alert('No hay suficiente stock');
                    return prev;
                }
                return prev.map(item =>
                    item.id_producto === product.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, {
                ...product,
                cantidad: 1,
                precio_unitario: price
            }];
        });
    }, []);

    const handleUpdateQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity < 1) {
            setCart(prev => prev.filter(item => item.id_producto !== productId));
            return;
        }

        const product = allProducts.find(p => p.id_producto === productId);
        if (newQuantity > (product?.existencia ?? 0)) {
            alert(`Máximo ${product.existencia} unidades disponibles`);
            return;
        }

        setCart(prev =>
            prev.map(item =>
                item.id_producto === productId
                    ? { ...item, cantidad: newQuantity }
                    : item
            )
        );
    }, [allProducts]);

    /* ---- Crear Orden (Ticket/Pedido) ---- */
    const handleCreateOrder = async (tipo = 'pedido') => {
        if (!selectedCustomer) {
            alert('Selecciona un cliente primero');
            return;
        }
        if (cart.length === 0) {
            alert('Agrega productos al carrito');
            return;
        }

        try {
            const orderData = {
                cliente_id: selectedCustomer.id_cliente,
                tipo: tipo,
                estado: 'pendiente',
                total: total,
                subtotal: subtotal,
                
                // === CORRECCIÓN FINAL: Redundancia para forzar el valor 0 en el backend ===
                abonado: 0, 
                abono_inicial: 0, // Nombre alternativo
                pagado_inicial: 0, // Nombre alternativo
                // ========================================================================
                
                etiqueta: temporaryTag,
                
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
            
            alert(`${tipo === 'pedido' ? 'Pedido' : 'Apartado'} #${createdOrder.id_pedido} creado exitosamente.`);
            
            setCart([]);
            setTemporaryTag(''); 
            loadOrders();
            setActiveTab(1);
            
        } catch (error) {
            // Manejo de errores más específico para el problema de la BD
            let errorMessage = 'Error desconocido.';
            if (error.message && (error.message.includes('abonado') || error.message.includes('NULL'))) {
                errorMessage = "Error de BD: Falta el campo 'abonado' o es nulo. Este es un problema de configuración en el servidor. Revisa que el campo 'abonado' en el backend tenga DEFAULT 0.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert('Error al crear la orden: ' + errorMessage);
        }
    };

    /* ---- ELIMINAR/CANCELAR ORDEN (Ajustado a api.cancelOrder) ---- */
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm(`⚠️ ¿Estás seguro de que quieres CANCELAR la Orden #${orderId}? Esta acción no se puede deshacer y borrará el ticket.`)) {
            return;
        }
        setLoading(true);
        try {
            await api.cancelOrder(orderId, token); 
            alert(`Orden #${orderId} cancelada/eliminada correctamente.`);
            loadOrders();
        } catch (error) {
            console.error('Error al cancelar orden:', error);
            alert('Error al cancelar la orden: ' + (error.message || 'Desconocido'));
        } finally {
            setLoading(false);
        }
    };

    /* ---- Finalizar Venta desde Modal (Facturar Ticket) ---- */
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
                },
                userId: currentUser.id_usuario,
                clientId: orderToProcess.cliente_id,
                origen: orderToProcess.tipo === 'apartado' ? 'apartado' : 'pedido',
                pedido_id: orderToProcess.id_pedido
            };

            await api.createSale(saleData, token);
            
            alert('✅ Pago procesado exitosamente. Venta registrada en el sistema.');
            
            setPaymentModal({ open: false, order: null });
            loadOrders();

        } catch (error) {
            console.error('Error al procesar pago:', error);
            throw new Error('Error al registrar la venta en el sistema: ' + (error.message || 'Desconocido'));
        }
    };


    /* =======================================
     * 3. RENDERIZADO DEL COMPONENTE
     * ======================================= */
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
                    <FaClipboardList /> Gestión de Órdenes
                </h1>
                {canCollectPayment && (
                    <span style={{ background: '#28a745', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        MODO CAJA
                    </span>
                )}
                {!canViewAllOrders && (
                    <span style={{ background: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        <FaUsers /> MODO VENDEDOR
                    </span>
                )}
            </div>

            <div style={styles.tabs}>
                <div 
                    style={{...styles.tab, ...(activeTab === 0 ? styles.activeTab : {})}}
                    onClick={() => setActiveTab(0)}
                >
                    <FaShoppingCart /> Nuevo Ticket (Pedido/Apartado)
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
                    <div>
                        <div style={{...styles.card, marginBottom: '15px'}}>
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
                                        <div style={{ fontWeight: 'bold' }}>{product.nombre}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            Stock: {product.existencia ?? 0} | Precio: {fmt(product.precio_venta || product.precio)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={{ marginTop: 0, color: '#333' }}><FaUserTag /> Seleccionar Cliente</h3>
                            <div style={styles.clientContainer}>
                                {clients.map(client => (
                                    <div
                                        key={client.id_cliente}
                                        style={{
                                            ...styles.productItem,
                                            background: selectedCustomer?.id_cliente === client.id_cliente ? '#e3f2fd' : '#f9f9f9',
                                            borderLeft: selectedCustomer?.id_cliente === client.id_cliente ? '4px solid #007bff' : '4px solid #007bff00'
                                        }}
                                        onClick={() => setSelectedCustomer(client)}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{client.nombre}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{client.telefono}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha (Carrito y Totales) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{...styles.card, flexGrow: 1}}>
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
                                        Agrega productos al ticket
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id_producto} style={styles.cartItem}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.nombre}</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {fmt(item.precio_unitario)} x {item.cantidad} = {fmt(item.precio_unitario * item.cantidad)}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <button 
                                                    style={{...styles.button, background: '#dc3545', color: 'white', padding: '5px 10px'}}
                                                    onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad - 1)}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{item.cantidad}</span>
                                                <button 
                                                    style={{...styles.button, background: '#28a745', color: 'white', padding: '5px 10px'}}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                <span>TOTAL:</span>
                                <span>{fmt(total)}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{...styles.button, ...styles.primaryButton, flex: 1}}
                                onClick={() => handleCreateOrder('pedido')}
                                disabled={!selectedCustomer || cart.length === 0}
                            >
                                Crear Pedido (Venta)
                            </button>
                            <button
                                style={{...styles.button, flex: 1, background: '#6c757d', color: 'white'}}
                                onClick={() => handleCreateOrder('apartado')}
                                disabled={!selectedCustomer || cart.length === 0}
                            >
                                Crear Apartado
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
                                            {/* Botón de CANCELAR (ELIMINAR) */}
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

            {/* Modal de Detalles (Mantengo tu estructura original) */}
            {selectedOrder && (
                <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                            Detalles de Orden #{selectedOrder.id_pedido}
                        </h2>
                        
                        <div style={styles.card}>
                            <p><strong>Cliente:</strong> {selectedOrder.cliente_nombre}</p>
                            <p><strong>Total:</strong> {fmt(selectedOrder.total)}</p>
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

            {/* Modal de Pago (Usando tu componente PaymentModal) */}
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
                    showAlert={({ title, message, type }) => alert(`${type.toUpperCase()}: ${title} - ${message}`)}
                />
            )}
        </div>
    );
};

export default PedidosYApartados;