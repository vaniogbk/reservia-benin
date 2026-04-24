<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->enum('methode', ['fedapay','cinetpay','mtn_momo','moov_money','carte']);
            $table->string('reference_externe', 100)->unique()->nullable();
            $table->unsignedInteger('montant_fcfa');
            $table->enum('statut', ['en_attente','reussi','echoue','rembourse'])->default('en_attente');
            $table->string('recu_pdf_url')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('paye_le')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('paiements'); }
};
