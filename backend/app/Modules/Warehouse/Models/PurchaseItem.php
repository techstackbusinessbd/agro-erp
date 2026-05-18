<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\MasterData\Models\Product;

class PurchaseItem extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'rate',
        'amount',
        'batch_no',
        'expiry_date',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'quantity'    => 'decimal:2',
        'rate'        => 'decimal:2',
        'amount'      => 'decimal:2',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class, 'purchase_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
