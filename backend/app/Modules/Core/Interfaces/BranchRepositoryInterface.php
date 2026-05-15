<?php

namespace App\Modules\Core\Interfaces;

use App\Modules\Core\Models\Branch;

interface BranchRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Branch;
    public function create(array $data): Branch;
}
