import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { loadCajaSession, saveCajaSession } from '../utils/caja.js';

import { io } from 'socket.io-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [cajaSession, setCajaSession] = useState(null);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        navigate('/login');
    }, [navigate]);

    const loadMasterData = useCallback(async (token) => {
        // isLoading is false here usually, so we don't block UI if refreshing
        // But initial load handles that via useEffect
        try {
            const [usersData, productsData, clientsData] = await Promise.all([
                api.fetchUsers(token),
                api.fetchProducts(token),
                api.fetchClients(token),
            ]);
            setAllUsers(usersData || []);
            setProducts(productsData || []);
            setClients(clientsData || []);
        } catch (err) {
            console.error("Fallo al cargar datos maestros:", err);
            if (err.status === 401) logout();
        }
    }, [logout]);

    // --- SOCKET.IO LISTENER ---
    const refreshProducts = useCallback(async () => {
        if (!token) return;
        try {
            const data = await api.fetchProducts(token);
            setProducts(data || []);
            // console.log("Inventario actualizado en tiempo real");
        } catch (e) {
            console.error("Error actualizando inventario socket:", e);
        }
    }, [token]);

    useEffect(() => {
        // Usar la URL de producción correcta (sin /api)
        // Dado que api.js usa https://multirepuestosrg.com/api, el host es https://multirepuestosrg.com
        const socketUrl = 'https://multirepuestosrg.com';

        const socketIo = io(socketUrl, {
            path: '/socket.io/', // Path por defecto, asegurar que Nginx lo permita
            transports: ['polling', 'websocket'], // Intentar ambos
        });

        socketIo.on('connect', () => {
            console.log('Cliente Socket conectado a:', socketUrl);
        });

        socketIo.on('connect_error', (err) => {
            console.error('Error conexión Socket:', err.message);
        });

        socketIo.on('inventory_update', () => {
            console.log("Evento recibido: inventory_update");
            refreshProducts();
        });

        return () => {
            socketIo.disconnect();
        };
    }, [refreshProducts]);
    // --------------------------

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true); // Bloqueo solo inicial
            try {
                const tokenInStorage = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                if (tokenInStorage && storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setToken(tokenInStorage);
                        await loadMasterData(tokenInStorage);
                    } catch (error) {
                        logout();
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, [logout, loadMasterData]);

    const login = async (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(token);
        setIsLoading(true);
        await loadMasterData(token);
        setIsLoading(false);
        navigate('/dashboard');
    };

    const refreshClients = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                const clientsData = await api.fetchClients(currentToken);
                setClients(clientsData || []);
            } catch (error) {
                console.error("Error al refrescar clientes:", error);
            }
        }
    }, []);

    // Tu lógica de caja se mantiene
    useEffect(() => {
        if (user) {
            const userId = user.id_usuario || user.id;
            setCajaSession(loadCajaSession(userId));
        } else {
            setCajaSession(null);
        }
    }, [user]);

    const addCajaTransaction = useCallback((transaction) => {
        if (!user) return;
        const userId = user.id_usuario || user.id;
        const session = loadCajaSession(userId);
        if (session && !session.closedAt) {
            session.transactions = [...(session.transactions || []), transaction];
            saveCajaSession(userId, session);
            setCajaSession(session);
        }
    }, [user]);

    const value = {
        user,
        token,
        allUsers,
        products,
        clients,
        isLoading,
        login,
        logout,
        loadMasterData,
        refreshProducts, // Exportar para uso manual si se requiere
        refreshClients,
        cajaSession,
        setCajaSession,
        addCajaTransaction
    };

    if (isLoading && !user) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.5rem' }}>Cargando Aplicación...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider> // <-- CORRECCIÓN AQUÍ

    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};