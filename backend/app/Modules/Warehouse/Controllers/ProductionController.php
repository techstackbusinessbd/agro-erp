<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Services\ProductionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class ProductionController extends Controller
{
    use ApiResponse;

    public function __construct(protected ProductionService $productionService)
    {
    }

    // ========================================
    // RECIPE (BOM) ENDPOINTS
    // ========================================

    public function indexRecipes(): JsonResponse
    {
        $recipes = $this->productionService->getAllRecipes();
        return $this->successResponse($recipes, 'Recipes retrieved successfully.');
    }

    public function storeRecipe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'product_id'     => 'required|uuid|exists:products,id',
            'batch_size'     => 'required|numeric|min:0.01',
            'is_active'      => 'boolean',
            'remarks'        => 'nullable|string',
            'items'          => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.001',
        ]);

        $recipe = $this->productionService->storeRecipe($validated);
        return $this->successResponse($recipe, 'Recipe created successfully.', 201);
    }

    public function updateRecipe(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'product_id'     => 'required|uuid|exists:products,id',
            'batch_size'     => 'required|numeric|min:0.01',
            'is_active'      => 'boolean',
            'remarks'        => 'nullable|string',
            'items'          => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.001',
        ]);

        try {
            $recipe = $this->productionService->updateRecipe($id, $validated);
            return $this->successResponse($recipe, 'Recipe updated successfully.');
        } catch (Exception $e) {
            return response()->json(['status' => 'Error', 'message' => $e->getMessage(), 'data' => null], 400);
        }
    }

    public function destroyRecipe(string $id): JsonResponse
    {
        try {
            $this->productionService->destroyRecipe($id);
            return $this->successResponse(null, 'Recipe deleted successfully.');
        } catch (Exception $e) {
            return response()->json(['status' => 'Error', 'message' => $e->getMessage(), 'data' => null], 400);
        }
    }

    // ========================================
    // PRODUCTION ORDER ENDPOINTS
    // ========================================

    public function indexProductions(): JsonResponse
    {
        $productions = $this->productionService->getAllProductions();
        return $this->successResponse($productions, 'Productions retrieved successfully.');
    }

    public function storeProduction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id'                  => 'required|uuid|exists:products,id',
            'recipe_id'                   => 'required|uuid|exists:recipes,id',
            'target_qty'                  => 'required|numeric|min:0.01',
            'raw_material_warehouse_id'   => 'required|uuid|exists:warehouses,id',
            'finished_goods_warehouse_id' => 'required|uuid|exists:warehouses,id',
            'production_date'             => 'required|date',
            'remarks'                     => 'nullable|string',
        ]);

        try {
            $production = $this->productionService->storeProduction($validated);
            return $this->successResponse($production, 'Production order created successfully.', 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'Error', 'message' => $e->getMessage(), 'data' => null], 400);
        }
    }

    public function startProduction(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'items'                => 'required|array|min:1',
            'items.*.id'           => 'required|uuid|exists:production_items,id',
            'items.*.actual_qty'   => 'required|numeric|min:0.001',
            'items.*.batch_no'     => 'nullable|string|max:255',
        ]);

        try {
            $production = $this->productionService->startProduction($id, $validated['items']);
            return $this->successResponse($production, 'Production started. Raw materials deducted from warehouse.');
        } catch (Exception $e) {
            return response()->json(['status' => 'Error', 'message' => $e->getMessage(), 'data' => null], 400);
        }
    }

    public function completeProduction(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'batch_no'    => 'required|string|max:255',
            'expiry_date' => 'nullable|date',
            'yield_qty'   => 'required|numeric|min:0.001',
        ]);

        try {
            $production = $this->productionService->completeProduction($id, $validated);
            return $this->successResponse($production, 'Production completed! Finished goods loaded into warehouse.');
        } catch (Exception $e) {
            return response()->json(['status' => 'Error', 'message' => $e->getMessage(), 'data' => null], 400);
        }
    }

    public function cancelProduction(string $id): JsonResponse
    {
        try {
            $production = $this->productionService->cancelProduction($id);
            return $this->successResponse($production, 'Production order cancelled.');
        } catch (Exception $e) {
            return response()->json(['status' => 'Error', 'message' => $e->getMessage(), 'data' => null], 400);
        }
    }
}
