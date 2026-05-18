<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\MasterData\Models\Product;
use App\Traits\Auditable;

class Production extends Model
{
    use HasUuids, SoftDeletes, Auditable;

    protected $fillable = [
        'production_no',
        'product_id',
        'recipe_id',
        'target_qty',
        'raw_material_warehouse_id',
        'finished_goods_warehouse_id',
        'status',
        'production_date',
        'started_at',
        'completed_at',
        'batch_no',
        'expiry_date',
        'remarks',
    ];

    protected $casts = [
        'production_date' => 'date',
        'expiry_date'     => 'date',
        'started_at'      => 'datetime',
        'completed_at'    => 'datetime',
        'target_qty'      => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class, 'recipe_id');
    }

    public function rawMaterialWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'raw_material_warehouse_id');
    }

    public function finishedGoodsWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'finished_goods_warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProductionItem::class, 'production_id');
    }
}
