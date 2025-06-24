// Ubicación: frontend/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginRequest } from '../services/api'; // Importamos la función específica de login

const Login = () => {
    const [tenantId, setTenantId] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        // Esta lógica para detectar el subdominio está perfecta
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
            // Reemplazamos '.ferreteria.doc' o '.localhost' para obtener el ID limpio
            const subdomain = parts[0].replace('.ferreteria.doc', '').replace('.localhost', '');
            setTenantId(subdomain);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!tenantId) {
            setError('Acceso denegado. Ingrese desde la URL de su empresa.');
            return;
        }

        try {
            // ¡Usamos nuestra nueva función de login!
            const response = await loginRequest(tenantId, { username, password });
            
            auth.login(response.data.token, tenantId);
            navigate('/dashboard');

        } catch (err) {
            setError('Error de autenticación. Revisa tu usuario y contraseña.');
            console.error(err);
        }
    };

    // ... el resto del componente (el return con el JSX) puede quedar exactamente igual ...
    // (Aquí iría el return con el formulario de login que ya tienes)
    if (!tenantId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-indigo-600">Bienvenido al Sistema SaaS</h1>
                    <p className="mt-4 text-gray-600">
                        Por favor, acceda a través de la URL proporcionada para su compañía.
                    </p>
                </div>
            </div>
        );
    }

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