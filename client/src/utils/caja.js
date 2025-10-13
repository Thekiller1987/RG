// client/src/utils/caja.js
/**
 * Persistencia y sincronización de sesión de caja por USUARIO y por DÍA.
 * - Clave por día: "caja_session_${userId}_${YYYY-MM-DD}"
 * - Índice estable: "caja_session_index_${userId}" -> apunta a la clave del día vigente
 * - Sync entre pestañas con "storage"
 */

// ───────────────────────────────────────────────────────────────
// Utilidades de fecha y claves
// ───────────────────────────────────────────────────────────────
/** Formatea fecha a YYYY-MM-DD (UTC) */
const toDay = (date) => date.toISOString().substring(0, 10);
/** Clave por día para una sesión de caja de un usuario */
const dayKey = (userId, date) => `caja_session_${userId}_${toDay(date)}`;
/** Índice estable que apunta a la clave vigente del día (o la última usada) */
const indexKey = (userId) => `caja_session_index_${userId}`;
/** Prefijo para detectar eventos de otras fechas en storage */
const keyPrefix = (userId) => `caja_session_${userId}_`;

// ───────────────────────────────────────────────────────────────
// CARGAR / GUARDAR / LIMPIAR
// ───────────────────────────────────────────────────────────────
/**
 * Carga la sesión vigente:
 * 1) Usa índice estable si existe; 2) intenta por día actual; 3) busca huérfanas (últimos 7 días, sin closedAt)
 */
export const loadCajaSession = (userId) => {
  if (!userId) return null;
  try {
    const idx = localStorage.getItem(indexKey(userId));
    if (idx) {
      const raw = localStorage.getItem(idx);
      if (raw) return JSON.parse(raw);
    }
    const todayRaw = localStorage.getItem(dayKey(userId, new Date()));
    if (todayRaw) return JSON.parse(todayRaw);
    return findStaleSession(userId);
  } catch (e) {
    console.error('Error al cargar la sesión de caja:', e);
    return null;
  }
};

/**
 * Guarda la sesión y actualiza índice estable. Respeta el día de openedAt si viene, o usa hoy.
 */
export const saveCajaSession = (userId, sessionObj) => {
  if (!userId || !sessionObj) return;
  try {
    const openedDate = sessionObj.openedAt ? new Date(sessionObj.openedAt) : new Date();
    const dKey = dayKey(userId, openedDate);
    localStorage.setItem(dKey, JSON.stringify(sessionObj));
    localStorage.setItem(indexKey(userId), dKey);
  } catch (e) {
    console.error('Error al guardar la sesión de caja:', e);
  }
};

/** Limpia la sesión del DÍA ACTUAL y el índice estable */
export const clearCajaSession = (userId) => {
  if (!userId) return;
  try {
    const todayK = dayKey(userId, new Date());
    localStorage.removeItem(todayK);
    localStorage.removeItem(indexKey(userId));
  } catch (e) {
    console.error('Error al limpiar la sesión de caja:', e);
  }
};

/**
 * Busca sesiones abiertas (sin closedAt) en los últimos 7 días.
 * Retorna la MÁS RECIENTE encontrada (si existe) y actualiza el índice para “recuperarla”.
 */
export const findStaleSession = (userId) => {
  if (!userId) return null;
  try {
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const past = new Date(today);
      past.setDate(today.getDate() - i);
      const k = dayKey(userId, past);
      const raw = localStorage.getItem(k);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && !session.closedAt) {
          localStorage.setItem(indexKey(userId), k);
          return session;
        }
      }
    }
    return null;
  } catch (e) {
    console.error('Error buscando sesiones antiguas:', e);
    return null;
  }
};

// ───────────────────────────────────────────────────────────────
// SYNC ENTRE PESTAÑAS
// ───────────────────────────────────────────────────────────────
/**
 * Escucha cambios en el índice estable y en cualquier clave de caja del usuario.
 * Llama a callback con la sesión vigente.
 */
export const subscribeCajaChanges = (userId, callback) => {
  if (!userId) return () => {};
  const handler = (e) => {
    if (!e.key) return;
    const idxK = indexKey(userId);
    const prefix = keyPrefix(userId);
    if (e.key === idxK || e.key.startsWith(prefix)) {
      const s = loadCajaSession(userId);
      callback?.(s);
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

// ───────────────────────────────────────────────────────────────
// FETCH OPCIONAL DESDE SERVIDOR (para cross-device real)
// ───────────────────────────────────────────────────────────────
export async function fetchCajaSessionFromServer(userId, api) {
  if (!api?.getCajaSession || !userId) return null;
  try {
    const s = await api.getCajaSession(userId);
    if (s) {
      saveCajaSession(userId, s);
      return s;
    }
    return null;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// TASA DÓLAR POR USUARIO (helpers)
// ───────────────────────────────────────────────────────────────
const tasaKey = (userId) => `tasa_dolar_${userId}`;

export const saveTasaDolar = (userId, value) => {
  if (!userId) return;
  try {
    localStorage.setItem(tasaKey(userId), String(value));
    // Ping suave al índice para que otras pestañas refresquen
    const idx = localStorage.getItem(indexKey(userId));
    if (idx) localStorage.setItem(indexKey(userId), idx);
  } catch (e) {
    console.error('Error al guardar tasa dólar:', e);
  }
};

export const loadTasaDolar = (userId, fallback = 36.60) => {
  if (!userId) return Number(fallback);
  const raw = localStorage.getItem(tasaKey(userId));
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number(fallback);
};

// ───────────────────────────────────────────────────────────────
// Helpers opcionales para UI (no autocierra a medianoche)
// ───────────────────────────────────────────────────────────────
export const isSessionOpen = (session) => Boolean(session && !session.closedAt);
export const getSessionOpenedDay = (session) =>
  session?.openedAt ? new Date(session.openedAt).toISOString().substring(0, 10) : null;
export const shouldWarnCrossDay = (session) => {
  if (!isSessionOpen(session)) return false;
  const openedDay = getSessionOpenedDay(session);
  const today = new Date().toISOString().substring(0, 10);
  return openedDay && openedDay !== today;
};
export const pingCajaIndex = (userId) => {
  if (!userId) return;
  const idxKey = indexKey(userId);
  const idx = localStorage.getItem(idxKey);
  if (idx) localStorage.setItem(idxKey, idx); // dispara 'storage'
};
