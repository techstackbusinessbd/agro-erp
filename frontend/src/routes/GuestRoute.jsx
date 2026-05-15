import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function GuestRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loader-container"><div className="material-spinner"></div></div>;
    }

    // If user is logged in, redirect them away from Guest routes (like /login)
    return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
