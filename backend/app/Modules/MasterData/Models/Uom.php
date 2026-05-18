<?php

namespace App\Modules\MasterData\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\Auditable;

class Uom extends Model
{
    use HasFactory, HasUuids, SoftDeletes, Auditable;

    protected $fillable = [
        'name',
        'code',
        'is_base',
        'parent_id',
        'conversion_factor',
        'is_active',
    ];

    protected $casts = [
        'is_base'           => 'boolean',
        'conversion_factor' => 'decimal:4',
        'is_active'         => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Uom::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Uom::class, 'parent_id');
    }
}
