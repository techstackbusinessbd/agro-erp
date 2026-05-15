import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

import DashboardOverview from '../features/dashboard/pages/DashboardOverview';
import ProfilePage from '../features/users/pages/ProfilePage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Guest Routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected Routes (Admin Layout) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<DashboardOverview />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Add more routes like /users, /branches here */}
                </Route>
            </Route>
        </Routes>
    );
}
