// TEMPORARY: Socket stub for debugging
// This removes all socket.io functionality to isolate the circular dependency error

let socket = null;

export const getSocket = () => {
    if (!socket) {
        console.log("🔌 Socket DISABLED for debugging");
        // Return a mock socket object with no-op methods
        socket = {
            on: () => { },
            off: () => { },
            emit: () => { },
            connect: () => { },
            disconnect: () => { },
            id: null
        };
    }
    return socket;
};
