// client/src/pages/PedidosYApartados.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../service/api.js';

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
  const [paymentData, setPaymentData] = useState({ efectivo: 0, tarjeta: 0, transferencia: 0 });

  // Verificar si usuario puede cobrar
  const canCollectPayment = ['Administrador', 'Contador', 'Encargado de Finanzas'].includes(currentUser?.rol);

  // Estilos simples
  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' },
    header: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      marginBottom: '20px',
      borderBottom: '2px solid #ddd',
      paddingBottom: '10px',
      background: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tabs: { 
      display: 'flex', 
      marginBottom: '20px',
      borderBottom: '1px solid #ccc',
      background: 'white',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tab: { 
      padding: '10px 20px', 
      cursor: 'pointer',
      border: '1px solid #ccc',
      borderBottom: 'none',
      borderRadius: '5px 5px 0 0',
      marginRight: '5px',
      background: '#f5f5f5',
      transition: 'all 0.3s ease'
    },
    activeTab: { 
      background: '#007bff', 
      color: 'white',
      borderColor: '#007bff'
    },
    panel: { 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '20px' 
    },
    card: { 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      padding: '15px', 
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    productItem: {
      border: '1px solid #eee',
      padding: '10px',
      marginBottom: '8px',
      borderRadius: '5px',
      cursor: 'pointer',
      background: '#f9f9f9',
      transition: 'background 0.2s ease'
    },
    productItemHover: { background: '#e3f2fd' },
    cartItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      borderBottom: '1px solid #eee',
      background: '#fafafa',
      marginBottom: '5px',
      borderRadius: '4px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '2px',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.2s ease'
    },
    primaryButton: { background: '#007bff', color: 'white' },
    successButton: { background: '#28a745', color: 'white' },
    dangerButton: { background: '#dc3545', color: 'white' },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    badge: {
      background: '#28a745',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '10px'
    },
    infoAlert: {
      background: '#d1ecf1',
      border: '1px solid #bee5eb',
      color: '#0c5460',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px'
    }
  };

  // Filtrar productos
  const filteredProducts = allProducts.filter(product =>
    product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo?.toString().includes(searchTerm)
  );

  // Cargar órdenes
  const loadOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await api.fetchOrders(token);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Manejar carrito
  const handleAddToCart = (product) => {
    if (product.existencia <= 0) {
      alert('Producto agotado');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id_producto === product.id_producto);
      if (existing) {
        if (existing.cantidad >= product.existencia) {
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
        precio_unitario: product.precio_venta || product.precio
      }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id_producto !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    const product = allProducts.find(p => p.id_producto === productId);
    if (newQuantity > product.existencia) {
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
  };

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
  const total = subtotal;

  // Crear orden
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
          subtotal: item.precio_unitario * item.cantidad
        })),
        usuario_id: currentUser.id_usuario,
        vendedor: currentUser.nombre_usuario
      };

      await api.createOrder(orderData, token);
      
      alert(`${tipo === 'pedido' ? 'Pedido' : 'Apartado'} creado exitosamente`);
      
      setCart([]);
      setSelectedCustomer(null);
      loadOrders();
      
    } catch (error) {
      alert('Error al crear la orden: ' + error.message);
    }
  };

  // Procesar pago
  const handleProcessPayment = async () => {
    if (!paymentModal.order) return;

    try {
      const totalPagado = Number(paymentData.efectivo) + Number(paymentData.tarjeta) + Number(paymentData.transferencia);
      
      const saleData = {
        totalVenta: paymentModal.order.total,
        subtotal: paymentModal.order.subtotal,
        descuento: 0,
        items: paymentModal.order.items.map(item => ({
          id: item.producto_id,
          quantity: item.cantidad,
          precio: item.precio_unitario
        })),
        pagoDetalles: {
          efectivo: Number(paymentData.efectivo),
          cambio: Math.max(0, Number(paymentData.efectivo) - paymentModal.order.total),
          tarjeta: Number(paymentData.tarjeta) || 0,
          transferencia: Number(paymentData.transferencia) || 0,
          tipoVenta: 'contado',
          clienteId: paymentModal.order.cliente_id
        },
        userId: currentUser.id_usuario,
        clientId: paymentModal.order.cliente_id,
        origen: 'pedido',
        pedido_id: paymentModal.order.id_pedido
      };

      await api.createSale(saleData, token);
      await api.updateOrderStatus(paymentModal.order.id_pedido, 'completado', token);

      alert('✅ Pago procesado exitosamente. Venta registrada en el sistema.');
      setPaymentModal({ open: false, order: null });
      setPaymentData({ efectivo: 0, tarjeta: 0, transferencia: 0 });
      loadOrders();

    } catch (error) {
      alert('Error al procesar pago: ' + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0, color: '#333' }}>🛒 Pedidos y Apartados</h1>
        {canCollectPayment && (
          <span style={styles.badge}>
            MODO COBRO
          </span>
        )}
      </div>

      {!canCollectPayment && (
        <div style={styles.infoAlert}>
          <strong>Modo Vendedor:</strong> Solo puedes crear pedidos. Los administradores procesarán los pagos.
        </div>
      )}

      <div style={styles.tabs}>
        <div 
          style={{...styles.tab, ...(activeTab === 0 ? styles.activeTab : {})}}
          onClick={() => setActiveTab(0)}
        >
          Nuevo Pedido/Apartado
        </div>
        <div 
          style={{...styles.tab, ...(activeTab === 1 ? styles.activeTab : {})}}
          onClick={() => setActiveTab(1)}
        >
          Órdenes Existentes
        </div>
      </div>

      {activeTab === 0 && (
        <div style={styles.panel}>
          {/* Columna Izquierda */}
          <div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#333' }}>🔍 Buscar Productos</h3>
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.input}
              />
              
              <div style={{ maxHeight: '400px', overflow: 'auto', marginTop: '10px' }}>
                {filteredProducts.map(product => (
                  <div
                    key={product.id_producto}
                    style={styles.productItem}
                    onClick={() => handleAddToCart(product)}
                    onMouseEnter={(e) => e.target.style.background = '#e3f2fd'}
                    onMouseLeave={(e) => e.target.style.background = '#f9f9f9'}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{product.nombre}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Código: {product.codigo} | Stock: {product.existencia} | 
                      Precio: C${(product.precio_venta || product.precio)?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#333' }}>👥 Seleccionar Cliente</h3>
              <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                {clients.map(client => (
                  <div
                    key={client.id_cliente}
                    style={{
                      ...styles.productItem,
                      background: selectedCustomer?.id_cliente === client.id_cliente ? '#e3f2fd' : '#f9f9f9',
                      border: selectedCustomer?.id_cliente === client.id_cliente ? '2px solid #007bff' : '1px solid #eee'
                    }}
                    onClick={() => setSelectedCustomer(client)}
                  >
                    <div style={{ fontWeight: 'bold' }}>{client.nombre}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {client.telefono} | {client.direccion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#333' }}>🛒 Carrito de Compra</h3>
              
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  El carrito está vacío
                </div>
              ) : (
                <div>
                  {cart.map(item => (
                    <div key={item.id_producto} style={styles.cartItem}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.nombre}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          C${item.precio_unitario?.toFixed(2)} x {item.cantidad} = C${(item.precio_unitario * item.cantidad).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button 
                          style={{...styles.button, ...styles.dangerButton}}
                          onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad - 1)}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.cantidad}</span>
                        <button 
                          style={{...styles.button, ...styles.successButton}}
                          onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad + 1)}
                        >
                          +
                        </button>
                        <button 
                          style={{...styles.button, ...styles.dangerButton}}
                          onClick={() => handleRemoveFromCart(item.id_producto)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.card}>
              <h3 style={{ marginTop: 0, color: '#333' }}>📊 Resumen</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Subtotal:</span>
                  <span>C${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <strong style={{ fontSize: '18px' }}>Total:</strong>
                  <strong style={{ color: '#007bff', fontSize: '18px' }}>C${total.toFixed(2)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{...styles.button, ...styles.primaryButton, flex: 1}}
                  onClick={() => handleCreateOrder('pedido')}
                  disabled={!selectedCustomer || cart.length === 0}
                >
                  Crear Pedido
                </button>
                <button
                  style={{...styles.button, flex: 1, border: '1px solid #6c757d', background: 'transparent', color: '#6c757d'}}
                  onClick={() => handleCreateOrder('apartado')}
                  disabled={!selectedCustomer || cart.length === 0}
                >
                  Crear Apartado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div style={styles.card}>
          <h3 style={{ marginTop: 0, color: '#333' }}>📋 Órdenes Existentes</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Cargando órdenes...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No hay órdenes registradas
            </div>
          ) : (
            <div>
              {orders.map(order => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '16px' }}>Orden #{order.id_pedido}</strong>
                        <span style={{
                          background: order.tipo === 'pedido' ? '#007bff' : '#6c757d',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {order.tipo}
                        </span>
                        <span style={{
                          background: 
                            order.estado === 'completado' ? '#28a745' :
                            order.estado === 'pendiente' ? '#ffc107' : '#6c757d',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {order.estado}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                        <strong>Cliente:</strong> {order.cliente_nombre} | 
                        <strong> Vendedor:</strong> {order.vendedor || 'N/A'} |
                        <strong> Total:</strong> C${order.total?.toFixed(2)} | 
                        <strong> Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        style={{...styles.button, ...styles.primaryButton}}
                        onClick={() => setSelectedOrder(order)}
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      {canCollectPayment && order.estado === 'pendiente' && (
                        <button 
                          style={{...styles.button, ...styles.successButton}}
                          onClick={() => setPaymentModal({ open: true, order })}
                          title="Procesar pago"
                        >
                          💳
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
              <p><strong>Tipo:</strong> {selectedOrder.tipo}</p>
              <p><strong>Estado:</strong> 
                <span style={{
                  color: selectedOrder.estado === 'completado' ? '#28a745' : 
                         selectedOrder.estado === 'pendiente' ? '#ffc107' : '#6c757d',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {selectedOrder.estado}
                </span>
              </p>
              <p><strong>Vendedor:</strong> {selectedOrder.vendedor || 'N/A'}</p>
              <p><strong>Total:</strong> C${selectedOrder.total?.toFixed(2)}</p>
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
                    {item.cantidad} x C${item.precio_unitario?.toFixed(2)} = 
                    <strong> C${item.subtotal?.toFixed(2)}</strong>
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

      {/* Modal de Pago */}
      {paymentModal.open && paymentModal.order && (
        <div style={styles.modalOverlay} onClick={() => setPaymentModal({ open: false, order: null })}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
              💳 Procesar Pago - Pedido #{paymentModal.order.id_pedido}
            </h2>
            
            <div style={{ marginBottom: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                Total a Pagar: <strong style={{ color: '#007bff', fontSize: '24px' }}>C${paymentModal.order.total?.toFixed(2)}</strong>
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Efectivo:</label>
                <input
                  type="number"
                  value={paymentData.efectivo}
                  onChange={(e) => setPaymentData({...paymentData, efectivo: e.target.value})}
                  style={styles.input}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tarjeta:</label>
                  <input
                    type="number"
                    value={paymentData.tarjeta}
                    onChange={(e) => setPaymentData({...paymentData, tarjeta: e.target.value})}
                    style={styles.input}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Transferencia:</label>
                  <input
                    type="number"
                    value={paymentData.transferencia}
                    onChange={(e) => setPaymentData({...paymentData, transferencia: e.target.value})}
                    style={styles.input}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div style={styles.card}>
                <p style={{ margin: '5px 0' }}><strong>Total Pagado:</strong> C${(Number(paymentData.efectivo) + Number(paymentData.tarjeta) + Number(paymentData.transferencia)).toFixed(2)}</p>
                <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>
                  <strong>Cambio:</strong> C${Math.max(0, Number(paymentData.efectivo) - paymentModal.order.total).toFixed(2)}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                style={{...styles.button, flex: 1, background: '#6c757d', color: 'white'}}
                onClick={() => {
                  setPaymentModal({ open: false, order: null });
                  setPaymentData({ efectivo: 0, tarjeta: 0, transferencia: 0 });
                }}
              >
                Cancelar
              </button>
              <button
                style={{...styles.button, ...styles.successButton, flex: 1}}
                disabled={(Number(paymentData.efectivo) + Number(paymentData.tarjeta) + Number(paymentData.transferencia)) < paymentModal.order.total}
                onClick={handleProcessPayment}
              >
                ✅ Procesar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosYApartados;