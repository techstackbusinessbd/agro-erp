<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Services\TerritoryService;
use App\Modules\Warehouse\Requests\StoreTerritoryRequest;
use App\Modules\Warehouse\Requests\UpdateTerritoryRequest;
use App\Modules\Warehouse\Resources\TerritoryResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class TerritoryController extends Controller
{
    use ApiResponse;

    public function __construct(protected TerritoryService $territoryService)
    {
    }

    public function index(): JsonResponse
    {
        $territories = $this->territoryService->getAll();

        return $this->successResponse(
            TerritoryResource::collection($territories),
            'Territories retrieved successfully.'
        );
    }

    public function store(StoreTerritoryRequest $request): JsonResponse
    {
        $territory = $this->territoryService->store($request->validated());

        return $this->successResponse(
            new TerritoryResource($territory),
            'Territory created successfully.',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $territory = $this->territoryService->show($id);

        return $this->successResponse(
            new TerritoryResource($territory),
            'Territory details retrieved successfully.'
        );
    }

    public function update(UpdateTerritoryRequest $request, string $id): JsonResponse
    {
        $territory = $this->territoryService->update($id, $request->validated());

        return $this->successResponse(
            new TerritoryResource($territory),
            'Territory updated successfully.'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->territoryService->destroy($id);

        return $this->successResponse(
            null,
            'Territory deleted successfully.'
        );
    }
}
