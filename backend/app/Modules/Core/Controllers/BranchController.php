<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Services\BranchService;
use App\Modules\Core\Requests\StoreBranchRequest;
use App\Modules\Core\Requests\UpdateBranchRequest;
use App\Modules\Core\Resources\BranchResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class BranchController extends Controller
{
    use ApiResponse;

    public function __construct(protected BranchService $branchService)
    {
    }

    /**
     * Display a listing of the branches.
     */
    public function index(): JsonResponse
    {
        $branches = $this->branchService->getAll();

        return $this->successResponse(
            BranchResource::collection($branches),
            'Branches retrieved successfully.'
        );
    }

    /**
     * Store a newly created branch in storage.
     */
    public function store(StoreBranchRequest $request): JsonResponse
    {
        $branch = $this->branchService->store($request->validated());

        return $this->successResponse(
            new BranchResource($branch),
            'Branch created successfully.',
            201
        );
    }

    /**
     * Display the specified branch.
     */
    public function show(string $id): JsonResponse
    {
        $branch = $this->branchService->show($id);

        return $this->successResponse(
            new BranchResource($branch),
            'Branch details retrieved successfully.'
        );
    }

    /**
     * Update the specified branch in storage.
     */
    public function update(UpdateBranchRequest $request, string $id): JsonResponse
    {
        $branch = $this->branchService->update($id, $request->validated());

        return $this->successResponse(
            new BranchResource($branch),
            'Branch updated successfully.'
        );
    }

    /**
     * Remove the specified branch from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $this->branchService->destroy($id);

        return $this->successResponse(
            null,
            'Branch deleted successfully.'
        );
    }
}
