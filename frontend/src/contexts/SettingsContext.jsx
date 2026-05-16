import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        name: 'Agro ERP',
        short_name: 'Agro ERP',
        logo: null,
        loading: true
    });

    const fetchSettings = async () => {
        try {
            const response = await apiClient.get('/core/app-settings');
            if (response.data.status === 'Success') {
                const data = response.data.data;
                setSettings({
                    name: data.name,
                    short_name: data.name.split(' ')[0] || 'Agro',
                    logo: data.logo,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Failed to fetch app settings:', error);
            setSettings(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};
