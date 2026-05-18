<?php

namespace App\Modules\MasterData\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Warehouse\Models\Warehouse;

use App\Traits\Auditable;

class ProductBatch extends Model
{
    use HasUuids, Auditable;

    protected $fillable = [
        'product_id',
        'warehouse_id',
        'batch_number',
        'mfg_date',
        'expiry_date',
        'qty_on_hand',
    ];

    protected $casts = [
        'mfg_date' => 'date',
        'expiry_date' => 'date',
        'qty_on_hand' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }
}
