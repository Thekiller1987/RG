import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

// Páginas
// Módulos
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Lazy Load Pages for Performance ("Instant" feeling)
const Login = React.lazy(() => import('./pages/login.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const UserManagement = React.lazy(() => import('./pages/UserManagement.jsx'));
const InventoryManagement = React.lazy(() => import('./pages/InventoryManagement.jsx'));
const PedidosYApartados = React.lazy(() => import('./pages/PedidosYApartados.jsx'));
const ClientesYCreditos = React.lazy(() => import('./pages/ClientesYCreditos.jsx'));
const Finances = React.lazy(() => import('./pages/Finances.jsx'));
const POS = React.lazy(() => import('./pages/pos/POS.jsx'));
const Reports = React.lazy(() => import('./pages/Reports.jsx'));
const Unauthorized = React.lazy(() => import('./components/Unauthorized.jsx'));
const InventoryUpload = React.lazy(() => import('./pages/InventoryUpload.jsx'));
const CashReport = React.lazy(() => import('./pages/CashReport.jsx'));
const FacturasProveedores = React.lazy(() => import('./pages/FacturasProveedores.jsx'));
const Solicitudes = React.lazy(() => import('./pages/Solicitudes.jsx'));
const InventoryOutflowPage = React.lazy(() => import('./pages/InventoryOutflowPage.jsx'));
const DetailedSalesReport = React.lazy(() => import('./pages/DetailedSalesReport.jsx'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.jsx'));

// Simple fallback component
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
    Cargando...
  </div>
);

// Mapa de roles
const ROLES = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  INVENTARIO: 'Encargado de Inventario',
  FINANZAS: 'Encargado de Finanzas',
  GERENTE: 'Gerente',
  EMPLEADO: 'Empleado',
};

function App() {
  const { user, isLoading } = useAuth();

  // Evitar parpadeo mientras auth carga
  if (isLoading) return <Loading />;

  return (
    <React.Suspense fallback={<Loading />}>
      <Toaster position="top-center" reverseOrder={false} />
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
        {/* ... rest of routes ... */}

        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR]}>
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

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.EMPLEADO]}>
              <PedidosYApartados />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.FINANZAS]}>
              <ClientesYCreditos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/finances"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANZAS]}>
              <Finances />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS]}>
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
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS]}>
              <CashReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/traslados"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTARIO]}>
              <InventoryOutflowPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/detailed-sales-report"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE, ROLES.FINANZAS]}>
              <DetailedSalesReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FINANZAS]}>
              <FacturasProveedores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/solicitudes"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDEDOR, ROLES.INVENTARIO, ROLES.FINANZAS, ROLES.GERENTE]}>
              <Solicitudes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GERENTE]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;