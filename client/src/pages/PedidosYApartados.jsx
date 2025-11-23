import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../service/api.js';
import { 
    FaShoppingCart, FaClipboardList, FaSearch, FaUserTag, FaTrashAlt, FaPlus, FaMinus, 
    FaFileInvoiceDollar, FaCheckCircle, FaClipboardCheck, FaArrowLeft
} from 'react-icons/fa';
// Importamos solo los modales necesarios para la creación
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
    
    // Simplificamos el layout para una sola ventana POS de creación
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
    productContainer: { maxHeight: '60vh', overflowY: 'auto', marginTop: '10px', paddingRight: '5px' },
    clientContainer: { maxHeight: '20vh', overflowY: 'auto', paddingRight: '5px' },
    productItem: { 
        padding: '10px', marginBottom: '6px', borderRadius: '5px', cursor: 'pointer', background: '#f9f9f9', 
        borderLeft: '4px solid #007bff00', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px', borderBottom: '1px solid #eee', background: '#fafafa', borderRadius: '4px' },
    totalBar: { background: '#007bff', color: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold' },
    primaryButton: { background: '#007bff', color: 'white', '&:hover': { background: '#0056b3' } },
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
    // Eliminamos activeTab y el manejo de órdenes pendientes
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]); // Carrito activo
    const [loading, setLoading] = useState(false);
    const [temporaryTag, setTemporaryTag] = useState(''); 
    
    const [modal, setModal] = useState({ name: null, props: {} });
    const [ticketData, setTicketData] = useState({ transaction: null, shouldOpen: false, printMode: '80' });
    
    // Lista de todas las cajas activas disponibles para seleccionar
    const [activeCajas, setActiveCajas] = useState([]); 
    
    const tasaDolar = 1; // Simplificamos la tasa
    
    // Helper para cerrar el modal genérico
    const closeGenericModal = () => setModal({ name: null, props: {} });
    
    // Helper para mostrar alertas
    const showAlert = useCallback((props) => setModal({ name: 'alert', props }), []);


    /* ---------------------- FETCHING INICIAL ---------------------- */

    // Función para cargar TODAS las cajas activas disponibles para selección
    const loadActiveCajas = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(ENDPOINT_ABIERTAS_ACTIVAS, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            // Adaptar la respuesta del servidor al formato de opciones
            const cajas = (response.data?.abiertas || [])
                .filter(c => !c.closedAt) 
                .map(c => ({
                    value: String(c.id_caja || c.id), 
                    label: `Caja #${c.id_caja || c.id} - ${resolveName(c.openedBy)}`
                }));
            
            setActiveCajas(cajas);
        } catch (error) {
            console.error('Error cargando cajas activas:', error);
            showAlert({ title: "Error", message: "No se pudo cargar la lista de cajas activas. No se pueden crear pedidos." });
            setActiveCajas([]);
        }
    }, [token, showAlert]);

    useEffect(() => {
        if (currentUser) {
            loadActiveCajas(); 
        }
    }, [loadActiveCajas, currentUser]);

    /* ---- AUTOSLECCIÓN DE CLIENTE CONTADO ---- */
    useEffect(() => {
        if (clients.length > 0 && !selectedCustomer) {
            const contado = clients.find(c => (c.nombre || '').toLowerCase().includes('final') || (c.nombre || '').toLowerCase().includes('contado'));
            if (contado) {
                setSelectedCustomer(contado);
            }
        }
    }, [clients, selectedCustomer]);

    /* ---------------------- CÁLCULOS Y LÓGICA DE CARRITO ---------------------- */

    const filteredProducts = useMemo(() => allProducts.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo?.toString().includes(searchTerm)
    ), [allProducts, searchTerm]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0), [cart]);
    const total = subtotal; 

    // Agrega o incrementa la cantidad de un producto
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
                nombre: product.nombre,
                precio: price 
            }];
        });
    }, [showAlert]);

    // Actualiza cantidad o elimina si es <= 0
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

    /* ---------------------- CREACIÓN DE TICKET (FUNCIÓN POS CLONADA) ---------------------- */

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
             showAlert({ title: 'Caja Inactiva', message: 'No hay cajas activas disponibles. Debe haber al menos una caja abierta en el sistema.' });
             return;
        }
        
        // 1. Abrir Modal de Selección de Caja y Nombre
        setModal({
            name: 'prompt_name_caja',
            props: {
                title: 'Crear Nuevo Ticket (Pedido)',
                // Usamos JSX en el mensaje para inyectar los campos custom
                message: (
                    <>
                        <p style={{marginBottom: '15px'}}>Selecciona la caja de destino y asigna un nombre al ticket.</p>
                        
                        <label htmlFor="cajaSelect" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Caja a Asignar: <span style={{color: '#007bff'}}>(Hay {activeCajas.length} cajas activas)</span>
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
                            defaultValue={`Ticket ${selectedCustomer.nombre || ''}`}
                            style={styles.input}
                        />
                    </>
                ),
                // Lógica de confirmación: extrae valores del DOM
                onConfirm: () => {
                    const nameInput = document.getElementById('ticketName');
                    const cajaSelect = document.getElementById('cajaSelect');

                    const newName = nameInput?.value?.trim() || `Pedido para ${selectedCustomer.nombre}`;
                    const selectedCajaId = Number(cajaSelect?.value);

                    if (!selectedCajaId) {
                         showAlert({ title: "Error", message: "Debes seleccionar una caja activa." });
                         return;
                    }
                    
                    // Llama a la función final de guardado con los datos
                    handleCreateOrder('pedido', newName, selectedCajaId);
                },
                inputType: 'custom', // Indica a PromptModal que renderice el JSX en 'message'
                closeLabel: 'Cancelar',
                confirmLabel: 'Guardar Ticket'
            }
        });
    };

    /* ---- Crear Orden (Función Final - Similar a POS.jsx) ---- */
    const handleCreateOrder = async (tipo, pedidoName, idCaja) => {
        closeGenericModal();
        setLoading(true);

        try {
            const orderData = {
                cliente_id: selectedCustomer.id_cliente,
                tipo: tipo, // 'pedido'
                estado: 'pendiente',
                total: total,
                subtotal: subtotal,
                
                // Datos requeridos por el backend para pedidos/tickets
                abonado: 0, 
                etiqueta: temporaryTag || pedidoName, 
                nombre_pedido: pedidoName, 
                id_caja: idCaja, 
                
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
            
            showAlert({ title: "Ticket Guardado", message: `Ticket #${createdOrder.id_pedido} guardado con éxito y asignado a la Caja ID: ${idCaja}.` });
            
            // Prepara los datos para la impresión (simulación de POS)
            const orderWithDetails = { 
                ...orderData, 
                id_pedido: createdOrder.id_pedido, 
                created_at: new Date().toISOString(), 
                tipo,
                id_caja: idCaja // Aseguramos que la caja esté en el objeto para el modal
            };
            askForPrintOrder(orderWithDetails); 

            // Limpiar y resetear el estado local
            setCart([]);
            setTemporaryTag(''); 
            loadActiveCajas(); // Recargar cajas por si acaso (aunque no es estrictamente necesario aquí)
            
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al guardar el ticket.';
            showAlert({ title: 'Error al Guardar Ticket', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    /* ---- LÓGICA DE IMPRESIÓN (copia del POS original) ---- */

    const openTicketWithOrder = useCallback((order, printMode = '80') => {
        // Adaptación de los campos de orden a la estructura esperada por TicketModal
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
            isProforma: true, // Lo tratamos como un comprobante de orden/proforma
            pagoDetalles: { efectivo: 0, tarjeta: 0, credito: 0, cambio: 0, ingresoCaja: 0 },
            notes: order.etiqueta || order.nombre_pedido || '',
            at: order.created_at || new Date().toISOString(),
            cajaId: order.id_caja, // Mostramos la caja asignada en el ticket
        };

        setTicketData({ 
            transaction, 
            shouldOpen: true, 
            printMode 
        });
    }, [tasaDolar]);

    const askForPrintOrder = useCallback((order) => {
        const orderName = order.nombre_pedido || order.tipo || 'Ticket';
        const saleId = order.id_pedido;

        const closeModals = () => setTicketData({ transaction: null, shouldOpen: false });
        
        showAlert({
            title: `Imprimir Comprobante #${saleId}`,
            message: `Ticket "${orderName}" guardado. ¿Desea imprimir el comprobante?`,
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

    /* =======================================
     * 3. RENDERIZADO DEL COMPONENTE
     * ======================================= */
    
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
                    <FaClipboardList /> Crear Nuevo Ticket (POS Centralizado)
                </h1>
                <span style={{ 
                    background: activeCajas.length > 0 ? '#28a745' : '#dc3545', 
                    color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' 
                }}>
                    CAJAS ACTIVAS: {activeCajas.length}
                </span>
            </div>

            <div style={styles.panel}>
                
                {/* Columna Izquierda: Productos y Clientes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{...styles.card, flexGrow: 1}}>
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
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaUserTag /> 1. Cliente</h3>
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

                {/* Columna Derecha: Carrito y Acciones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{...styles.card, flexGrow: 1, position: 'relative'}}>
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaShoppingCart /> 2. Carrito</h3>
                        
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                                    El carrito está vacío.
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
                                            {/* Botones de Cantidad */}
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
                                            <button
                                                style={{...styles.button, background: 'none', border: '1px solid #dc3545', color: '#dc3545', padding: '5px', width: '30px', height: '30px'}}
                                                onClick={() => handleUpdateQuantity(item.id_producto, 0)} // Eliminar
                                            >
                                                <FaTrashAlt size={12}/>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div style={styles.card}>
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaClipboardCheck /> 3. Detalles y Total</h3>
                        <input
                            type="text"
                            placeholder="Etiqueta o nota para el pedido (Opcional)"
                            value={temporaryTag}
                            onChange={(e) => setTemporaryTag(e.target.value)}
                            style={styles.input}
                        />

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
                        
                        <button
                            style={{...styles.button, ...styles.primaryButton, width: '100%', marginTop: '10px'}}
                            onClick={handleCreateOrderFlow}
                            disabled={!selectedCustomer || cart.length === 0 || activeCajas.length === 0 || loading}
                        >
                            <FaFileInvoiceDollar /> {loading ? 'Guardando...' : 'Crear Ticket/Pedido'}
                        </button>
                         {!selectedCustomer && (
                            <p style={{ color: '#dc3545', fontSize: '0.9em', textAlign: 'center', marginTop: '5px' }}>
                                * Debe seleccionar un cliente (paso 1).
                            </p>
                        )}
                        {activeCajas.length === 0 && (
                            <p style={{ color: '#dc3545', fontSize: '0.9em', textAlign: 'center', marginTop: '5px' }}>
                                * No hay cajas activas para asignar el ticket.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALES */}

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
                    onConfirm={(value) => {
                        // El onConfirm del modal llama a la lógica de extracción del DOM y luego a handleCreateOrder
                        modal.props.onConfirm(value);
                    }}
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