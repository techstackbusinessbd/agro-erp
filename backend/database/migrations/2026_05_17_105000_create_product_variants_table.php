<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('pack_size', 100);           // e.g. "1kg*20", "500ml*10"
            $table->string('sku_code', 100)->nullable(); // e.g. "VZM-1KG20"
            $table->decimal('rate_per_ct', 15, 2)->default(0);   // Rate per carton
            $table->decimal('commission_rate', 5, 2)->default(0); // Commission %
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
