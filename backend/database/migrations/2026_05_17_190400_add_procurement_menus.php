<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Modules\Core\Models\Menu;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Find the "Warehouse & Territory" menu parent
        $warehouseMenu = Menu::where('label', 'Warehouse & Territory')->first();

        if ($warehouseMenu) {
            // 1. Suppliers Menu
            Menu::updateOrCreate(
                ['label' => 'Suppliers & Vendors', 'path' => '/suppliers'],
                [
                    'icon' => 'Users',
                    'parent_id' => $warehouseMenu->id,
                    'order' => 6,
                    'permission' => 'warehouses.view',
                    'is_active' => true,
                ]
            );

            // 2. Purchases Menu
            Menu::updateOrCreate(
                ['label' => 'Purchase & Imports', 'path' => '/procurements'],
                [
                    'icon' => 'Briefcase',
                    'parent_id' => $warehouseMenu->id,
                    'order' => 7,
                    'permission' => 'warehouses.view',
                    'is_active' => true,
                ]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Menu::whereIn('path', ['/suppliers', '/procurements'])->delete();
    }
};
