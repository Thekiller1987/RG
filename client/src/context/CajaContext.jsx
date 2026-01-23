// client/src/context/CajaContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCajaSession } from '../service/api';
// No imports from SocketContext

const CajaContext = createContext(null);

export const CajaProvider = ({ children, user, socket }) => { // Accept socket as prop
    const userId = user?.id_usuario || user?.id;

    const [isCajaOpen, setIsCajaOpen] = useState(false);
    const [cajaSession, setCajaSession] = useState(null);
    const [tasaDolar, setTasaDolar] = useState(36.60);

    const refreshSession = useCallback(async () => {
        if (!userId) return;
        try {
            console.log("🔄 Syncing Caja Session from Server...");
            const serverSession = await getCajaSession(userId);

            if (serverSession && !serverSession.closedAt) {
                setCajaSession(serverSession);
                setIsCajaOpen(true);
                if (serverSession.tasaDolar) setTasaDolar(Number(serverSession.tasaDolar));
            } else {
                setCajaSession(null);
                setIsCajaOpen(false);
            }
        } catch (error) {
            console.error("❌ Error syncing caja (Server Error):", error);
            setCajaSession(null);
            setIsCajaOpen(false);
        }
    }, [userId]);

    // Initial load & Socket Sync using PROP
    useEffect(() => {
        if (!userId) {
            setIsCajaOpen(false);
            setCajaSession(null);
            return;
        }

        refreshSession();

        if (socket) {
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

            return () => {
                socket.off('caja:session_update', onSessionUpdate);
                socket.off('caja:transaction_new', onNewTx);
            };
        }

        const interval = setInterval(refreshSession, 60000);

        return () => {
            clearInterval(interval);
        };
    }, [userId, refreshSession, socket]);

    const closeCajaSession = () => {
        if (!userId) return;
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
        refreshSession
    };

    return <CajaContext.Provider value={value}>{children}</CajaContext.Provider>;
};

export const useCaja = () => {
    const context = useContext(CajaContext);
    if (!context) throw new Error('useCaja must be used within CajaProvider');
    return context;
};
