<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'username'  => 'johndoe',
        'email'     => 'john@example.com',
        'password'  => Hash::make('secret123'),
        'is_active' => true,
    ]);
});

it('can login with email and receive sanctum token', function () {
    $payload = [
        'login'    => 'john@example.com',
        'password' => 'secret123',
    ];

    $response = $this->postJson('/api/auth/login', $payload);

    $response->assertStatus(200)
        ->assertJsonPath('status', 'Success')
        ->assertJsonStructure([
            'data' => [
                'user' => ['id', 'email', 'username'],
                'token'
            ]
        ]);
});

it('can login with username and receive sanctum token', function () {
    $payload = [
        'login'    => 'johndoe',
        'password' => 'secret123',
    ];

    $response = $this->postJson('/api/auth/login', $payload);

    $response->assertStatus(200)
        ->assertJsonPath('status', 'Success')
        ->assertJsonStructure(['data' => ['token']]);
});

it('fails to login with wrong password and returns standard error format', function () {
    $payload = [
        'login'    => 'john@example.com',
        'password' => 'wrongpassword',
    ];

    $response = $this->postJson('/api/auth/login', $payload);

    // Should return 422 Unprocessable Entity for validation failures
    $response->assertStatus(422)
        ->assertJsonPath('status', 'Error')
        ->assertJsonStructure(['errors' => ['login']]);
});

it('fails to login if user is inactive', function () {
    $this->user->update(['is_active' => false]);

    $payload = [
        'login'    => 'john@example.com',
        'password' => 'secret123',
    ];

    $response = $this->postJson('/api/auth/login', $payload);

    $response->assertStatus(422)
        ->assertJsonPath('status', 'Error')
        ->assertJsonPath('errors.login.0', 'This account is deactivated.');
});

it('can logout and revoke token', function () {
    Sanctum::actingAs($this->user);

    $response = $this->postJson('/api/auth/logout');

    $response->assertStatus(200)
        ->assertJsonPath('status', 'Success')
        ->assertJsonPath('message', 'Logged out successfully.');
});
