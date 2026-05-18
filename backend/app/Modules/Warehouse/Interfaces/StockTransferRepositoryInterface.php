<?php

namespace App\Modules\Warehouse\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\Warehouse\Models\StockTransferOrder;

interface StockTransferRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?StockTransferOrder;
    public function create(array $data): StockTransferOrder;
}
