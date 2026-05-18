<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Auth\Controllers\AuthController;
use App\Modules\Auth\Controllers\SecurityController;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('audit-logs', [SecurityController::class, 'auditLogs']);
        Route::get('login-histories', [SecurityController::class, 'loginHistories']);
    });
});
