import apiClient from '../../../services/apiClient';

export const menuApi = {
    getSidebarMenu: async () => {
        try {
            const response = await apiClient.get('/core/sidebar-menu');
            return response.data;
        } catch (error) {
            console.error('Error fetching sidebar menu:', error);
            throw error;
        }
    }
};
