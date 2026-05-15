<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\Company;
use App\Modules\Core\Interfaces\CompanyRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CompanyService
{
    public function __construct(protected CompanyRepositoryInterface $companyRepository)
    {
    }

    public function getAll(): Collection
    {
        // レпозиটরি থেকে সব ডাটা নেওয়া হচ্ছে
        return $this->companyRepository->all();
    }

    public function store(array $data): Company
    {
        return DB::transaction(function () use ($data) {
            return $this->companyRepository->create($data);
        });
    }

    public function show(string $id): Company
    {
        // ডাটা না পেলে অটোমেটিক 404 এরর থ্রো করবে
        $company = $this->companyRepository->find($id);
        if (!$company) {
            abort(404, 'Company not found');
        }
        return $company;
    }

    // UUID-এর জন্য string এবং রিটার্ন টাইপ Company
    public function update(string $id, array $data): Company
    {
        return DB::transaction(function () use ($id, $data) {
            $this->companyRepository->update($id, $data);
            return $this->companyRepository->find($id);
        });
    }

    // UUID-এর জন্য string এবং রিটার্ন টাইপ bool
    public function destroy(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            return $this->companyRepository->delete($id);
        });
    }
}
