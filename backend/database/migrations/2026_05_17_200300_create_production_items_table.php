<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('production_id');
            $table->uuid('product_id'); // Raw material or packaging consumed
            $table->decimal('planned_qty', 15, 2);
            $table->decimal('actual_qty', 15, 2)->default(0);
            $table->string('batch_no')->nullable(); // Specific raw chem lot consumed
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('production_id')->references('id')->on('productions')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_items');
    }
};
