<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

/**
 * @method static void creating(\Closure|string|array $callback)
 * @method static void updating(\Closure|string|array $callback)
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait HasAuditFields
{
    protected static function bootHasAuditFields()
    {
        static::creating(function ($model) {
            /** @var \Illuminate\Database\Eloquent\Model $model */
            if (Auth::check()) {
                $model->setAttribute('created_by', $model->getAttribute('created_by') ?? Auth::id());
                
                if (\Illuminate\Support\Facades\Schema::hasColumn($model->getTable(), 'company_id')) {
                    /** @var \App\Models\User $user */
                    $user = Auth::user();
                    $model->setAttribute('company_id', $model->getAttribute('company_id') ?? $user->company_id ?? null);
                }
            }
        });

        static::updating(function ($model) {
            /** @var \Illuminate\Database\Eloquent\Model $model */
            if (Auth::check()) {
                $model->setAttribute('updated_by', Auth::id());
            }
        });
    }
}
