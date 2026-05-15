<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Services\CompanyService;
use App\Modules\Core\Requests\StoreCompanyRequest;
use App\Modules\Core\Requests\UpdateCompanyRequest;
use App\Modules\Core\Resources\CompanyResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    use ApiResponse;

    public function __construct(protected CompanyService $companyService)
    {
    }

    /**
     * Display a listing of the companies.
     */
    public function index(): JsonResponse
    {
        $companies = $this->companyService->getAll();

        return $this->successResponse(
            CompanyResource::collection($companies),
            'Companies retrieved successfully.'
        );
    }

    /**
     * Store a newly created company in storage.
     */
    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $company = $this->companyService->store($request->validated());

        return $this->successResponse(
            new CompanyResource($company),
            'Company created successfully.',
            201
        );
    }

    /**
     * Display the specified company.
     * নীল দাগ ২ এর ফিক্স: UUID এর জন্য string $id দেওয়া হলো
     */
    public function show(string $id): JsonResponse
    {
        $company = $this->companyService->show($id);

        return $this->successResponse(
            new CompanyResource($company),
            'Company details retrieved successfully.'
        );
    }

    /**
     * Update the specified company in storage.
     * এখানেও string $id দেওয়া হলো
     */
    public function update(UpdateCompanyRequest $request, string $id): JsonResponse
    {
        // আপডেট করার পর লেটেস্ট ডাটাটি আবার তুলে আনা
        $company = $this->companyService->update($id, $request->validated());

        return $this->successResponse(
            new CompanyResource($company),
            'Company updated successfully.'
        );
    }

    /**
     * Remove the specified company from storage.
     * এখানেও string $id দেওয়া হলো
     */
    public function destroy(string $id): JsonResponse
    {
        $this->companyService->destroy($id);

        return $this->successResponse(
            null,
            'Company deleted successfully.'
        );
    }
}
