<?php

namespace App\Modules\Core\Repositories;

use App\Modules\Core\Interfaces\EloquentRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

class BaseRepository implements EloquentRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function find(string $id): ?Model
    {
        // ইন্টারফেসে ?Model দেওয়া আছে, তাই findOrFail এর বদলে find ব্যবহার করা হলো
        // ডাটা না পেলে এটি null রিটার্ন করবে, এরর দিয়ে ক্র্যাশ করবে না
        return $this->model->find($id);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): bool
    {
        // আপডেট করার আগে ডাটা আছে কিনা নিশ্চিত হওয়া
        $record = $this->model->findOrFail($id);
        return $record->update($data);
    }

    public function delete(string $id): bool
    {
        $record = $this->model->findOrFail($id);
        return $record->delete();
    }
}
