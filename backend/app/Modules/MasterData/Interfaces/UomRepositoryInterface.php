<?php

namespace App\Modules\MasterData\Interfaces;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use App\Modules\MasterData\Models\Uom;

interface UomRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Uom;
    public function create(array $data): Uom;
}
