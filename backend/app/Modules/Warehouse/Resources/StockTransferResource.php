<?php

namespace App\Modules\Warehouse\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockTransferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'code'                     => $this->code,
            'source_warehouse_id'      => $this->source_warehouse_id,
            'source_warehouse_code'    => $this->sourceWarehouse?->code,
            'source_warehouse_name'    => $this->sourceWarehouse?->name,
            'destination_warehouse_id' => $this->destination_warehouse_id,
            'destination_warehouse_code' => $this->destinationWarehouse?->code,
            'destination_warehouse_name' => $this->destinationWarehouse?->name,
            'status'                   => $this->status,
            'remarks'                  => $this->remarks,
            'shipped_at'               => $this->shipped_at?->toIso8601String(),
            'received_at'              => $this->received_at?->toIso8601String(),
            'created_at'               => $this->created_at?->toIso8601String(),
            'items'                    => $this->items->map(function ($item) {
                return [
                    'id'                 => $item->id,
                    'product_id'         => $item->product_id,
                    'product_code'       => $item->product?->code,
                    'product_name'       => $item->product?->name,
                    'uom_code'           => $item->product?->uom?->code,
                    'quantity_requested' => (float) $item->quantity_requested,
                    'quantity_shipped'   => $item->quantity_shipped !== null ? (float) $item->quantity_shipped : null,
                    'quantity_received'  => $item->quantity_received !== null ? (float) $item->quantity_received : null,
                ];
            }),
        ];
    }
}
