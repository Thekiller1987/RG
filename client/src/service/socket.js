// client/src/service/socket.js
// Dynamic Import Pattern to prevent ReferenceError during bundle init
const URL = 'https://multirepuestosrg.com';

let socketInstance = null;
let ioModule = null;

export const getSocket = async () => {
    if (socketInstance) return socketInstance;

    try {
        console.log("🔌 Loading Socket.io Client dynamically...");
        // Dynamic import forces code splitting and safe initialization order
        if (!ioModule) {
            ioModule = await import('socket.io-client');
        }

        const { io } = ioModule;

        if (!socketInstance) {
            socketInstance = io(URL, {
                path: '/socket.io/',
                transports: ['polling', 'websocket'],
                reconnection: true,
                reconnectionAttempts: 20,
                autoConnect: true
            });

            socketInstance.on('connect', () => console.log('✅ Socket Connected (Real-Time Active)', socketInstance.id));
            socketInstance.on('disconnect', () => console.log('❌ Socket Disconnected'));
        }

        return socketInstance;
    } catch (error) {
        console.error("CRITICAL: Failed to load socket.io-client", error);
        return null;
    }
};
