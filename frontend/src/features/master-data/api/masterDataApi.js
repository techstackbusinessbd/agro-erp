import apiClient from '../../../services/apiClient';

export const masterDataApi = {
    // Categories CRUD
    getCategories: async () => {
        try {
            const response = await apiClient.get('/master-data/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },
    createCategory: async (data) => {
        return await apiClient.post('/master-data/categories', data);
    },
    updateCategory: async (id, data) => {
        return await apiClient.put(`/master-data/categories/${id}`, data);
    },
    deleteCategory: async (id) => {
        return await apiClient.delete(`/master-data/categories/${id}`);
    },

    // UOMs CRUD
    getUoms: async () => {
        try {
            const response = await apiClient.get('/master-data/uoms');
            return response.data;
        } catch (error) {
            console.error('Error fetching UOMs:', error);
            throw error;
        }
    },
    createUom: async (data) => {
        return await apiClient.post('/master-data/uoms', data);
    },
    updateUom: async (id, data) => {
        return await apiClient.put(`/master-data/uoms/${id}`, data);
    },
    deleteUom: async (id) => {
        return await apiClient.delete(`/master-data/uoms/${id}`);
    }
};
