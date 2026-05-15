<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a company via api', function () {
    $payload = [
        'name'     => 'Standard Group Test',
        'email'    => 'test@standard.local',
        'phone'    => '01711223344',
        'status'   => 'active',
        'currency' => 'BDT',
        'timezone' => 'Asia/Dhaka'
    ];

    $response = $this->postJson('/api/core/companies', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('status', 'Success');

    $this->assertDatabaseHas('companies', [
        'email' => 'test@standard.local'
    ]);
});

it('fails to create company without name', function () {
    $response = $this->postJson('/api/core/companies', [
        'email' => 'no-name@test.local'
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});
