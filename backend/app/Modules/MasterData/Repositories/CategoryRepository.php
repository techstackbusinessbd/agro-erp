<?php

namespace App\Modules\MasterData\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\MasterData\Interfaces\CategoryRepositoryInterface;
use App\Modules\MasterData\Models\Category;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Category
    {
        /** @var Category|null $category */
        $category = parent::find($id);
        
        return $category;
    }

    public function create(array $data): Category
    {
        /** @var Category $category */
        $category = parent::create($data);
        
        return $category;
    }
}
