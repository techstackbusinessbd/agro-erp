<?php

namespace App\Modules\Warehouse\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\Warehouse\Models\Territory;

interface TerritoryRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Territory;
    public function create(array $data): Territory;
}
