<?php

namespace App\Modules\Warehouse\Services;

use App\Modules\Warehouse\Models\Territory;
use App\Modules\Warehouse\Interfaces\TerritoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TerritoryService
{
    public function __construct(protected TerritoryRepositoryInterface $territoryRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->territoryRepository->all()->load('warehouses');
    }

    public function store(array $data): Territory
    {
        return DB::transaction(function () use ($data) {
            return $this->territoryRepository->create($data);
        });
    }

    public function show(string $id): Territory
    {
        $territory = $this->territoryRepository->find($id);
        if (!$territory) {
            abort(404, 'Territory not found');
        }
        return $territory;
    }

    public function update(string $id, array $data): Territory
    {
        return DB::transaction(function () use ($id, $data) {
            $this->territoryRepository->update($id, $data);
            return $this->territoryRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->territoryRepository->delete($id);
        });
    }
}
