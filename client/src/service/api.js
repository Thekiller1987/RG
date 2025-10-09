// ==========================================================
// ARCHIVO: client/src/service/api.js
// VERSIÓN FINAL Y COMPLETA (CON FUNCIÓN DE SUBIDA)
// ==========================================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const axiosBase = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Aumentado a 60 segundos para subidas largas
});

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

// --- FUNCIÓN ESPECIAL PARA SUBIR ARCHIVOS ---
export const uploadFile = async (path, formData, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };
  try {
    const res = await axiosBase.post(path, formData, { headers });
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

// --- AUTENTICACIÓN Y USUARIOS ---
export const login = (credentials) => request('post', '/auth/login', null, credentials);
export const fetchMe = (token) => request('get', '/auth/me', token);
export const fetchUsers = (token) => request('get', '/users', token);
export const createUser = (userData, token) => request('post', '/users', token, userData);
export const updateUser = (userId, userData, token) => request('put', `/users/${userId}`, token, userData);
export const deleteUser = (userId, token) => request('delete', `/users/${userId}`, token);

// --- PRODUCTOS, CATEGORÍAS, PROVEEDORES ---
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
export const createProduct = (productData, token) => request('post', '/products', token, productData);
export const updateProduct = (productId, productData, token) => request('put', `/products/${productId}`, token, productData);
export const deleteProduct = (productId, token) => request('delete', `/products/${productId}`, token);
export const adjustStock = (productId, adjustmentData, token) => request('patch', `/products/${productId}/stock`, token, adjustmentData);
export const fetchInventoryHistory = (token) => request('get', '/products/inventory/history', token);

export const fetchCategories = (token) => request('get', '/categories', token);
export const createCategory = (categoryData, token) => request('post', '/categories', token, categoryData);
export const deleteCategory = (categoryId, token) => request('delete', `/categories/${categoryId}`, token);

export const fetchProviders = (token) => request('get', '/providers', token);
export const createProvider = (providerData, token) => request('post', '/providers', token, providerData);
export const deleteProvider = (providerId, token) => request('delete', `/providers/${providerId}`, token);

// --- CLIENTES Y CRÉDITOS ---
export const fetchClients = (token) => request('get', '/clients', token);
export const createClient = (clientData, token) => request('post', '/clients', token, clientData);
export const updateClient = (clientId, clientData, token) => request('put', `/clients/${clientId}`, token, clientData);
export const deleteClient = (clientId, token) => request('delete', `/clients/${clientId}`, token);
export const addCreditPayment = (clientId, paymentData, token) => request('post', `/clients/${clientId}/abono`, token, paymentData);
export const getCreditosByClient = (clientId, token) => request('get', `/clients/${clientId}/creditos`, token);
export const getAbonosByClient = (clientId, token) => request('get', `/clients/${clientId}/abonos`, token);

// --- VENTAS ---
export const fetchSales = (token) => request('get', '/sales', token);
export const createSale = (saleData, token) => request('post', '/sales', token, saleData);
export const returnItem = (returnData, token) => request('post', '/sales/return-item', token, returnData);
export const createReturn = (returnData, token) => request('post', '/sales/returns', token, returnData);
export const cancelSale = (saleId, token) => request('delete', `/sales/${saleId}`, token);

// --- PEDIDOS Y APARTADOS ---
export const fetchOrders = (token) => request('GET', '/orders', token);
export const fetchOrderDetails = (orderId, token) => request('GET', `/orders/${orderId}`, token);
export const createOrder = (orderData, token) => request('POST', '/orders', token, orderData);
export const addAbonoToOrder = (orderId, abonoData, token) => request('POST', `/orders/${orderId}/abono`, token, abonoData);
export const liquidateOrder = (orderId, paymentData, token) => request('POST', `/orders/${orderId}/liquidar`, token, paymentData);
export const cancelOrder = (orderId, token) => request('DELETE', `/orders/${orderId}`, token);

// --- REPORTES ---
export const fetchSalesSummaryReport = (token, params) => request('get', '/reports/sales-summary', token, null, { params });
export const fetchInventoryValueReport = (token) => request('get', '/reports/inventory-value', token);
export const fetchSalesByUserReport = (token, params) => request('get', '/reports/sales-by-user', token, null, { params });
export const fetchTopProductsReport = (token, params) => request('get', '/reports/top-products', token, null, { params });
export const fetchSalesChartReport = (token, params) => request('get', '/reports/sales-chart', token, null, { params });