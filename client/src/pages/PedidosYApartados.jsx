import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Chip,
  Modal,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  Search,
  Person,
  Receipt,
  Visibility,
  Payment,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import * as api from '../../service/api.js';

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

  // Verificar si usuario puede cobrar
const canCollectPayment = ['Administrador', 'Contador', 'Encargado de Finanzas'].includes(currentUser?.rol);
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
        vendedor: currentUser.nombre_usuario // Guardar quién creó el pedido
      };

      await api.createOrder(orderData, token);
      
      alert(`${tipo === 'pedido' ? 'Pedido' : 'Apartado'} creado exitosamente`);
      
      // Limpiar carrito
      setCart([]);
      setSelectedCustomer(null);
      
      // Recargar órdenes
      loadOrders();
      
    } catch (error) {
      alert('Error al crear la orden: ' + error.message);
    }
  };

  // Procesar pago de orden existente
  const handleProcessPayment = async (paymentData) => {
    if (!paymentModal.order) return;

    try {
      // Crear la venta en el sistema
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
          efectivo: paymentData.efectivo,
          cambio: paymentData.cambio,
          tarjeta: paymentData.tarjeta || 0,
          transferencia: paymentData.transferencia || 0,
          tipoVenta: 'contado',
          clienteId: paymentModal.order.cliente_id
        },
        userId: currentUser.id_usuario,
        clientId: paymentModal.order.cliente_id,
        // Marcar que viene de un pedido
        origen: 'pedido',
        pedido_id: paymentModal.order.id_pedido
      };

      // Llamar a la API de ventas (la misma que usa el POS)
      const response = await api.createSale(saleData, token);

      // Actualizar estado del pedido a "pagado"
      await api.updateOrderStatus(paymentModal.order.id_pedido, 'completado', token);

      alert('✅ Pago procesado exitosamente. Venta registrada en el sistema.');
      
      // Cerrar modal y recargar
      setPaymentModal({ open: false, order: null });
      loadOrders();

    } catch (error) {
      alert('Error al procesar pago: ' + error.message);
    }
  };

  // Modal de Pago
  const PaymentModalComponent = () => {
    const [efectivo, setEfectivo] = useState(0);
    const [tarjeta, setTarjeta] = useState(0);
    const [transferencia, setTransferencia] = useState(0);

    if (!paymentModal.order) return null;

    const total = paymentModal.order.total;
    const totalPagado = Number(efectivo) + Number(tarjeta) + Number(transferencia);
    const cambio = totalPagado - total > 0 ? totalPagado - total : 0;

    return (
      <Dialog open={paymentModal.open} onClose={() => setPaymentModal({ open: false, order: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          💳 Procesar Pago - Pedido #{paymentModal.order.id_pedido}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Total a Pagar: <strong>C${total.toFixed(2)}</strong>
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Efectivo"
                type="number"
                value={efectivo}
                onChange={(e) => setEfectivo(e.target.value)}
                InputProps={{ startAdornment: <AttachMoney /> }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tarjeta"
                type="number"
                value={tarjeta}
                onChange={(e) => setTarjeta(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Transferencia"
                type="number"
                value={transferencia}
                onChange={(e) => setTransferencia(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography><strong>Total Pagado:</strong> C${totalPagado.toFixed(2)}</Typography>
                <Typography color={cambio > 0 ? 'green' : 'text.primary'}>
                  <strong>Cambio:</strong> C${cambio.toFixed(2)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModal({ open: false, order: null })}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="success"
            disabled={totalPagado < total}
            onClick={() => handleProcessPayment({
              efectivo: Number(efectivo),
              tarjeta: Number(tarjeta),
              transferencia: Number(transferencia),
              cambio: cambio
            })}
          >
            ✅ Procesar Pago
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🛒 Pedidos y Apartados
        {canCollectPayment && (
          <Chip 
            label="MODO COBRO" 
            color="success" 
            variant="outlined" 
            sx={{ ml: 2 }} 
          />
        )}
      </Typography>

      {!canCollectPayment && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Modo Vendedor: Solo puedes crear pedidos. Los administradores procesarán los pagos.
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Nuevo Pedido/Apartado" />
          <Tab label="Órdenes Existentes" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
          {/* Columna Izquierda - Búsqueda y Cliente */}
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Búsqueda de Productos */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🔍 Buscar Productos
              </Typography>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              
              <List sx={{ maxHeight: 400, overflow: 'auto', mt: 2 }}>
                {filteredProducts.map(product => (
                  <ListItem
                    key={product.id_producto}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle1">
                        {product.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Código: {product.codigo} | Stock: {product.existencia} | 
                        Precio: C${product.precio_venta || product.precio}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Selección de Cliente */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                👥 Seleccionar Cliente
              </Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {clients.map(client => (
                  <ListItem
                    key={client.id_cliente}
                    sx={{
                      bgcolor: selectedCustomer?.id_cliente === client.id_cliente ? 'primary.light' : 'transparent',
                      cursor: 'pointer',
                      borderRadius: 1,
                      mb: 1
                    }}
                    onClick={() => setSelectedCustomer(client)}
                  >
                    <Person sx={{ mr: 2 }} />
                    <Box>
                      <Typography>{client.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.telefono} | {client.direccion}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Columna Derecha - Carrito y Resumen */}
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Carrito */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🛒 Carrito de Compra
              </Typography>
              
              {cart.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  El carrito está vacío
                </Typography>
              ) : (
                <List>
                  {cart.map(item => (
                    <ListItem
                      key={item.id_producto}
                      sx={{ borderBottom: '1px solid', borderColor: 'grey.200' }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">
                          {item.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          C${item.precio_unitario} x {item.cantidad} = 
                          C${(item.precio_unitario * item.cantidad).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{item.cantidad}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad + 1)}
                        >
                          <Add />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFromCart(item.id_producto)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            {/* Resumen y Acciones */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📊 Resumen
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Subtotal:</Typography>
                  <Typography>C${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    C${total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleCreateOrder('pedido')}
                  disabled={!selectedCustomer || cart.length === 0}
                >
                  Crear Pedido
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => handleCreateOrder('apartado')}
                  disabled={!selectedCustomer || cart.length === 0}
                >
                  Crear Apartado
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📋 Órdenes Existentes
          </Typography>
          
          {loading ? (
            <Typography textAlign="center">Cargando...</Typography>
          ) : orders.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={3}>
              No hay órdenes registradas
            </Typography>
          ) : (
            <List>
              {orders.map(order => (
                <ListItem
                  key={order.id_pedido}
                  sx={{
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="subtitle1">
                        Orden #{order.id_pedido}
                      </Typography>
                      <Chip
                        label={order.tipo}
                        color={order.tipo === 'pedido' ? 'primary' : 'secondary'}
                        size="small"
                      />
                      <Chip
                        label={order.estado}
                        color={
                          order.estado === 'completado' ? 'success' :
                          order.estado === 'pendiente' ? 'warning' : 'default'
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2">
                      Cliente: {order.cliente_nombre} | 
                      Vendedor: {order.vendedor || 'N/A'} |
                      Total: C${order.total} | 
                      Fecha: {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton onClick={() => setSelectedOrder(order)}>
                      <Visibility />
                    </IconButton>
                    {canCollectPayment && order.estado === 'pendiente' && (
                      <IconButton 
                        color="success"
                        onClick={() => setPaymentModal({ open: true, order })}
                      >
                        <Payment />
                      </IconButton>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Modal de Detalles de Orden */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          {selectedOrder && (
            <>
              <Typography variant="h6" gutterBottom>
                Detalles de Orden #{selectedOrder.id_pedido}
              </Typography>
              
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography><strong>Cliente:</strong> {selectedOrder.cliente_nombre}</Typography>
                  <Typography><strong>Tipo:</strong> {selectedOrder.tipo}</Typography>
                  <Typography><strong>Estado:</strong> {selectedOrder.estado}</Typography>
                  <Typography><strong>Vendedor:</strong> {selectedOrder.vendedor || 'N/A'}</Typography>
                  <Typography><strong>Total:</strong> C${selectedOrder.total}</Typography>
                  <Typography><strong>Fecha:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom>Productos:</Typography>
              <List>
                {selectedOrder.items?.map((item, index) => (
                  <ListItem key={index}>
                    <Typography>
                      {item.nombre} - {item.cantidad} x C${item.precio_unitario} = C${item.subtotal}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                onClick={() => setSelectedOrder(null)}
                sx={{ mt: 2 }}
              >
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal de Pago */}
      <PaymentModalComponent />
    </Box>
  );
};

export default PedidosYApartados;
