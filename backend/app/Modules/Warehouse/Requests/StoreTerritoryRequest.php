<?php

namespace App\Modules\Warehouse\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTerritoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'        => 'required|string|max:50|unique:territories,code',
            'name'        => 'required|string|max:255',
            'region'      => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ];
    }
}
