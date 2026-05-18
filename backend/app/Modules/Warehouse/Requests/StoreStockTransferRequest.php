<?php

namespace App\Modules\Warehouse\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'source_warehouse_id'      => 'required|uuid|exists:warehouses,id',
            'destination_warehouse_id' => 'required|uuid|exists:warehouses,id|different:source_warehouse_id',
            'remarks'                  => 'nullable|string|max:1000',
            'items'                    => 'required|array|min:1',
            'items.*.product_id'       => 'required|uuid|exists:products,id',
            'items.*.quantity_requested'=> 'required|numeric|gt:0',
        ];
    }
}
