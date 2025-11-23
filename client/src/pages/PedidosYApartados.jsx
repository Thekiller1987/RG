import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';
import { 
    FaShoppingCart, FaClipboardList, FaSearch, FaUserTag, FaTrashAlt, FaPlus, FaMinus, 
    FaFileInvoiceDollar, FaCheckCircle, FaArrowLeft, FaClipboardCheck, FaSignature
} from 'react-icons/fa';
import { Button, TotalsRow, SearchInput, PanelCard, CartItemWrapper } from './POS.styles.jsx'; 
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

const localStyles = { 
    container: { padding: '10px', fontFamily: 'Roboto, sans-serif', background: '#e9ecef', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '10px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    
    panelGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'minmax(300px, 1fr) 1fr', 
        gap: '15px', 
        '@media (max-width: 768px)': { 
            gridTemplateColumns: '1fr' 
        }
    },

    productContainer: { maxHeight: '60vh', overflowY: 'auto', marginTop: '10px', paddingRight: '5px' },
    clientContainer: { maxHeight: '20vh', overflowY: 'auto', paddingRight: '5px' },
    productItem: { 
        padding: '10px', marginBottom: '6px', borderRadius: '5px', cursor: 'pointer', background: '#f9f9f9', 
        borderLeft: '4px solid #007bff00', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    totalBar: { background: '#007bff', color: 'white', padding: '15px', borderRadius: '8px', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '15px', boxSizing: 'border-box' }
};


/* =======================================
 * 2. COMPONENTE PRINCIPAL PedidosYApartados
 * ======================================= */
const PedidosYApartados = () => {
    const navigate = useNavigate(); 
    
    const { currentUser, clients, products: allProducts, token } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [temporaryTag, setTemporaryTag] = useState(''); 
    
    const [modal, setModal] = useState({ name: null, props: {} });
    const [ticketData, setTicketData] = useState({ transaction: null, shouldOpen: false, printMode: '80' });
    
    const [activeCajas, setActiveCajas] = useState([]); 
    
    const tasaDolar = 1; 
    
    const closeGenericModal = () => setModal({ name: null, props: {} });
    const showAlert = useCallback((props) => setModal({ name: 'alert', props }), []);


    /* ---------------------- FETCHING Y CÁLCULOS ---------------------- */

    const loadActiveCajas = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(ENDPOINT_ABIERTAS_ACTIVAS, { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            const cajas = (response.data?.abiertas || [])
                .filter(c => !c.closedAt) 
                .map(c => ({
                    id: String(c.id_caja || c.id), 
                    label: `Caja #${c.id_caja || c.id} - ${resolveName(c.openedBy)}`
                }));
            
            setActiveCajas(cajas);
        } catch (error) {
            console.error('Error cargando cajas activas:', error);
            setActiveCajas([]);
        }
    }, [token]);

    useEffect(() => {
        if (currentUser) {
            loadActiveCajas(); 
        }
        const intervalId = setInterval(loadActiveCajas, 15000); 
        return () => clearInterval(intervalId);
    }, [loadActiveCajas, currentUser]);

    useEffect(() => {
        if (clients.length > 0 && !selectedCustomer) {
            const contado = clients.find(c => (c.nombre || '').toLowerCase().includes('final') || (c.nombre || '').toLowerCase().includes('contado'));
            if (contado) {
                setSelectedCustomer(contado);
            }
        }
    }, [clients, selectedCustomer]);

    const filteredProducts = useMemo(() => allProducts.filter(product =>
        product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo?.toString().includes(searchTerm)
    ), [allProducts, searchTerm]);

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0), [cart]);
    const total = subtotal; 
    
    /* ---------------------- LÓGICA DE CARRITO (CLAVE: CÓDIGO) ---------------------- */

    // FUNCIÓN DE CLAVE ÚNICA: Usa 'codigo' o 'codigo_barras' como identificador
    const getProductKey = (product) => {
        return String(product.codigo || product.codigo_barras || product.id_producto || `temp-id-${Date.now()}`);
    };

    // FUNCIÓN CORREGIDA: Añadir producto usando la CLAVE ÚNICA (CÓDIGO)
    const handleAddToCart = useCallback((product) => {
        const stock = product.existencia ?? 0;
        if (stock <= 0) {
            showAlert({ title: 'Producto Agotado', message: 'No hay stock disponible para este producto.' });
            return;
        }
        
        const productKey = getProductKey(product);
        const price = product.precio_venta ?? product.precio ?? 0;

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.productKey === productKey);
            
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
            return [...prev, {
                ...product,
                productKey: productKey, 
                cantidad: 1,
                precio_unitario: price,
                id_producto: product.id_producto, 
                nombre: product.nombre,
                precio: price 
            }];
        });
    }, [showAlert]);

    // FUNCIÓN CORREGIDA: Actualiza cantidad usando la CLAVE INTERNA (productKey).
    const handleUpdateQuantity = useCallback((productKey, newQuantity) => {
        const numQuantity = parseInt(newQuantity, 10) || 0;

        const cartItem = cart.find(item => item.productKey === productKey);
        if (!cartItem) return;
        
        const productData = allProducts.find(p => String(p.id_producto) === String(cartItem.id_producto));
        if (!productData) return; 

        if (numQuantity < 1) {
            setCart(prev => prev.filter(item => item.productKey !== productKey));
            return;
        }
        
        if (numQuantity > (productData?.existencia ?? 0)) {
            showAlert({ title: "Stock Insuficiente", message: `Máximo ${productData.existencia} unidades disponibles.` });
            return;
        }

        setCart(prev =>
            prev.map(item =>
                item.productKey === productKey
                    ? { ...item, cantidad: numQuantity, subtotal: item.precio_unitario * numQuantity }
                    : item
            )
        );
    }, [allProducts, showAlert, cart]);

    /* ---------------------- FLUJO DE CREACIÓN DE TICKET ---------------------- */

    const handleCreateOrderFlow = () => {
        if (!selectedCustomer) {
            showAlert({ title: 'Cliente Requerido', message: 'Selecciona un cliente para crear el pedido.' });
            return;
        }
        if (cart.length === 0) {
            showAlert({ title: 'Carrito Vacío', message: 'Agrega productos al carrito primero.' });
            return;
        }
        
        const activeCajaIds = activeCajas.map(c => c.id);

        if (activeCajaIds.length === 0) {
             showAlert({ title: 'Caja Inactiva', message: 'No hay cajas activas disponibles. Debe haber al menos una caja abierta en el sistema para asignar el ticket.' });
             return;
        }
        
        // Abrir Modal para Nombre Personalizado
        setModal({
            name: 'prompt_name',
            props: {
                title: 'Asignar Ticket y Nombre',
                message: (
                    <>
                        <p style={{marginBottom: '10px', fontWeight: 600}}>
                            <span style={{ color: '#007bff' }}>El ticket se asignará automáticamente a las {activeCajaIds.length} cajas activas.</span>
                        </p>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: '10px 0', fontSize: '0.85em', maxHeight: '100px', overflowY: 'auto', border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
                            {activeCajas.map(c => <li key={c.id} style={{ padding: '3px 0', color: '#333' }}>
                                <FaClipboardCheck style={{ color: '#28a745', marginRight: '5px' }} /> {c.label}
                            </li>)}
                        </ul>
                        <label htmlFor="ticketName" style={{ display: 'block', margin: '15px 0 5px', fontWeight: 'bold' }}>
                            <FaSignature style={{ marginRight: '5px' }} /> Nombre del Ticket/Referencia:
                        </label>
                        <SearchInput 
                            type="text" 
                            id="ticketName" 
                            placeholder={`Ej: ${selectedCustomer.nombre} - ${new Date().toLocaleTimeString()}`} 
                            defaultValue={`Ticket ${selectedCustomer.nombre || ''}`}
                        />
                    </>
                ),
                closeLabel: 'Cancelar',
                confirmLabel: 'Guardar Ticket',
                onConfirm: () => {
                    const nameInput = document.getElementById('ticketName');
                    const newName = nameInput?.value?.trim() || `Pedido para ${selectedCustomer.nombre}`; 
                    handleCreateOrder('pedido', newName, activeCajaIds);
                },
                inputType: 'custom', 
            }
        });
    };

    const handleCreateOrder = async (tipo, pedidoName, idCajaList) => {
        setLoading(true);

        const primaryCajaId = idCajaList[0]; 

        try {
            const orderData = {
                cliente_id: selectedCustomer.id_cliente,
                tipo: tipo, 
                estado: 'pendiente',
                total: total,
                subtotal: subtotal,
                
                abonado: 0, 
                etiqueta: temporaryTag || pedidoName, 
                nombre_pedido: pedidoName, 
                id_caja: primaryCajaId, 
                cajas_asignadas: idCajaList, 
                
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
            
            showAlert({ title: "Ticket Guardado", message: `Ticket #${createdOrder.id_pedido} guardado con éxito. Asignado a ${idCajaList.length} cajas.` });
            
            const orderWithDetails = { 
                ...orderData, 
                id_pedido: createdOrder.id_pedido, 
                created_at: new Date().toISOString(), 
                tipo,
                id_caja: primaryCajaId
            };
            askForPrintOrder(orderWithDetails); 

            setCart([]);
            setTemporaryTag(''); 
            
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido al guardar el ticket.';
            showAlert({ title: 'Error al Guardar Ticket', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    /* ---- LÓGICA DE IMPRESIÓN (se mantiene) ---- */

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
            isProforma: true, 
            pagoDetalles: { efectivo: 0, tarjeta: 0, credito: 0, cambio: 0, ingresoCaja: 0 },
            notes: order.etiqueta || order.nombre_pedido || '',
            at: order.created_at || new Date().toISOString(),
            cajaId: order.id_caja, 
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
                    primary: true 
                },
                { 
                    label: "A4 (Completo)", 
                    action: () => {
                        openTicketWithOrder(order, 'A4');
                        closeGenericModal();
                    } 
                },
                { label: "No / Cerrar", action: closeModals, $cancel: true }
            ]
        });

    }, [openTicketWithOrder, showAlert]);

    /* =======================================
     * 3. RENDERIZADO DEL COMPONENTE
     * ======================================= */
    
    return (
        <div style={localStyles.container}>
            
            <div style={localStyles.header}>
                <Button 
                    primary style={{ padding: '10px 15px', marginRight: '10px' }} 
                    onClick={() => navigate('/dashboard')}
                >
                    <FaArrowLeft /> Dashboard
                </Button>
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

            <div style={localStyles.panelGrid} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Columna Izquierda: Productos y Clientes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Buscador y Lista de Productos */}
                    <PanelCard style={{flexGrow: 1}}>
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaSearch /> Buscar Productos</h3>
                        <SearchInput
                            type="text"
                            placeholder="Buscar por nombre o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        <div style={localStyles.productContainer}>
                            {filteredProducts.map(product => (
                                <div
                                    key={getProductKey(product)} 
                                    style={localStyles.productItem}
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
                    </PanelCard>

                    {/* Selector de Cliente */}
                    <PanelCard>
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaUserTag /> 1. Cliente</h3>
                        <div style={localStyles.clientContainer}>
                            {clients.map(client => (
                                <div
                                    key={client.id_cliente}
                                    style={{
                                        ...localStyles.productItem,
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
                    </PanelCard>
                </div>

                {/* Columna Derecha: Carrito y Acciones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <PanelCard style={{flexGrow: 1, position: 'relative'}}>
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaShoppingCart /> 2. Carrito</h3>
                        
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                                    El carrito está vacío.
                                </div>
                            ) : (
                                cart.map(item => (
                                    <CartItemWrapper key={item.productKey}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{item.nombre}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {fmt(item.precio_unitario)} x {item.cantidad} = <strong style={{ color: '#333' }}>{fmt(item.precio_unitario * item.cantidad)}</strong>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {/* Botones de Cantidad */}
                                            <Button 
                                                $cancel
                                                style={{ padding: '5px 10px', width: '30px', height: '30px', backgroundColor: '#dc3545' }}
                                                onClick={() => handleUpdateQuantity(item.productKey, item.cantidad - 1)}
                                            >
                                                <FaMinus />
                                            </Button>
                                            <span style={{ minWidth: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{item.cantidad}</span>
                                            <Button 
                                                primary
                                                style={{ padding: '5px 10px', width: '30px', height: '30px', backgroundColor: '#28a745' }}
                                                onClick={() => handleUpdateQuantity(item.productKey, item.cantidad + 1)}
                                            >
                                                <FaPlus />
                                            </Button>
                                            <Button
                                                $cancel
                                                style={{ padding: '5px', width: '30px', height: '30px', backgroundColor: '#6c757d' }}
                                                onClick={() => handleUpdateQuantity(item.productKey, 0)} // Eliminar
                                            >
                                                <FaTrashAlt size={12}/>
                                            </Button>
                                        </div>
                                    </CartItemWrapper>
                                ))
                            )}
                        </div>
                    </PanelCard>
                    
                    {/* Detalles, Nota y Totales */}
                    <PanelCard>
                        <h3 style={{ marginTop: 0, color: '#333' }}><FaClipboardCheck /> 3. Detalles y Total</h3>
                        <SearchInput
                            type="text"
                            placeholder="Etiqueta o nota para el pedido (Opcional)"
                            value={temporaryTag}
                            onChange={(e) => setTemporaryTag(e.target.value)}
                        />

                        <div style={localStyles.totalBar}>
                            <TotalsRow><span>Subtotal:</span><span>{fmt(subtotal)}</span></TotalsRow>
                            <TotalsRow style={{ borderTop: '2px solid #fff', paddingTop: '8px' }}>
                                <span>TOTAL:</span>
                                <span>{fmt(total)}</span>
                            </TotalsRow>
                        </div>
                        
                        <Button
                            primary
                            style={{ width: '100%', marginTop: '10px' }}
                            onClick={handleCreateOrderFlow}
                            disabled={!selectedCustomer || cart.length === 0 || activeCajas.length === 0 || loading}
                        >
                            <FaFileInvoiceDollar /> {loading ? 'Guardando...' : 'Crear Ticket/Pedido'}
                        </Button>
                         {/* Mensajes de error/bloqueo */}
                         {(!selectedCustomer || cart.length === 0 || activeCajas.length === 0) && (
                            <p style={{ color: '#dc3545', fontSize: '0.9em', textAlign: 'center', marginTop: '5px' }}>
                                * {activeCajas.length === 0 ? 'No hay cajas activas para asignar.' : 'Faltan productos o cliente (Pasos 1 y 2).'}
                            </p>
                        )}
                    </PanelCard>
                </div>
            </div>

            {/* MODALES */}

            {/* Modal de Alerta/Confirmación */}
            {modal.name === 'alert' && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={closeGenericModal}
                    {...modal.props}
                />
            )}
            
            {/* Modal de Prompt (Nombrar Pedido) */}
            {modal.name === 'prompt_name' && (
                <PromptModal
                    isOpen={true}
                    onClose={closeGenericModal}
                    onConfirm={() => {
                        // El padre lee el DOM y cierra el modal
                        modal.props.onConfirm();
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