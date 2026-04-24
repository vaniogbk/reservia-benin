<?php
namespace Database\Seeders;

use App\Models\{User, Hebergement, Evenement};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'nom' => 'Admin', 'prenom' => 'Réservia',
            'email' => 'admin@reservia-benin.com',
            'password' => Hash::make('password123'),
            'role' => 'admin', 'telephone' => '+22961000000',
        ]);

        // Prestataire demo
        $presta = User::create([
            'nom' => 'Ahossou', 'prenom' => 'Barnabé',
            'email' => 'prestataire@reservia-benin.com',
            'password' => Hash::make('password123'),
            'role' => 'prestataire', 'telephone' => '+22967000000',
        ]);

        // Client demo
        User::create([
            'nom' => 'Mensah', 'prenom' => 'Kofi',
            'email' => 'client@reservia-benin.com',
            'password' => Hash::make('password123'),
            'role' => 'client', 'telephone' => '+22996000000',
        ]);

        // Hébergements béninois
        $hebergements = [
            ['nom' => 'Écolodge du Lac Nokoué', 'type' => 'ecolodge', 'ville' => 'Ganvié',
             'departement' => 'Atlantique', 'prix_nuit_fcfa' => 45000, 'capacite_max' => 4,
             'note_moyenne' => 4.9, 'commodites' => ['WiFi','Terrasse sur lac','Petit-déjeuner inclus','Pirogue'],
             'description' => "Séjour unique sur pilotis au cœur du lac Nokoué, la Venise de l'Afrique."],
            ['nom' => 'Résidence Royale Dahomey', 'type' => 'villa', 'ville' => 'Abomey',
             'departement' => 'Zou', 'prix_nuit_fcfa' => 55000, 'capacite_max' => 6,
             'note_moyenne' => 5.0, 'commodites' => ['Piscine','Climatisation','WiFi','Parking','Jardin'],
             'description' => "Villa historique à 5 minutes des Palais Royaux d'Abomey, site UNESCO."],
            ['nom' => 'Villa Auberge de la Plage', 'type' => 'auberge', 'ville' => 'Grand-Popo',
             'departement' => 'Mono', 'prix_nuit_fcfa' => 62000, 'capacite_max' => 8,
             'note_moyenne' => 4.8, 'commodites' => ['Plage privée','Restaurant','Bar','WiFi','Hammacs'],
             'description' => 'Auberge en bord de mer avec accès direct à la plage de Grand-Popo.'],
            ['nom' => 'Camp Pendjari Savane', 'type' => 'ecolodge', 'ville' => 'Tanguiéta',
             'departement' => 'Atacora', 'prix_nuit_fcfa' => 38000, 'capacite_max' => 4,
             'note_moyenne' => 4.7, 'commodites' => ['Safari','Guide naturiste','Repas inclus','Observation faune'],
             'description' => "Camp écologique en lisière du Parc National de la Pendjari. Lions et éléphants."],
            ['nom' => 'Hôtel Azalaï Cotonou', 'type' => 'hotel', 'ville' => 'Cotonou',
             'departement' => 'Littoral', 'prix_nuit_fcfa' => 80000, 'capacite_max' => 2,
             'note_moyenne' => 4.6, 'commodites' => ['Piscine','Restaurant','Spa','WiFi','Salle de conférence','Bar'],
             'description' => "Hôtel 5 étoiles au cœur de Cotonou, idéal pour les voyageurs d'affaires."],
            ['nom' => "Maison d'hôtes Ouidah Heritage", 'type' => 'gite', 'ville' => 'Ouidah',
             'departement' => 'Atlantique', 'prix_nuit_fcfa' => 42000, 'capacite_max' => 4,
             'note_moyenne' => 4.9, 'commodites' => ['WiFi','Jardin','Petit-déjeuner','Visite guidée incluse'],
             'description' => "Maison coloniale restaurée à Ouidah, ville sacrée du Vodoun et de la Route des Esclaves.",
             'images' => ['/Images/hebergements/ouidah.jpg']],
            ['nom' => 'Azalaï Hôtel Cotonou', 'type' => 'hotel', 'ville' => 'Cotonou',
             'departement' => 'Littoral', 'prix_nuit_fcfa' => 85000, 'capacite_max' => 2,
             'note_moyenne' => 4.8, 'commodites' => ['Piscine','Spa','WiFi','Navette Aéroport','Restaurant Gastronomique'],
             'description' => "L'excellence de l'hôtellerie ouest-africaine au cœur de Cotonou.",
             'images' => ['/Images/hebergements/azalai.jpg']],
            ['nom' => 'Sofitel Cotonou Marina Hotel & Spa', 'type' => 'hotel', 'ville' => 'Cotonou',
             'departement' => 'Littoral', 'prix_nuit_fcfa' => 150000, 'capacite_max' => 2,
             'note_moyenne' => 5.0, 'commodites' => ['Piscine Olympique','Plage privée','Casino','Spa de luxe','Tennis'],
             'description' => "Le nouveau joyau du luxe à Cotonou, entre mer et jardin tropical.",
             'images' => ['/Images/hebergements/sofitel.jpg']],
            ['nom' => 'Golden Tulip Le Diplomate', 'type' => 'hotel', 'ville' => 'Cotonou',
             'departement' => 'Littoral', 'prix_nuit_fcfa' => 95000, 'capacite_max' => 2,
             'note_moyenne' => 4.7, 'commodites' => ['WiFi','Business Center','Piscine sur toit','Bar Vue Panoramique'],
             'description' => "Hôtel d'affaires de référence, alliant modernité et confort international.",
             'images' => ['/Images/hebergements/golden_tulip.jpg']],
            ['nom' => 'Novotel Cotonou Orisha', 'type' => 'hotel', 'ville' => 'Cotonou',
             'departement' => 'Littoral', 'prix_nuit_fcfa' => 78000, 'capacite_max' => 2,
             'note_moyenne' => 4.6, 'commodites' => ['WiFi','Piscine','Jardin','Accès PMR','Restaurant'],
             'description' => "Idéalement situé en bord de mer, le Novotel Orisha offre un cadre paisible et professionnel.",
             'images' => ['/Images/hebergements/novotel.jpg']],
        ];

        foreach ($hebergements as $h) {
            $presta->hebergements()->create($h);
        }

        // Événements béninois
        $evenements = [
            ['nom' => 'Festival International du Vodoun', 'categorie' => 'vodoun',
             'lieu' => 'Place Chacha', 'ville' => 'Ouidah', 'departement' => 'Atlantique',
             'date_debut' => '2026-01-10 08:00:00', 'date_fin' => '2026-01-10 22:00:00',
             'prix_fcfa' => 5000, 'capacite_totale' => 500, 'places_restantes' => 342,
             'description' => 'Célébration nationale du Vodoun avec processions, cérémonies et danses rituelles.'],
            ['nom' => 'Festival Gastronomique Béninois', 'categorie' => 'gastronomie',
             'lieu' => 'Centre de Congrès', 'ville' => 'Porto-Novo', 'departement' => 'Ouémé',
             'date_debut' => '2026-03-08 10:00:00', 'date_fin' => '2026-03-08 20:00:00',
             'prix_fcfa' => 10000, 'capacite_totale' => 200, 'places_restantes' => 87,
             'description' => 'Découvrez le meilleur de la cuisine béninoise : amiwo, akpan, sauce gombo.'],
            ['nom' => 'Safari Parc W-Pendjari', 'categorie' => 'nature',
             'lieu' => 'Parc National Pendjari', 'ville' => 'Tanguiéta', 'departement' => 'Atacora',
             'date_debut' => '2026-03-22 06:00:00', 'date_fin' => '2026-03-23 18:00:00',
             'prix_fcfa' => 75000, 'capacite_totale' => 20, 'places_restantes' => 8,
             'description' => "Safari guidé dans l'un des parcs les mieux préservés d'Afrique de l'Ouest."],
            ['nom' => 'Nuit des Rois du Dahomey', 'categorie' => 'culture',
             'lieu' => 'Palais Royaux', 'ville' => 'Abomey', 'departement' => 'Zou',
             'date_debut' => '2026-04-15 19:00:00', 'date_fin' => '2026-04-15 23:00:00',
             'prix_fcfa' => 7500, 'capacite_totale' => 150, 'places_restantes' => 73,
             'description' => "Spectacle vivant retraçant l'histoire du Royaume du Dahomey et des Agojie."],
            ['nom' => 'Forum Économique du Bénin', 'categorie' => 'seminaire',
             'lieu' => 'Palais des Congrès', 'ville' => 'Cotonou', 'departement' => 'Littoral',
             'date_debut' => '2026-05-05 08:00:00', 'date_fin' => '2026-05-06 18:00:00',
             'prix_fcfa' => 50000, 'capacite_totale' => 300, 'places_restantes' => 201,
             'description' => "Rencontre des acteurs économiques béninois et internationaux."],
            ['nom' => 'Biennale des Arts de Cotonou', 'categorie' => 'art',
             'lieu' => 'Fondation Zinsou', 'ville' => 'Cotonou', 'departement' => 'Littoral',
             'date_debut' => '2026-06-20 10:00:00', 'date_fin' => '2026-06-30 18:00:00',
             'prix_fcfa' => 3000, 'capacite_totale' => 1000, 'places_restantes' => 750,
             'description' => "La plus grande exposition d'art contemporain africain au Bénin."],
        ];

        foreach ($evenements as $e) {
            $presta->evenements()->create($e);
        }
    }
}
