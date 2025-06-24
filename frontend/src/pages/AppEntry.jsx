import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTenantExists } from '../services/generalApi';
import LandingPage from './LandingPage';

const AppEntry = () => {
    const [status, setStatus] = useState('resolving'); // 'resolving', 'is_main_domain'
    const navigate = useNavigate();

    useEffect(() => {
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        
        // Asumimos que una URL como "localhost" tiene 1 parte, y "compania.localhost" tiene 2.
        // Ajusta la lógica si tu dominio base tiene más puntos (ej: .com.pe)
        const tenantId = (parts.length > 1 && parts[0] !== 'localhost') ? parts[0] : null;

        if (tenantId) {
            // Hay un subdominio, vamos a verificarlo.
            checkTenantExists(tenantId)
                .then(response => {
                    if (response.data === true) {
                        // El tenant existe, redirigimos a su página de login.
                        // El `Maps` mantiene el subdominio en la URL.
                        navigate('/login');
                    } else {
                        // El tenant NO existe, redirigimos al dominio principal.
                        window.location.href = 'http://localhost:5173/';
                    }
                })
                .catch(() => {
                    // Si hay un error en la API, también redirigimos al dominio principal.
                    window.location.href = 'http://localhost:5173/';
                });
        } else {
            // No hay subdominio, estamos en el dominio principal.
            // Mostramos la LandingPage.
            setStatus('is_main_domain');
        }
    }, [navigate]);

    if (status === 'is_main_domain') {
        return <LandingPage />;
    }

    // Mientras se resuelve el tenant, mostramos un mensaje de carga.
    // Esto evita un parpadeo de contenido.
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <p className="text-xl text-gray-600">Verificando...</p>
        </div>
    );
};

export default AppEntry;