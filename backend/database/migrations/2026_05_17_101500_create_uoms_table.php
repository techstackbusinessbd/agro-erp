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
        Schema::create('uoms', function (Blueprint $table) {
            // Primary Key as UUID
            $table->uuid('id')->primary();

            // UOM Details
            $table->string('name');
            $table->string('code')->unique(); // UOM কোড যেমন kg, ltr, bag ইত্যাদি
            $table->boolean('is_base')->default(false);
            $table->uuid('parent_id')->nullable();
            $table->decimal('conversion_factor', 12, 4)->default(1.0000);
            $table->boolean('is_active')->default(true);

            // System fields
            $table->softDeletes(); // Soft deletes এনাবল করার জন্য
            $table->timestamps();
        });

        Schema::table('uoms', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('uoms')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uoms');
    }
};
