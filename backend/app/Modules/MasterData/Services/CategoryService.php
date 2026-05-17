<?php

namespace App\Modules\MasterData\Services;

use App\Modules\MasterData\Models\Category;
use App\Modules\MasterData\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function __construct(protected CategoryRepositoryInterface $categoryRepository)
    {
    }

    public function getAll(): Collection
    {
        return $this->categoryRepository->all();
    }

    public function store(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            return $this->categoryRepository->create($data);
        });
    }

    public function show(string $id): Category
    {
        $category = $this->categoryRepository->find($id);
        if (!$category) {
            abort(404, 'Category not found');
        }
        return $category;
    }

    public function update(string $id, array $data): Category
    {
        return DB::transaction(function () use ($id, $data) {
            $this->categoryRepository->update($id, $data);
            return $this->categoryRepository->find($id);
        });
    }

    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->categoryRepository->delete($id);
        });
    }
}
