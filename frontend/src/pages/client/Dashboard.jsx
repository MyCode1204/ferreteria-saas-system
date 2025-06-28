import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Users, DollarSign, BarChart2, LogOut, Menu, X } from 'lucide-react';

// Componente para los items del menú
const NavItem = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === `/dashboard${to}` || (to === '/ventas' && location.pathname === '/dashboard');

    return (
        <Link
            to={`/dashboard${to}`}
            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                isActive
                    ? 'bg-indigo-200 text-indigo-800 font-bold'
                    : 'hover:bg-gray-200'
            }`}
        >
            {icon}
            <span className="mx-4">{children}</span>
        </Link>
    );
};


const Dashboard = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
    }

    const sidebarContent = (
      <>
        <div className="flex items-center justify-center mt-8">
            <div className="flex items-center">
                 <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="mx-2 text-lg font-semibold text-gray-800">
                    {user.username}
                </span>
            </div>
        </div>

        <nav className="mt-10 px-2">
            {/* <NavItem to="" icon={<ShoppingCart size={20} />}>DASHBOARD</NavItem> */}
            <NavItem to="/ventas" icon={<ShoppingCart size={20} />}>Venta Rápida</NavItem>
            <NavItem to="/productos" icon={<Package size={20} />}>Productos</NavItem>
            <NavItem to="/clientes" icon={<Users size={20} />}>Clientes</NavItem>
            <NavItem to="/caja" icon={<DollarSign size={20} />}>Caja Diaria</NavItem>
            <NavItem to="/reportes" icon={<BarChart2 size={20} />}>Reportes</NavItem>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
             <button
                onClick={logout}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring"
            >
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
            </button>
        </div>
      </>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar para pantallas grandes */}
            <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg relative">
                {sidebarContent}
            </aside>

            {/* Menú hamburguesa para móviles */}
            <div className="md:hidden">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute top-4 left-4 z-20 text-gray-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {/* Overlay */}
                {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>}
                {/* Sidebar móvil */}
                <aside
                    className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20 relative`}
                >
                   {sidebarContent}
                </aside>
            </div>
            
            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    <Outlet /> {/* Aquí se renderizarán los componentes hijos */}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;