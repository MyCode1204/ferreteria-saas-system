import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTenants } from '../services/generalApi';
import { FiLogIn } from 'react-icons/fi';

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <nav className="container flex items-center justify-between p-4 mx-auto">
                    <div className="text-2xl font-bold text-indigo-600">
                        Ferretería SaaS
                    </div>
                    <Link to="/superadmin/login" className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-transparent rounded-md hover:bg-indigo-50">
                        <FiLogIn className="mr-2" />
                        Acceso Superadmin
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="container p-8 mx-auto text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    La solución definitiva para tu ferretería
                </h1>
                <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Gestiona tu inventario, ventas y clientes de forma centralizada y eficiente.
                </p>

                {/* Lista de Empresas */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800">Empresas que confían en nosotros</h2>
                    {loading ? (
                        <p className="mt-4">Cargando empresas...</p>
                    ) : (
                        <div className="grid max-w-lg gap-5 mx-auto mt-5 lg:grid-cols-3 lg:max-w-none">
                            {tenants.map(tenant => (
                                <div key={tenant.tenantId} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white">
                                        <div className="flex-1">
                                            {/* --- ESTE ES EL CAMBIO SOLICITADO --- */}
                                            <p className="text-xl font-semibold text-gray-900">{tenant.companyName}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LandingPage;