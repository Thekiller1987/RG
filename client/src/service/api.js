// ==========================================================
// ARCHIVO: client/src/service/api.js
// VERSIÓN FINAL PARA NETLIFY
// ==========================================================

console.log("--- Cargando la versión final y correcta de api.js ---");

import axios from 'axios';

// Base URL que coincide con redirect de Netlify
const API_BASE_URL = '/api';

const axiosBase = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// --- Autenticación ---
export const login = async (credentials) => request('post', '/auth/login', null, credentials);
export const fetchMe = async (token) => request('get', '/auth/me', token);

// --- Usuarios ---
export const fetchUsers = async (token) => {
  const data = await request('get', '/users', token);
  return Array.isArray(data) ? data : [];
};

// --- Productos ---
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
  return Array.isArray(data) ? data : [];
};

// --- Ventas ---
export const fetchSales = (token) => request('get', '/sales', token);
export const createSale = (saleData, token) => request('post', '/sales', token, saleData);

// --- Pedidos ---
export const fetchOrders = (token) => request('GET', '/orders', token);
export const createOrder = (orderData, token) => request('POST', '/orders', token, orderData);

// --- Reportes ---
export const fetchSalesSummaryReport = (token, params) => request('get', '/reports/sales-summary', token, null, { params });
