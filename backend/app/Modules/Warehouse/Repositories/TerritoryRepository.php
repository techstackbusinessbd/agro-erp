<?php

namespace App\Modules\Warehouse\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\Warehouse\Interfaces\TerritoryRepositoryInterface;
use App\Modules\Warehouse\Models\Territory;

class TerritoryRepository extends BaseRepository implements TerritoryRepositoryInterface
{
    public function __construct(Territory $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Territory
    {
        /** @var Territory|null $territory */
        $territory = parent::find($id);
        return $territory;
    }

    public function create(array $data): Territory
    {
        /** @var Territory $territory */
        $territory = parent::create($data);
        return $territory;
    }
}
