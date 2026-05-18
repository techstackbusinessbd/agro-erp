<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Core\Models\Menu;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Main Header
        $mainHeader = Menu::updateOrCreate(
            ['label' => 'Main', 'type' => 'header'],
            ['order' => 1]
        );

        Menu::updateOrCreate(
            ['label' => 'Dashboard', 'path' => '/dashboard'],
            ['icon' => 'LayoutDashboard', 'order' => 2]
        );

        // 2. Administration Header
        Menu::updateOrCreate(
            ['label' => 'Administration', 'type' => 'header'],
            ['order' => 3]
        );

        $userMgmt = Menu::updateOrCreate(
            ['label' => 'User Management'],
            [
                'icon' => 'ShieldCheck',
                'order' => 4,
                'permission' => 'view_users',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Users List', 'path' => '/users'],
            [
                'icon' => 'Users',
                'parent_id' => $userMgmt->id,
                'order' => 1,
                'permission' => 'view_users',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Roles & Permissions', 'path' => '/roles'],
            [
                'icon' => 'Shield',
                'parent_id' => $userMgmt->id,
                'order' => 3,
                'permission' => 'view_roles',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'My Profile', 'path' => '/profile'],
            [
                'icon' => 'User',
                'parent_id' => $userMgmt->id,
                'order' => 2,
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Permissions', 'path' => '/permissions'],
            [
                'icon' => 'Key',
                'parent_id' => $userMgmt->id,
                'order' => 4,
                'permission' => 'permission.manage',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Security Audit Logs', 'path' => '/audits'],
            [
                'icon' => 'ClipboardList',
                'parent_id' => $userMgmt->id,
                'order' => 5,
                'permission' => 'audit.view',
            ]
        );

        // 3. Master Data Menu
        $masterData = Menu::updateOrCreate(
            ['label' => 'Master Data'],
            [
                'icon' => 'Database',
                'order' => 5,
                'permission' => 'categories.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Categories', 'path' => '/categories'],
            [
                'icon' => 'FolderOpen',
                'parent_id' => $masterData->id,
                'order' => 1,
                'permission' => 'categories.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Units (UOM)', 'path' => '/uoms'],
            [
                'icon' => 'Ruler',
                'parent_id' => $masterData->id,
                'order' => 2,
                'permission' => 'uoms.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Products', 'path' => '/products'],
            [
                'icon' => 'Package',
                'parent_id' => $masterData->id,
                'order' => 3,
                'permission' => 'products.view',
            ]
        );

        // 4. Warehouse & Territory Menu
        $warehouseMenu = Menu::updateOrCreate(
            ['label' => 'Warehouse & Territory'],
            [
                'icon' => 'Warehouse',
                'order' => 6,
                'permission' => 'warehouses.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Warehouses', 'path' => '/warehouses'],
            [
                'icon' => 'Building2',
                'parent_id' => $warehouseMenu->id,
                'order' => 1,
                'permission' => 'warehouses.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Depots', 'path' => '/depots'],
            [
                'icon' => 'Store',
                'parent_id' => $warehouseMenu->id,
                'order' => 2,
                'permission' => 'warehouses.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Territory Management', 'path' => '/territories'],
            [
                'icon' => 'Map',
                'parent_id' => $warehouseMenu->id,
                'order' => 3,
                'permission' => 'territories.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Inventory Balances', 'path' => '/stocks'],
            [
                'icon' => 'Boxes',
                'parent_id' => $warehouseMenu->id,
                'order' => 4,
                'permission' => 'warehouses.view',
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Stock Transfers', 'path' => '/transfers'],
            [
                'icon' => 'Truck',
                'parent_id' => $warehouseMenu->id,
                'order' => 5,
                'permission' => 'warehouses.view',
            ]
        );

        // Nested Example (2nd Level)
        $settings = Menu::updateOrCreate(
            ['label' => 'Settings'],
            [
                'icon' => 'Settings',
                'order' => 7,
                'permission' => 'manage_settings',
            ]
        );

        $generalSettings = Menu::updateOrCreate(
            ['label' => 'General Settings', 'path' => '/settings/general'],
            [
                'icon' => 'Settings2',
                'parent_id' => $settings->id,
                'order' => 1,
            ]
        );

        // Nested Example (3rd Level)
        Menu::updateOrCreate(
            ['label' => 'Company Info', 'path' => '/settings/general/company'],
            [
                'icon' => 'Building',
                'parent_id' => $generalSettings->id,
                'order' => 1,
            ]
        );
    }
}
