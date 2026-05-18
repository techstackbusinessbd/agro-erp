<?php

namespace App\Modules\MasterData\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\MasterData\Services\ProductService;
use App\Modules\MasterData\Requests\StoreProductRequest;
use App\Modules\MasterData\Requests\UpdateProductRequest;
use App\Modules\MasterData\Resources\ProductResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(protected ProductService $productService)
    {
    }

    public function index(): JsonResponse
    {
        $products = $this->productService->getAll();

        return $this->successResponse(
            ProductResource::collection($products),
            'Products retrieved successfully.'
        );
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->store($request->validated());

        return $this->successResponse(
            new ProductResource($product),
            'Product created successfully.',
            201
        );
    }

    public function show(string $id): JsonResponse
    {
        $product = $this->productService->show($id);

        return $this->successResponse(
            new ProductResource($product),
            'Product details retrieved successfully.'
        );
    }

    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        $product = $this->productService->update($id, $request->validated());

        return $this->successResponse(
            new ProductResource($product),
            'Product updated successfully.'
        );
    }

    public function destroy(string $id): JsonResponse
    {
        $this->productService->destroy($id);

        return $this->successResponse(
            null,
            'Product deleted successfully.'
        );
    }
}
