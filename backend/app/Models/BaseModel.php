<?php

namespace App\Models;

use App\Traits\HasAuditFields; // এটি আমরা পরের ধাপে তৈরি করব
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    // সব মডেলের জন্য ডিফল্টভাবে এই ট্রেইটটি কাজ করবে
    use HasAuditFields, HasUuids;

    // লারাভেলকে বলে দিচ্ছি যে আমাদের আইডিগুলো হবে string (text) এবং auto-increment হবে না
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * mass assignment প্রোটেকশন থেকে আইডিকে বাদ রাখা।
     * আমরা যেহেতু রিপোজিটরি লেভেলে ডাটা ভ্যালিডেট করব, তাই এটি নিরাপদ।
     */
    protected $guarded = ['id'];
}
