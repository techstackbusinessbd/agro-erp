<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Modules\Core\Models\Company::create([
            'name' => 'Enterprise Agro ERP',
            'email' => 'admin@agroerp.com',
            'phone' => '+880 1234 567890',
            'address' => 'Dhaka, Bangladesh',
            'status' => \App\Enums\GeneralStatus::ACTIVE->value,
            'currency' => 'BDT',
            'timezone' => 'Asia/Dhaka',
        ]);
    }
}
