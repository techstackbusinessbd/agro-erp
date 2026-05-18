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
        Schema::create('purchase_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('purchase_id');
            $table->uuid('product_id'); // Raw Chemical / Packaging product
            $table->decimal('quantity', 15, 2);
            $table->decimal('rate', 15, 2); // Purchase rate
            $table->decimal('amount', 15, 2); // Calculated in BDT: qty * rate * conversion_rate
            $table->string('batch_no')->nullable(); // Lot Chemical batch
            $table->date('expiry_date')->nullable(); // Lot Chemical Expiration Date
            
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('purchase_id')->references('id')->on('purchases')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
