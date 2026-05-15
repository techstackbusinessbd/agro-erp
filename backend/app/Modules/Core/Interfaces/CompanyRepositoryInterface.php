<?php

namespace App\Modules\Core\Interfaces;

use App\Modules\Core\Models\Company;

interface CompanyRepositoryInterface extends EloquentRepositoryInterface
{
    public function find(string $id): ?Company;
    public function create(array $data): Company;
}
