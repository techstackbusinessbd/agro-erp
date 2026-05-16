<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->get();
        return $this->successResponse($roles, 'Roles retrieved successfully.');
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);
        
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return $this->successResponse($role->load('permissions'), 'Role created successfully.', 201);
    }

    public function show(Role $role): JsonResponse
    {
        return $this->successResponse($role->load('permissions'), 'Role details retrieved successfully.');
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        if ($role->name === 'Super Admin') {
            abort(403, 'System Super Admin role cannot be modified.');
        }

        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'array'
        ]);

        $role->update(['name' => $request->name]);
        
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return $this->successResponse($role->load('permissions'), 'Role updated successfully.');
    }

    public function destroy(Role $role): JsonResponse
    {
        if ($role->name === 'Super Admin') {
            abort(403, 'System Super Admin role cannot be deleted.');
        }

        $role->delete();
        return $this->successResponse(null, 'Role deleted successfully.');
    }
}
