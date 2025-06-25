import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, Moon, DollarSign, ArrowUp, ArrowDown, Package, Users, LogOut, PlusCircle, FileText, UserPlus } from 'lucide-react';

// --- DATOS DE EJEMPLO (Simulando una llamada a la API REST) ---
// Estos datos vendrían de endpoints como /api/ventas/dia, /api/productos/, etc. [cite: 6]
const dailyStats = {
    totalSales: 785.50,
    cashIncome: 650.00,
    cashExpenses: 75.00,
    lowStockProducts: 8,
};

const salesByDay = [
    { name: 'Lun', ventas: 400 },
    { name: 'Mar', ventas: 300 },
    { name: 'Mié', ventas: 680 },
    { name: 'Jue', ventas: 500 },
    { name: 'Vie', ventas: 785 },
    { name: 'Sáb', ventas: 1100 },
];

const lowStockItems = [
    { id: 1, name: 'Clavos de 2"', stock: 15, min_stock: 20 },
    { id: 2, name: 'Tubo PVC 1/2"', stock: 5, min_stock: 10 },
    { id: 3, name: 'Cinta Aislante', stock: 18, min_stock: 20 },
    { id: 4, name: 'Foco LED 12W', stock: 9, min_stock: 15 },
];

// --- COMPONENTES REUTILIZABLES ---

// Tarjeta para mostrar un KPI principal
const StatCard = ({ title, value, icon, detail }) => (
    <div className="p-6 transition-all duration-300 transform bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:-translate-y-1">
        <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-2">
                <span className="text-gray-500 dark:text-gray-400">{title}</span>
                <span className="text-3xl font-bold dark:text-white">{value}</span>
                {detail && <span className="text-sm text-green-500">{detail}</span>}
            </div>
            <div className="p-3 text-white bg-blue-500 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

// Botón para acciones rápidas
const QuickActionButton = ({ title, icon, role, userRoles }) => {
    // Si se define un rol para el botón y el usuario no lo tiene, no se muestra
    if (role && !userRoles.includes(role)) {
        return null;
    }

    return (
        <button className="flex flex-col items-center justify-center p-6 space-y-3 transition-all duration-300 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            {icon}
            <span className="font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        </button>
    );
};


// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* --- Cabecera --- */}
                <header className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Ferretería</h1>
                        {user && <p className="mt-1 text-gray-600 dark:text-gray-300">Bienvenido de nuevo, <span className="font-semibold text-blue-500">{user.username}</span>!</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {theme === 'light' ? <Moon className="w-6 h-6 text-gray-700" /> : <Sun className="w-6 h-6 text-yellow-400" />}
                        </button>
                        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600">
                            <LogOut size={16} />
                            Cerrar Sesión
                        </button>
                    </div>
                </header>

                {/* --- KPIs Principales --- */}
                {/* Estos KPIs se basan en los indicadores de uso del sistema [cite: 16] y el reporte diario  */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Ventas de Hoy" value={`S/ ${dailyStats.totalSales.toFixed(2)}`} icon={<DollarSign />} detail="+15% vs ayer" />
                    <StatCard title="Ingresos de Caja" value={`S/ ${dailyStats.cashIncome.toFixed(2)}`} icon={<ArrowUp className="text-green-400" />} />
                    <StatCard title="Egresos de Caja" value={`S/ ${dailyStats.cashExpenses.toFixed(2)}`} icon={<ArrowDown className="text-red-400" />} />
                    <StatCard title="Stock Bajo" value={dailyStats.lowStockProducts} icon={<Package />} detail="Necesitan atención" />
                </div>

                {/* --- Acciones Rápidas --- */}
                {/* Las acciones se basan en los casos de uso para diferentes roles [cite: 2] */}
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        <QuickActionButton title="Registrar Venta" icon={<PlusCircle size={32} className="text-green-500"/>} userRoles={user.roles} />
                        <QuickActionButton title="Registrar Producto" icon={<Package size={32} className="text-blue-500"/>} userRoles={user.roles} role="ferretero" />
                        <QuickActionButton title="Ver Reportes" icon={<FileText size={32} className="text-yellow-500"/>} userRoles={user.roles} role="admin" />
                        <QuickActionButton title="Gestionar Clientes" icon={<Users size={32} className="text-purple-500"/>} userRoles={user.roles} />
                        <QuickActionButton title="Gestionar Usuarios" icon={<UserPlus size={32} className="text-red-500"/>} userRoles={user.roles} role="admin" />
                    </div>
                </div>

                {/* --- Visualización de Datos --- */}
                <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3">
                    {/* Gráfico de Ventas Semanales */}
                    <div className="p-6 transition-all duration-300 bg-white border rounded-lg shadow-sm lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="mb-4 font-bold text-gray-800 dark:text-white">Resumen de Ventas Semanales</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salesByDay}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.2)" />
                                <XAxis dataKey="name" tick={{ fill: theme === 'light' ? '#374151' : '#d1d5db' }} />
                                <YAxis tick={{ fill: theme === 'light' ? '#374151' : '#d1d5db' }} />
                                <Tooltip cursor={{fill: 'rgba(200, 200, 200, 0.1)'}} contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#1f2937', border: '1px solid #374151' }}/>
                                <Legend />
                                <Bar dataKey="ventas" fill="#3b82f6" name="Ventas (S/)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Lista de Productos por Agotarse */}
                    <div className="p-6 transition-all duration-300 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="mb-4 font-bold text-gray-800 dark:text-white">Productos por Agotarse</h3>
                        {/* La alerta por stock mínimo es un requisito del MVP  */}
                        <ul className="space-y-4">
                            {lowStockItems.map(item => (
                                <li key={item.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Stock Mínimo: {item.min_stock}</p>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-bold text-red-800 bg-red-200 rounded-full dark:bg-red-300 dark:text-red-900">
                                        Quedan: {item.stock}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;