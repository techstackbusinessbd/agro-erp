<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class BaseService
{
    // Type Hinting: এতে এডিটর জানবে এই ভ্যারিয়েবলের ভেতরে ইন্টারফেসের সব মেথড আছে
    protected EloquentRepositoryInterface $repository;

    public function __construct(EloquentRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(): Collection
    {
        return $this->repository->all();
    }

    public function store(array $data): Model
    {
        return $this->repository->create($data);
    }

    // UUID এর জন্য int এর বদলে string
    public function show(string $id): ?Model
    {
        return $this->repository->find($id);
    }

    // UUID এর জন্য int এর বদলে string
    public function update(string $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    // UUID এর জন্য int এর বদলে string
    public function destroy(string $id): bool
    {
        return $this->repository->delete($id);
    }
}
