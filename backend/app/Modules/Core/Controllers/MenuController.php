<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Models\Menu;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    use ApiResponse;

    public function sidebar(): JsonResponse
    {
        $user = auth()->user();
        
        $menus = Menu::whereNull('parent_id')
            ->where('is_active', true)
            ->with(['children' => function ($query) {
                $query->where('is_active', true)->orderBy('order')->with(['children' => function ($q) {
                    $q->where('is_active', true)->orderBy('order');
                }]);
            }])
            ->orderBy('order')
            ->get();

        // Helper function for recursive filtering
        $filterMenus = function ($menus) use ($user, &$filterMenus) {
            return $menus->filter(function ($menu) use ($user, $filterMenus) {
                // Super Admin sees everything
                if ($user->hasRole('Super Admin')) {
                    return true;
                }

                // Recursive filtering for children first
                if ($menu->relationLoaded('children') && $menu->children->isNotEmpty()) {
                    $menu->setRelation('children', $filterMenus($menu->children)->values());
                }

                // If it's a header, hide it if it has no children (after filtering)
                if ($menu->type === 'header') {
                    return $menu->children->isNotEmpty();
                }

                // If no permission is required, show it
                if (!$menu->permission) {
                    return true;
                }

                // Check if user has permission
                if ($user->hasPermissionTo($menu->permission)) {
                    return true;
                }

                return false;
            })->values();
        };

        $filteredMenus = $filterMenus($menus);

        return $this->successResponse($filteredMenus, 'Sidebar menus retrieved successfully.');
    }
}
