// client/src/context/OrdersContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../service/api';

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
    // Intentar obtener usuario desde AuthContext si es posible, o props
    // Nota: Como estamos dentro de AuthProvider, deberíamos poder usar useAuth.
    // Pero si hay dependencia circular, evaluar. (Auth usa API, Orders usa API).
    // Asumiremos que es seguro.
    const [orders, setOrders] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const activeOrder = orders.find(o => o.id === activeOrderId) || { items: [] };

    const loadOrdersFromDB = useCallback(async (userId) => {
        if (!userId) return;
        setCurrentUserId(userId);
        const saved = localStorage.getItem(`orders_${userId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setOrders(parsed);
                    // Si no hay activo o el activo no existe, setear el primero
                    setActiveOrderId(parsed[0].id);
                    return;
                }
            } catch (e) { console.error("Error loading orders", e); }
        }
        // Fallback or init
        const initial = [{ id: Date.now(), name: 'Ticket 1', items: [] }];
        setOrders(initial);
        setActiveOrderId(initial[0].id);
    }, []);

    // Persistencia Automática
    useEffect(() => {
        if (currentUserId && orders.length > 0) {
            localStorage.setItem(`orders_${currentUserId}`, JSON.stringify(orders));
        }
    }, [orders, currentUserId]);

    const handleNewOrder = () => {
        const newOrder = { id: Date.now(), name: `Ticket ${orders.length + 1}`, items: [] };
        setOrders(prev => {
            const next = [...prev, newOrder];
            return next;
        });
        setActiveOrderId(newOrder.id);
    };

    const handleRemoveOrder = (id) => {
        setOrders(prev => {
            const newOrders = prev.filter(o => o.id !== id);
            if (newOrders.length === 0) {
                const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
                return [initial]; // Debe devolver estado
            }
            return newOrders;
        });
        // Logic for activeID update needs to be outside or careful
        // React batching might make this tricky if we depend on 'newOrders' immediately.
        // Better:
    };

    // Wrapper para remove que maneje el ID
    const removeOrderWrapper = (id) => {
        let nextOrders = [];
        let nextActiveId = activeOrderId;

        setOrders(prev => {
            const remaining = prev.filter(o => o.id !== id);
            if (remaining.length === 0) {
                const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
                nextOrders = [initial];
                nextActiveId = initial.id;
            } else {
                nextOrders = remaining;
                if (activeOrderId === id) {
                    nextActiveId = remaining[0].id;
                }
            }
            return nextOrders;
        });
        // Update active ID after render? Or immediately?
        // setState is async. We can't guarantee 'nextActiveId' is perfectly synced if we don't set it in the same tick if possible.
        // But here we split logic. 
        // Actually, if we use the function form for setOrders, we can't side-effect setActiveOrderId easily inside.
        // We should calculate logic first.
        // But 'orders' state is a dependency.

        // Simplified: Use current 'orders' state since 'handleRemoveOrder' is closure.
        const newOrders = orders.filter(o => o.id !== id);
        if (newOrders.length === 0) {
            const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
            setOrders([initial]);
            setActiveOrderId(initial.id);
        } else {
            setOrders(newOrders);
            if (activeOrderId === id) {
                setActiveOrderId(newOrders[0].id);
            }
        }
    };

    const updateActiveOrder = (key, value) => {
        setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, [key]: value } : o));
    };

    const loadPendingOrdersFromServer = async () => {
        try {
            const token = localStorage.getItem('token');
            const pending = await api.fetchPendingOrders(token);
            if (pending && pending.length > 0) {
                const serverTickets = pending.map(p => ({
                    id: `server_${p.id_pedido}`,
                    serverSaleId: p.id_pedido,
                    name: `Pedido #${p.id_pedido}`,
                    items: p.items || [],
                    client: p.cliente
                }));
                setOrders(prev => {
                    // Evitar duplicados
                    const existingIds = new Set(prev.map(o => o.id));
                    const toAdd = serverTickets.filter(t => !existingIds.has(t.id));
                    return [...prev, ...toAdd];
                });
            }
        } catch (e) { console.error("Error loading pending orders", e); }
    };

    const value = {
        orders, setOrders, activeOrderId, setActiveOrderId, activeOrder,
        handleNewOrder, handleRemoveOrder: removeOrderWrapper, updateActiveOrder, loadOrdersFromDB,
        loadPendingOrdersFromServer
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within OrdersProvider');
    return context;
};
