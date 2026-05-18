<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\Supplier;
use App\Modules\Warehouse\Models\Purchase;
use App\Modules\Warehouse\Models\PurchaseItem;
use App\Modules\Warehouse\Models\Stock;
use App\Modules\MasterData\Models\ProductBatch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;

class ProcurementService
{
    // --- SUPPLIER CRUD Operations ---

    public function getAllSuppliers(): Collection
    {
        return Supplier::all();
    }

    public function storeSupplier(array $data): Supplier
    {
        // Generate Supplier Code
        $count = Supplier::withTrashed()->count() + 1;
        $data['code'] = 'SPL-' . str_pad($count, 6, '0', STR_PAD_LEFT);

        return Supplier::create($data);
    }

    public function updateSupplier(string $id, array $data): Supplier
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update($data);
        return $supplier;
    }

    public function destroySupplier(string $id): void
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();
    }

    // --- PURCHASE / PROCUREMENT LEDGER Operations ---

    public function getAllPurchases(): Collection
    {
        return Purchase::with(['supplier', 'warehouse', 'items.product.uom'])->get();
    }

    public function storePurchase(array $data): Purchase
    {
        return DB::transaction(function () use ($data) {
            // Generate sequence purchase number
            $count = Purchase::withTrashed()->count() + 1;
            $prefix = ($data['type'] === 'import') ? 'LC-' : 'PO-';
            $purchaseNo = $prefix . str_pad($count, 6, '0', STR_PAD_LEFT);

            $conversionRate = (float) ($data['conversion_rate'] ?? 1.00);

            $purchase = Purchase::create([
                'purchase_no'     => $purchaseNo,
                'supplier_id'     => $data['supplier_id'],
                'warehouse_id'    => $data['warehouse_id'],
                'type'            => $data['type'],
                'purchase_date'   => $data['purchase_date'],
                'lc_no'           => $data['lc_no'] ?? null,
                'lc_date'         => $data['lc_date'] ?? null,
                'conversion_rate' => $conversionRate,
                'total_amount'    => 0.00, // Updated below after summing item amounts
                'status'          => 'pending',
                'remarks'         => $data['remarks'] ?? null,
            ]);

            $totalAmount = 0.00;

            foreach ($data['items'] as $item) {
                $qty = (float) $item['quantity'];
                $rate = (float) $item['rate'];
                $amount = $qty * $rate * $conversionRate;
                $totalAmount += $amount;

                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $qty,
                    'rate'        => $rate,
                    'amount'      => $amount,
                    'batch_no'    => $item['batch_no'] ?? null,
                    'expiry_date' => $item['expiry_date'] ?? null,
                ]);
            }

            $purchase->total_amount = $totalAmount;
            $purchase->save();

            return $purchase->load(['supplier', 'warehouse', 'items.product.uom']);
        });
    }

    public function receivePurchase(string $id): Purchase
    {
        return DB::transaction(function () use ($id) {
            $purchase = Purchase::with('items')->findOrFail($id);

            if ($purchase->status === 'received') {
                throw new Exception('This purchase has already been received into warehouse stock.');
            }

            foreach ($purchase->items as $item) {
                // 1. Find or create batch record
                $batchNo = $item->batch_no ?: 'BATCH-' . $purchase->purchase_no;
                $batch = ProductBatch::firstOrCreate([
                    'product_id'   => $item->product_id,
                    'warehouse_id' => $purchase->warehouse_id,
                    'batch_number' => $batchNo,
                ], [
                    'qty_on_hand'  => 0,
                    'expiry_date'  => $item->expiry_date,
                ]);

                $batch->qty_on_hand += $item->quantity;
                $batch->save();

                // 2. Find or create warehouse physical stock
                $stock = Stock::firstOrCreate([
                    'warehouse_id' => $purchase->warehouse_id,
                    'product_id'   => $item->product_id,
                ], [
                    'physical_qty' => 0,
                    'transit_qty'  => 0,
                ]);

                $stock->physical_qty += $item->quantity;
                $stock->save();
            }

            $purchase->status = 'received';
            $purchase->received_at = now();
            $purchase->save();

            return $purchase->load(['supplier', 'warehouse', 'items.product.uom']);
        });
    }
}
