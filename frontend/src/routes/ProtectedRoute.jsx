import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si se especifican roles, verificar que el usuario tenga al menos uno de ellos.
    const hasRequiredRole = user && allowedRoles ? allowedRoles.some(role => user.roles.includes(role)) : true;

    if (!hasRequiredRole) {
        // Redirigir a una página de "No autorizado" o al dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;