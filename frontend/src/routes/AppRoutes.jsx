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
import AuditLogsPage from '../features/users/pages/AuditLogsPage';
import CategoryListPage from '../features/master-data/pages/CategoryListPage';
import UomListPage from '../features/master-data/pages/UomListPage';
import ProductListPage from '../features/master-data/pages/ProductListPage';
import WarehouseListPage from '../features/warehouse/pages/WarehouseListPage';
import TerritoryListPage from '../features/warehouse/pages/TerritoryListPage';
import DepotListPage from '../features/warehouse/pages/DepotListPage';
import WarehouseStockPage from '../features/warehouse/pages/WarehouseStockPage';
import StockTransferPage from '../features/warehouse/pages/StockTransferPage';
import SupplierListPage from '../features/warehouse/pages/SupplierListPage';
import PurchaseListPage from '../features/warehouse/pages/PurchaseListPage';
import RecipeListPage from '../features/warehouse/pages/RecipeListPage';
import ProductionListPage from '../features/warehouse/pages/ProductionListPage';
import SettingsCompanyPage from '../features/dashboard/pages/SettingsCompanyPage';

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
                    <Route path="/settings/general/company" element={<SettingsCompanyPage />} />
                    
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

                    <Route element={<ProtectedRoute permission="audit.view" />}>
                        <Route path="/audits" element={<AuditLogsPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="categories.view" />}>
                        <Route path="/categories" element={<CategoryListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="uoms.view" />}>
                        <Route path="/uoms" element={<UomListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="products.view" />}>
                        <Route path="/products" element={<ProductListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/warehouses" element={<WarehouseListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/depots" element={<DepotListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="territories.view" />}>
                        <Route path="/territories" element={<TerritoryListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/stocks" element={<WarehouseStockPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/transfers" element={<StockTransferPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/suppliers" element={<SupplierListPage />} />
                    </Route>

                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/procurements" element={<PurchaseListPage />} />
                    </Route>

                    {/* Manufacturing & Production */}
                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/recipes" element={<RecipeListPage />} />
                    </Route>
                    <Route element={<ProtectedRoute permission="warehouses.view" />}>
                        <Route path="/productions" element={<ProductionListPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
