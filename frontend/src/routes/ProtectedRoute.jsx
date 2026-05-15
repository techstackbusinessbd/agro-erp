import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loader-container"><div className="material-spinner"></div></div>;
    }

    // If user is not logged in, redirect them to login page
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
