<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->uuid('territory_id')->nullable()->after('type');
        });

        Schema::table('warehouses', function (Blueprint $table) {
            $table->foreign('territory_id')
                  ->references('id')
                  ->on('territories')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropForeign(['territory_id']);
            $table->dropColumn('territory_id');
        });
    }
};
