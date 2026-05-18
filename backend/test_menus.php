<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('username', 'superadmin')->first();
auth()->login($user);

$menus = App\Modules\Core\Models\Menu::whereNull('parent_id')
    ->where('is_active', true)
    ->with(['children' => function ($query) {
        $query->where('is_active', true)->orderBy('order')->with(['children' => function ($q) {
            $q->where('is_active', true)->orderBy('order');
        }]);
    }])
    ->orderBy('order')
    ->get();

$filterMenus = function ($menus) use ($user, &$filterMenus) {
    return $menus->filter(function ($menu) use ($user, $filterMenus) {
        if ($user->hasRole('Super Admin')) {
            return true;
        }
        if ($menu->relationLoaded('children') && $menu->children->isNotEmpty()) {
            $menu->setRelation('children', $filterMenus($menu->children)->values());
        }
        if ($menu->type === 'header') {
            return $menu->children->isNotEmpty();
        }
        if (!$menu->permission) {
            return true;
        }
        if ($user->hasPermissionTo($menu->permission)) {
            return true;
        }
        return false;
    })->values();
};

$filteredMenus = $filterMenus($menus);
echo json_encode($filteredMenus, JSON_PRETTY_PRINT);
