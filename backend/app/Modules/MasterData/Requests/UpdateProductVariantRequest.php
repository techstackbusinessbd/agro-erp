<?php

namespace App\Modules\MasterData\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $variantId = $this->route('variant');

        return [
            'pack_size'       => 'required|string|max:100',
            'sku_code'        => "nullable|string|max:100|unique:product_variants,sku_code,{$variantId}",
            'rate_per_ct'     => 'required|numeric|min:0',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'is_active'       => 'boolean',
            'sort_order'      => 'nullable|integer|min:0',
        ];
    }
}
