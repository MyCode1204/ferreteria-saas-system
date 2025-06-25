import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTenants } from '../services/generalApi';
import { FiLogIn, FiPackage, FiUsers, FiTrendingUp, FiShield, FiClock, FiSettings } from 'react-icons/fi';



const LandingPage = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTenants()
            .then(response => {
                setTenants(response.data);
            })
            .catch(error => {
                console.error("Error al cargar las empresas:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
                <nav className="container flex items-center justify-between p-4 mx-auto">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <FiPackage className="text-white text-xl" />
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Ferretería SaaS
                        </div>
                    </div>
                    <Link 
                        to="/superadmin/login" 
                        className="group inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <FiLogIn className="mr-2 group-hover:rotate-12 transition-transform duration-200" />
                        Acceso
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="container p-8 mx-auto">
                <div className="text-center relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                    
                    <div className="relative z-10">
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl leading-tight">
                            Lleva tu ferretería al{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                                siguiente nivel
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-600 leading-relaxed">
                            Gestiona tu inventario, ventas y clientes de forma centralizada y eficiente para potenciar tu crecimiento.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                            <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl">
                                <span className="flex items-center justify-center">
                                    Comenzar Gratis
                                    <FiTrendingUp className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                </span>
                            </button>
                            <button className="px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-800 font-semibold rounded-xl hover:bg-white/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/50">
                                Ver Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="group bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/50">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FiPackage className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Gestión de Inventario</h3>
                        <p className="text-gray-600 leading-relaxed">Control total de tu stock con alertas automáticas y seguimiento en tiempo real.</p>
                    </div>

                    <div className="group bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/50">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FiUsers className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">CRM Integrado</h3>
                        <p className="text-gray-600 leading-relaxed">Mantén relaciones sólidas con tus clientes y aumenta la fidelización.</p>
                    </div>

                    <div className="group bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/50">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FiTrendingUp className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Análisis Avanzado</h3>
                        <p className="text-gray-600 leading-relaxed">Reportes detallados y métricas que impulsan el crecimiento de tu negocio.</p>
                    </div>
                </div>

                {/* Additional Features */}
                <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4 bg-white/40 backdrop-blur-sm p-4 rounded-xl">
                        <FiShield className="text-indigo-600 text-2xl" />
                        <span className="text-gray-700 font-medium">Seguridad Garantizada</span>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/40 backdrop-blur-sm p-4 rounded-xl">
                        <FiClock className="text-indigo-600 text-2xl" />
                        <span className="text-gray-700 font-medium">Soporte 24/7</span>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/40 backdrop-blur-sm p-4 rounded-xl">
                        <FiSettings className="text-indigo-600 text-2xl" />
                        <span className="text-gray-700 font-medium">Configuración Flexible</span>
                    </div>
                </div>

                {/* Lista de Empresas */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                            Empresas que confían en nosotros
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                                <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce delay-200"></div>
                            </div>
                            <span className="ml-4 text-gray-600 font-medium">Cargando empresas...</span>
                        </div>
                    ) : (
                        <div className="grid gap-6 mx-auto max-w-6xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {tenants.map((tenant, index) => (
                                <div 
                                    key={tenant.tenantId} 
                                    className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-white/50 overflow-hidden"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-white font-bold text-lg">
                                                    {tenant.companyName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                            {tenant.companyName}
                                        </p>
                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                            <div className="flex space-x-1">
                                                <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                                                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                                <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                                            </div>
                                            <span className="ml-2">Cliente activo</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                <div className="mt-24 text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        ¿Listo para transformar tu ferretería?
                    </h3>
                    <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
                        Únete a las empresas que ya están revolucionando su gestión con nuestra plataforma.
                    </p>
                    <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                        Comenzar Ahora
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;