import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CajaProvider } from './context/CajaContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import App from './App.jsx';
import './index.css';

// Initialize Socket Singleton (CDN)
const URL = 'https://multirepuestosrg.com';
let socket = null;

try {
  if (window.io) {
    socket = window.io(URL, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      reconnection: true,
      autoConnect: true
    });
    console.log("✅ Main: Socket Initialized via CDN");
  } else {
    console.error("❌ Main: Socket.io CDN missing! Real-time disabled.");
  }
} catch (e) {
  console.error("❌ Main: Socket init error:", e);
}

// Wrapper to pass user AND socket
const AppProviders = ({ socket }) => {
  const { user } = useAuth();

  return (
    <CajaProvider user={user} socket={socket}>
      <OrdersProvider>
        <App />
      </OrdersProvider>
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