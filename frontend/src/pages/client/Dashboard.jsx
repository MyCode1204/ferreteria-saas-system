import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user && (
                <div className="mt-4">
                    <p>Bienvenido, <span className="font-semibold">{user.username}</span>!</p>
                    <p>Tu rol es: <span className="font-semibold">{user.roles.join(', ')}</span></p>
                    <button onClick={logout} className="px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded hover:bg-red-700">
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;