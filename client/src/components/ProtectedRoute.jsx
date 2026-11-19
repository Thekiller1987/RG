// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles, requiredPermission }) => {
  const { user, isLoading, hasPermission, isMasterAdmin } = useAuth();

  if (isLoading) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // El Super Administrador Principal ('admin' / 1987) siempre tiene acceso total
  if (isMasterAdmin) return children;

  // 1. Si la ruta especifica un permiso granular por casilla, ese permiso manda
  if (requiredPermission) {
    const allowed = Array.isArray(requiredPermission)
      ? requiredPermission.some(key => hasPermission(key))
      : hasPermission(requiredPermission);

    if (!allowed) {
      return (
        <Navigate
          to="/unauthorized"
          state={{
            role: user?.rol || 'Usuario',
            requiredPermission,
            allowed: allowedRoles || []
          }}
          replace
        />
      );
    }
    return children;
  }

  // 2. Fallback por roles si no se definió requiredPermission
  if (allowedRoles && Array.isArray(allowedRoles)) {
    const userRole = (user?.rol || '').trim().toLowerCase();
    const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!hasAccess) {
      return <Navigate to="/unauthorized" state={{ role: userRole, allowed: allowedRoles }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
