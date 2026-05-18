<?php

namespace App\Modules\Warehouse\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\Warehouse\Models\Stock;

interface StockRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Stock;
    public function findOrCreate(string $warehouseId, string $productId): Stock;
}
