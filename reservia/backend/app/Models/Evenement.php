<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'nom', 'description', 'categorie', 'lieu', 'ville',
        'departement', 'date_debut', 'date_fin', 'prix_fcfa',
        'capacite_totale', 'places_restantes', 'images', 'programme', 'actif',
    ];

    protected $casts = [
        'images'   => 'array',
        'programme' => 'array',
        'date_debut' => 'datetime',
        'date_fin'   => 'datetime',
        'actif'      => 'boolean',
    ];

    public function user()        { return $this->belongsTo(User::class); }
    public function reservations(){ return $this->morphMany(Reservation::class, 'reservable'); }

    public function scopeActif($q)              { return $q->where('actif', true); }
    public function scopeParCategorie($q, $c)   { return $c ? $q->where('categorie', $c) : $q; }
    public function scopeParVille($q, $v)       { return $v ? $q->where('ville', 'like', "%{$v}%") : $q; }
    public function scopeAvenir($q)             { return $q->where('date_debut', '>=', now()); }

    public function hasPlacesDisponibles(): bool { return $this->places_restantes > 0; }
}
