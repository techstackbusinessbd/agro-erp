<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use App\Enums\UserRole;

uses(RefreshDatabase::class);

it('blocks unauthenticated users from accessing core routes with 401 Error', function () {
    $response = $this->getJson('/api/core/users');

    $response->assertStatus(401)
        ->assertJsonPath('status', 'Error')
        ->assertJsonPath('message', 'Unauthenticated');
});

it('returns 403 global error format when user lacks permission', function () {
    
    // Create staff role and user locally to avoid IDE warnings about $this->property
    $staffRole = Role::firstOrCreate(['name' => UserRole::STAFF->value]);
    $staffUser = User::factory()->create();
    $staffUser->assignRole($staffRole);

    // Create a temporary route protected by Spatie middleware
    \Illuminate\Support\Facades\Route::middleware(['auth:sanctum', 'role:super_admin'])->get('/test-role-route', function () {
        return response()->json(['success' => true]);
    });

    // Staff tries to access Super Admin route
    Sanctum::actingAs($staffUser);
    $response = $this->getJson('/test-role-route');

    $response->assertStatus(403)
        ->assertJsonPath('status', 'Error')
        ->assertJsonPath('message', 'User does not have the right roles.');
});
