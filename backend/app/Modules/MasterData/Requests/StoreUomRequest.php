<?php

namespace App\Modules\MasterData\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'              => ['required', 'string', 'max:255'],
            'code'              => ['required', 'string', 'max:50', 'unique:uoms,code'],
            'is_base'           => ['boolean'],
            'parent_id'         => ['nullable', 'uuid', 'exists:uoms,id'],
            'conversion_factor' => ['required_if:is_base,false', 'numeric', 'min:0.0001'],
            'is_active'         => ['boolean'],
        ];
    }
}
