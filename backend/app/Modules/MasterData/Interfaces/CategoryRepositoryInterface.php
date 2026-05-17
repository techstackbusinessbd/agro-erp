<?php

namespace App\Modules\MasterData\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\MasterData\Models\Category;

interface CategoryRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Category;
    public function create(array $data): Category;
}
