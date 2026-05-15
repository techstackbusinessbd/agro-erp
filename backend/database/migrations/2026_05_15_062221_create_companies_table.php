<?php

use App\Enums\GeneralStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key

            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('logo')->nullable();

            // Status with Enum default value
            $table->string('status')->default(GeneralStatus::ACTIVE->value);

            $table->string('currency', 10)->default('BDT');
            $table->string('timezone', 50)->default('Asia/Dhaka');

            // Audit Fields
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();

            // Soft Deletes & Timestamps
            $table->softDeletes();
            $table->timestamps();

            // Indexing
            $table->index(['status', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
