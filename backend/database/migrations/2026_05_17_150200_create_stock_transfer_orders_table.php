<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_transfer_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->uuid('source_warehouse_id')->nullable();
            $table->uuid('destination_warehouse_id')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'shipped', 'received', 'cancelled'])->default('draft');
            $table->text('remarks')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('source_warehouse_id')
                  ->references('id')
                  ->on('warehouses')
                  ->onDelete('set null');

            $table->foreign('destination_warehouse_id')
                  ->references('id')
                  ->on('warehouses')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transfer_orders');
    }
};
