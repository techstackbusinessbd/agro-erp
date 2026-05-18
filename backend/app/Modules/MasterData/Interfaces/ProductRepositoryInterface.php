<?php

namespace App\Modules\MasterData\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\MasterData\Models\Product;

interface ProductRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Product;
    public function create(array $data): Product;
}
