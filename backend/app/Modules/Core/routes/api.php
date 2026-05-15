<?php

use App\Modules\Core\Controllers\BranchController;
use App\Modules\Core\Controllers\CompanyController;
use App\Modules\Core\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// এই ফাইলের সব রাউট অটোমেটিক 'api' প্রিফিক্স পাবে (আমরা bootstrap/app.php তে সেট করে দেব)
Route::prefix('core')->middleware('auth:sanctum')->group(function () {

    // Company Routes
    Route::apiResource('companies', CompanyController::class);

    // Branch Routes
    Route::apiResource('branches', BranchController::class);

    // User Routes
    Route::apiResource('users', UserController::class);
});
