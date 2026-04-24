<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hebergement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'nom', 'description', 'type', 'ville', 'departement',
        'adresse', 'latitude', 'longitude', 'prix_nuit_fcfa', 'nb_chambres',
        'capacite_max', 'commodites', 'images', 'actif', 'note_moyenne', 'nb_avis',
    ];

    protected $casts = [
        'commodites' => 'array',
        'images' => 'array',
        'actif' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'note_moyenne' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservations()
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }

    public function disponibilites()
    {
        return $this->hasMany(Disponibilite::class);
    }

    public function avis()
    {
        return $this->morphMany(Avis::class, 'notable');
    }

    // Scopes de filtrage
    public function scopeActif($query)
    {
        return $query->where('actif', true);
    }

    public function scopeParVille($query, $ville)
    {
        return $ville ? $query->where('ville', 'like', "%{$ville}%") : $query;
    }

    public function scopeParType($query, $type)
    {
        return $type ? $query->where('type', $type) : $query;
    }

    public function scopePrixMax($query, $max)
    {
        return $max ? $query->where('prix_nuit_fcfa', '<=', $max) : $query;
    }

    public function scopeCapacite($query, $nb)
    {
        return $nb ? $query->where('capacite_max', '>=', $nb) : $query;
    }

    public function datesReservees(): array
    {
        return $this->reservations()
            ->where('statut', '!=', 'annulee')
            ->get()
            ->flatMap(function ($r) {
                $dates = [];
                $current = \Carbon\Carbon::parse($r->date_arrivee);
                $end = \Carbon\Carbon::parse($r->date_depart);
                while ($current->lt($end)) {
                    $dates[] = $current->format('Y-m-d');
                    $current->addDay();
                }
                return $dates;
            })
            ->unique()
            ->values()
            ->toArray();
    }
}
