<?php

namespace App\Modules\Warehouse\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'        => 'required|string|max:50|unique:warehouses,code',
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:raw_material,finished_goods,depot,cold_storage,transit,distribution_center,quarantine',
            'territory_id'=> 'nullable|uuid|exists:territories,id',
            'warehouse_id' => 'nullable|uuid|exists:warehouses,id',
            'address'     => 'nullable|string|max:500',
            'city'        => 'nullable|string|max:100',
            'phone'       => 'nullable|string|max:20',
            'capacity'    => 'nullable|numeric|min:0',
            'is_active'   => 'boolean',
        ];
    }
}
