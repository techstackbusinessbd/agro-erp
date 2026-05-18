<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$m = App\Modules\Core\Models\Menu::where('label', 'Manufacturing')->first();
$m->update(['type' => 'item', 'icon' => 'Factory', 'permission' => 'warehouses.view']);

App\Modules\Core\Models\Menu::whereIn('label', ['BOM Recipes', 'Batch Production'])
    ->update([
        'parent_id' => $m->id, 
        'order' => \DB::raw("CASE WHEN label = 'BOM Recipes' THEN 1 ELSE 2 END")
    ]);
echo "Menu fixed\n";
