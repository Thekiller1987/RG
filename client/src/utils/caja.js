// client/src/utils/caja.js

/**
 * Genera la clave única para la sesión de caja de un usuario en una fecha específica.
 * @param {string|number} userId - El ID del usuario.
 * @param {Date} date - El objeto Date para el cual generar la clave.
 * @returns {string|null} La clave para localStorage o null si no hay userId.
 */
const getSessionKeyForDate = (userId, date) => {
    if (!userId) return null;
    // Formato: YYYY-MM-DD para consistencia.
    const day = date.toISOString().substring(0, 10);
    return `caja_session_${userId}_${day}`;
};

/**
 * Carga la sesión de caja desde localStorage para un usuario en el día actual.
 * @param {string|number} userId - El ID del usuario.
 * @returns {object|null} El objeto de la sesión parseado o null si no se encuentra.
 */
export const loadCajaSession = (userId) => {
    if (!userId) return null;
    try {
        const key = getSessionKeyForDate(userId, new Date());
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.error('Error al cargar la sesión de caja desde localStorage:', e);
        // En caso de JSON corrupto, es mejor limpiar para evitar errores futuros.
        const key = getSessionKeyForDate(userId, new Date());
        localStorage.removeItem(key);
        return null;
    }
};

/**
 * Guarda el objeto completo de la sesión de caja en localStorage para el día actual.
 * @param {string|number} userId - El ID del usuario.
 * @param {object} sessionObj - El objeto de sesión completo a guardar.
 */
export const saveCajaSession = (userId, sessionObj) => {
    if (!userId || !sessionObj) return;
    try {
        const key = getSessionKeyForDate(userId, new Date());
        localStorage.setItem(key, JSON.stringify(sessionObj));
    } catch (e) {
        console.error('Error al guardar la sesión de caja en localStorage:', e);
    }
};

/**
 * Limpia (elimina) la sesión de caja del día actual del localStorage.
 * Útil cuando se cierra sesión o se necesita un reinicio forzado.
 * @param {string|number} userId - El ID del usuario.
 */
export const clearCajaSession = (userId) => {
    if (!userId) return;
    try {
        const key = getSessionKeyForDate(userId, new Date());
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Error al limpiar la sesión de caja de localStorage:', e);
    }
};

/**
 * Busca sesiones de días anteriores que no fueron cerradas.
 * Itera sobre los últimos 7 días para encontrar sesiones abiertas.
 * @param {string|number} userId - El ID del usuario.
 * @returns {object|null} La sesión más reciente sin cerrar encontrada, o null.
 */
export const findStaleSession = (userId) => {
    if (!userId) return null;
    try {
        const today = new Date();
        for (let i = 1; i <= 7; i++) { // Revisa la última semana
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - i);
            const key = getSessionKeyForDate(userId, pastDate);
            const raw = localStorage.getItem(key);
            if (raw) {
                const session = JSON.parse(raw);
                // Si la sesión existe y no tiene fecha de cierre, es una sesión "huérfana".
                if (session && !session.closedAt) {
                    return session; 
                }
            }
        }
        return null; // No se encontraron sesiones huérfanas
    } catch (e) {
        console.error("Error buscando sesiones de caja antiguas:", e);
        return null;
    }
}