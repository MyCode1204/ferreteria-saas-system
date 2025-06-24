import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
    return (
        <Routes>
            {/* Ruta Pública */}
            <Route path="/" element={<Login />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Ejemplo de ruta solo para ADMINS */}
                {/* <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/usuarios" element={<GestionUsuarios />} />
                </Route> */}
            </Route>

             {/* Ruta para cualquier otra URL no definida */}
            <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
    );
};

export default AppRouter;