<?php

use App\Modules\MasterData\Controllers\UomController;
use App\Modules\MasterData\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('master-data')->middleware('auth:sanctum')->group(function () {
    // Categories CRUD
    Route::get('categories', [CategoryController::class, 'index'])->middleware('permission:categories.view');
    Route::post('categories', [CategoryController::class, 'store'])->middleware('permission:categories.create');
    Route::get('categories/{category}', [CategoryController::class, 'show'])->middleware('permission:categories.view');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->middleware('permission:categories.edit');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->middleware('permission:categories.delete');

    // UOMs CRUD
    Route::get('uoms', [UomController::class, 'index'])->middleware('permission:uoms.view');
    Route::post('uoms', [UomController::class, 'store'])->middleware('permission:uoms.create');
    Route::get('uoms/{uom}', [UomController::class, 'show'])->middleware('permission:uoms.view');
    Route::put('uoms/{uom}', [UomController::class, 'update'])->middleware('permission:uoms.edit');
    Route::delete('uoms/{uom}', [UomController::class, 'destroy'])->middleware('permission:uoms.delete');
});
