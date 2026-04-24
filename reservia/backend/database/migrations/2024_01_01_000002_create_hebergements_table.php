<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('hebergements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom', 200);
            $table->text('description')->nullable();
            $table->enum('type', ['hotel', 'ecolodge', 'gite', 'villa', 'auberge']);
            $table->string('ville', 100);
            $table->string('departement', 50);
            $table->text('adresse')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->unsignedInteger('prix_nuit_fcfa');
            $table->unsignedSmallInteger('nb_chambres')->default(1);
            $table->unsignedSmallInteger('capacite_max');
            $table->json('commodites')->nullable();
            $table->json('images')->nullable();
            $table->decimal('note_moyenne', 3, 2)->default(0);
            $table->unsignedInteger('nb_avis')->default(0);
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('hebergements');
    }
};
