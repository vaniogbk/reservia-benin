<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 150);
            $table->string('slug', 150)->unique();
            $table->text('description')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('email_contact', 191)->unique();
            $table->string('telephone', 20)->nullable();
            $table->string('ville', 100)->nullable();
            $table->string('pays', 100)->default('Bénin');
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
