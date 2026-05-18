import apiClient from '../../../services/apiClient';

export const masterDataApi = {
    // ─── Categories ───────────────────────────────────────────────────────────
    getCategories: async () => {
        const response = await apiClient.get('/master-data/categories');
        return response.data;
    },
    createCategory: async (data) => apiClient.post('/master-data/categories', data),
    updateCategory: async (id, data) => apiClient.put(`/master-data/categories/${id}`, data),
    deleteCategory: async (id) => apiClient.delete(`/master-data/categories/${id}`),

    // ─── UOMs ─────────────────────────────────────────────────────────────────
    getUoms: async () => {
        const response = await apiClient.get('/master-data/uoms');
        return response.data;
    },
    createUom: async (data) => apiClient.post('/master-data/uoms', data),
    updateUom: async (id, data) => apiClient.put(`/master-data/uoms/${id}`, data),
    deleteUom: async (id) => apiClient.delete(`/master-data/uoms/${id}`),

    // ─── Products ─────────────────────────────────────────────────────────────
    getProducts: async () => {
        const response = await apiClient.get('/master-data/products');
        return response.data;
    },
    getProduct: async (id) => {
        const response = await apiClient.get(`/master-data/products/${id}`);
        return response.data;
    },
    createProduct: async (data) => apiClient.post('/master-data/products', data),
    updateProduct: async (id, data) => apiClient.put(`/master-data/products/${id}`, data),
    deleteProduct: async (id) => apiClient.delete(`/master-data/products/${id}`),

    // ─── Product Variants ─────────────────────────────────────────────────────
    getVariants: async (productId) => {
        const response = await apiClient.get(`/master-data/products/${productId}/variants`);
        return response.data;
    },
    createVariant: async (productId, data) =>
        apiClient.post(`/master-data/products/${productId}/variants`, data),
    updateVariant: async (productId, variantId, data) =>
        apiClient.put(`/master-data/products/${productId}/variants/${variantId}`, data),
    deleteVariant: async (productId, variantId) =>
        apiClient.delete(`/master-data/products/${productId}/variants/${variantId}`),
};
