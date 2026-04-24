<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    protected $fillable = [
        'nom',
        'slug',
        'description',
        'logo_url',
        'email_contact',
        'telephone',
        'ville',
        'pays',
        'actif',
    ];

    protected function casts(): array
    {
        return ['actif' => 'boolean'];
    }

    protected static function booted(): void
    {
        static::creating(function (Company $company) {
            if (empty($company->slug)) {
                $company->slug = Str::slug($company->nom);
            }
        });
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function hebergements()
    {
        return $this->hasMany(Hebergement::class);
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }

    public function reservations()
    {
        return $this->hasManyThrough(Reservation::class, User::class);
    }
}
