<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\Stock;
use App\Modules\Warehouse\Interfaces\StockRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function __construct(protected StockRepositoryInterface $stockRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->stockRepository->all()->load(['warehouse', 'product.category', 'product.uom']);
    }

    public function updateStock(string $warehouseId, string $productId, float $physicalQtyChange, float $transitQtyChange): Stock
    {
        return DB::transaction(function () use ($warehouseId, $productId, $physicalQtyChange, $transitQtyChange) {
            $stock = $this->stockRepository->findOrCreate($warehouseId, $productId);
            $stock->physical_qty += $physicalQtyChange;
            $stock->transit_qty += $transitQtyChange;
            $stock->save();
            return $stock;
        });
    }

    public function adjustStockDirect(
        string $warehouseId,
        string $productId,
        float $physicalQty,
        ?string $batchNumber = null,
        ?string $mfgDate = null,
        ?string $expiryDate = null
    ): Stock {
        return DB::transaction(function () use ($warehouseId, $productId, $physicalQty, $batchNumber, $mfgDate, $expiryDate) {
            $stock = $this->stockRepository->findOrCreate($warehouseId, $productId);
            $stock->physical_qty = $physicalQty;
            $stock->save();

            if ($batchNumber) {
                \App\Modules\MasterData\Models\ProductBatch::updateOrCreate(
                    [
                        'product_id' => $productId,
                        'warehouse_id' => $warehouseId,
                        'batch_number' => $batchNumber,
                    ],
                    [
                        'mfg_date' => $mfgDate,
                        'expiry_date' => $expiryDate,
                        'qty_on_hand' => $physicalQty,
                    ]
                );
            }

            return $stock->load(['warehouse', 'product']);
        });
    }
}
