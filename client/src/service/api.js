import axios from 'axios';

// ===================================================================
// === MODIFICACIÓN OBLIGATORIA: CONEXIÓN DIRECTA A DIGITALOCEAN ===
// RAW_BASE DEBE TERMINAR SIN SLASH PARA UNIÓN LIMPIA
const RAW_BASE = 'https://multirepuestosrg.com/api';
// ===================================================================

const API_URL = RAW_BASE; // Simplificado

export { API_URL };

const request = async (method, path, token = null, data = null, config = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(config.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    // =======================================================
    // ESTA ES LA LINEA CLAVE: USA LA URL ABSOLUTA COMPLETA
    const fullUrl = `${RAW_BASE}${path}`; 
    // =======================================================

    try {
        const requestConfig = {
            url: fullUrl, // Usamos la URL absoluta
            method: String(method || 'get').toLowerCase(), // normaliza, soporta 'GET'/'get'
            headers,
            withCredentials: !!config.withCredentials,
            ...config,
        };

        if (data !== null && requestConfig.method !== 'get') {
            requestConfig.data = data;
        }

        // Si hay 'params' en la configuración (usado por fetchSales), Axios los añade como query string.
        if (config.params && requestConfig.method === 'get') {
            requestConfig.params = config.params;
        }

        const res = await axios.request(requestConfig); // Usamos axios directamente
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

export const login = async (credentials) => {
  const { username, nombre_usuario, password } = credentials;
  const body = { nombre_usuario: nombre_usuario ?? username, password };
  return await request('post', '/auth/login', null, body);
};

export const fetchMe = async (token) => {
    if (!token) throw new Error('fetchMe requires token');
    return await request('get', '/auth/me', token);
};
export const fetchUsers = async (token) => {
    return await request('get', '/users', token);
};

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

// ===================================================================
// =================== SECCIÓN DE CLIENTES ===========================
// ===================================================================

export const fetchClients = async (token) => {
    const data = await request('get', '/clients', token);
    const list = Array.isArray(data) ? data : [];
    
    const contado = list.find(c => (c.nombre || '').toLowerCase().includes('contado'));
    const others = list.filter(c => contado ? c.id_cliente !== contado.id_cliente : true);
    
    return contado ? [contado, ...others] : list;
};

// ===================================================================
// ==================== TERMINA SECCIÓN CLIENTES =====================
// ===================================================================

// --- Funciones para Ventas ---
/**
 * Obtiene ventas, opcionalmente filtradas por fecha.
 * @param {string} token 
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'.
 * @returns {Promise<Array>}
 */
export const fetchSales = async (token, date = null) => {
    const config = {};
    if (date) {
        // Axios usará esto para añadir ?date=YYYY-MM-DD a la URL
        config.params = { date }; 
    }
    return await request('get', '/sales', token, null, config);
};
export const createSale = async (saleData, token) => {
    return await request('post', '/sales', token, saleData);
};

// ==================== DEVOLUCIONES (AJUSTADO) ====================
export const returnItem = async (returnData, token) => { 
    // Ahora apunta al endpoint correcto del servidor
    return await request('post', '/sales/returns', token, returnData);
};
export const createReturn = returnItem;
// ================================================================

export const cancelSale = async (saleId, token) => {
    return await request('delete', `/sales/${saleId}`, token);
};

// ===================================================================
// --- SECCIÓN DE PEDIDOS Y APARTADOS (ACTUALIZADO) ---
// ===================================================================

// ✅ CORREGIDO: Ahora acepta parámetros para filtros
export const fetchOrders = async (token, params = {}) => {
    return await request('GET', '/orders', token, null, { params });
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

// ===================================================================
// --- SECCIÓN DE USUARIOS Y REPORTES (CORREGIDO) ---
// ===================================================================

// ✅ CORREGIDO: Usando la función request en lugar de fetch
export const fetchUsuarios = async (token) => {
    return await request('GET', '/usuarios', token);
};

// ✅ CORREGIDO: Usando la función request en lugar de fetch
export const fetchReportePedidos = async (token, params = {}) => {
    return await request('GET', '/reporte-pedidos', token, null, { params });
};

// ===================================================================
// --- SECCIÓN DE REPORTES (NUEVO) ---
// ===================================================================

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

// ===================================================================
// --- SECCIÓN DE CARGA MASIVA ---
// ===================================================================
export const bulkUploadInventory = async (items, token) => {
    return await request('post', '/upload/inventory', token, { items });
};

// ===================================================================
// =================== SECCIÓN DE CAJA (ACTUALIZADO) =================
// ===================================================================

// Nota: getCajaSession acepta token opcional. Si no se pasa, lo toma de localStorage
export const getCajaSession = async (userId, token) => {
    const t = token || localStorage.getItem('token');
    return await request('get', '/caja/session', t, null, {
        params: { userId }
    });
};

export const openCajaSession = async (sessionData, token) => {
    return await request('post', '/caja/session/open', token, sessionData);
};

export const addCajaTx = async (txData, token) => {
    return await request('post', '/caja/session/tx', token, txData);
};

export const closeCajaSession = async (closeData, token) => {
    return await request('post', '/caja/session/close', token, closeData);
};

/**
 * NUEVO: Obtiene el reporte de cierres de caja para una fecha específica.
 * Asume el endpoint usado en CashReport.jsx.
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'.
 * @param {string} token - Token de autenticación.
 */
export const fetchClosedCajaReport = async (date, token) => {
    return await request('get', '/caja/reporte', token, null, { params: { date } });
};

/**
 * NUEVO: Obtiene todas las sesiones de caja actualmente abiertas.
 * Asume el endpoint usado en CashReport.jsx.
 * @param {string} token - Token de autenticación.
 */
export const fetchActiveCajaSessions = async (token) => {
    return await request('get', '/caja/abiertas/activas', token);
};

/**
 * NUEVO: Permite obtener el reporte individual (PDF/HTML) por ID.
 * @param {string} sessionId - ID de la sesión (puede ser 'caja-X-TIMESTAMP').
 * @param {string} token - Token de autenticación.
 */
export const fetchCajaReportById = async (sessionId, token) => {
    // Si tu backend retorna un PDF o HTML, este endpoint solo necesita ser llamado.
    // La forma en que lo usamos en el frontend es navegar a la URL directamente.
    return await request('get', `/caja/reporte/${sessionId}`, token);
};