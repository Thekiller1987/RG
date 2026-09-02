import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { loadCajaSession, saveCajaSession } from '../utils/caja.js';
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
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const userRole = (parsedUser?.rol || '').trim();

            // Si no es en background, valida el token (solo al hacer login)
            if (!isBackground) {
                try {
                    await api.fetchMe(currentToken);
                } catch (authErr) {
                    if (authErr.status === 401) {
                        console.error("🚫 Fallo en fetchMe (Validación inicial). Redirigiendo al login...");
                        logout();
                        return;
                    }
                }
            }

            const results = await Promise.allSettled([
                userRole === 'Administrador' ? api.fetchUsers(currentToken) : Promise.resolve(null),
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

        socket.on('inventory_update', onInventoryUpdate);
        socket.on('products:update', onInventoryUpdate);
        socket.on('stock:reservations_update', onReservationsUpdate);
        socket.on('clients:update', refreshClients);
        socket.on('users:update', async () => {
            const token = localStorage.getItem('token');
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (token && currentUser?.rol === 'Administrador') {
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
            socket.off('users:update');
        };
    }, [socket, refreshProductsDebounced, refreshClients]);

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