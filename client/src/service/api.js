// ==========================================================
// ARCHIVO: client/src/service/api.js
// VERSIÓN PARA CONECTARSE A RENDER
// ==========================================================

import axios from 'axios';

// CAMBIO CRÍTICO: La URL del backend ahora es la de Render.
// La leeremos de las variables de entorno de Netlify.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const axiosBase = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// El resto del archivo es idéntico, ya que la lógica es correcta.
const request = async (method, path, token = null, data = null, config = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(config.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const requestConfig = { url: path, method, headers, ...config };
    if (data !== null) requestConfig.data = data;

    const res = await axiosBase.request(requestConfig);
    return res.data;
  } catch (err) {
    if (err.response) {
      const msg = err.response.data?.message || err.response.data?.msg || JSON.stringify(err.response.data);
      const error = new Error(msg || `HTTP ${err.response.status}`);
      error.status = err.response.status;
      throw error;
    }
    throw err;
  }
};

// ==========================================================
// AUTENTICACIÓN Y USUARIO
// ==========================================================
export const login = async (credentials) => request('post', '/auth/login', null, credentials);
export const fetchMe = async (token) => request('get', '/auth/me', token);
export const fetchUsers = async (token) => {
  const data = await request('get', '/users', token);
  return Array.isArray(data) ? data : [];
};
// ... (El resto de tus funciones de API no necesitan cambios)
// --- Manejo de Productos ---
export const fetchProducts = async (token) => {
  const data = await request('get', '/products', token);
  const list = Array.isArray(data) ? data : [];
  return list.map(p => ({
    id: p.id_producto ?? p.id ?? p._id,
    codigo: p.codigo ?? p.code ?? '',
    nombre: p.nombre ?? p.nombre_producto ?? p.name ?? 'Sin nombre',
    precio: Number(p.venta ?? p.precio ?? p.price ?? 0),
    existencia: Number(p.existencia ?? p.stock ?? 0),
    raw: p,
  }));
};

// --- Clientes ---
export const fetchClients = async (token) => {
  const data = await request('get', '/clients', token);
  const list = Array.isArray(data) ? data : [];
  
  const contado = list.find(c => (c.nombre || '').toLowerCase().includes('contado'));
  const others = list.filter(c => contado ? c.id_cliente !== contado.id_cliente : true);
  
  return contado ? [contado, ...others] : list;
};

// --- Funciones para Ventas ---
export const fetchSales = (token) => request('get', '/sales', token);
export const createSale = (saleData, token) => request('post', '/sales', token, saleData);
export const returnItem = (returnData, token) => request('post', '/sales/return-item', token, returnData);
export const createReturn = (returnData, token) => request('post', '/sales/returns', token, returnData);
export const cancelSale = (saleId, token) => request('delete', `/sales/${saleId}`, token);

// --- Pedidos y Apartados ---
export const fetchOrders = (token) => request('GET', '/orders', token);
export const fetchOrderDetails = (orderId, token) => request('GET', `/orders/${orderId}`, token);
export const createOrder = (orderData, token) => request('POST', '/orders', token, orderData);
export const addAbonoToOrder = (orderId, abonoData, token) => request('POST', `/orders/${orderId}/abono`, token, abonoData);
export const liquidateOrder = (orderId, paymentData, token) => request('POST', `/orders/${orderId}/liquidar`, token, paymentData);
export const cancelOrder = (orderId, token) => request('DELETE', `/orders/${orderId}`, token);

// --- Clientes y Créditos ---
export const fetchAllClientsWithCredit = (token) => request('GET', '/clients', token);
export const createClient = (clientData, token) => request('POST', '/clients', token, clientData);
export const updateClient = (clientId, clientData, token) => request('PUT', `/clients/${clientId}`, token, clientData);
export const deleteClient = (clientId, token) => request('DELETE', `/clients/${clientId}`, token);
export const addCreditPayment = (clientId, paymentData, token) => request('POST', `/clients/${clientId}/abono`, token, paymentData);
export const getCreditosByClient = (clientId, token) => request('GET', `/clients/${clientId}/creditos`, token);
export const getAbonosByClient = (clientId, token) => request('GET', `/clients/${clientId}/abonos`, token);

// --- Reportes ---
export const fetchSalesSummaryReport = (token, params) => request('get', '/reports/sales-summary', token, null, { params });
export const fetchInventoryValueReport = (token) => request('get', '/reports/inventory-value', token);
export const fetchSalesByUserReport = (token, params) => request('get', '/reports/sales-by-user', token, null, { params });
export const fetchTopProductsReport = (token, params) => request('get', '/reports/top-products', token, null, { params });
export const fetchSalesChartReport = (token, params) => request('get', '/reports/sales-chart', token, null, { params });