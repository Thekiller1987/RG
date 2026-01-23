import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CajaProvider } from './context/CajaContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import App from './App.jsx';
import './index.css';

// Wrapper component to access useAuth and pass to CajaProvider
const AppProviders = () => {
  const { user } = useAuth();

  return (
    <CajaProvider user={user}>
      <OrdersProvider>
        <App />
      </OrdersProvider>
    </CajaProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <AppProviders />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);