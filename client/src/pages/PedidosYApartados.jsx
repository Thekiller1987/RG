import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../service/api.js';
import { FaShoppingCart, FaClipboardList, FaSearch, FaUserTag, FaTrashAlt, FaPlus, FaMinus, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';
import PaymentModal from './pos/components/PaymentModal.jsx'; // 👈 Importamos tu modal de pago

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
    panel: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }, // 👈 Responsive
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px', boxSizing: 'border-box' },
    button: { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '5px 0', fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s ease', whiteSpace: 'nowrap' },
    // Específicos
    productItem: { padding: '10px', marginBottom: '6px', borderRadius: '5px', cursor: 'pointer', background: '#f9f9f9', borderLeft: '4px solid #007bff00' },
    productItemHover: { background: '#e3f2fd', borderLeft: '4px solid #007bff' },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee', background: '#fafafa', borderRadius: '4px' },
    totalBar: { background: '#007bff', color: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '1.2rem' },
    // Colores de Botones
    primaryButton: { background: '#007bff', color: 'white', '&:hover': { background: '#0056b3' } },
    successButton: { background: '#28a745', color: 'white', '&:hover': { background: '#1e7e34' } },
    dangerButton: { background: '#dc3545', color: 'white', '&:hover': { background: '#bd2130' } },
};

// Función para formatear moneda
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
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentModal, setPaymentModal] = useState({ open: false, order: null });
    const [loading, setLoading] = useState(false);
    
    // Asumo que la tasa de dólar debe ser pasada al modal de pago (si no tienes un contexto para eso, es 1)
    const tasaDolar = 1; 

    // Verificar roles de cobro (Cajero)
    const canCollectPayment = useMemo(() => ['Administrador', 'Contador', 'Encargado de Finanzas', 'Cajero'].includes(currentUser?.rol), [currentUser]);

    /* ---- Cargar Órdenes ---- */
    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const ordersData = await api.fetchOrders(token);
            setOrders(ordersData || []);
        } catch (error) {
            console.error('Error cargando órdenes:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    /* ---- Derivados y Cálculos ---- */
    const filteredProducts = useMemo(() => allProducts.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo?.toString().includes(searchTerm)
    ), [allProducts, searchTerm]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0), [cart]);
    const total = subtotal; 

    /* ---- Manejo de Carrito ---- */
    const handleAddToCart = useCallback((product) => {
        if ((product.existencia ?? 0) <= 0) {
            alert('Producto agotado');
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.id_producto === product.id_producto);
            const stock = product.existencia ?? 0;
            const price = product.precio_venta ?? product.precio ?? 0; // 👈 Corrección de posible null/undefined

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
                precio_unitario: price // Usar el precio corregido
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
                items: cart.map(item => ({
                    producto_id: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.precio_unitario * item.cantidad,
                    nombre: item.nombre // Incluir nombre para el modal de pago/detalle
                })),
                usuario_id: currentUser.id_usuario,
                vendedor: currentUser.nombre_usuario,
                cliente_nombre: selectedCustomer.nombre // Para mostrar en la lista de órdenes
            };

            const createdOrder = await api.createOrder(orderData, token); // Asumo que devuelve la orden creada
            
            alert(`${tipo === 'pedido' ? 'Pedido' : 'Apartado'} #${createdOrder.id_pedido} creado exitosamente.`);
            
            setCart([]);
            setSelectedCustomer(null);
            loadOrders();
            setActiveTab(1); // Mover a la pestaña de órdenes existentes
            
        } catch (error) {
            alert('Error al crear la orden: ' + (error.message || 'Error desconocido'));
        }
    };

    /* ---- Finalizar Venta desde Modal (Manejador del PaymentModal) ---- */
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
                    // Asegurar que el id del cliente y vendedor estén en los detalles
                    clientId: orderToProcess.cliente_id,
                    userId: currentUser.id_usuario,
                },
                userId: currentUser.id_usuario,
                clientId: orderToProcess.cliente_id,
                origen: orderToProcess.tipo === 'apartado' ? 'apartado' : 'pedido',
                pedido_id: orderToProcess.id_pedido
            };

            // 1. Crear la Venta
            await api.createSale(saleData, token);

            // 2. Actualizar el estado de la Orden a 'completado'
            await api.updateOrderStatus(orderToProcess.id_pedido, 'completado', token);

            alert('✅ Pago procesado exitosamente. Venta registrada en el sistema.');
            
            // Limpiar y Recargar
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
                    <span style={{ ...styles.badge, background: '#28a745' }}>
                        MODO CAJA
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
                    <FaBoxOpen /> Órdenes Existentes
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
                            
                            <div style={{ maxHeight: '250px', overflowY: 'auto', marginTop: '10px' }}>
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
                            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
                    <h3 style={{ marginTop: 0, color: '#333' }}><FaBoxOpen /> Órdenes Existentes</h3>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Cargando órdenes...</div>
                    ) : orders.filter(o => o.estado !== 'completado').length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                            No hay órdenes pendientes
                        </div>
                    ) : (
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {orders.filter(o => o.estado !== 'completado').map(order => (
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
                                                Cliente: <strong>{order.cliente_nombre}</strong> | Total: <strong>{fmt(order.total)}</strong>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                style={{...styles.button, background: '#007bff', color: 'white', padding: '8px'}}
                                                onClick={() => setSelectedOrder(order)}
                                                title="Ver detalles"
                                            >
                                                👁️
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
                 // ... [Tu código original para el Modal de Detalles aquí] ...
                 // Para mantenerlo conciso, asumo que este modal está bien y no requiere cambios
                <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                            Detalles de Orden #{selectedOrder.id_pedido}
                        </h2>
                        
                        <div style={styles.card}>
                            <p><strong>Cliente:</strong> {selectedOrder.cliente_nombre}</p>
                            <p><strong>Total:</strong> {fmt(selectedOrder.total)}</p>
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
                    // Provee un snapshot del carrito para coherencia en el modal de pago
                    cartSnapshot={paymentModal.order.items} 
                    currentUserId={currentUser.id_usuario}
                    initialClientId={String(paymentModal.order.cliente_id)}
                    orderSubtotal={paymentModal.order.subtotal}
                    // Simulación de función showAlert si tu PaymentModal la espera
                    showAlert={({ title, message, type }) => alert(`${type.toUpperCase()}: ${title} - ${message}`)}
                />
            )}
        </div>
    );
};

export default PedidosYApartados;