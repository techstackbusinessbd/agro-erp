<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'manage companies',
            'manage branches',
            'manage users',
            'view reports',
            'manage settings'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // create roles and assign created permissions

        // 1. Super Admin: gets all permissions
        $superAdmin = Role::firstOrCreate(['name' => UserRole::SUPER_ADMIN->value]);
        $superAdmin->givePermissionTo(Permission::all());

        // 2. Company Admin: manage branches, users, and view reports
        $companyAdmin = Role::firstOrCreate(['name' => UserRole::COMPANY_ADMIN->value]);
        $companyAdmin->givePermissionTo(['manage branches', 'manage users', 'view reports']);

        // 3. Manager: manage users within branch, view reports
        $manager = Role::firstOrCreate(['name' => UserRole::MANAGER->value]);
        $manager->givePermissionTo(['manage users', 'view reports']);

        // 4. Staff: very limited
        Role::firstOrCreate(['name' => UserRole::STAFF->value]);
    }
}
