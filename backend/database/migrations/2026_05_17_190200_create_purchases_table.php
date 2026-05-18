<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('purchase_no')->unique();
            $table->uuid('supplier_id');
            $table->uuid('warehouse_id'); // Raw Material Destination Warehouse
            $table->enum('type', ['local', 'import'])->default('local');
            $table->date('purchase_date');
            
            // Import/LC Details
            $table->string('lc_no')->nullable();
            $table->date('lc_date')->nullable();
            $table->decimal('conversion_rate', 10, 2)->default(1.00); // Exchange rate to BDT
            
            $table->decimal('total_amount', 15, 2)->default(0.00); // Total price in BDT
            $table->enum('status', ['pending', 'received'])->default('pending');
            $table->timestamp('received_at')->nullable();
            $table->text('remarks')->nullable();
            
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');
            $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
