import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // La base de tu API
});

// Interceptor para añadir las cabeceras a cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const tenantId = localStorage.getItem('tenantId');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;