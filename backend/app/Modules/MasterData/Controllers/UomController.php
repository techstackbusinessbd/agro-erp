<?php

namespace App\Modules\MasterData\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\MasterData\Services\UomService;
use App\Modules\MasterData\Requests\StoreUomRequest;
use App\Modules\MasterData\Requests\UpdateUomRequest;
use App\Modules\MasterData\Resources\UomResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class UomController extends Controller
{
    use ApiResponse;

    public function __construct(protected UomService $uomService)
    {
    }

    public function index(): JsonResponse
    {
        $uoms = $this->uomService->getAll();

        return $this->successResponse(
            UomResource::collection($uoms),
            'Units of Measurement retrieved successfully.'
        );
    }

    public function store(StoreUomRequest $request): JsonResponse
    {
        $uom = $this->uomService->store($request->validated());

        return $this->successResponse(
            new UomResource($uom),
            'Unit of Measurement created successfully.',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $uom = $this->uomService->show($id);

        return $this->successResponse(
            new UomResource($uom),
            'Unit of Measurement details retrieved successfully.'
        );
    }

    public function update(UpdateUomRequest $request, string $id): JsonResponse
    {
        $uom = $this->uomService->update($id, $request->validated());

        return $this->successResponse(
            new UomResource($uom),
            'Unit of Measurement updated successfully.'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->uomService->destroy($id);

        return $this->successResponse(
            null,
            'Unit of Measurement deleted successfully.'
        );
    }
}
