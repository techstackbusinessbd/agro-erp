<?php

namespace App\Modules\Core\Repositories;

use App\Modules\Core\Models\Branch;
use App\Modules\Core\Interfaces\BranchRepositoryInterface;

class BranchRepository extends BaseRepository implements BranchRepositoryInterface
{
    public function __construct(Branch $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Branch
    {
        /** @var Branch|null $branch */
        $branch = parent::find($id);
        
        return $branch;
    }

    public function create(array $data): Branch
    {
        /** @var Branch $branch */
        $branch = parent::create($data);
        
        return $branch;
    }
}
