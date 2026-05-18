<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\MasterData\Models\Product;

class ProductionItem extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'production_id',
        'product_id',
        'planned_qty',
        'actual_qty',
        'batch_no',
    ];

    protected $casts = [
        'planned_qty' => 'decimal:2',
        'actual_qty'  => 'decimal:2',
    ];

    public function production(): BelongsTo
    {
        return $this->belongsTo(Production::class, 'production_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
