<?php

namespace App\Modules\Warehouse\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Warehouse\Services\StockTransferService;
use App\Modules\Warehouse\Requests\StoreStockTransferRequest;
use App\Modules\Warehouse\Resources\StockTransferResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class StockTransferController extends Controller
{
    use ApiResponse;

    public function __construct(protected StockTransferService $stoService)
    {
    }

    public function index(): JsonResponse
    {
        $orders = $this->stoService->getAll();

        return $this->successResponse(
            StockTransferResource::collection($orders),
            'Stock Transfer Orders retrieved successfully.'
        );
    }

    public function show(string $id): JsonResponse
    {
        $order = $this->stoService->show($id);

        return $this->successResponse(
            new StockTransferResource($order),
            'Stock Transfer Order retrieved successfully.'
        );
    }

    public function store(StoreStockTransferRequest $request): JsonResponse
    {
        $order = $this->stoService->store($request->validated());

        return $this->successResponse(
            new StockTransferResource($order),
            'Stock Transfer Order request submitted successfully.',
            201
        );
    }

    public function approve(string $id): JsonResponse
    {
        try {
            $order = $this->stoService->approve($id);
            return $this->successResponse(
                new StockTransferResource($order),
                'Stock Transfer Order approved successfully.'
            );
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function ship(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'items'                    => 'required|array|min:1',
            'items.*.product_id'       => 'required|uuid|exists:products,id',
            'items.*.quantity_shipped' => 'required|numeric|min:0',
        ]);

        try {
            $order = $this->stoService->ship($id, $validated['items']);
            return $this->successResponse(
                new StockTransferResource($order),
                'Stock Transfer Order shipped. Inventory is now In-Transit.'
            );
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function receive(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'items'                     => 'required|array|min:1',
            'items.*.product_id'        => 'required|uuid|exists:products,id',
            'items.*.quantity_received' => 'required|numeric|min:0',
        ]);

        try {
            $order = $this->stoService->receive($id, $validated['items']);
            return $this->successResponse(
                new StockTransferResource($order),
                'Stock Transfer Order received. Inventory loaded to physical stock.'
            );
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function cancel(string $id): JsonResponse
    {
        try {
            $order = $this->stoService->cancel($id);
            return $this->successResponse(
                new StockTransferResource($order),
                'Stock Transfer Order cancelled successfully.'
            );
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
