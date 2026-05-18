<?php

namespace App\Modules\Warehouse\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'warehouse_id'   => $this->warehouse_id,
            'warehouse_code' => $this->warehouse?->code,
            'warehouse_name' => $this->warehouse?->name,
            'warehouse_type' => $this->warehouse?->type,
            'product_id'     => $this->product_id,
            'product_code'   => $this->product?->code,
            'product_name'   => $this->product?->name,
            'category_name'  => $this->product?->category?->name,
            'uom_code'       => $this->product?->uom?->code,
            'physical_qty'   => (float) $this->physical_qty,
            'transit_qty'    => (float) $this->transit_qty,
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
