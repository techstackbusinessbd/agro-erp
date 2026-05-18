<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\StockTransferOrder;
use App\Modules\Warehouse\Models\StockTransferOrderItem;
use App\Modules\Warehouse\Interfaces\StockTransferRepositoryInterface;
use App\Modules\Warehouse\Interfaces\StockRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;

class StockTransferService
{
    public function __construct(
        protected StockTransferRepositoryInterface $stoRepository,
        protected StockRepositoryInterface $stockRepository
    ) {
    }

    public function getAll(): Collection
    {
        return $this->stoRepository->all()->load([
            'sourceWarehouse',
            'destinationWarehouse',
            'items.product.uom'
        ]);
    }

    public function show(string $id): StockTransferOrder
    {
        $order = $this->stoRepository->find($id);
        if (!$order) {
            abort(404, 'Stock Transfer Order not found');
        }
        return $order->load([
            'sourceWarehouse',
            'destinationWarehouse',
            'items.product.uom'
        ]);
    }

    public function store(array $data): StockTransferOrder
    {
        return DB::transaction(function () use ($data) {
            // Generate sequence code
            $count = StockTransferOrder::withTrashed()->count() + 1;
            $code = 'STO-' . str_pad($count, 6, '0', STR_PAD_LEFT);

            $order = $this->stoRepository->create([
                'code'                     => $code,
                'source_warehouse_id'      => $data['source_warehouse_id'],
                'destination_warehouse_id' => $data['destination_warehouse_id'],
                'status'                   => 'pending', // Starts directly in pending
                'remarks'                  => $data['remarks'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                StockTransferOrderItem::create([
                    'stock_transfer_order_id' => $order->id,
                    'product_id'              => $item['product_id'],
                    'quantity_requested'      => $item['quantity_requested'],
                    'quantity_shipped'        => null,
                    'quantity_received'       => null,
                ]);
            }

            return $order->load(['sourceWarehouse', 'destinationWarehouse', 'items.product.uom']);
        });
    }

    public function approve(string $id): StockTransferOrder
    {
        return DB::transaction(function () use ($id) {
            $order = $this->show($id);
            if ($order->status !== 'pending') {
                throw new Exception('Only pending transfer requests can be approved.');
            }

            $order->status = 'approved';
            $order->save();

            return $order;
        });
    }

    public function ship(string $id, array $shippedItems): StockTransferOrder
    {
        return DB::transaction(function () use ($id, $shippedItems) {
            $order = $this->show($id);
            if ($order->status !== 'approved') {
                throw new Exception('Only approved transfers can be shipped.');
            }

            $sourceId = $order->source_warehouse_id;
            $destId = $order->destination_warehouse_id;

            // Index shipped quantities by product_id
            $shippedQtyMap = [];
            foreach ($shippedItems as $item) {
                $shippedQtyMap[$item['product_id']] = (float) $item['quantity_shipped'];
            }

            foreach ($order->items as $item) {
                $productId = $item->product_id;
                $shippedQty = $shippedQtyMap[$productId] ?? (float) $item->quantity_requested;

                // 1. Check physical stock availability in source warehouse
                $sourceStock = $this->stockRepository->findOrCreate($sourceId, $productId);
                if ($sourceStock->physical_qty < $shippedQty) {
                    throw new Exception("Insufficient stock for product code: {$item->product->code} in source warehouse. Available: {$sourceStock->physical_qty}, Required: {$shippedQty}");
                }

                // 2. Perform transactional inventory movement to in-transit
                $sourceStock->physical_qty -= $shippedQty;
                $sourceStock->save();

                $destStock = $this->stockRepository->findOrCreate($destId, $productId);
                $destStock->transit_qty += $shippedQty;
                $destStock->save();

                // 3. Update transfer order item
                $item->quantity_shipped = $shippedQty;
                $item->save();
            }

            $order->status = 'shipped';
            $order->shipped_at = now();
            $order->save();

            return $order->load(['sourceWarehouse', 'destinationWarehouse', 'items.product.uom']);
        });
    }

    public function receive(string $id, array $receivedItems): StockTransferOrder
    {
        return DB::transaction(function () use ($id, $receivedItems) {
            $order = $this->show($id);
            if ($order->status !== 'shipped') {
                throw new Exception('Only shipped transfers can be received.');
            }

            $destId = $order->destination_warehouse_id;

            // Index received quantities by product_id
            $receivedQtyMap = [];
            foreach ($receivedItems as $item) {
                $receivedQtyMap[$item['product_id']] = (float) $item['quantity_received'];
            }

            foreach ($order->items as $item) {
                $productId = $item->product_id;
                // Fallback to shipped qty if not provided
                $receivedQty = $receivedQtyMap[$productId] ?? (float) $item->quantity_shipped;
                $shippedQty = (float) $item->quantity_shipped;

                // 1. Transactional inventory movement: deduct from transit, add to physical in destination
                $destStock = $this->stockRepository->findOrCreate($destId, $productId);
                
                // Deduct shipped amount from transit (since it was shipped, even if we receive less, the transit clearing matches shipped quantity)
                $destStock->transit_qty = max(0, $destStock->transit_qty - $shippedQty);
                
                // Add actual received quantity to physical stock
                $destStock->physical_qty += $receivedQty;
                $destStock->save();

                // 2. Update transfer order item
                $item->quantity_received = $receivedQty;
                $item->save();
            }

            $order->status = 'received';
            $order->received_at = now();
            $order->save();

            return $order->load(['sourceWarehouse', 'destinationWarehouse', 'items.product.uom']);
        });
    }

    public function cancel(string $id): StockTransferOrder
    {
        return DB::transaction(function () use ($id) {
            $order = $this->show($id);
            if (in_array($order->status, ['shipped', 'received'])) {
                throw new Exception('Shipped or completed transfers cannot be cancelled.');
            }

            $order->status = 'cancelled';
            $order->save();

            return $order;
        });
    }
}
