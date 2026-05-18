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
        Schema::create('categories', function (Blueprint $table) {
            // Primary Key as UUID
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();

            // Category Details
            $table->string('name');
            $table->string('slug')->unique(); // URL ফ্রেন্ডলি ইউনিক স্ল্যাগ
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);

            // System fields
            $table->softDeletes(); // Soft deletes এনাবল করার জন্য
            $table->timestamps();
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
