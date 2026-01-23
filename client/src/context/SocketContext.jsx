// client/src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const SocketContext = createContext(null);
const URL = 'https://multirepuestosrg.com';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        const initSocket = async () => {
            if (socketRef.current) return; // Already initialized

            try {
                console.log("🔌 SocketProvider: Dynamically importing socket.io-client...");
                // DYNAMIC IMPORT: The magic fix for initialization errors
                const { io } = await import('socket.io-client');

                if (!isMounted) return;

                console.log("🔌 SocketProvider: Connecting...");
                const newSocket = io(URL, {
                    path: '/socket.io/',
                    transports: ['polling', 'websocket'],
                    reconnection: true,
                    reconnectionAttempts: 20,
                    autoConnect: true
                });

                newSocket.on('connect', () => {
                    console.log('✅ Socket Global Connected:', newSocket.id);
                });

                newSocket.on('disconnect', () => {
                    console.log('❌ Socket Global Disconnected');
                });

                socketRef.current = newSocket;
                setSocket(newSocket);

            } catch (error) {
                console.error("CRITICAL: Failed to load socket.io-client", error);
            }
        };

        initSocket();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                console.log("🔌 SocketProvider: Cleaning up");
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
