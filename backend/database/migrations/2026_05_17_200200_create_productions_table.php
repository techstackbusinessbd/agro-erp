<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('production_no')->unique(); // PRD-000001
            $table->uuid('product_id');   // Finished Good to produce
            $table->uuid('recipe_id');    // Which BOM recipe to use
            $table->decimal('target_qty', 15, 2); // Desired output quantity
            $table->uuid('raw_material_warehouse_id');   // Source of raw ingredients
            $table->uuid('finished_goods_warehouse_id'); // Destination for finished goods

            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');

            $table->date('production_date');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            // Finished goods batch output info
            $table->string('batch_no')->nullable();
            $table->date('expiry_date')->nullable();

            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('recipe_id')->references('id')->on('recipes')->onDelete('cascade');
            $table->foreign('raw_material_warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
            $table->foreign('finished_goods_warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productions');
    }
};
