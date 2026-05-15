<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Modules\Core\Models\Company;
use App\Modules\Core\Models\Branch;

uses(RefreshDatabase::class);

beforeEach(function () {
    \Laravel\Sanctum\Sanctum::actingAs(\App\Models\User::factory()->create());
});

it('can fetch all branches', function () {
    $company = Company::factory()->create();
    Branch::factory()->count(3)->create(['company_id' => $company->id]);

    $response = $this->getJson('/api/core/branches');

    $response->assertStatus(200)
        ->assertJsonPath('status', 'Success')
        ->assertJsonCount(3, 'data');
});

it('can create a branch', function () {
    $company = Company::factory()->create();

    $payload = [
        'company_id' => $company->id,
        'name'       => 'Dhaka Main Branch',
        'code'       => 'DHK-001',
        'is_active'  => true,
    ];

    $response = $this->postJson('/api/core/branches', $payload);

    $response->assertStatus(201)
        ->assertJsonPath('status', 'Success')
        ->assertJsonPath('data.name', 'Dhaka Main Branch');

    $this->assertDatabaseHas('branches', [
        'name' => 'Dhaka Main Branch',
        'code' => 'DHK-001'
    ]);
});

it('fails if branch name is duplicate under same company', function () {
    $company = Company::factory()->create();
    
    // Create first branch
    Branch::factory()->create([
        'company_id' => $company->id,
        'name'       => 'Duplicate Branch',
        'code'       => 'BR-01'
    ]);

    // Try to create another branch with same name under same company
    $payload = [
        'company_id' => $company->id,
        'name'       => 'Duplicate Branch',
        'code'       => 'BR-02',
    ];

    $response = $this->postJson('/api/core/branches', $payload);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

it('can update a branch', function () {
    $branch = Branch::factory()->create();

    $payload = [
        'name' => 'Updated Branch Name',
        'is_active' => false,
    ];

    $response = $this->putJson("/api/core/branches/{$branch->id}", $payload);

    $response->assertStatus(200)
        ->assertJsonPath('data.name', 'Updated Branch Name')
        ->assertJsonPath('data.is_active', false);

    $this->assertDatabaseHas('branches', [
        'id' => $branch->id,
        'name' => 'Updated Branch Name',
        'is_active' => false,
    ]);
});

it('can delete a branch', function () {
    $branch = Branch::factory()->create();

    $response = $this->deleteJson("/api/core/branches/{$branch->id}");

    $response->assertStatus(200)
        ->assertJsonPath('status', 'Success');

    $this->assertSoftDeleted('branches', [
        'id' => $branch->id
    ]);
});
