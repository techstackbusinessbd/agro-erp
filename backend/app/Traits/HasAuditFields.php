<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait HasAuditFields
{
    protected static function bootHasAuditFields()
    {
        // যখনই নতুন কোনো রেকর্ড তৈরি হবে
        static::creating(function ($model) {
            if (Auth::check()) {
                $model->created_by = $model->created_by ?? Auth::id();
                // এন্টারপ্রাইজ লেভেলে কোম্পানি আইডি ট্র্যাকিং করা খুব জরুরি
                $model->company_id = $model->company_id ?? Auth::user()->company_id ?? null;
            }
        });

        // যখনই কোনো রেকর্ড আপডেট হবে
        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::id();
            }
        });
    }
}
