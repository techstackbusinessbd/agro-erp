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
        Schema::create('branches', function (Blueprint $table) {
            // Primary Key as UUID
            $table->uuid('id')->primary();

            // Foreign Key linking to companies table (UUID)
            $table->foreignUuid('company_id')
                ->constrained('companies')
                ->onDelete('cascade');

            // Branch Details
            $table->string('name');
            $table->string('code')->nullable();
            $table->boolean('is_active')->default(true);

            // System fields
            $table->softDeletes(); // Soft deletes এনাবল করার জন্য
            $table->timestamps();

            // Indexes & Uniqueness
            // একই কোম্পানির অধীনে যেন ডুপ্লিকেট ব্রাঞ্চের নাম না হয়
            $table->unique(['company_id', 'name']);
            // ব্রাঞ্চ কোড পুরো সিস্টেমে ইউনিক রাখার জন্য
            $table->unique('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
