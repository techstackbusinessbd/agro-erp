<?php

use Illuminate\Database\Migrations\Migration;
use App\Modules\Core\Models\Menu;

return new class extends Migration
{
    public function up(): void
    {
        // Find the "Warehouse & Territory" menu parent, or maybe create a "Manufacturing" header?
        // Let's create a "Manufacturing" menu parent
        $manufacturingMenu = Menu::updateOrCreate(
            ['label' => 'Manufacturing', 'type' => 'header'],
            ['order' => 8]
        );

        Menu::updateOrCreate(
            ['label' => 'BOM Recipes', 'path' => '/recipes'],
            [
                'icon' => 'BookOpen',
                'parent_id' => null,
                'order' => 9,
                'permission' => 'warehouses.view',
                'is_active' => true,
            ]
        );

        Menu::updateOrCreate(
            ['label' => 'Batch Production', 'path' => '/productions'],
            [
                'icon' => 'Factory',
                'parent_id' => null,
                'order' => 10,
                'permission' => 'warehouses.view',
                'is_active' => true,
            ]
        );
    }

    public function down(): void
    {
        Menu::whereIn('path', ['/recipes', '/productions'])->delete();
        Menu::where('label', 'Manufacturing')->where('type', 'header')->delete();
    }
};
