// Ubicación: frontend/src/services/api.js
import axios from 'axios';
 

// Función que crea un cliente de API para un inquilino específico
const getApiClient = (tenantId) => {
    // Construimos la URL base dinámicamente
    // En producción, esto podría ser `https://${tenantId}.misistema.com/api`
    const baseURL = `http://${tenantId}.localhost:8080/api/app`;

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


// --- AUTH ---
export const loginRequest = (tenantId, credentials) => {
    const loginApi = axios.create({
        baseURL: `http://${tenantId}.localhost:8080/api`
    });
    return loginApi.post('/auth/login', credentials);
};


// --- NUEVAS FUNCIONES DE API ---

// PRODUCTOS
export const getProducts = (tenantId) => getApiClient(tenantId).get('/productos');
export const createProduct = (tenantId, productData) => getApiClient(tenantId).post('/productos', productData);

// CLIENTES
export const getClients = (tenantId) => getApiClient(tenantId).get('/clientes');
export const createClient = (tenantId, clientData) => getApiClient(tenantId).post('/clientes', clientData);

// VENTAS
export const createSale = (tenantId, saleData) => getApiClient(tenantId).post('/ventas', saleData);

// CAJA
export const getIncomes = (tenantId) => getApiClient(tenantId).get('/caja/ingresos');
export const createIncome = (tenantId, incomeData) => getApiClient(tenantId).post('/caja/ingresos', incomeData);
export const getExpenses = (tenantId) => getApiClient(tenantId).get('/caja/egresos');
export const createExpense = (tenantId, expenseData) => getApiClient(tenantId).post('/caja/egresos', expenseData);


export default getApiClient;