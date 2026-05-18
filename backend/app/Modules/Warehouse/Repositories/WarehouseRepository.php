<?php

namespace App\Modules\Warehouse\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\Warehouse\Interfaces\WarehouseRepositoryInterface;
use App\Modules\Warehouse\Models\Warehouse;

class WarehouseRepository extends BaseRepository implements WarehouseRepositoryInterface
{
    public function __construct(Warehouse $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Warehouse
    {
        /** @var Warehouse|null $warehouse */
        $warehouse = parent::find($id);
        return $warehouse;
    }

    public function create(array $data): Warehouse
    {
        /** @var Warehouse $warehouse */
        $warehouse = parent::create($data);
        return $warehouse;
    }
}
