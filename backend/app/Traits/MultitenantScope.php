<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

trait MultitenantScope
{
    /**
     * Boot the multitenant scope for the model.
     */
    protected static function bootMultitenantScope()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                
                // Automatically assign tenant parameters if not manually overridden
                if (Schema::hasColumn($model->getTable(), 'company_id')) {
                    $model->company_id = $model->company_id ?? $user->company_id;
                }
                
                if (Schema::hasColumn($model->getTable(), 'branch_id')) {
                    $model->branch_id = $model->branch_id ?? $user->branch_id;
                }
            }
        });

        static::addGlobalScope('multitenant', function (Builder $builder) {
            if (Auth::check()) {
                /** @var \App\Models\User $user */
                $user = Auth::user();
                
                // Super Admin sees all data
                if ($user->hasRole('Super Admin') || $user->role === 'super_admin') {
                    return;
                }
                
                $modelTable = $builder->getModel()->getTable();

                if (Schema::hasColumn($modelTable, 'company_id') && $user->company_id) {
                    $builder->where($modelTable . '.company_id', $user->company_id);
                }

                if (Schema::hasColumn($modelTable, 'branch_id') && $user->branch_id) {
                    $builder->where($modelTable . '.branch_id', $user->branch_id);
                }
            }
        });
    }
}
