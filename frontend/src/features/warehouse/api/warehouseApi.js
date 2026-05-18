import apiClient from '../../../services/apiClient';

export const warehouseApi = {
    // Warehouses CRUD
    getWarehouses: async () => {
        const response = await apiClient.get('/warehouse/warehouses');
        return response.data;
    },
    createWarehouse: async (data) => {
        return await apiClient.post('/warehouse/warehouses', data);
    },
    updateWarehouse: async (id, data) => {
        return await apiClient.put(`/warehouse/warehouses/${id}`, data);
    },
    deleteWarehouse: async (id) => {
        return await apiClient.delete(`/warehouse/warehouses/${id}`);
    },

    // Territories CRUD
    getTerritories: async () => {
        const response = await apiClient.get('/warehouse/territories');
        return response.data;
    },
    createTerritory: async (data) => {
        return await apiClient.post('/warehouse/territories', data);
    },
    updateTerritory: async (id, data) => {
        return await apiClient.put(`/warehouse/territories/${id}`, data);
    },
    deleteTerritory: async (id) => {
        return await apiClient.delete(`/warehouse/territories/${id}`);
    },

    // Stocks CRUD
    getStocks: async () => {
        const response = await apiClient.get('/warehouse/stocks');
        return response.data;
    },
    adjustStock: async (data) => {
        return await apiClient.post('/warehouse/stocks/adjust', data);
    },

    // Stock Transfer Orders (STO)
    getTransfers: async () => {
        const response = await apiClient.get('/warehouse/transfers');
        return response.data;
    },
    getTransferById: async (id) => {
        const response = await apiClient.get(`/warehouse/transfers/${id}`);
        return response.data;
    },
    createTransfer: async (data) => {
        return await apiClient.post('/warehouse/transfers', data);
    },
    approveTransfer: async (id) => {
        return await apiClient.post(`/warehouse/transfers/${id}/approve`);
    },
    shipTransfer: async (id, data) => {
        return await apiClient.post(`/warehouse/transfers/${id}/ship`, data);
    },
    receiveTransfer: async (id, data) => {
        return await apiClient.post(`/warehouse/transfers/${id}/receive`, data);
    },
    cancelTransfer: async (id) => {
        return await apiClient.post(`/warehouse/transfers/${id}/cancel`);
    },

    // Suppliers CRUD
    getSuppliers: async () => {
        const response = await apiClient.get('/warehouse/suppliers');
        return response.data;
    },
    createSupplier: async (data) => {
        return await apiClient.post('/warehouse/suppliers', data);
    },
    updateSupplier: async (id, data) => {
        return await apiClient.put(`/warehouse/suppliers/${id}`, data);
    },
    deleteSupplier: async (id) => {
        return await apiClient.delete(`/warehouse/suppliers/${id}`);
    },

    // Purchases / Procurement Ledger
    getPurchases: async () => {
        const response = await apiClient.get('/warehouse/purchases');
        return response.data;
    },
    createPurchase: async (data) => {
        return await apiClient.post('/warehouse/purchases', data);
    },
    receivePurchase: async (id) => {
        return await apiClient.post(`/warehouse/purchases/${id}/receive`);
    },

    // Formulation Recipes (BOM)
    getRecipes: async () => {
        const response = await apiClient.get('/warehouse/recipes');
        return response.data;
    },
    createRecipe: async (data) => {
        return await apiClient.post('/warehouse/recipes', data);
    },
    updateRecipe: async (id, data) => {
        return await apiClient.put(`/warehouse/recipes/${id}`, data);
    },
    deleteRecipe: async (id) => {
        return await apiClient.delete(`/warehouse/recipes/${id}`);
    },

    // Production Orders
    getProductions: async () => {
        const response = await apiClient.get('/warehouse/productions');
        return response.data;
    },
    createProduction: async (data) => {
        return await apiClient.post('/warehouse/productions', data);
    },
    startProduction: async (id, data) => {
        return await apiClient.post(`/warehouse/productions/${id}/start`, data);
    },
    completeProduction: async (id, data) => {
        return await apiClient.post(`/warehouse/productions/${id}/complete`, data);
    },
    cancelProduction: async (id) => {
        return await apiClient.post(`/warehouse/productions/${id}/cancel`);
    },
};

