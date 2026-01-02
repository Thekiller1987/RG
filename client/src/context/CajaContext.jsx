// client/src/context/CajaContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CajaContext = createContext(null);

export const CajaProvider = ({ children }) => {
    const [isCajaOpen, setIsCajaOpen] = useState(false);
    const [cajaSession, setCajaSession] = useState(null);
    const [tasaDolar, setTasaDolar] = useState(36.60);

    // Intentar recuperar de localStorage si existe
    useEffect(() => {
        const saved = localStorage.getItem('cajaSession');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && !parsed.closedAt) {
                    setCajaSession(parsed);
                    setIsCajaOpen(true);
                    if (parsed.tasaDolar) setTasaDolar(parsed.tasaDolar);
                }
            } catch (e) {
                console.error("Error parsing cajaSession", e);
            }
        }
    }, []);

    useEffect(() => {
        if (cajaSession) {
            localStorage.setItem('cajaSession', JSON.stringify(cajaSession));
        } else {
            localStorage.removeItem('cajaSession');
        }
    }, [cajaSession]);

    const value = {
        isCajaOpen, setIsCajaOpen,
        cajaSession, setCajaSession,
        tasaDolar, setTasaDolar
    };

    return <CajaContext.Provider value={value}>{children}</CajaContext.Provider>;
};

export const useCaja = () => {
    const context = useContext(CajaContext);
    if (!context) throw new Error('useCaja must be used within CajaProvider');
    return context;
};
