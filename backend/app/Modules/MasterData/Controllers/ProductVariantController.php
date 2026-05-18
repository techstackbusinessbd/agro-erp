<?php

namespace App\Modules\MasterData\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\MasterData\Models\Product;
use App\Modules\MasterData\Models\ProductVariant;
use App\Modules\MasterData\Requests\StoreProductVariantRequest;
use App\Modules\MasterData\Requests\UpdateProductVariantRequest;
use App\Modules\MasterData\Resources\ProductVariantResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProductVariantController extends Controller
{
    use ApiResponse;

    /**
     * List all variants for a product.
     */
    public function index(string $productId): JsonResponse
    {
        $product = Product::findOrFail($productId);
        $variants = $product->variants()->get();

        return $this->successResponse(
            ProductVariantResource::collection($variants),
            'Variants retrieved successfully.'
        );
    }

    /**
     * Create a new variant for a product.
     */
    public function store(StoreProductVariantRequest $request, string $productId): JsonResponse
    {
        $product = Product::findOrFail($productId);

        $variant = $product->variants()->create($request->validated());

        return $this->successResponse(
            new ProductVariantResource($variant),
            'Variant created successfully.',
            201
        );
    }

    /**
     * Update an existing variant.
     */
    public function update(UpdateProductVariantRequest $request, string $productId, string $variantId): JsonResponse
    {
        /** @var ProductVariant $variant */
        $variant = ProductVariant::where('product_id', $productId)->findOrFail($variantId);
        $variant->update($request->validated());

        return $this->successResponse(
            new ProductVariantResource($variant->fresh()),
            'Variant updated successfully.'
        );
    }

    /**
     * Delete a variant (soft delete).
     */
    public function destroy(string $productId, string $variantId): JsonResponse
    {
        $variant = ProductVariant::where('product_id', $productId)->findOrFail($variantId);
        $variant->delete();

        return $this->successResponse(null, 'Variant deleted successfully.');
    }
}
