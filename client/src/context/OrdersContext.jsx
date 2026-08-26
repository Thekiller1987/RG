// client/src/context/OrdersContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import * as api from '../service/api';

const OrdersContext = createContext(null);

// Helper para sanitizar y desduplicar lista de tickets
const deduplicateOrdersList = (ordersList) => {
    if (!Array.isArray(ordersList)) return [{ id: String(Date.now()), name: 'Ticket 1', items: [] }];
    const seenIds = new Set();
    const seenNames = new Set();
    const result = [];

    for (const o of ordersList) {
        if (!o) continue;
        const idStr = String(o.id || Date.now() + Math.floor(Math.random() * 10000));
        const nameStr = String(o.name || '').trim().toLowerCase();
        const hasItems = Array.isArray(o.items) && o.items.length > 0;

        if (!seenIds.has(idStr)) {
            // Si no tiene items y ya existe otro ticket vacío con el mismo nombre, evitar duplicarlo
            if (!hasItems && nameStr && seenNames.has(nameStr)) {
                continue;
            }
            seenIds.add(idStr);
            if (nameStr) seenNames.add(nameStr);
            result.push({
                ...o,
                id: idStr,
                name: o.name || `Ticket ${result.length + 1}`,
                items: Array.isArray(o.items) ? o.items : []
            });
        }
    }

    if (result.length === 0) {
        return [{ id: String(Date.now()), name: 'Ticket 1', items: [] }];
    }
    return result;
};

export const OrdersProvider = ({ children, socket, user }) => {
    const [orders, setOrders] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(() => user?.id_usuario || user?.id || null);
    const recentlyDeletedIds = useRef(new Set());

    const activeOrder = orders.find(o => String(o.id) === String(activeOrderId)) || orders[0] || { id: 'default', name: 'Ticket 1', items: [] };

    useEffect(() => {
        if (user) {
            const uid = user.id_usuario || user.id;
            setCurrentUserId(uid);
        }
    }, [user]);

    const loadOrdersFromDB = useCallback(async (userId) => {
        if (!userId) return;
        setCurrentUserId(userId);

        try {
            const token = localStorage.getItem('token');
            const serverCarts = await api.getCart(userId, token);

            if (serverCarts && Array.isArray(serverCarts) && serverCarts.length > 0) {
                const cleanCarts = deduplicateOrdersList(serverCarts);
                setOrders(cleanCarts);
                setActiveOrderId(prev => {
                    const prevStr = String(prev);
                    const found = cleanCarts.find(c => String(c.id) === prevStr);
                    return found ? found.id : cleanCarts[0].id;
                });
                return;
            }
        } catch (e) {
            console.error("Error loading carts from DB, falling back to local:", e);
        }

        const initial = [{ id: String(Date.now()), name: 'Ticket 1', items: [] }];
        setOrders(initial);
        setActiveOrderId(initial[0].id);
    }, []);

    // Sincronización en Tiempo Real por Socket + Persistencia HTTP Debounced
    useEffect(() => {
        if (currentUserId && orders.length > 0) {
            // Emisión de Socket rápida para sincronización inmediata de reservas (200ms)
            const socketTimer = setTimeout(() => {
                if (socket && socket.connected) {
                    socket.emit('cart:update', { userId: currentUserId, carts: orders });
                }
            }, 200);

            // Persistencia HTTP en BD
            const dbTimer = setTimeout(() => {
                const token = localStorage.getItem('token');
                if (token) {
                    api.saveCart(currentUserId, orders, token).catch(e => console.error("Error saving cart:", e));
                }
            }, 1000);

            return () => {
                clearTimeout(socketTimer);
                clearTimeout(dbTimer);
            };
        }
    }, [orders, currentUserId, socket]);

    const handleNewOrder = () => {
        const newId = String(Date.now() + Math.floor(Math.random() * 1000));
        setOrders(prev => {
            const cleanPrev = deduplicateOrdersList(prev);
            const newOrder = { id: newId, name: `Ticket ${cleanPrev.length + 1}`, items: [] };
            return [...cleanPrev, newOrder];
        });
        setActiveOrderId(newId);
    };

    const handleRemoveOrder = (id) => {
        removeOrderWrapper(id);
    };

    // Wrapper para remove que maneje el ID y libere reservas al instante
    const removeOrderWrapper = (id) => {
        const idStr = String(id);
        if (recentlyDeletedIds.current) {
            recentlyDeletedIds.current.add(idStr);
            setTimeout(() => {
                if (recentlyDeletedIds.current) recentlyDeletedIds.current.delete(idStr);
            }, 15000);
        }

        setOrders(prev => {
            const remaining = prev.filter(o => String(o.id) !== idStr);
            let finalOrders = remaining;
            let nextActiveId = activeOrderId;

            if (remaining.length === 0) {
                const newId = String(Date.now());
                finalOrders = [{ id: newId, name: 'Ticket 1', items: [] }];
                nextActiveId = newId;
            } else if (String(activeOrderId) === idStr) {
                nextActiveId = remaining[0].id;
            }

            setActiveOrderId(nextActiveId);

            // Sincronizar inmediatamente para limpiar DB y socket
            if (socket && socket.connected && currentUserId) {
                socket.emit('cart:update', { userId: currentUserId, carts: finalOrders });
            }
            const token = localStorage.getItem('token');
            if (currentUserId && token) {
                api.saveCart(currentUserId, finalOrders, token).catch(() => {});
            }

            return finalOrders;
        });
    };

    const updateActiveOrder = (key, value) => {
        setOrders(prev => prev.map(o => String(o.id) === String(activeOrderId) ? { ...o, [key]: value } : o));
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
                    const existingIds = new Set(prev.map(o => String(o.id)));
                    const toAdd = serverTickets.filter(t => !existingIds.has(String(t.id)));
                    return deduplicateOrdersList([...prev, ...toAdd]);
                });
            }
        } catch (e) { console.error("Error loading pending orders", e); }
    };

    // SAFE SYNC: Only append NEW tickets from other users (e.g., Proforma)
    // Does NOT overwrite local changes to existing tickets and prevents duplicates.
    const checkForNewOrders = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const token = localStorage.getItem('token');
            const serverCarts = await api.getCart(userId, token);

            if (serverCarts && Array.isArray(serverCarts)) {
                setOrders(prev => {
                    const existingIdSet = new Set(prev.map(o => String(o.id)));
                    const existingNameSet = new Set(prev.map(o => String(o.name || '').trim().toLowerCase()));

                    const newTickets = [];
                    for (const t of serverCarts) {
                        if (!t) continue;
                        const tidStr = String(t.id);
                        const tName = String(t.name || '').trim().toLowerCase();
                        const hasItems = Array.isArray(t.items) && t.items.length > 0;

                        if (existingIdSet.has(tidStr)) continue;
                        if (recentlyDeletedIds.current.has(tidStr)) continue;
                        if (!hasItems && existingNameSet.has(tName)) continue;

                        existingIdSet.add(tidStr);
                        if (tName) existingNameSet.add(tName);
                        newTickets.push({ ...t, id: tidStr });
                    }

                    if (newTickets.length > 0) {
                        return deduplicateOrdersList([...prev, ...newTickets]);
                    }
                    return prev;
                });
            }
        } catch (e) {
            // silent fail for polling
        }
    }, []);

    const value = {
        orders, setOrders, activeOrderId, setActiveOrderId, activeOrder,
        handleNewOrder, handleRemoveOrder: removeOrderWrapper, updateActiveOrder, loadOrdersFromDB,
        loadPendingOrdersFromServer, checkForNewOrders
    };

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
    const context = useContext(OrdersContext);
    if (!context) throw new Error('useOrders must be used within OrdersProvider');
    return context;
};
