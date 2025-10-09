// ==========================================================
// ARCHIVO: client/src/service/api.js
// VERSIÓN LISTA PARA PRODUCCIÓN
// ==========================================================

import axios from 'axios';

// Línea de verificación
console.log("--- Cargando la versión final y correcta de api.js ---");

// URL base para Netlify: coincide con la redirección en netlify.toml
const API_BASE_URL = '/api';

const axiosBase = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Función genérica para solicitudes HTTP
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

// ==========================================================
// PRODUCTOS Y CATEGORÍAS
// ==========================================================
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

export const fetchCategories = async (token) => request('get', '/categories', token);

// ==========================================================
// CLIENTES Y CRÉDITOS
// ==========================================================
export const fetchClients = async (token) => {
  const data = await request('get', '/clients', token);
  const list = Array.isArray(data) ? data : [];

  const contado = list.find(c => (c.nombre || '').toLowerCase().includes('contado'));
  const others = list.filter(c => contado ? c.id_cliente !== contado.id_cliente : true);
  return contado ? [contado, ...others] : list;
};

export const createClient = (clientData, token) => request('POST', '/clients', token, clientData);
export const updateClient = (clientId, clientData, token) => request('PUT', `/clients/${clientId}`, token, clientData);
export const deleteClient = (clientId, token) => request('DELETE', `/clients/${clientId}`, token);
export const addCreditPayment = (clientId, paymentData, token) => request('POST', `/clients/${clientId}/abono`, token, paymentData);
export const getCreditosByClient = (clientId, token) => request('GET', `/clients/${clientId}/creditos`, token);
export const getAbonosByClient = (clientId, token) => request('GET', `/clients/${clientId}/abonos`, token);

// ==========================================================
// PEDIDOS Y APARTADOS
// ==========================================================
export const fetchOrders = (token) => request('GET', '/orders', token);
export const fetchOrderDetails = (orderId, token) => request('GET', `/orders/${orderId}`, token);
export const createOrder = (orderData, token) => request('POST', '/orders', token, orderData);
export const addAbonoToOrder = (orderId, abonoData, token) => request('POST', `/orders/${orderId}/abono`, token, abonoData);
export const liquidateOrder = (orderId, paymentData, token) => request('POST', `/orders/${orderId}/liquidar`, token, paymentData);
export const cancelOrder = (orderId, token) => request('DELETE', `/orders/${orderId}`, token);

// ==========================================================
// VENTAS
// ==========================================================
export const fetchSales = (token) => request('get', '/sales', token);
export const createSale = (saleData, token) => request('post', '/sales', token, saleData);
export const returnItem = (returnData, token) => request('post', '/sales/return-item', token, returnData);
export const createReturn = (returnData, token) => request('post', '/sales/returns', token, returnData);
export const cancelSale = (saleId, token) => request('DELETE', `/sales/${saleId}`, token);

// ==========================================================
// PROVEEDORES
// ==========================================================
export const fetchProviders = (token) => request('get', '/providers', token);

// ==========================================================
// REPORTES
// ==========================================================
export const fetchSalesSummaryReport = (token, params) => request('get', '/reports/sales-summary', token, null, { params });
export const fetchInventoryValueReport = (token) => request('get', '/reports/inventory-value', token);
export const fetchSalesByUserReport = (token, params) => request('get', '/reports/sales-by-user', token, null, { params });
export const fetchTopProductsReport = (token, params) => request('get', '/reports/top-products', token, null, { params });
export const fetchSalesChartReport = (token, params) => request('get', '/reports/sales-chart', token, null, { params });
