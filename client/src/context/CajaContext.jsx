// client/src/context/CajaContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCajaSession } from '../service/api';
import {
    loadCajaSession,
    saveCajaSession,
    clearCajaSession,
    subscribeCajaChanges,
    loadTasaDolar,
    saveTasaDolar,
    isSessionOpen
} from '../utils/caja';

const CajaContext = createContext(null);

export const CajaProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id_usuario || user?.id;

    const [isCajaOpen, setIsCajaOpen] = useState(false);
    const [cajaSession, setCajaSession] = useState(null);
    const [tasaDolar, setTasaDolar] = useState(36.60);

    // Cargar sesión desde utils O DESDE SERVIDOR al montar o cuando cambia el usuario
    useEffect(() => {
        if (!userId) {
            setIsCajaOpen(false);
            setCajaSession(null);
            return;
        }

        const fetchSession = async () => {
            try {
                // 1. Intentar cargar del servidor primero (SSOT)
                const serverSession = await getCajaSession(userId);

                if (serverSession && !serverSession.closedAt) {
                    // Si hay sesión activa en servidor, usarla y actualizar local
                    setCajaSession(serverSession);
                    setIsCajaOpen(true);
                    saveCajaSession(userId, serverSession); // Sync local

                    const tasa = loadTasaDolar(userId, serverSession.tasaDolar || 36.60);
                    setTasaDolar(tasa);
                } else {
                    // 2. Fallback a local si el servidor no devuelve nada activo
                    // (O si queremos soportar offline, pero la prioridad es la seguridad)
                    const localSession = loadCajaSession(userId);
                    if (localSession && isSessionOpen(localSession)) {
                        // PRECAUCIÓN: Aquí podría haber desincronización si el servidor cerró.
                        // Idealmente confiamos en el servidor.
                        // Pero dejaremos el fallback por robustez momentánea.
                        setCajaSession(localSession);
                        setIsCajaOpen(true);
                    } else {
                        setIsCajaOpen(false);
                        setCajaSession(null);
                    }
                }
            } catch (error) {
                console.error("Error al sincronizar caja con servidor:", error);
                // Fallback a local en error de red
                const localSession = loadCajaSession(userId);
                if (localSession && isSessionOpen(localSession)) {
                    setCajaSession(localSession);
                    setIsCajaOpen(true);
                }
            }
        };

        fetchSession();
    }, [userId]);

    // Suscribirse a cambios entre pestañas
    useEffect(() => {
        if (!userId) return;

        const unsubscribe = subscribeCajaChanges(userId, (session) => {
            if (session && isSessionOpen(session)) {
                setCajaSession(session);
                setIsCajaOpen(true);
            } else {
                setCajaSession(null);
                setIsCajaOpen(false);
            }
        });

        return unsubscribe;
    }, [userId]);

    // Guardar sesión cuando cambia
    useEffect(() => {
        if (!userId) return;
        if (cajaSession) {
            saveCajaSession(userId, cajaSession);
        }
    }, [cajaSession, userId]);

    // Guardar tasa del dólar cuando cambia
    useEffect(() => {
        if (!userId) return;
        saveTasaDolar(userId, tasaDolar);
    }, [tasaDolar, userId]);

    const closeCajaSession = () => {
        if (!userId) return;
        clearCajaSession(userId);
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
    };

    return <CajaContext.Provider value={value}>{children}</CajaContext.Provider>;
};

export const useCaja = () => {
    const context = useContext(CajaContext);
    if (!context) throw new Error('useCaja must be used within CajaProvider');
    return context;
};
