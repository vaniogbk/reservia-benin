<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 20)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('reservable');
            $table->date('date_arrivee')->nullable();
            $table->date('date_depart')->nullable();
            $table->unsignedSmallInteger('nb_personnes')->default(1);
            $table->unsignedInteger('montant_ht_fcfa');
            $table->unsignedInteger('frais_service_fcfa')->default(0);
            $table->unsignedInteger('taxes_fcfa')->default(0);
            $table->unsignedInteger('montant_total_fcfa');
            $table->enum('statut', ['en_attente','confirmee','annulee','remboursee'])->default('en_attente');
            $table->text('demandes_speciales')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('reservations'); }
};
