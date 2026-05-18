<?php

namespace App\Modules\Warehouse\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\Warehouse\Models\Warehouse;

interface WarehouseRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Warehouse;
    public function create(array $data): Warehouse;
}
