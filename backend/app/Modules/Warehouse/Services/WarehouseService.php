<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\Warehouse;
use App\Modules\Warehouse\Interfaces\WarehouseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class WarehouseService
{
    public function __construct(protected WarehouseRepositoryInterface $warehouseRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->warehouseRepository->all()->load(['territory', 'sourceWarehouse']);
    }

    public function store(array $data): Warehouse
    {
        return DB::transaction(function () use ($data) {
            return $this->warehouseRepository->create($data);
        });
    }

    public function show(string $id): Warehouse
    {
        $warehouse = $this->warehouseRepository->find($id);
        if (!$warehouse) {
            abort(404, 'Warehouse not found');
        }
        return $warehouse->load(['territory', 'sourceWarehouse']);
    }

    public function update(string $id, array $data): Warehouse
    {
        return DB::transaction(function () use ($id, $data) {
            $this->warehouseRepository->update($id, $data);
            return $this->warehouseRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->warehouseRepository->delete($id);
        });
    }
}
