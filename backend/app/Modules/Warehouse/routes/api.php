<?php

use App\Modules\Warehouse\Controllers\WarehouseController;
use App\Modules\Warehouse\Controllers\TerritoryController;
use App\Modules\Warehouse\Controllers\StockController;
use App\Modules\Warehouse\Controllers\StockTransferController;
use App\Modules\Warehouse\Controllers\ProcurementController;
use App\Modules\Warehouse\Controllers\ProductionController;
use Illuminate\Support\Facades\Route;

Route::prefix('warehouse')->middleware('auth:sanctum')->group(function () {

    // Warehouses CRUD
    Route::get('warehouses',              [WarehouseController::class, 'index'])->middleware('permission:warehouses.view');
    Route::post('warehouses',             [WarehouseController::class, 'store'])->middleware('permission:warehouses.create');
    Route::get('warehouses/{warehouse}',  [WarehouseController::class, 'show'])->middleware('permission:warehouses.view');
    Route::put('warehouses/{warehouse}',  [WarehouseController::class, 'update'])->middleware('permission:warehouses.edit');
    Route::delete('warehouses/{warehouse}',[WarehouseController::class, 'destroy'])->middleware('permission:warehouses.delete');

    // Territories CRUD
    Route::get('territories',              [TerritoryController::class, 'index'])->middleware('permission:territories.view');
    Route::post('territories',             [TerritoryController::class, 'store'])->middleware('permission:territories.create');
    Route::get('territories/{territory}',  [TerritoryController::class, 'show'])->middleware('permission:territories.view');
    Route::put('territories/{territory}',  [TerritoryController::class, 'update'])->middleware('permission:territories.edit');
    Route::delete('territories/{territory}',[TerritoryController::class, 'destroy'])->middleware('permission:territories.delete');

    // Inventory Balances (Stocks)
    Route::get('stocks',                   [StockController::class, 'index'])->middleware('permission:warehouses.view');
    Route::post('stocks/adjust',           [StockController::class, 'adjust'])->middleware('permission:warehouses.edit');

    // Stock Transfer Orders (STO)
    Route::get('transfers',                [StockTransferController::class, 'index'])->middleware('permission:warehouses.view');
    Route::get('transfers/{transfer}',     [StockTransferController::class, 'show'])->middleware('permission:warehouses.view');
    Route::post('transfers',               [StockTransferController::class, 'store'])->middleware('permission:warehouses.create');
    Route::post('transfers/{transfer}/approve', [StockTransferController::class, 'approve'])->middleware('permission:warehouses.edit');
    Route::post('transfers/{transfer}/ship',    [StockTransferController::class, 'ship'])->middleware('permission:warehouses.edit');
    Route::post('transfers/{transfer}/receive', [StockTransferController::class, 'receive'])->middleware('permission:warehouses.edit');
    Route::post('transfers/{transfer}/cancel',  [StockTransferController::class, 'cancel'])->middleware('permission:warehouses.edit');

    // Suppliers CRUD
    Route::get('suppliers',                [ProcurementController::class, 'indexSuppliers'])->middleware('permission:warehouses.view');
    Route::post('suppliers',               [ProcurementController::class, 'storeSupplier'])->middleware('permission:warehouses.create');
    Route::put('suppliers/{id}',           [ProcurementController::class, 'updateSupplier'])->middleware('permission:warehouses.edit');
    Route::delete('suppliers/{id}',        [ProcurementController::class, 'destroySupplier'])->middleware('permission:warehouses.delete');

    // Purchases / Procurement Ledger
    Route::get('purchases',                [ProcurementController::class, 'indexPurchases'])->middleware('permission:warehouses.view');
    Route::post('purchases',               [ProcurementController::class, 'storePurchase'])->middleware('permission:warehouses.create');
    Route::post('purchases/{id}/receive',  [ProcurementController::class, 'receivePurchase'])->middleware('permission:warehouses.edit');

    // Formulation Recipes (BOM)
    Route::get('recipes',                  [ProductionController::class, 'indexRecipes'])->middleware('permission:warehouses.view');
    Route::post('recipes',                 [ProductionController::class, 'storeRecipe'])->middleware('permission:warehouses.create');
    Route::put('recipes/{id}',             [ProductionController::class, 'updateRecipe'])->middleware('permission:warehouses.edit');
    Route::delete('recipes/{id}',          [ProductionController::class, 'destroyRecipe'])->middleware('permission:warehouses.delete');

    // Production Orders
    Route::get('productions',                          [ProductionController::class, 'indexProductions'])->middleware('permission:warehouses.view');
    Route::post('productions',                         [ProductionController::class, 'storeProduction'])->middleware('permission:warehouses.create');
    Route::post('productions/{id}/start',              [ProductionController::class, 'startProduction'])->middleware('permission:warehouses.edit');
    Route::post('productions/{id}/complete',           [ProductionController::class, 'completeProduction'])->middleware('permission:warehouses.edit');
    Route::post('productions/{id}/cancel',             [ProductionController::class, 'cancelProduction'])->middleware('permission:warehouses.edit');
});

