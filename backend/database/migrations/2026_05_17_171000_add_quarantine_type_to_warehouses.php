<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // For PostgreSQL, drop existing check constraint and add a new one including 'quarantine'
        DB::statement("ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS warehouses_type_check");
        DB::statement("ALTER TABLE warehouses ADD CONSTRAINT warehouses_type_check CHECK (type::text IN ('raw_material'::text, 'finished_goods'::text, 'depot'::text, 'cold_storage'::text, 'transit'::text, 'distribution_center'::text, 'quarantine'::text))");
    }

    public function down(): void
    {
        // Rollback check constraint to original values
        DB::statement("ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS warehouses_type_check");
        DB::statement("ALTER TABLE warehouses ADD CONSTRAINT warehouses_type_check CHECK (type::text IN ('raw_material'::text, 'finished_goods'::text, 'depot'::text, 'cold_storage'::text, 'transit'::text, 'distribution_center'::text))");
    }
};
