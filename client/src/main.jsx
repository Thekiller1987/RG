import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CajaProvider } from './context/CajaContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CajaProvider>
          <OrdersProvider>
            <App />
          </OrdersProvider>
        </CajaProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);