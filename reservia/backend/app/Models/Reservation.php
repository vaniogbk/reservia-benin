<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'user_id', 'reservable_id', 'reservable_type',
        'date_arrivee', 'date_depart', 'nb_personnes',
        'montant_ht_fcfa', 'frais_service_fcfa', 'taxes_fcfa', 'montant_total_fcfa',
        'statut', 'demandes_speciales',
    ];

    protected $casts = [
        'date_arrivee' => 'date',
        'date_depart'  => 'date',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($r) {
            $r->reference = 'RES-' . date('Y') . '-' . strtoupper(Str::random(6));
        });
    }

    public function user()       { return $this->belongsTo(User::class); }
    public function reservable() { return $this->morphTo(); }
    public function paiement()   { return $this->hasOne(Paiement::class); }

    public function getNbreNuitsAttribute(): int
    {
        if (!$this->date_arrivee || !$this->date_depart) return 0;
        return $this->date_arrivee->diffInDays($this->date_depart);
    }

    public static function calculerMontant(int $prixBase, int $nbNuits = 1): array
    {
        $ht    = $prixBase * $nbNuits;
        $frais = (int) ($ht * 0.05);   // 5% frais de service
        $taxes = (int) ($ht * 0.03);   // 3% taxes
        return ['ht' => $ht, 'frais' => $frais, 'taxes' => $taxes, 'total' => $ht + $frais + $taxes];
    }
}
