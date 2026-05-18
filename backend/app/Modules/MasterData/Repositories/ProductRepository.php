<?php

namespace App\Modules\MasterData\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\MasterData\Interfaces\ProductRepositoryInterface;
use App\Modules\MasterData\Models\Product;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Product
    {
        /** @var Product|null $product */
        $product = parent::find($id);
        
        return $product;
    }

    public function create(array $data): Product
    {
        /** @var Product $product */
        $product = parent::create($data);
        
        return $product;
    }
}
