<?php

namespace App\Modules\Warehouse\Repositories;

use App\Modules\Core\Repositories\BaseRepository;
use App\Modules\Warehouse\Interfaces\StockTransferRepositoryInterface;
use App\Modules\Warehouse\Models\StockTransferOrder;

class StockTransferRepository extends BaseRepository implements StockTransferRepositoryInterface
{
    public function __construct(StockTransferOrder $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?StockTransferOrder
    {
        /** @var StockTransferOrder|null $order */
        $order = parent::find($id);
        
        return $order;
    }

    public function create(array $data): StockTransferOrder
    {
        /** @var StockTransferOrder $order */
        $order = parent::create($data);
        
        return $order;
    }
}
