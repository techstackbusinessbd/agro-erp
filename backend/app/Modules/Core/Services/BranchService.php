<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\Branch;
use App\Modules\Core\Interfaces\BranchRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class BranchService
{
    public function __construct(protected BranchRepositoryInterface $branchRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->branchRepository->all();
    }

    public function store(array $data): Branch
    {
        return DB::transaction(function () use ($data) {
            return $this->branchRepository->create($data);
        });
    }

    public function show(string $id): Branch
    {
        $branch = $this->branchRepository->find($id);
        if (!$branch) {
            abort(404, 'Branch not found');
        }
        return $branch;
    }

    public function update(string $id, array $data): Branch
    {
        return DB::transaction(function () use ($id, $data) {
            $this->branchRepository->update($id, $data);
            return $this->branchRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->branchRepository->delete($id);
        });
    }
}
