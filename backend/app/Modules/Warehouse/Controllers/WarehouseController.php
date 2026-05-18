<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Services\WarehouseService;
use App\Modules\Warehouse\Requests\StoreWarehouseRequest;
use App\Modules\Warehouse\Requests\UpdateWarehouseRequest;
use App\Modules\Warehouse\Resources\WarehouseResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class WarehouseController extends Controller
{
    use ApiResponse;

    public function __construct(protected WarehouseService $warehouseService)
    {
    }

    public function index(): JsonResponse
    {
        $warehouses = $this->warehouseService->getAll();

        return $this->successResponse(
            WarehouseResource::collection($warehouses),
            'Warehouses retrieved successfully.'
        );
    }

    public function store(StoreWarehouseRequest $request): JsonResponse
    {
        $warehouse = $this->warehouseService->store($request->validated());

        return $this->successResponse(
            new WarehouseResource($warehouse),
            'Warehouse created successfully.',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $warehouse = $this->warehouseService->show($id);

        return $this->successResponse(
            new WarehouseResource($warehouse),
            'Warehouse details retrieved successfully.'
        );
    }

    public function update(UpdateWarehouseRequest $request, string $id): JsonResponse
    {
        $warehouse = $this->warehouseService->update($id, $request->validated());

        return $this->successResponse(
            new WarehouseResource($warehouse),
            'Warehouse updated successfully.'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->warehouseService->destroy($id);

        return $this->successResponse(
            null,
            'Warehouse deleted successfully.'
        );
    }
}
