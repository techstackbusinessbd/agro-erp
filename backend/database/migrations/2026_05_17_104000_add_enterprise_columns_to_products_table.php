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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('batch_required')->default(false)->after('is_active');
            $table->decimal('price', 15, 2)->default(0.00)->after('batch_required');
            $table->decimal('tax_rate', 5, 2)->default(0.00)->after('price'); // VAT/GST %
            $table->enum('approval_status', ['draft', 'pending', 'approved'])->default('approved')->after('tax_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['batch_required', 'price', 'tax_rate', 'approval_status']);
        });
    }
};
