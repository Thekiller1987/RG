// client/src/context/OrdersContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../service/api';

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null);

    const activeOrder = orders.find(o => o.id === activeOrderId) || { items: [] };

    const loadOrdersFromDB = useCallback(async (userId) => {
        // Lógica para cargar ordenes de localStorage o API
        const saved = localStorage.getItem(`orders_${userId}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setOrders(parsed);
                if (parsed.length > 0) setActiveOrderId(parsed[0].id);
            } catch (e) { }
        } else {
            const initial = [{ id: Date.now(), name: 'Ticket 1', items: [] }];
            setOrders(initial);
            setActiveOrderId(initial[0].id);
        }
    }, []);

    const handleNewOrder = () => {
        const newOrder = { id: Date.now(), name: `Ticket ${orders.length + 1}`, items: [] };
        setOrders([...orders, newOrder]);
        setActiveOrderId(newOrder.id);
    };

    const handleRemoveOrder = (id) => {
        const newOrders = orders.filter(o => o.id !== id);
        if (newOrders.length === 0) {
            const initial = { id: Date.now(), name: 'Ticket 1', items: [] };
            setOrders([initial]);
            setActiveOrderId(initial.id);
        } else {
            setOrders(newOrders);
            if (activeOrderId === id) setActiveOrderId(newOrders[0].id);
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
                // Integrar pedidos del servidor como tickets locales
                const serverTickets = pending.map(p => ({
                    id: `server_${p.id_pedido}`,
                    serverSaleId: p.id_pedido,
                    name: `Pedido #${p.id_pedido}`,
                    items: p.items || [],
                    client: p.cliente
                }));
                setOrders(prev => [...prev.filter(o => !o.id.toString().startsWith('server_')), ...serverTickets]);
            }
        } catch (e) { console.error("Error loading pending orders", e); }
    };

    const value = {
        orders, setOrders, activeOrderId, setActiveOrderId, activeOrder,
        handleNewOrder, handleRemoveOrder, updateActiveOrder, loadOrdersFromDB,
        loadPendingOrdersFromServer
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within OrdersProvider');
    return context;
};
