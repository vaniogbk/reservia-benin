<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Ajouter company_id aux utilisateurs
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('avatar')
                  ->constrained('companies')->nullOnDelete();
            $table->enum('role', ['client', 'prestataire', 'admin', 'company_admin', 'super_admin'])
                  ->default('client')->change();
        });

        // Ajouter company_id aux hébergements
        Schema::table('hebergements', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('user_id')
                  ->constrained('companies')->nullOnDelete();
        });

        // Ajouter company_id aux événements
        Schema::table('evenements', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('user_id')
                  ->constrained('companies')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('evenements', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Company::class);
            $table->dropColumn('company_id');
        });

        Schema::table('hebergements', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Company::class);
            $table->dropColumn('company_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Company::class);
            $table->dropColumn('company_id');
            $table->enum('role', ['client', 'prestataire', 'admin'])->default('client')->change();
        });
    }
};
