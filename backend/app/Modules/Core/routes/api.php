<?php

use App\Modules\Core\Controllers\BranchController;
use App\Modules\Core\Controllers\CompanyController;
use App\Modules\Core\Controllers\UserController;
use App\Modules\Core\Controllers\MenuController;
use App\Modules\Core\Controllers\RoleController;
use App\Modules\Core\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

// Public Settings Route
Route::get('core/app-settings', [\App\Modules\Core\Controllers\CompanyController::class, 'appSettings']);

// এই ফাইলের সব রাউট অটোমেটিক 'api' প্রিফিক্স পাবে (আমরা bootstrap/app.php তে সেট করে দেব)
Route::prefix('core')->middleware('auth:sanctum')->group(function () {

    // Company Routes (Settings)
    Route::apiResource('companies', CompanyController::class)->middleware('permission:settings.manage');

    // Branch Routes
    Route::apiResource('branches', BranchController::class)->middleware('permission:settings.manage');

    // User Routes
    Route::get('users', [UserController::class, 'index'])->middleware('permission:users.view');
    Route::post('users', [UserController::class, 'store'])->middleware('permission:users.create');
    Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission:users.view');
    Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:users.edit');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete');
    Route::get('users/{id}/permissions', [UserController::class, 'getPermissions'])->middleware('permission:permission.manage');
    Route::post('users/{id}/permissions', [UserController::class, 'syncPermissions'])->middleware('permission:permission.manage');

    // Role & Permission Routes
    Route::get('roles', [RoleController::class, 'index'])->middleware('permission:roles.view');
    Route::post('roles', [RoleController::class, 'store'])->middleware('permission:roles.create');
    Route::get('roles/{role}', [RoleController::class, 'show'])->middleware('permission:roles.view');
    Route::put('roles/{role}', [RoleController::class, 'update'])->middleware('permission:roles.edit');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:roles.delete');
    
    Route::post('permissions/bulk-delete', [PermissionController::class, 'bulkDestroy'])->middleware('permission:permission.manage');
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:roles.view|permission.manage');
    Route::post('permissions', [PermissionController::class, 'store'])->middleware('permission:permission.manage');
    Route::put('permissions/{id}', [PermissionController::class, 'update'])->middleware('permission:permission.manage');
    Route::delete('permissions/{id}', [PermissionController::class, 'destroy'])->middleware('permission:permission.manage');

    // Sidebar Menu Route
    Route::get('sidebar-menu', [MenuController::class, 'sidebar']);
});
