<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\MasterData\Models\Product;
use App\Traits\Auditable;

class Recipe extends Model
{
    use HasUuids, SoftDeletes, Auditable;

    protected $fillable = [
        'name',
        'product_id',
        'batch_size',
        'is_active',
        'remarks',
    ];

    protected $casts = [
        'batch_size' => 'decimal:2',
        'is_active'  => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(RecipeItem::class, 'recipe_id');
    }

    public function productions(): HasMany
    {
        return $this->hasMany(Production::class, 'recipe_id');
    }
}
