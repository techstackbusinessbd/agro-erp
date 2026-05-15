<?php

namespace App\Modules\Core\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

interface EloquentRepositoryInterface
{
    public function all(): Collection;

    public function find(string $id): ?Model;

    public function create(array $data): Model;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
