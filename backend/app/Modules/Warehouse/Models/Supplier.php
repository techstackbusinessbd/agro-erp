<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\MultitenantScope;
use App\Traits\Auditable;

class Supplier extends Model
{
    use HasUuids, SoftDeletes, MultitenantScope, Auditable;

    protected $fillable = [
        'code',
        'name',
        'phone',
        'email',
        'address',
        'origin',
        'remarks',
    ];

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class, 'supplier_id');
    }
}
