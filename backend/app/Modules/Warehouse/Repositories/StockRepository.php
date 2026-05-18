<?php

namespace App\Modules\Warehouse\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\Warehouse\Interfaces\StockRepositoryInterface;
use App\Modules\Warehouse\Models\Stock;

class StockRepository extends BaseRepository implements StockRepositoryInterface
{
    public function __construct(Stock $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Stock
    {
        /** @var Stock|null $stock */
        $stock = parent::find($id);
        
        return $stock;
    }

    public function findOrCreate(string $warehouseId, string $productId): Stock
    {
        return $this->model->firstOrCreate(
            ['warehouse_id' => $warehouseId, 'product_id' => $productId],
            ['physical_qty' => 0.00, 'transit_qty' => 0.00]
        );
    }
}
