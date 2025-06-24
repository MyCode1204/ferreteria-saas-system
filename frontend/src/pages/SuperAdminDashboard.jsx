import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createTenant } from '../services/generalApi';

const SuperAdminDashboard = () => {
    const { user, logout, token } = useAuth();
    const [formData, setFormData] = useState({
        companyName: '',
        adminName: '',
        adminUsername: '',
        adminPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await createTenant(formData, token);
            setMessage(`¡Empresa "${response.data.companyName}" creada con éxito! Tenant ID: ${response.data.tenantId}`);
            setFormData({ companyName: '', adminName: '', adminUsername: '', adminPassword: '' }); // Limpiar formulario
        } catch (err) {
            setError('Error al crear la empresa. ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold">Panel de Superadministrador</h1>
                {user && (
                    <div>
                        <span>Bienvenido, <span className="font-semibold">{user.username}</span>!</span>
                        <button onClick={logout} className="px-4 py-2 ml-4 font-bold text-white bg-red-500 rounded hover:bg-red-700">
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>

            <div className="max-w-4xl p-8 mx-auto mt-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold">Crear Nueva Empresa</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Campos del formulario */}
                    <div>
                        <label className="block text-sm font-medium">Nombre de la Compañía</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Nombre del Administrador</label>
                        <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Username del Administrador</label>
                        <input type="text" name="adminUsername" value={formData.adminUsername} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Password del Administrador</label>
                        <input type="password" name="adminPassword" value={formData.adminPassword} onChange={handleChange} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                    </div>
                    
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Crear Empresa
                    </button>
                </form>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;