<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Services\StockService;
use App\Modules\Warehouse\Resources\StockResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StockController extends Controller
{
    use ApiResponse;

    public function __construct(protected StockService $stockService)
    {
    }

    public function index(): JsonResponse
    {
        $stocks = $this->stockService->getAll();

        return $this->successResponse(
            StockResource::collection($stocks),
            'Inventory balances retrieved successfully.'
        );
    }

    public function adjust(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|uuid|exists:warehouses,id',
            'product_id'   => 'required|uuid|exists:products,id',
            'physical_qty' => 'required|numeric|min:0',
            'batch_number' => 'nullable|string|max:255',
            'mfg_date'     => 'nullable|date',
            'expiry_date'  => 'nullable|date|after_or_equal:mfg_date',
        ]);

        $stock = $this->stockService->adjustStockDirect(
            $validated['warehouse_id'],
            $validated['product_id'],
            (float) $validated['physical_qty'],
            $validated['batch_number'] ?? null,
            $validated['mfg_date'] ?? null,
            $validated['expiry_date'] ?? null
        );

        return $this->successResponse(
            new StockResource($stock),
            'Physical stock level adjusted successfully.'
        );
    }
}
