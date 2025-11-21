// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Páginas
import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import InventoryManagement from './pages/InventoryManagement.jsx';
import PedidosYApartados from './pages/PedidosYApartados.jsx';
import ClientesYCreditos from './pages/ClientesYCreditos.jsx';
import Finances from './pages/Finances.jsx';
import POS from './pages/pos/POS.jsx';
import Reports from './pages/Reports.jsx';
import Unauthorized from './components/Unauthorized.jsx';

// Módulos
import ProtectedRoute from './components/ProtectedRoute.jsx';
import InventoryUpload from './pages/InventoryUpload.jsx';
import CashReport from './pages/CashReport.jsx';

// Mapa de roles - AGREGA CONTADOR
const ROLES = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  INVENTARIO: 'Encargado de Inventario',
  FINANZAS: 'Encargado de Finanzas',
  GERENTE: 'Gerente',
  CONTADOR: 'Contador' // ← AGREGA ESTA LÍNEA
};

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANZAS, ROLES.CONTADOR]}>
            <POS />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}>
            <InventoryManagement />
          </ProtectedRoute>
        }
      />

      {/* ACTUALIZA ESTA RUTA - permite a Contador cobrar */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.FINANZAS, ROLES.CONTADOR]}>
            <PedidosYApartados />
          </ProtectedRoute>
        }
      />

      <Route
        path="/credits"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.FINANZAS, ROLES.CONTADOR]}>
            <ClientesYCreditos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/finances"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANZAS, ROLES.CONTADOR]}>
            <Finances />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS, ROLES.CONTADOR]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload/inventory"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}>
            <InventoryUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cash-report"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS, ROLES.CONTADOR]}>
            <CashReport />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;