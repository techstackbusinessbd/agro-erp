<?php

namespace App\Modules\Warehouse\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\MasterData\Models\Product;

class StockTransferOrderItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'stock_transfer_order_id',
        'product_id',
        'quantity_requested',
        'quantity_shipped',
        'quantity_received',
    ];

    protected $casts = [
        'quantity_requested' => 'decimal:2',
        'quantity_shipped'   => 'decimal:2',
        'quantity_received'  => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(StockTransferOrder::class, 'stock_transfer_order_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
