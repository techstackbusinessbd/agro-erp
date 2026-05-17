<?php

namespace App\Modules\MasterData\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\MasterData\Interfaces\UomRepositoryInterface;
use App\Modules\MasterData\Models\Uom;

class UomRepository extends BaseRepository implements UomRepositoryInterface
{
    public function __construct(Uom $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Uom
    {
        /** @var Uom|null $uom */
        $uom = parent::find($id);
        
        return $uom;
    }

    public function create(array $data): Uom
    {
        /** @var Uom $uom */
        $uom = parent::create($data);
        
        return $uom;
    }
}
