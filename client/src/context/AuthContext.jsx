import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { loadCajaSession, saveCajaSession } from '../utils/caja.js';
import { checkUserPermission, isMasterAdmin, getPermissionMeta } from '../utils/permissions.js';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, socket }) => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [cajaSession, setCajaSession] = useState(null);

    const [globalReservations, setGlobalReservations] = useState({ totalByProduct: {}, userReservations: {} });
    const [permissionDeniedModal, setPermissionDeniedModal] = useState({
        open: false,
        key: '',
        label: '',
        category: '',
        description: ''
    });

    // Ref for Debouncing
    const refreshTimeoutRef = useRef(null);

    const logout = useCallback((message = null) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        
        if (message && typeof message === 'string') {
            toast.error(message);
        }

        navigate('/login');
    }, [navigate]);

    const isMasterDataLoading = useRef(false);

    const loadMasterData = useCallback(async (tokenToUse, isBackground = false) => {
        if (isMasterDataLoading.current) return;
        isMasterDataLoading.current = true;
        try {
            const currentToken = tokenToUse || localStorage.getItem('token');
            if (!currentToken) return;

            const storedUser = localStorage.getItem('user');
            let parsedUser = storedUser ? JSON.parse(storedUser) : null;

            // Sincronizar siempre el perfil y permisos actualizados del usuario
            try {
                const freshMe = await api.fetchMe(currentToken);
                if (freshMe && (freshMe.id || freshMe.id_usuario)) {
                    parsedUser = { ...(parsedUser || {}), ...freshMe };
                    setUser(parsedUser);
                    localStorage.setItem('user', JSON.stringify(parsedUser));
                }
            } catch (authErr) {
                if (authErr.status === 401) {
                    console.error("🚫 Fallo en fetchMe (Validación de sesión). Redirigiendo al login...");
                    logout();
                    return;
                }
            }

            const userRole = (parsedUser?.rol || '').trim();
            const canReadUsers = userRole === 'Administrador' || checkUserPermission(parsedUser, 'usuarios.acceso');

            const results = await Promise.allSettled([
                canReadUsers ? api.fetchUsers(currentToken) : Promise.resolve(null),
                api.fetchProducts(currentToken),
                api.fetchClients(currentToken),
                api.fetchCategories(currentToken),
                api.fetchProviders(currentToken),
            ]);

            const newUsers = results[0].status === 'fulfilled' ? (results[0].value || []) : null;
            const newProducts = results[1].status === 'fulfilled' ? (results[1].value || []) : null;
            const newClients = results[2].status === 'fulfilled' ? (results[2].value || []) : null;
            const newCategories = results[3].status === 'fulfilled' ? (results[3].value || []) : null;
            const newProviders = results[4].status === 'fulfilled' ? (results[4].value || []) : null;

            if (newUsers) setAllUsers(newUsers);
            if (newProducts) setProducts(newProducts);
            if (newClients) setClients(newClients);
            if (newCategories) setCategories(newCategories);
            if (newProviders) setProviders(newProviders);

        } catch (err) {
            console.error("Error cargando datos maestros:", err);
        } finally {
            isMasterDataLoading.current = false;
        }
    }, [logout]);

    const refreshProducts = useCallback(async () => {
        if (!token) return;
        try {
            const data = await api.fetchProducts(token);
            setProducts(data || []);
        } catch (e) {
            if (e.name !== 'CanceledError') {
                console.error("Error updating inventory:", e.message);
            }
        }
    }, [token]);

    // DEBOUNCED REFRESH: Prevents "Network Error" double-fetch race conditions
    const refreshProductsDebounced = useCallback(() => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
        refreshTimeoutRef.current = setTimeout(() => {
            refreshProducts();
        }, 50); // 50ms: imperceptible pero suficiente para deduplicar eventos simultáneos
    }, [refreshProducts]);

    const refreshClients = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                const clientsData = await api.fetchClients(currentToken);
                setClients(clientsData || []);
            } catch (error) {
                // console.error("Error al refrescar clientes:", error);
            }
        }
    }, []);

    // Helper: calcular stock disponible excluyendo las reservas de otros usuarios
    const getAvailableStock = useCallback((product, excludeUserId = null) => {
        if (!product) return 0;
        const pid = product.id_producto || product.id;
        const rawStock = Number(product.existencia || 0);
        const totalReserved = Number(globalReservations.totalByProduct?.[pid] || 0);
        
        let userReserved = 0;
        if (excludeUserId && globalReservations.userReservations?.[excludeUserId]) {
            userReserved = Number(globalReservations.userReservations[excludeUserId]?.[pid] || 0);
        }
        
        const otherUsersReserved = Math.max(0, totalReserved - userReserved);
        return Math.max(0, rawStock - otherUsersReserved);
    }, [globalReservations]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        const onInventoryUpdate = (data) => {
            // Invalida la imagen en caché para que useLazyImage vuelva a pedirla
            if (data?.id) {
                api.clearCachedImage(data.id);
            }
            refreshProductsDebounced();
        };

        const onReservationsUpdate = (data) => {
            if (data) {
                setGlobalReservations({
                    totalByProduct: data.totalByProduct || {},
                    userReservations: data.userReservations || {}
                });
            }
        };

        const onUserPermissionsUpdated = (payload) => {
            if (!payload) return;
            const stored = localStorage.getItem('user');
            if (!stored) return;
            try {
                const current = JSON.parse(stored);
                const myId = Number(current.id_usuario || current.id);
                if (myId === Number(payload.id_usuario)) {
                    if (payload.activo === false) {
                        logout('Tu cuenta de usuario ha sido suspendida por el Administrador.');
                        return;
                    }
                    const updated = {
                        ...current,
                        rol: payload.rol || current.rol,
                        nombre_usuario: payload.nombre_usuario || current.nombre_usuario,
                        nombre_completo: payload.nombre_completo || current.nombre_completo,
                        permisos: payload.permisos || current.permisos
                    };
                    setUser(updated);
                    localStorage.setItem('user', JSON.stringify(updated));
                    toast.success('Tus permisos de acceso fueron actualizados en tiempo real.');
                }
            } catch (e) {}
        };

        socket.on('inventory_update', onInventoryUpdate);
        socket.on('products:update', onInventoryUpdate);
        socket.on('stock:reservations_update', onReservationsUpdate);
        socket.on('clients:update', refreshClients);
        socket.on('user:permissions_updated', onUserPermissionsUpdated);
        socket.on('users:update', async () => {
            const token = localStorage.getItem('token');
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (token && (currentUser?.rol === 'Administrador' || checkUserPermission(currentUser, 'usuarios.acceso'))) {
                try {
                    const users = await api.fetchUsers(token);
                    setAllUsers(users || []);
                } catch (e) { }
            }
        });

        return () => {
            if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
            socket.off('inventory_update', onInventoryUpdate);
            socket.off('products:update', onInventoryUpdate);
            socket.off('stock:reservations_update', onReservationsUpdate);
            socket.off('clients:update', refreshClients);
            socket.off('user:permissions_updated', onUserPermissionsUpdated);
            socket.off('users:update');
        };
    }, [socket, refreshProductsDebounced, refreshClients, logout]);

    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        const initializeAuth = async () => {
            api.setUnauthorizedHandler(() => {
                logout('Su sesión ha expirado o es inválida. Por favor, ingrese de nuevo.');
            });

            try {
                const tokenInStorage = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                if (tokenInStorage && storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setToken(tokenInStorage);
                        setIsLoading(false);
                        loadMasterData(tokenInStorage, true);
                    } catch (error) {
                        setIsLoading(false);
                    }
                } else {
                    setIsLoading(false);
                }
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const login = async (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(token);
        setIsLoading(false);
        navigate('/dashboard');
        loadMasterData(token, true);
    };

    useEffect(() => {
        if (user) {
            const userId = user.id_usuario || user.id;
            setCajaSession(loadCajaSession(userId));
        } else {
            setCajaSession(null);
        }
    }, [user]);

    const addCajaTransaction = useCallback(async (transaction) => {
        if (!user) return;
        const userId = user.id_usuario || user.id;

        try {
            await api.addCajaTx({ userId, tx: transaction }, token);
        } catch (error) {
            console.error("❌ Error sincronizando transacción de caja:", error);
            throw error;
        }
    }, [user, token]);

    const hasPermission = useCallback((permissionKey) => {
        return checkUserPermission(user, permissionKey);
    }, [user]);

    /**
     * Verifica si el usuario tiene permiso para ejecutar una función/acción.
     * Si NO lo tiene, muestra inmediatamente el anuncio "No tienes permiso para realizar esta acción" y devuelve false.
     */
    const requireActionPermission = useCallback((permissionKey, customActionLabel = null) => {
        const allowed = checkUserPermission(user, permissionKey);
        if (allowed) return true;

        const meta = getPermissionMeta(permissionKey);
        setPermissionDeniedModal({
            open: true,
            key: permissionKey,
            label: customActionLabel || meta.label,
            category: meta.category,
            description: meta.description
        });
        return false;
    }, [user]);

    const value = {
        user,
        token,
        allUsers,
        products,
        clients,
        categories,
        providers,
        isLoading,
        login,
        logout,
        loadMasterData,
        refreshProducts,
        refreshClients,
        cajaSession,
        setCajaSession,
        addCajaTransaction,
        globalReservations,
        getAvailableStock,
        hasPermission,
        requireActionPermission,
        isMasterAdmin: isMasterAdmin(user),
        socket
    };

    if (isLoading && !user) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#f8fafc',
                color: '#64748b'
            }}>
                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #e2e8f0',
                    borderTop: '5px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <h3 style={{ marginTop: '20px', fontWeight: 600 }}>Cargando Sistema...</h3>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
            {permissionDeniedModal.open && (
                <div
                    onClick={() => setPermissionDeniedModal(p => ({ ...p, open: false }))}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.72)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 99999999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#ffffff',
                            borderRadius: 20,
                            maxWidth: 450,
                            width: '100%',
                            overflow: 'hidden',
                            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.4)',
                            border: '2px solid #fca5a5',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
                                color: '#ffffff',
                                padding: '1.35rem 1.5rem'
                            }}
                        >
                            <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>🚫</div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                                No tienes permiso para realizar esta acción
                            </h3>
                        </div>
                        <div style={{ padding: '1.4rem 1.6rem', color: '#334155' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '0.94rem', lineHeight: 1.5 }}>
                                Tu usuario <strong>{user?.nombre_usuario || ''}</strong> ({user?.rol || 'Usuario'}) no tiene habilitada la casilla para:
                            </p>
                            <div
                                style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: 12,
                                    padding: '0.85rem 1rem',
                                    marginBottom: 14,
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>
                                    Módulo: {permissionDeniedModal.category}
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7f1d1d', marginTop: 3 }}>
                                    🔒 {permissionDeniedModal.label}
                                </div>
                                {permissionDeniedModal.description && (
                                    <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: 4 }}>
                                        {permissionDeniedModal.description}
                                    </div>
                                )}
                            </div>
                            <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#64748b' }}>
                                Solicita al Administrador Principal que habilite esta casilla en tu perfil de usuario si necesitas ejecutar esta función.
                            </p>
                            <button
                                type="button"
                                onClick={() => setPermissionDeniedModal(p => ({ ...p, open: false }))}
                                style={{
                                    width: '100%',
                                    padding: '0.78rem',
                                    borderRadius: 11,
                                    border: 'none',
                                    background: '#0f172a',
                                    color: '#ffffff',
                                    fontWeight: 800,
                                    fontSize: '0.92rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};