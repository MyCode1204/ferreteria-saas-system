import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/client/Login';
import Dashboard from '../pages/client/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import AppEntry from '../pages/AppEntry';
import SuperAdminLogin from '../pages/dashboard/SuperAdminLogin';
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';

// --- VISTAS DEL DASHBOARD DEL CLIENTE ---
// ¡Importa aquí los nuevos componentes que crearemos!
import VentaRapida from '../pages/client/views/VentaRapida';
import GestionProductos from '../pages/client/views/GestionProductos/GestionProductos';
import GestionClientes from '../pages/client/views/GestionClientes/GestionClientes';
import GestionCaja from '../pages/client/views/GestionCaja';
import Reportes from '../pages/client/views/Reportes';


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AppEntry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />

            {/* --- RUTAS PROTEGIDAS DEL DASHBOARD --- */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
                <Route element={<Dashboard />}>
                    {/* La ruta por defecto al entrar al dashboard */}
                    <Route index element={<VentaRapida />} />
                    <Route path="ventas" element={<VentaRapida />} />
                    <Route path="productos" element={<GestionProductos />} />
                    <Route path="clientes" element={<GestionClientes />} />
                    <Route path="caja" element={<GestionCaja />} />
                    <Route path="reportes" element={<Reportes />} />
                </Route>
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
                 <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            </Route>

            <Route path="*" element={<div className="flex justify-center items-center h-screen">404 - Página no encontrada</div>} />
        </Routes>
    );
};

export default AppRouter;