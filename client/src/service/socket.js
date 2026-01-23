import { io } from 'socket.io-client';

const URL = 'https://multirepuestosrg.com';

export const socket = io(URL, {
    path: '/socket.io/',
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    autoConnect: true
});

// Helper for debugging
socket.on('connect', () => console.log('✅ Socket Global Connected:', socket.id));
socket.on('disconnect', () => console.log('❌ Socket Global Disconnected'));
