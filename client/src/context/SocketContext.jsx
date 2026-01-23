// client/src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../service/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const initSocket = async () => {
            console.log("🔌 SocketProvider: Initializing...");
            const s = await getSocket();
            if (isMounted && s) {
                setSocket(s);
                console.log("✅ SocketProvider: Ready");
            }
        };

        initSocket();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
