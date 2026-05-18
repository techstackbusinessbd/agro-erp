<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_transfer_order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stock_transfer_order_id');
            $table->uuid('product_id');
            $table->decimal('quantity_requested', 12, 2);
            $table->decimal('quantity_shipped', 12, 2)->nullable();
            $table->decimal('quantity_received', 12, 2)->nullable();
            $table->timestamps();

            $table->foreign('stock_transfer_order_id')
                  ->references('id')
                  ->on('stock_transfer_orders')
                  ->onDelete('cascade');

            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transfer_order_items');
    }
};
