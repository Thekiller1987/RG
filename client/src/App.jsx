import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// --- Importaciones de Páginas ---
import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import InventoryManagement from './pages/InventoryManagement.jsx';
import PedidosYApartados from './pages/PedidosYApartados.jsx';
import ClientesYCreditos from './pages/ClientesYCreditos.jsx';
// --- CORRECCIÓN AQUÍ ---
import MassiveUploadPage from './pages/MassiveUploadPage.jsx'; // Ruta/Nombre corregido
import POS from './pages/pos/POS.jsx';
import Reports from './pages/Reports.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Unauthorized from './components/Unauthorized.jsx';

function App() {
    const { user, isLoading } = useAuth();

    // Mientras el contexto está en su carga inicial, no mostramos nada para evitar flashes
    if (isLoading) {
        return null;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Rutas Protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/pos" element={<ProtectedRoute allowedRoles={['Administrador', 'Vendedor']}><POS /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute allowedRoles={['Administrador', 'Encargado de Inventario']}><InventoryManagement /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['Administrador', 'Vendedor']}><PedidosYApartados /></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute allowedRoles={['Administrador', 'Encargado de Finanzas']}><ClientesYCreditos /></ProtectedRoute>} />
            {/* --- CORRECCIÓN AQUÍ --- */}
            <Route path="/finances" element={<ProtectedRoute allowedRoles={['Administrador', 'Encargado de Finanzas']}><MassiveUploadPage /></ProtectedRoute>} /> 
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['Administrador', 'Gerente']}><Reports /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Administrador']}><UserManagement /></ProtectedRoute>} />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
}

export default App;