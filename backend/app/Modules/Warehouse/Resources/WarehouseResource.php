<?php

namespace App\Modules\Warehouse\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'code'           => $this->code,
            'name'           => $this->name,
            'type'           => $this->type,
            'territory_id'    => $this->territory_id,
            'territory_name'  => $this->territory?->name,
            'territory_code'  => $this->territory?->code,
            'warehouse_id'    => $this->warehouse_id,
            'warehouse_name'  => $this->sourceWarehouse?->name,
            'warehouse_code'  => $this->sourceWarehouse?->code,
            'address'        => $this->address,
            'city'           => $this->city,
            'phone'          => $this->phone,
            'capacity'       => $this->capacity ? (float) $this->capacity : null,
            'is_active'      => (bool) $this->is_active,
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}

