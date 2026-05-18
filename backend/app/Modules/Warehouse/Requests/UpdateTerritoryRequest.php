<?php

namespace App\Modules\Warehouse\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTerritoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('territory');

        return [
            'code'        => "required|string|max:50|unique:territories,code,{$id}",
            'name'        => 'required|string|max:255',
            'region'      => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ];
    }
}
