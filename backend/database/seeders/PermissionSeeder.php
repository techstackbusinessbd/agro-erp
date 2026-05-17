<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions with groups
        $permissionGroups = [
            'User Management' => [
                'users.view', 'users.create', 'users.edit', 'users.delete',
                'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            ],
            'Company Management' => [
                'companies.view', 'companies.create', 'companies.edit', 'companies.delete',
            ],
            'Branch Management' => [
                'branches.view', 'branches.create', 'branches.edit', 'branches.delete',
            ],
            'Dashboard' => [
                'dashboard.view', 'reports.view',
            ],
            'System Settings' => [
                'settings.manage',
            ],
            'Master Data' => [
                'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
                'uoms.view', 'uoms.create', 'uoms.edit', 'uoms.delete',
            ],
            'Manage Permission' => [
                'permission.manage',
            ],
        ];

        foreach ($permissionGroups as $group => $perms) {
            foreach ($perms as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission, 'guard_name' => 'web'],
                    ['group' => $group]
                );
            }
        }

        // Create Roles and Assign Permissions
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions([
            'users.view', 'users.create', 'users.edit',
            'branches.view', 'branches.create', 'branches.edit',
            'dashboard.view', 'reports.view'
        ]);

        $staff = Role::firstOrCreate(['name' => 'Staff', 'guard_name' => 'web']);
        $staff->syncPermissions(['dashboard.view', 'users.view']);

        // Assign Role to existing Admin User
        $user = User::where('username', 'superadmin')->first();
        if ($user) {
            $user->assignRole($superAdmin);
        }
    }
}
