<?php

namespace App\Modules\Core\Models;

use App\Models\BaseModel;
use App\Enums\GeneralStatus;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends BaseModel
{
    // ডাটা হাইড করার জন্য SoftDeletes ব্যবহার করছি
    use SoftDeletes, HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\CompanyFactory::new();
    }

    protected $table = 'companies';

    // Mass assignment এর জন্য কোন কলামগুলো উন্মুক্ত থাকবে
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'logo',
        'status',
        'currency',
        'timezone'
    ];

    /**
     * Senior Logic: Enum Casting
     * ডাটাবেজ থেকে যখন status আসবে, লারাভেল অটোমেটিক সেটিকে GeneralStatus Enum অবজেক্টে রূপান্তর করবে।
     */
    protected $casts = [
        'status' => GeneralStatus::class,
    ];
}
