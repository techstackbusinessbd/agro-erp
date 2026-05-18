<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\MasterData\Models\Product;

use App\Traits\MultitenantScope;
use App\Traits\Auditable;

class Stock extends Model
{
    use HasUuids, MultitenantScope, Auditable;

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'physical_qty',
        'transit_qty',
    ];

    protected $casts = [
        'physical_qty' => 'decimal:2',
        'transit_qty'  => 'decimal:2',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
