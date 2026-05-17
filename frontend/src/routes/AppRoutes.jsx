import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

import DashboardOverview from '../features/dashboard/pages/DashboardOverview';
import ProfilePage from '../features/users/pages/ProfilePage';
import UserListPage from '../features/users/pages/UserListPage';
import RoleListPage from '../features/users/pages/RoleListPage';
import PermissionListPage from '../features/users/pages/PermissionListPage';
import CategoryListPage from '../features/master-data/pages/CategoryListPage';
import UomListPage from '../features/master-data/pages/UomListPage';

import UnauthorizedPage from '../components/common/UnauthorizedPage';

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
                    <Route element={<ProtectedRoute permission="dashboard.view" />}>
                        <Route path="/dashboard" element={<DashboardOverview />} />
                    </Route>
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Permission Based Routes */}
                    <Route element={<ProtectedRoute permission="users.view" />}>
                        <Route path="/users" element={<UserListPage />} />
                    </Route>
                    
                    <Route element={<ProtectedRoute permission="roles.view" />}>
                        <Route path="/roles" element={<RoleListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="permission.manage" />}>
                        <Route path="/permissions" element={<PermissionListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="categories.view" />}>
                        <Route path="/categories" element={<CategoryListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="uoms.view" />}>
                        <Route path="/uoms" element={<UomListPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
