<?php

namespace App\Modules\Core\Interfaces;

use App\Models\User;

interface UserRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?User;
    public function create(array $data): User;
    public function paginate(int $perPage = 10, ?string $search = null);
}
