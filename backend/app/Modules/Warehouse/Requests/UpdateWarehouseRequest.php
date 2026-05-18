<?php

namespace App\Modules\Warehouse\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('warehouse');

        return [
            'code'        => "required|string|max:50|unique:warehouses,code,{$id}",
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:raw_material,finished_goods,depot,cold_storage,transit,distribution_center,quarantine',
            'territory_id'=> 'nullable|uuid|exists:territories,id',
            'warehouse_id' => [
                'nullable',
                'uuid',
                'exists:warehouses,id',
                function ($attribute, $value, $fail) use ($id) {
                    if ($value === $id) {
                        $fail('A warehouse/depot cannot be its own source warehouse.');
                    }
                }
            ],
            'address'     => 'nullable|string|max:500',
            'city'        => 'nullable|string|max:100',
            'phone'       => 'nullable|string|max:20',
            'capacity'    => 'nullable|numeric|min:0',
            'is_active'   => 'boolean',
        ];
    }
}
