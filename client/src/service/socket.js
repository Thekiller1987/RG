import { io } from 'socket.io-client';

const URL = 'https://multirepuestosrg.com';

let socket;

export const getSocket = () => {
    if (!socket) {
        console.log("🔌 Initializing Socket Lazy...");
        socket = io(URL, {
            path: '/socket.io/',
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            autoConnect: true
        });

        socket.on('connect', () => console.log('✅ Socket Global Connected:', socket.id));
        socket.on('disconnect', () => console.log('❌ Socket Global Disconnected'));
    }
    return socket;
};
