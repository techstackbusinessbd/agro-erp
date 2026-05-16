import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../features/auth/api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const response = await authApi.getMe();
            if (response.status === 'Success') {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        if (response.status === 'Success') {
            await loadUser(); // Fetch user data after successful login
        }
        return response;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
        }
    };

    const hasPermission = (permission) => {
        return user?.all_permissions?.includes(permission) || user?.roles?.includes('Super Admin');
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role) || user?.roles?.includes('Super Admin');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
