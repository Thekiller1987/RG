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

    // Initial load
    useEffect(() => {
        if (!userId) {
            setIsCajaOpen(false);
            setCajaSession(null);
            return;
        }
        refreshSession();
        // Polling (Optional but recommended for multi-tab sync without local storage events)
        const interval = setInterval(refreshSession, 10000); // Check every 10s
        return () => clearInterval(interval);
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
