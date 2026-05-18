<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\Recipe;
use App\Modules\Warehouse\Models\RecipeItem;
use App\Modules\Warehouse\Models\Production;
use App\Modules\Warehouse\Models\ProductionItem;
use App\Modules\Warehouse\Models\Stock;
use App\Modules\MasterData\Models\ProductBatch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;

class ProductionService
{
    // ========================================
    //  RECIPE (BOM) CRUD
    // ========================================

    public function getAllRecipes(): Collection
    {
        return Recipe::with(['product.uom', 'items.product.uom'])->get();
    }

    public function storeRecipe(array $data): Recipe
    {
        return DB::transaction(function () use ($data) {
            $recipe = Recipe::create([
                'name'       => $data['name'],
                'product_id' => $data['product_id'],
                'batch_size' => $data['batch_size'],
                'is_active'  => $data['is_active'] ?? true,
                'remarks'    => $data['remarks'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                RecipeItem::create([
                    'recipe_id'  => $recipe->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                ]);
            }

            return $recipe->load(['product.uom', 'items.product.uom']);
        });
    }

    public function updateRecipe(string $id, array $data): Recipe
    {
        return DB::transaction(function () use ($id, $data) {
            $recipe = Recipe::findOrFail($id);
            $recipe->update([
                'name'       => $data['name'],
                'product_id' => $data['product_id'],
                'batch_size' => $data['batch_size'],
                'is_active'  => $data['is_active'] ?? true,
                'remarks'    => $data['remarks'] ?? null,
            ]);

            // Replace items
            $recipe->items()->delete();
            foreach ($data['items'] as $item) {
                RecipeItem::create([
                    'recipe_id'  => $recipe->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                ]);
            }

            return $recipe->load(['product.uom', 'items.product.uom']);
        });
    }

    public function destroyRecipe(string $id): void
    {
        $recipe = Recipe::findOrFail($id);
        if ($recipe->productions()->whereNotIn('status', ['cancelled'])->count() > 0) {
            throw new Exception('Cannot delete a recipe that has active production orders.');
        }
        $recipe->delete();
    }

    // ========================================
    //  PRODUCTION ORDERS CRUD
    // ========================================

    public function getAllProductions(): Collection
    {
        return Production::with([
            'product.uom',
            'recipe',
            'rawMaterialWarehouse',
            'finishedGoodsWarehouse',
            'items.product.uom',
        ])->get();
    }

    public function storeProduction(array $data): Production
    {
        return DB::transaction(function () use ($data) {
            $count = Production::withTrashed()->count() + 1;
            $productionNo = 'PRD-' . str_pad($count, 6, '0', STR_PAD_LEFT);

            $recipe = Recipe::with('items.product')->findOrFail($data['recipe_id']);
            $targetQty = (float) $data['target_qty'];
            $multiplier = $targetQty / (float) $recipe->batch_size;

            $production = Production::create([
                'production_no'               => $productionNo,
                'product_id'                  => $data['product_id'],
                'recipe_id'                   => $data['recipe_id'],
                'target_qty'                  => $targetQty,
                'raw_material_warehouse_id'   => $data['raw_material_warehouse_id'],
                'finished_goods_warehouse_id' => $data['finished_goods_warehouse_id'],
                'status'                      => 'pending',
                'production_date'             => $data['production_date'],
                'remarks'                     => $data['remarks'] ?? null,
            ]);

            // Auto-populate production items from recipe scaled to target_qty
            foreach ($recipe->items as $ri) {
                ProductionItem::create([
                    'production_id' => $production->id,
                    'product_id'    => $ri->product_id,
                    'planned_qty'   => round($ri->quantity * $multiplier, 2),
                    'actual_qty'    => round($ri->quantity * $multiplier, 2),
                    'batch_no'      => null,
                ]);
            }

            return $production->load(['product.uom', 'recipe', 'rawMaterialWarehouse', 'finishedGoodsWarehouse', 'items.product.uom']);
        });
    }

    /**
     * Start production: deduct raw materials from source warehouse.
     */
    public function startProduction(string $id, array $itemsData): Production
    {
        return DB::transaction(function () use ($id, $itemsData) {
            $production = Production::with('items')->findOrFail($id);

            if ($production->status !== 'pending') {
                throw new Exception('Only pending production orders can be started.');
            }

            foreach ($itemsData as $itemInput) {
                $item = ProductionItem::findOrFail($itemInput['id']);
                $actualQty = (float) $itemInput['actual_qty'];

                // Update actual quantity consumed
                $item->actual_qty = $actualQty;
                $item->batch_no   = $itemInput['batch_no'] ?? null;
                $item->save();

                // Deduct from raw material warehouse stock
                $stock = Stock::where('warehouse_id', $production->raw_material_warehouse_id)
                    ->where('product_id', $item->product_id)
                    ->first();

                if (!$stock || $stock->physical_qty < $actualQty) {
                    $productName = $item->product->name ?? 'Unknown';
                    throw new Exception("Insufficient stock for raw material: {$productName}. Available: " . ($stock?->physical_qty ?? 0));
                }

                $stock->physical_qty -= $actualQty;
                $stock->save();

                // Deduct from batch as well (if batch_no specified)
                if ($item->batch_no) {
                    $batch = ProductBatch::where('product_id', $item->product_id)
                        ->where('warehouse_id', $production->raw_material_warehouse_id)
                        ->where('batch_number', $item->batch_no)
                        ->first();

                    if ($batch) {
                        $batch->qty_on_hand = max(0, $batch->qty_on_hand - $actualQty);
                        $batch->save();
                    }
                }
            }

            $production->status     = 'processing';
            $production->started_at = now();
            $production->save();

            return $production->load(['product.uom', 'recipe', 'rawMaterialWarehouse', 'finishedGoodsWarehouse', 'items.product.uom']);
        });
    }

    /**
     * Complete production: yield finished goods into FG warehouse.
     */
    public function completeProduction(string $id, array $data): Production
    {
        return DB::transaction(function () use ($id, $data) {
            $production = Production::findOrFail($id);

            if ($production->status !== 'processing') {
                throw new Exception('Only productions currently in processing can be completed.');
            }

            $batchNo    = $data['batch_no'] ?? ('FG-' . $production->production_no);
            $expiryDate = $data['expiry_date'] ?? null;
            $yieldQty   = (float) ($data['yield_qty'] ?? $production->target_qty);

            // 1. Create or update finished goods batch
            $fgBatch = ProductBatch::firstOrCreate([
                'product_id'   => $production->product_id,
                'warehouse_id' => $production->finished_goods_warehouse_id,
                'batch_number' => $batchNo,
            ], [
                'qty_on_hand' => 0,
                'expiry_date' => $expiryDate,
            ]);

            $fgBatch->qty_on_hand += $yieldQty;
            if ($expiryDate) $fgBatch->expiry_date = $expiryDate;
            $fgBatch->save();

            // 2. Add to finished goods physical stock
            $fgStock = Stock::firstOrCreate([
                'warehouse_id' => $production->finished_goods_warehouse_id,
                'product_id'   => $production->product_id,
            ], [
                'physical_qty' => 0,
                'transit_qty'  => 0,
            ]);

            $fgStock->physical_qty += $yieldQty;
            $fgStock->save();

            // 3. Mark production as completed
            $production->status       = 'completed';
            $production->completed_at = now();
            $production->batch_no     = $batchNo;
            $production->expiry_date  = $expiryDate;
            $production->save();

            return $production->load(['product.uom', 'recipe', 'rawMaterialWarehouse', 'finishedGoodsWarehouse', 'items.product.uom']);
        });
    }

    /**
     * Cancel a pending production order.
     */
    public function cancelProduction(string $id): Production
    {
        $production = Production::findOrFail($id);

        if (!in_array($production->status, ['pending'])) {
            throw new Exception('Only pending production orders can be cancelled. Processing orders must be completed first.');
        }

        $production->status = 'cancelled';
        $production->save();

        return $production;
    }
}
