import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../service/api.js';
import { loadCajaSession, saveCajaSession } from '../utils/caja.js';
import { useSocket } from './SocketContext';

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

    const refreshProducts = useCallback(async () => {
        if (!token) return;
        try {
            const data = await api.fetchProducts(token);
            setProducts(data || []);
        } catch (e) {
            console.error("Error actualizando inventario socket:", e);
        }
    }, [token]);

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const onInventoryUpdate = () => {
            console.log("⚡ Socket: inventory_update");
            refreshProducts();
        };
        const onClientsUpdate = () => {
            console.log("⚡ Socket: clients_update");
            refreshClients();
        };
        const onUsersUpdate = async () => {
            console.log("⚡ Socket: users_update");
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const users = await api.fetchUsers(token);
                    setAllUsers(users || []);
                } catch (e) { console.error("Error socket users:", e); }
            }
        };

        socket.on('inventory_update', onInventoryUpdate);
        socket.on('products:update', onInventoryUpdate);
        socket.on('clients:update', onClientsUpdate);
        socket.on('users:update', onUsersUpdate);

        return () => {
            socket.off('inventory_update', onInventoryUpdate);
            socket.off('products:update', onInventoryUpdate);
            socket.off('clients:update', onClientsUpdate);
            socket.off('users:update', onUsersUpdate);
        };
    }, [socket, refreshProducts, refreshClients]);

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
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
        refreshProducts,
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