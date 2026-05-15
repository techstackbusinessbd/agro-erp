<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Branch ID from route parameter (e.g. branch/{id})
        $branchId = $this->route('branch'); // Or depending on how the route parameter is named

        return [
            'company_id' => ['sometimes', 'required', 'uuid', 'exists:companies,id'],
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('branches')->where(function ($query) {
                    return $query->where('company_id', $this->company_id ?? $this->branch->company_id ?? null);
                })->ignore($branchId),
            ],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('branches')->ignore($branchId)],
            'is_active' => ['boolean'],
        ];
    }
}
