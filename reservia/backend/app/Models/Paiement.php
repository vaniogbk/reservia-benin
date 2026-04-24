<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id', 'methode', 'reference_externe',
        'montant_fcfa', 'statut', 'recu_pdf_url', 'paye_le', 'metadata',
    ];

    protected $casts = [
        'paye_le'  => 'datetime',
        'metadata' => 'array',
    ];

    public function reservation() { return $this->belongsTo(Reservation::class); }

    public function estReussi(): bool { return $this->statut === 'reussi'; }
}
