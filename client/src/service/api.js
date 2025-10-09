import axios from 'axios';

// --- CAMBIO CRÍTICO: Definición de la API URL ---
// 1. Usamos la variable de entorno que Netlify inyectará (REACT_APP_API_BASE_URL).
// 2. Si no existe (estamos en desarrollo), usamos 'http://localhost:3001'.
// 3. El path '/api' se añade AQUÍ para centralizarlo.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
    ? `${process.env.REACT_APP_API_BASE_URL}/api`
    : 'http://localhost:3001/api';

export const API_URL = API_BASE_URL; // Ahora API_URL es la URL completa

const axiosBase = axios.create({
    baseURL: API_URL, // Usa la URL base dinámica
    timeout: 10000,
});

const request = async (method, path, token = null, data = null, config = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(config.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    try {
        const requestConfig = {
            url: path,
            method,
            headers,
            withCredentials: !!config.withCredentials,
            ...config,
        };

        if (data !== null) {
            requestConfig.data = data;
        }

        const res = await axiosBase.request(requestConfig);
        return res.data;
        
    } catch (err) {
        if (err.response) {
            // Mantenemos el manejo de errores de la respuesta HTTP, sin console.logs adicionales
            const msg = err.response.data?.message || err.response.data?.msg || JSON.stringify(err.response.data);
            const error = new Error(msg || `HTTP ${err.response.status}`);
            error.status = err.response.status;
            throw error;
        }
        // Si el error no es una respuesta HTTP (ej: timeout o red), se lanza.
        throw err;
    }
};

// --- Autenticación y Datos Maestros ---
export const login = async (credentials) => {
    return await request('post', '/auth/login', null, credentials);
};
export const fetchMe = async (token) => {
    if (!token) throw new Error('fetchMe requires token');
    return await request('get', '/auth/me', token);
};
export const fetchUsers = async (token) => {
    const data = await request('get', '/users', token);
    return Array.isArray(data) ? data : [];
};

// --- Manejo de Productos ---
export const fetchProducts = async (token) => {
    const data = await request('get', '/products', token);
    const list = Array.isArray(data) ? data : [];
    // Nota: Es mejor que este mapeo se maneje lo más cerca posible de la vista,
    // pero lo dejamos como estaba para no introducir cambios de lógica.
    return list.map(p => ({
        id: p.id_producto ?? p.id ?? p._id,
        codigo: p.codigo ?? p.code ?? '',
        nombre: p.nombre ?? p.nombre_producto ?? p.name ?? 'Sin nombre',
        precio: Number(p.venta ?? p.precio ?? p.price ?? 0),
        existencia: Number(p.existencia ?? p.stock ?? 0),
        raw: p,
    }));
};


// ===================================================================
// =================== SECCIÓN CORREGIDA (Clientes) ==================
// ===================================================================

export const fetchClients = async (token) => {
    const data = await request('get', '/clients', token);
    const list = Array.isArray(data) ? data : [];
    
    const contado = list.find(c => (c.nombre || '').toLowerCase().includes('contado'));
    const others = list.filter(c => contado ? c.id_cliente !== contado.id_cliente : true);
    
    return contado ? [contado, ...others] : list;
};

// ===================================================================
// =================== Funciones de Venta, Pedidos, y Reportes =======
// ===================================================================


// --- Funciones para Ventas ---
export const fetchSales = async (token) => {
    return await request('get', '/sales', token);
};
export const createSale = async (saleData, token) => {
    return await request('post', '/sales', token, saleData);
};
// FUNCIÓN AGREGADA PARA DEVOLUCIÓN PARCIAL
export const returnItem = async (returnData, token) => { 
    return await request('post', '/sales/return-item', token, returnData);
};

export const createReturn = async (returnData, token) => {
    return await request('post', '/sales/returns', token, returnData);
};
export const cancelSale = async (saleId, token) => {
    return await request('delete', `/sales/${saleId}`, token);
};


// --- SECCIÓN DE PEDIDOS Y APARTADOS ---
export const fetchOrders = async (token) => {
    return await request('GET', '/orders', token);
};
export const fetchOrderDetails = async (orderId, token) => {
    return await request('GET', `/orders/${orderId}`, token);
};
export const createOrder = async (orderData, token) => {
    return await request('POST', '/orders', token, orderData);
};
export const addAbonoToOrder = async (orderId, abonoData, token) => {
    return await request('POST', `/orders/${orderId}/abono`, token, abonoData);
};
export const liquidateOrder = async (orderId, paymentData, token) => {
    return await request('POST', `/orders/${orderId}/liquidar`, token, paymentData);
};
export const cancelOrder = async (orderId, token) => {
    return await request('DELETE', `/orders/${orderId}`, token);
};

// --- FUNCIONES PARA CLIENTES Y CRÉDITOS ---
export const fetchAllClientsWithCredit = (token) => request('GET', '/clients', token);
export const createClient = (clientData, token) => request('POST', '/clients', token, clientData);
export const updateClient = (clientId, clientData, token) => request('PUT', `/clients/${clientId}`, token, clientData);
export const deleteClient = (clientId, token) => request('DELETE', `/clients/${clientId}`, token);
export const addCreditPayment = (clientId, paymentData, token) => {
    return request('POST', `/clients/${clientId}/abono`, token, paymentData);
};
export const getCreditosByClient = (clientId, token) => {
    return request('GET', `/clients/${clientId}/creditos`, token);
};
export const getAbonosByClient = (clientId, token) => {
    return request('GET', `/clients/${clientId}/abonos`, token);
};


// --- SECCIÓN DE REPORTES (NUEVO) ---
export const fetchSalesSummaryReport = (token, params) => {
    return request('get', '/reports/sales-summary', token, null, { params });
};
export const fetchInventoryValueReport = (token) => {
    return request('get', '/reports/inventory-value', token);
};
export const fetchSalesByUserReport = (token, params) => {
    return request('get', '/reports/sales-by-user', token, null, { params });
};
export const fetchTopProductsReport = (token, params) => {
    return request('get', '/reports/top-products', token, null, { params });
};
export const fetchSalesChartReport = (token, params) => {
    return request('get', '/reports/sales-chart', token, null, { params });
};