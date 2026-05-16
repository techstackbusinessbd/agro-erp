<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;



class PermissionController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        try {
            $permissions = Permission::orderBy('name', 'asc')->get()->groupBy('group')->map(function ($groupItems) {
                return $groupItems->groupBy(function ($item) {
                    $item->group = $item->group ?? 'Other';
                    $parts = explode('.', $item->name);
                    return count($parts) > 1 ? $parts[0] : 'general';
                });
            });
            
            return $this->successResponse($permissions, 'Permissions retrieved successfully.');
        } catch (\Exception $e) {
            Log::error('Error fetching permissions: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve permissions list.', 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        // Support both single object and array of permissions
        $permissionsData = $request->has('permissions') ? $request->permissions : [$request->all()];

        try {
            DB::beginTransaction();
            $createdPermissions = [];
            $superAdmin = Role::where('name', 'Super Admin')->first();

            foreach ($permissionsData as $permData) {
                // Basic validation for each item
                if (empty($permData['name']) || empty($permData['group'])) continue;

                // Check if already exists to avoid 500
                if (Permission::where('name', $permData['name'])->exists()) continue;

                $permission = Permission::create([
                    'name' => strtolower($permData['name']),
                    'group' => $permData['group'],
                    'guard_name' => 'web'
                ]);

                if ($superAdmin) {
                    $superAdmin->givePermissionTo($permission);
                }
                
                $createdPermissions[] = $permission;
            }

            DB::commit();

            // Clear Spatie Permission Cache
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return $this->successResponse($createdPermissions, count($createdPermissions) . ' permissions processed.', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating permissions: ' . $e->getMessage());
            return $this->errorResponse('Failed to create permissions. ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'name' => 'required|unique:permissions,name,' . $id,
            'group' => 'required|string',
        ]);

        try {
            $permission = Permission::findOrFail($id);
            $permission->update([
                'name' => $request->name,
                'group' => $request->group
            ]);

            return $this->successResponse($permission, 'Permission updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating permission: ' . $e->getMessage());
            return $this->errorResponse('Failed to update permission.', 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $permission = Permission::findOrFail($id);
            $permission->delete();
            return $this->successResponse(null, 'Permission deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting permission: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete permission.', 500);
        }
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:group,sub_group',
            'value' => 'required|string',
        ]);

        try {
            $query = Permission::query();
            
            if ($request->type === 'group') {
                $query->where('group', $request->value);
            } else {
                // For sub_group, we check the prefix before the dot
                $query->where('name', 'like', $request->value . '.%');
            }

            $count = $query->count();
            $query->delete();

            return $this->successResponse(null, "Successfully deleted {$count} permissions in the selected {$request->type}.");
        } catch (\Exception $e) {
            Log::error('Error bulk deleting permissions: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete permissions.', 500);
        }
    }
}

