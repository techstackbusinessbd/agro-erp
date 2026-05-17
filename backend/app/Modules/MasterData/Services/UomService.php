<?php

namespace App\Modules\MasterData\Services;

use App\Modules\MasterData\Models\Uom;
use App\Modules\MasterData\Interfaces\UomRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UomService
{
    public function __construct(protected UomRepositoryInterface $uomRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->uomRepository->all();
    }

    public function store(array $data): Uom
    {
        return DB::transaction(function () use ($data) {
            return $this->uomRepository->create($data);
        });
    }

    public function show(string $id): Uom
    {
        $uom = $this->uomRepository->find($id);
        if (!$uom) {
            abort(404, 'Unit of Measurement not found');
        }
        return $uom;
    }

    public function update(string $id, array $data): Uom
    {
        return DB::transaction(function () use ($id, $data) {
            $this->uomRepository->update($id, $data);
            return $this->uomRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->uomRepository->delete($id);
        });
    }
}
