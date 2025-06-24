// Ubicación: frontend/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Login = () => {
    // El tenantId ya no es un estado del formulario, se obtendrá de la URL.
    const [tenantId, setTenantId] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    // ¡LA MAGIA OCURRE AQUÍ!
    // Este efecto se ejecuta una sola vez cuando el componente se carga.
    useEffect(() => {
        const hostname = window.location.hostname; // ej: "compania-chavez.localhost"
        const parts = hostname.split('.');

        // Si tenemos un subdominio (ej: compania-chavez.localhost -> 2 partes)
        // Y no es 'www', lo establecemos como nuestro tenantId.
        if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
            const subdomain = parts[0];
            setTenantId(subdomain);
            console.log("Inquilino detectado por subdominio:", subdomain);
        } else {
            console.log("No se detectó un subdominio de inquilino.");
        }
    }, []); // El array vacío asegura que se ejecute solo una vez.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!tenantId) {
            setError('Acceso denegado. Ingrese desde la URL de su empresa (ej: su-empresa.ferreteria.doc)');
            return;
        }

        try {
            // Ya no usamos X-Tenant-ID. El backend lo leerá del subdominio.
            const response = await api.post('/auth/login', { username, password });
            
            // Pasamos el token Y el tenantId al contexto para guardarlos.
            auth.login(response.data.token, tenantId);
            navigate('/dashboard');

        } catch (err) {
            setError('Error de autenticación. Revisa tu usuario y contraseña.');
            console.error(err);
        }
    };

    // Si no se detecta un inquilino, mostramos un mensaje de bienvenida o error.
    if (!tenantId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-indigo-600">Bienvenido al Sistema SaaS</h1>
                    <p className="mt-4 text-gray-600">
                        Por favor, acceda a través de la URL proporcionada para su compañía.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Ejemplo: <code className="px-2 py-1 font-mono bg-gray-200 rounded">mi-empresa.ferreteria.doc</code>
                    </p>
                </div>
            </div>
        );
    }

    // Si sí hay un inquilino, mostramos el formulario de login.
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Iniciar Sesión en <span className="text-indigo-600">{tenantId}</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;