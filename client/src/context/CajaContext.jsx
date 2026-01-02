// client/src/context/CajaContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
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

    // Cargar sesión desde utils al montar o cuando cambia el usuario
    useEffect(() => {
        if (!userId) {
            setIsCajaOpen(false);
            setCajaSession(null);
            return;
        }

        const session = loadCajaSession(userId);
        if (session && isSessionOpen(session)) {
            setCajaSession(session);
            setIsCajaOpen(true);
            const tasa = loadTasaDolar(userId, 36.60);
            setTasaDolar(tasa);
        } else {
            setIsCajaOpen(false);
            setCajaSession(null);
        }
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
