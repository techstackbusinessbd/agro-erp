<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\MultitenantScope;
use App\Traits\Auditable;

class StockTransferOrder extends Model
{
    use HasUuids, SoftDeletes, MultitenantScope, Auditable;

    protected $fillable = [
        'code',
        'source_warehouse_id',
        'destination_warehouse_id',
        'status',
        'remarks',
        'shipped_at',
        'received_at',
    ];

    protected $casts = [
        'shipped_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    public function sourceWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'source_warehouse_id');
    }

    public function destinationWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'destination_warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockTransferOrderItem::class, 'stock_transfer_order_id');
    }
}
