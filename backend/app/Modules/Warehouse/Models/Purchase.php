<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\MultitenantScope;
use App\Traits\Auditable;

class Purchase extends Model
{
    use HasUuids, SoftDeletes, MultitenantScope, Auditable;

    protected $fillable = [
        'purchase_no',
        'supplier_id',
        'warehouse_id',
        'type',
        'purchase_date',
        'lc_no',
        'lc_date',
        'conversion_rate',
        'total_amount',
        'status',
        'received_at',
        'remarks',
    ];

    protected $casts = [
        'purchase_date'   => 'date',
        'lc_date'         => 'date',
        'received_at'     => 'datetime',
        'conversion_rate' => 'decimal:2',
        'total_amount'    => 'decimal:2',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class, 'purchase_id');
    }
}
