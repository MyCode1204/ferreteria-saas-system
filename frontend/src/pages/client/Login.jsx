import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginRequest } from '../../services/api';
import { checkTenantExists } from '../../services/generalApi'; // Importamos la función de verificación

const Login = () => {
    const [tenantId, setTenantId] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(false); // Nuevo estado para controlar la verificación
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        const currentTenantId = (parts.length > 1 && parts[0] !== 'localhost') ? parts[0] : null;

        if (currentTenantId) {
            // ---- ¡AQUÍ ESTÁ LA VALIDACIÓN CRUCIAL! ----
            checkTenantExists(currentTenantId)
                .then(response => {
                    if (response.data === true) {
                        // El tenant es válido, guardamos su ID y permitimos que se muestre el formulario.
                        setTenantId(currentTenantId);
                        setIsVerified(true);
                    } else {
                        // El tenant NO existe, redirigimos al dominio principal.
                        window.location.href = 'http://localhost:5173/';
                    }
                })
                .catch(() => {
                    // Si hay un error en la API (ej. backend caído), también redirigimos.
                    window.location.href = 'http://localhost:5173/';
                });
        } else {
            // Si no hay subdominio (se accedió a localhost:5173/login), redirigir.
            window.location.href = 'http://localhost:5173/';
        }
    }, []); // Se ejecuta solo una vez al cargar el componente

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginRequest(tenantId, { username, password });
            auth.login(response.data.token, tenantId);
            navigate('/dashboard');
        } catch (err) {
            setError('Error de autenticación. Revisa tu usuario y contraseña.');
            console.error(err);
        }
    };

    // Mientras se verifica el tenant, mostramos un mensaje de carga.
    if (!isVerified) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-600">Verificando empresa...</p>
            </div>
        );
    }

    // Si la verificación fue exitosa, renderizamos el formulario.
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    <span className="capitalize text-indigo-600">{tenantId.replace(/-/g, ' ')}</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;