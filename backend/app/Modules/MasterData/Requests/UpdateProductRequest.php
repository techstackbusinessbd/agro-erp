<?php

namespace App\Modules\MasterData\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('product');

        return [
            'code'           => "required|string|max:50|unique:products,code,{$id}",
            'name'           => 'required|string|max:255',
            'category_id'   => 'nullable|uuid|exists:categories,id',
            'uom_id'         => 'nullable|uuid|exists:uoms,id',
            'description'    => 'nullable|string|max:1000',
            'is_active'      => 'boolean',
            'batch_required' => 'boolean',
            'price'          => 'nullable|numeric|min:0',
            'tax_rate'       => 'nullable|numeric|min:0|max:100',
            'variants'                 => 'nullable|array',
            'variants.*.id'            => 'nullable|uuid|exists:product_variants,id',
            'variants.*.pack_size'     => 'required|string|max:100',
            'variants.*.sku_code'      => 'nullable|string|max:100',
            'variants.*.rate_per_ct'   => 'required|numeric|min:0',
            'variants.*.commission_rate' => 'required|numeric|min:0|max:100',
            'variants.*.is_active'     => 'boolean',
        ];
    }
}
