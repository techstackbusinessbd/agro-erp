<?php

namespace App\Modules\MasterData\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'product_id'      => $this->product_id,
            'pack_size'       => $this->pack_size,
            'sku_code'        => $this->sku_code,
            'rate_per_ct'     => (float) $this->rate_per_ct,
            'commission_rate' => (float) $this->commission_rate,
            'is_active'       => (bool) $this->is_active,
            'sort_order'      => (int) $this->sort_order,
            'created_at'      => $this->created_at?->toIso8601String(),
        ];
    }
}
