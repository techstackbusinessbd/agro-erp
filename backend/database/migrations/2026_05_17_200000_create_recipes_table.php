<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g. "Abamectin 1.8% EC - 100ml Recipe"
            $table->uuid('product_id'); // Finished Good Product
            $table->decimal('batch_size', 15, 2); // Reference yield quantity per batch
            $table->boolean('is_active')->default(true);
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
