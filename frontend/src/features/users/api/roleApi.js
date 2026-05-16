import apiClient from '../../../services/apiClient';

export const roleApi = {
    getRoles: async () => {
        try {
            const response = await apiClient.get('/core/roles');
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    },
    createRole: async (data) => {
        return await apiClient.post('/core/roles', data);
    },
    updateRole: async (id, data) => {
        return await apiClient.put(`/core/roles/${id}`, data);
    },
    deleteRole: async (id) => {
        return await apiClient.delete(`/core/roles/${id}`);
    },
    getRole: async (id) => {
        return await apiClient.get(`/core/roles/${id}`);
    }
};

export const permissionApi = {
    getPermissions: async () => {
        try {
            const response = await apiClient.get('/core/permissions');
            return response.data;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    },
    createPermission: async (data) => {
        return await apiClient.post('/core/permissions', data);
    },
    updatePermission: async (id, data) => {
        return await apiClient.put(`/core/permissions/${id}`, data);
    },
    deletePermission: async (id) => {
        return await apiClient.delete(`/core/permissions/${id}`);
    },
    bulkDeletePermissions: async (type, value) => {
        return await apiClient.post('/core/permissions/bulk-delete', { type, value });
    }
};
