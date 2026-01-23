// client/src/context/CajaContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCajaSession } from '../service/api';
import { getSocket } from '../service/socket';

const CajaContext = createContext(null);

export const CajaProvider = ({ children, user }) => {
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

    const socketRef = React.useRef(null);

    // Initial load & Socket Sync
    useEffect(() => {
        if (!userId) {
            setIsCajaOpen(false);
            setCajaSession(null);
            return;
        }

        // 1. Initial Load
        refreshSession();

        // 2. Socket Listeners (Using shared lazy instance)
        if (!socketRef.current) {
            socketRef.current = getSocket();
        }
        const socket = socketRef.current;

        const onSessionUpdate = (data) => {
            if (!data || !data.userId || data.userId === userId) {
                console.log("⚡ Socket: caja session update");
                refreshSession();
            }
        };

        const onNewTx = (data) => {
            if (!data || !data.userId || data.userId === userId) {
                console.log("⚡ Socket: New Tx");
                refreshSession();
            }
        };

        socket.on('caja:session_update', onSessionUpdate);
        socket.on('caja:transaction_new', onNewTx);

        // 3. Backup Polling (Relaxed to 60s)
        const interval = setInterval(refreshSession, 60000);

        return () => {
            clearInterval(interval);
            socket.off('caja:session_update', onSessionUpdate);
            socket.off('caja:transaction_new', onNewTx);
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
