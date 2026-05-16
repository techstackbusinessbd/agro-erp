import apiClient from '../../../services/apiClient';

export const userApi = {
    getUsers: async (params) => {
        try {
            const response = await apiClient.get('/core/users', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    createUser: async (data) => {
        return await apiClient.post('/core/users', data);
    },
    updateUser: async (id, data) => {
        return await apiClient.put(`/core/users/${id}`, data);
    },
    deleteUser: async (id) => {
        return await apiClient.delete(`/core/users/${id}`);
    },
    getUser: async (id) => {
        return await apiClient.get(`/core/users/${id}`);
    },
    getUserPermissions: async (id) => {
        const response = await apiClient.get(`/core/users/${id}/permissions`);
        return response.data;
    },
    syncUserPermissions: async (id, permissions) => {
        return await apiClient.post(`/core/users/${id}/permissions`, { permissions });
    }
};
