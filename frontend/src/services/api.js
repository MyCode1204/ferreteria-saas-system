// Ubicación: frontend/src/services/api.js
import axios from 'axios';

// Función que crea un cliente de API para un inquilino específico
const getApiClient = (tenantId) => {
    // Construimos la URL base dinámicamente
    const baseURL = `http://${tenantId}.localhost:8080/api`;

    const api = axios.create({
        baseURL,
    });

    // Interceptor para añadir el token de autenticación a futuras peticiones
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return api;
};

// Exportamos una función específica para el login
export const loginRequest = (tenantId, credentials) => {
    // Creamos un cliente de API sin interceptor de token, ya que aún no lo tenemos
    const loginApi = axios.create({
        baseURL: `http://${tenantId}.localhost:8080/api`
    });
    return loginApi.post('/auth/login', credentials);
};

// Exportamos la función principal para usarla en el resto de la app
export default getApiClient;