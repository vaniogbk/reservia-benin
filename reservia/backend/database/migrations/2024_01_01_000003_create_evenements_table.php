<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom', 200);
            $table->text('description')->nullable();
            $table->enum('categorie', ['vodoun','gastronomie','culture','seminaire','nature','art']);
            $table->string('lieu', 200);
            $table->string('ville', 100);
            $table->string('departement', 50);
            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable();
            $table->unsignedInteger('prix_fcfa');
            $table->unsignedInteger('capacite_totale');
            $table->unsignedInteger('places_restantes');
            $table->json('images')->nullable();
            $table->json('programme')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('evenements'); }
};
