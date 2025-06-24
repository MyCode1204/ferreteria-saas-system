import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [tenantId, setTenantId] = useState(localStorage.getItem('tenantId'));

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // La propiedad de roles en el token de Spring Security se llama 'roles' y es un array
                const roles = decodedToken.roles || [];
                setUser({
                    username: decodedToken.sub,
                    roles: roles,
                });
                localStorage.setItem('token', token);
            } catch (error) {
                console.error("Token inválido:", error);
                logout();
            }
        }
    }, [token]);

    const login = (newToken, newTenantId) => {
        setToken(newToken);
        setTenantId(newTenantId);
        localStorage.setItem('tenantId', newTenantId);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setTenantId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('tenantId');
    };

    const authContextValue = {
        user,
        token,
        tenantId,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};