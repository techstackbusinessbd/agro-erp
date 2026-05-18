<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\MultitenantScope;
use App\Traits\Auditable;

class Warehouse extends Model
{
    use HasUuids, SoftDeletes, MultitenantScope, Auditable;

    protected $fillable = [
        'code',
        'name',
        'type',
        'territory_id',
        'warehouse_id',
        'address',
        'city',
        'phone',
        'capacity',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacity'  => 'decimal:2',
    ];

    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class, 'territory_id');
    }

    /** The central warehouse that supplies this depot */
    public function sourceWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }

    /** Depots that receive stock from this warehouse */
    public function depots(): HasMany
    {
        return $this->hasMany(Warehouse::class, 'warehouse_id')
                    ->where('type', 'depot');
    }
}
