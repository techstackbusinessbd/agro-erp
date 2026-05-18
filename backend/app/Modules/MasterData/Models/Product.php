<?php

namespace App\Modules\MasterData\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\MultitenantScope;
use App\Traits\Auditable;

class Product extends Model
{
    use HasUuids, SoftDeletes, MultitenantScope, Auditable;

    protected $fillable = [
        'code',
        'name',
        'type',
        'category_id',
        'uom_id',
        'description',
        'is_active',
        'batch_required',
        'price',
        'tax_rate',
        'approval_status',
    ];

    protected $casts = [
        'is_active'      => 'boolean',
        'batch_required' => 'boolean',
        'price'          => 'decimal:2',
        'tax_rate'       => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function uom(): BelongsTo
    {
        return $this->belongsTo(Uom::class, 'uom_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'product_id')
                    ->orderBy('sort_order')
                    ->orderBy('created_at');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(ProductBatch::class, 'product_id');
    }
}
