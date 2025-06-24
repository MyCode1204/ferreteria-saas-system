import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // URL base para endpoints generales y de superadmin

const generalApi = axios.create({
    baseURL: BASE_URL,
});

// Función para verificar si un tenant existe
export const checkTenantExists = (tenantId) => {
    return generalApi.get(`/general/tenants/exists/${tenantId}`);
};

// Función para obtener la lista de empresas
export const getTenants = () => {
    return generalApi.get('/general/tenants');
};

// Función para el login del superadmin
export const superAdminLogin = (credentials) => {
    // Nota: El login de superadmin podría tener su propio endpoint
    // pero por simplicidad, asumimos que se distingue por el rol en el backend.
    // O mejor, vamos a darle un endpoint propio para más claridad.
    // (Asegúrate de tener un endpoint /api/auth/superadmin/login en el backend)
    return generalApi.post('/auth/superadmin/login', credentials);
};

// Función para crear un nuevo tenant (requiere token de superadmin)
export const createTenant = (tenantData, token) => {
    return generalApi.post('/superadmin/tenants', tenantData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};