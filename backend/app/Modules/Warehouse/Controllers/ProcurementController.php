<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Services\ProcurementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class ProcurementController extends Controller
{
    use ApiResponse;

    public function __construct(protected ProcurementService $procurementService)
    {
    }

    // --- Supplier Routes ---

    public function indexSuppliers(): JsonResponse
    {
        $suppliers = $this->procurementService->getAllSuppliers();
        return $this->successResponse($suppliers, 'Suppliers retrieved successfully.');
    }

    public function storeSupplier(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'nullable|string|max:50',
            'email'   => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'origin'  => 'required|in:local,foreign',
            'remarks' => 'nullable|string',
        ]);

        $supplier = $this->procurementService->storeSupplier($validated);
        return $this->successResponse($supplier, 'Supplier registered successfully.', 201);
    }

    public function updateSupplier(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'nullable|string|max:50',
            'email'   => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'origin'  => 'required|in:local,foreign',
            'remarks' => 'nullable|string',
        ]);

        $supplier = $this->procurementService->updateSupplier($id, $validated);
        return $this->successResponse($supplier, 'Supplier updated successfully.');
    }

    public function destroySupplier(string $id): JsonResponse
    {
        $this->procurementService->destroySupplier($id);
        return $this->successResponse(null, 'Supplier deleted successfully.');
    }

    // --- Purchase Routes ---

    public function indexPurchases(): JsonResponse
    {
        $purchases = $this->procurementService->getAllPurchases();
        return $this->successResponse($purchases, 'Purchases retrieved successfully.');
    }

    public function storePurchase(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id'     => 'required|uuid|exists:suppliers,id',
            'warehouse_id'    => 'required|uuid|exists:warehouses,id',
            'type'            => 'required|in:local,import',
            'purchase_date'   => 'required|date',
            'lc_no'           => 'nullable|string|max:255',
            'lc_date'         => 'nullable|date',
            'conversion_rate' => 'nullable|numeric|min:0',
            'remarks'         => 'nullable|string',
            'items'           => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.01',
            'items.*.rate'       => 'required|numeric|min:0.01',
            'items.*.batch_no'   => 'nullable|string|max:255',
            'items.*.expiry_date'=> 'nullable|date',
        ]);

        $purchase = $this->procurementService->storePurchase($validated);
        return $this->successResponse($purchase, 'Purchase requisition recorded successfully.', 201);
    }

    public function receivePurchase(string $id): JsonResponse
    {
        try {
            $purchase = $this->procurementService->receivePurchase($id);
            return $this->successResponse($purchase, 'Raw Material goods received successfully and inventory updated.');
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'Error',
                'message' => $e->getMessage(),
                'data'    => null,
            ], 400);
        }
    }
}
