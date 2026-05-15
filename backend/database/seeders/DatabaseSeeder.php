<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);
        
        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'email' => 'admin@agroerp.com',
            'password' => \Illuminate\Support\Facades\Hash::make('secret123'),
        ]);

        $superAdmin->assignRole(\App\Enums\UserRole::SUPER_ADMIN->value);
    }
}
