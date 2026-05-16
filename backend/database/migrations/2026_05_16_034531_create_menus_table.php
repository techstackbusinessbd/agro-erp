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
        Schema::create('menus', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('label');
            $table->string('path')->nullable();
            $table->string('icon')->nullable();
            $table->uuid('parent_id')->nullable();
            $table->integer('order')->default(0);
            $table->enum('type', ['header', 'item'])->default('item');
            $table->string('permission')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
