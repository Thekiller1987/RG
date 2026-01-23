// client/src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
// Note: io is loaded via CDN in index.html to prevent ReferenceError initialization crashes

const SocketContext = createContext(null);
const URL = 'https://multirepuestosrg.com';

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Connection Logic - Executed strictly AFTER Mount
        console.log("🔌 SocketProvider: Connecting via Global IO (CDN)...");

        // Use global 'io' from CDN
        const io = window.io;

        if (!io) {
            console.error("❌ CRITICAL: Socket.io CDN failed to load from index.html!");
            return;
        }

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

        return () => {
            console.log("🔌 SocketProvider: Cleanup");
            if (socketRef.current) {
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
}

export function useSocket() {
    return useContext(SocketContext);
}
