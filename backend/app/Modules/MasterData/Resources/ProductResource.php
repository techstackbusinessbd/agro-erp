<?php

namespace App\Modules\MasterData\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'code'            => $this->code,
            'name'            => $this->name,
            'category_id'     => $this->category_id,
            'category_name'   => $this->category?->name,
            'uom_id'          => $this->uom_id,
            'uom_name'        => $this->uom?->name,
            'uom_code'        => $this->uom?->code,
            'description'     => $this->description,
            'is_active'       => (bool) $this->is_active,
            'batch_required'  => (bool) $this->batch_required,
            'price'           => (float) ($this->price ?? 0),
            'tax_rate'        => (float) ($this->tax_rate ?? 0),
            'approval_status' => $this->approval_status,
            'variants'        => ProductVariantResource::collection($this->whenLoaded('variants')),
            'variants_count'  => $this->variants_count ?? 0,
            'created_at'      => $this->created_at?->toIso8601String(),
            'updated_at'      => $this->updated_at?->toIso8601String(),
        ];
    }
}
