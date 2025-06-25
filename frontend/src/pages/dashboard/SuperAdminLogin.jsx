import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { superAdminLogin } from '../../services/generalApi';

const SuperAdminLogin = () => {
    // Corregido: se usan los setters correctos (setUsername, setPassword)
    const [username, setUsername] = useState('superadmin');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Usamos la función de login para superadmin
            const response = await superAdminLogin({ username, password });
            // Hacemos login en el contexto, identificándolo como 'superadmin'
            auth.login(response.data.token, 'superadmin');
            navigate('/superadmin/dashboard');
        } catch (err) {
            setError('Credenciales de Superadmin incorrectas.');
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Portal de Superadministrador
                </h2>
                
                {/* --- INICIO DEL FORMULARIO AÑADIDO --- */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Usuario
                        </label>
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
                        <label htmlFor="password"  className="text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Mensaje de error */}
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}

                    <div>
                        <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
                {/* --- FIN DEL FORMULARIO AÑADIDO --- */}
                
            </div>
        </div>
    );
};

export default SuperAdminLogin;
