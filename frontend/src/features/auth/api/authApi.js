import apiClient from '../../../services/apiClient';
import axios from 'axios';

// To get CSRF cookie, we must call the root domain /sanctum/csrf-cookie
// Notice the baseURL is slightly different as it doesn't include /api
const csrfClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    withXSRFToken: true,
});

export const authApi = {
    getCsrfCookie: async () => {
        return await csrfClient.get('/sanctum/csrf-cookie');
    },

    login: async (credentials) => {
        await authApi.getCsrfCookie();
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    getMe: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
};
