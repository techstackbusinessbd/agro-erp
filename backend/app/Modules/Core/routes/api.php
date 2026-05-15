<?php

use App\Modules\Core\Controllers\BranchController;
use App\Modules\Core\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

// এই ফাইলের সব রাউট অটোমেটিক 'api' প্রিফিক্স পাবে (আমরা bootstrap/app.php তে সেট করে দেব)
Route::prefix('core')->group(function () {

    // Company Routes
    Route::apiResource('companies', CompanyController::class);

    // Branch Routes
    Route::apiResource('branches', BranchController::class);
});
