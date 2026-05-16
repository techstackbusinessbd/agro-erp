<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,
            PermissionSeeder::class,
            MenuSeeder::class,
        ]);

        // Create initial Super Admin if not exists (PermissionSeeder already handles one but let's be sure)
        $admin = User::firstOrCreate(
            ['username' => 'superadmin'],
            [
                'name' => 'Abdul Khaled',
                'email' => 'superadmin@agroerp.com',
                'password' => '12345678',
                'is_active' => true,
            ]
        );

        $admin->assignRole('Super Admin');
    }
}
