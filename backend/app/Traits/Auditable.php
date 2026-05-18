<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    /**
     * Boot the auditable trait for the model.
     */
    protected static function bootAuditable()
    {
        static::created(function ($model) {
            static::logAudit('CREATE', $model, null, $model->getAttributes());
        });

        static::updated(function ($model) {
            $dirty = $model->getDirty();
            $old = [];
            $new = [];

            // Ignore system timestamp updates or tokens if they are the only changes
            unset($dirty['updated_at']);

            if (empty($dirty)) {
                return;
            }

            foreach ($dirty as $key => $value) {
                $old[$key] = $model->getOriginal($key);
                $new[$key] = $value;
            }

            static::logAudit('UPDATE', $model, $old, $new);
        });

        static::deleted(function ($model) {
            static::logAudit('DELETE', $model, $model->getAttributes(), null);
        });
    }

    /**
     * Write an audit log entry.
     */
    protected static function logAudit(string $action, $model, ?array $oldValues, ?array $newValues)
    {
        // Don't audit the AuditLog model itself to avoid infinite loops
        if ($model instanceof AuditLog) {
            return;
        }

        // Filter out sensitive fields
        $sensitive = ['password', 'remember_token', 'token'];
        if ($oldValues) {
            $oldValues = array_diff_key($oldValues, array_flip($sensitive));
        }
        if ($newValues) {
            $newValues = array_diff_key($newValues, array_flip($sensitive));
        }

        AuditLog::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
        ]);
    }
}
