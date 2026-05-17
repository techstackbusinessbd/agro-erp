<?php

namespace App\Modules\MasterData\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\MasterData\Services\CategoryService;
use App\Modules\MasterData\Requests\StoreCategoryRequest;
use App\Modules\MasterData\Requests\UpdateCategoryRequest;
use App\Modules\MasterData\Resources\CategoryResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    public function __construct(protected CategoryService $categoryService)
    {
    }

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAll();

        return $this->successResponse(
            CategoryResource::collection($categories),
            'Categories retrieved successfully.'
        );
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->store($request->validated());

        return $this->successResponse(
            new CategoryResource($category),
            'Category created successfully.',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $category = $this->categoryService->show($id);

        return $this->successResponse(
            new CategoryResource($category),
            'Category details retrieved successfully.'
        );
    }

    public function update(UpdateCategoryRequest $request, string $id): JsonResponse
    {
        $category = $this->categoryService->update($id, $request->validated());

        return $this->successResponse(
            new CategoryResource($category),
            'Category updated successfully.'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->categoryService->destroy($id);

        return $this->successResponse(
            null,
            'Category deleted successfully.'
        );
    }
}
