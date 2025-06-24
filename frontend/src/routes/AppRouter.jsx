import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import AppEntry from '../pages/AppEntry'; // Importamos el nuevo componente
import SuperAdminLogin from '../pages/SuperAdminLogin';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';

const AppRouter = () => {
    return (
        <Routes>
            {/* La ruta raíz ahora es manejada por AppEntry */}
            <Route path="/" element={<AppEntry />} />

            {/* Las demás rutas permanecen igual */}
            <Route path="/login" element={<Login />} />
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                 <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            </Route>

            <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
    );
};

export default AppRouter;