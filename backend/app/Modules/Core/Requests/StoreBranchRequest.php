<?php

namespace App\Modules\Core\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'uuid', 'exists:companies,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                // Unique name per company
                Rule::unique('branches')->where(function ($query) {
                    return $query->where('company_id', $this->company_id);
                })
            ],
            'code' => ['nullable', 'string', 'max:50', 'unique:branches,code'],
            'is_active' => ['boolean'],
        ];
    }
}
