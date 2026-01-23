// client/src/context/CajaContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCajaSession } from '../service/api';
// REMOVED: All local storage utils imports to ensure strict server compliance
/* import {
    loadCajaSession, saveCajaSession, clearCajaSession,
    subscribeCajaChanges, loadTasaDolar, saveTasaDolar, isSessionOpen
} from '../utils/caja'; */

const CajaContext = createContext(null);

export const CajaProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id_usuario || user?.id;

    const [isCajaOpen, setIsCajaOpen] = useState(false);
    const [cajaSession, setCajaSession] = useState(null);
    const [tasaDolar, setTasaDolar] = useState(36.60);

    // CRITICAL: Function to force re-fetch from server (Single Source of Truth)
    const refreshSession = useCallback(async () => {
        if (!userId) return;
        try {
            console.log("🔄 Syncing Caja Session from Server...");
            const serverSession = await getCajaSession(userId);

            if (serverSession && !serverSession.closedAt) {
                setCajaSession(serverSession);
                setIsCajaOpen(true);
                // Respect server's tasa if present, else keep default
                if (serverSession.tasaDolar) setTasaDolar(Number(serverSession.tasaDolar));
            } else {
                setCajaSession(null);
                setIsCajaOpen(false);
            }
        } catch (error) {
            console.error("❌ Error syncing caja (Server Error):", error);
            // ON ERROR: Do NOT fallback to local. Fail safe -> closed.
            // This prevents "zombie" states where local thinks it's open but server died.
            setCajaSession(null);
            setIsCajaOpen(false);
        }
    }, [userId]);

    // Initial load & Socket Sync
    useEffect(() => {
        if (!userId) {
            setIsCajaOpen(false);
            setCajaSession(null);
            return;
        }

        // 1. Initial Load
        refreshSession();

        // 2. Socket Setup for Real-time Caja
        let socket = null;
        try {
            // Re-determine URL (same logic as AuthContext)
            let socketUrl = 'https://multirepuestosrg.com';
            // Note: In a real app, use a shared socket instance from AuthContext or a separate service to avoid multiple connections.
            // For now, creating a dedicated one for Caja to ensure isolation if AuthContext changes.
            // Ideally we should import the socket instance, but context structure limits us here without refactor.
            // We will try to rely on the side-effect of `refreshSession` if triggered by AuthContext? 
            // No, CajaContext needs its own listener or access the socket.
            // Let's create a lightweight connection or just accept 2 connections for now (robustness).

            // Reuse API config
            if (api.API_URL) socketUrl = new URL(api.API_URL).origin;

            socket = require('socket.io-client').io(socketUrl, {
                path: '/socket.io/',
                transports: ['polling', 'websocket']
            });

            socket.on('connect', () => console.log('✅ Caja Socket Connected'));

            socket.on('caja:session_update', (data) => {
                // Check if update is for this user? usually events are room-based or general
                // If data contains userId and it matches, or if it's a general broadcast
                if (!data || !data.userId || data.userId === userId) {
                    console.log("⚡ Socket: caja session update");
                    refreshSession();
                }
            });

            socket.on('caja:transaction_new', (data) => {
                if (!data || !data.userId || data.userId === userId) {
                    console.log("⚡ Socket: New Tx");
                    refreshSession();
                }
            });

        } catch (e) { console.error("Socket Caja Error:", e); }

        // 3. Backup Polling (Relaxed to 60s since we have sockets)
        const interval = setInterval(refreshSession, 60000);

        return () => {
            clearInterval(interval);
            if (socket) socket.disconnect();
        };
    }, [userId, refreshSession]);

    // NO local storage saving effects (removed)

    const closeCajaSession = () => {
        if (!userId) return;
        // Just clear state, the API call happens in the component
        setCajaSession(null);
        setIsCajaOpen(false);
    };

    const value = {
        isCajaOpen,
        setIsCajaOpen,
        cajaSession,
        setCajaSession,
        tasaDolar,
        setTasaDolar,
        closeCajaSession,
        refreshSession // Exported so POS can call it manually
    };

    return <CajaContext.Provider value={value}>{children}</CajaContext.Provider>;
};

export const useCaja = () => {
    const context = useContext(CajaContext);
    if (!context) throw new Error('useCaja must be used within CajaProvider');
    return context;
};
