<?php

namespace App\Modules\Core\Repositories;

use App\Modules\Core\Models\Company;
use App\Modules\Core\Interfaces\CompanyRepositoryInterface;

class CompanyRepository extends BaseRepository implements CompanyRepositoryInterface
{
    public function __construct(Company $model)
    {
        parent::__construct($model);
    }

    public function find(string $id): ?Company
    {
        /** @var Company|null $company */
        $company = parent::find($id);
        
        return $company;
    }

    public function create(array $data): Company
    {
        /** @var Company $company */
        $company = parent::create($data);
        
        return $company;
    }
}
