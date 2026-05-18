<?php

use App\Modules\MasterData\Controllers\UomController;
use App\Modules\MasterData\Controllers\CategoryController;
use App\Modules\MasterData\Controllers\ProductController;
use App\Modules\MasterData\Controllers\ProductVariantController;
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

    // Products CRUD
    Route::get('products', [ProductController::class, 'index'])->middleware('permission:products.view');
    Route::post('products', [ProductController::class, 'store'])->middleware('permission:products.create');
    Route::get('products/{product}', [ProductController::class, 'show'])->middleware('permission:products.view');
    Route::put('products/{product}', [ProductController::class, 'update'])->middleware('permission:products.edit');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->middleware('permission:products.delete');

    // Product Variants (nested under products)
    Route::get('products/{product}/variants', [ProductVariantController::class, 'index'])->middleware('permission:products.view');
    Route::post('products/{product}/variants', [ProductVariantController::class, 'store'])->middleware('permission:products.create');
    Route::put('products/{product}/variants/{variant}', [ProductVariantController::class, 'update'])->middleware('permission:products.edit');
    Route::delete('products/{product}/variants/{variant}', [ProductVariantController::class, 'destroy'])->middleware('permission:products.delete');
});
