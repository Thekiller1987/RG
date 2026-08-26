import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CajaProvider } from './context/CajaContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import App from './App.jsx';
import './index.css';

// Initialize Socket with robust reconnection and JWT Authentication
import { io } from 'socket.io-client';

const API_ENDPOINT = import.meta.env.VITE_API_URL || 'https://sistema.multirepuestosrg.com';
const URL = API_ENDPOINT.replace(/\/api\/?$/, '');

const socket = io(URL, {
  path: '/socket.io/',
  transports: ['websocket', 'polling'], // Prefer websocket, fallback to polling
  auth: {
    token: localStorage.getItem('token')
  },
  reconnection: true,
  reconnectionAttempts: Infinity, // Keep trying forever
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true
});

// Update socket auth token whenever localStorage changes or token is refreshed
export const updateSocketAuth = (token) => {
  if (socket) {
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
  }
};

socket.on('connect', () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on('connect_error', (err) => {
  console.warn("⚠️ Socket Connection Error (retrying...):", err.message);
});

socket.on('disconnect', (reason) => {
  console.warn("❌ Socket Disconnected:", reason);
  if (reason === 'io server disconnect') {
    socket.connect(); // Explicitly reconnect if server closed it
  }
});

// Wrapper to pass user AND socket
const AppProviders = ({ socket }) => {
  const { user } = useAuth();

  return (
    <CajaProvider user={user} socket={socket}>
      <SettingsProvider>
        <OrdersProvider socket={socket} user={user}>
          <App />
        </OrdersProvider>
      </SettingsProvider>
    </CajaProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider socket={socket}>
        <AppProviders socket={socket} />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);