<?php

namespace App\Modules\MasterData\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class ProductVariant extends Model
{
    use HasUuids, SoftDeletes, Auditable;

    protected $fillable = [
        'product_id',
        'pack_size',
        'sku_code',
        'rate_per_ct',
        'commission_rate',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'rate_per_ct'     => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'is_active'       => 'boolean',
        'sort_order'      => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
