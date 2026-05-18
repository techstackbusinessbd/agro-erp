<?php

namespace App\Modules\MasterData\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $uomId = $this->route('uom');

        return [
            'name'              => ['required', 'string', 'max:255'],
            'code'              => ['required', 'string', 'max:50', Rule::unique('uoms', 'code')->ignore($uomId)],
            'is_base'           => ['boolean'],
            'parent_id'         => [
                'nullable', 
                'uuid', 
                'exists:uoms,id',
                function ($attribute, $value, $fail) use ($uomId) {
                    if ($value === $uomId) {
                        $fail('A unit cannot be its own base unit.');
                    }
                }
            ],
            'conversion_factor' => ['required_if:is_base,false', 'numeric', 'min:0.0001'],
            'is_active'         => ['boolean'],
        ];
    }
}
