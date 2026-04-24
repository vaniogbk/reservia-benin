<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Company;
use App\Models\User;

class CompaniesSeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'company' => [
                    'nom'           => 'Hôtel Bénin Marina',
                    'slug'          => 'hotel-benin-marina',
                    'description'   => 'Hôtel 5 étoiles face à la lagune de Cotonou, référence de l\'hospitalité béninoise.',
                    'email_contact' => 'contact@marina-benin.bj',
                    'telephone'     => '+229 21 31 65 00',
                    'ville'         => 'Cotonou',
                    'pays'          => 'Bénin',
                    'actif'         => true,
                ],
                'admin' => [
                    'nom'      => 'Koffi',
                    'prenom'   => 'Amoussa',
                    'email'    => 'admin@marina-benin.bj',
                    'password' => 'marina2025!',
                    'telephone'=> '+229 97 11 22 33',
                ],
            ],
            [
                'company' => [
                    'nom'           => 'Écolodge Pendjari',
                    'slug'          => 'ecolodge-pendjari',
                    'description'   => 'Hébergement écologique aux portes du parc national de la Pendjari, nord du Bénin.',
                    'email_contact' => 'info@pendjari-lodge.bj',
                    'telephone'     => '+229 23 82 00 10',
                    'ville'         => 'Natitingou',
                    'pays'          => 'Bénin',
                    'actif'         => true,
                ],
                'admin' => [
                    'nom'      => 'Loko',
                    'prenom'   => 'Marc',
                    'email'    => 'admin@pendjari-lodge.bj',
                    'password' => 'pendjari2025!',
                    'telephone'=> '+229 97 44 55 66',
                ],
            ],
            [
                'company' => [
                    'nom'           => 'Villa Fidjrossè Events',
                    'slug'          => 'villa-fidjrosse-events',
                    'description'   => 'Villas de luxe et espaces événementiels sur la plage de Fidjrossè à Cotonou.',
                    'email_contact' => 'booking@fidjrosse-events.bj',
                    'telephone'     => '+229 21 30 45 67',
                    'ville'         => 'Cotonou',
                    'pays'          => 'Bénin',
                    'actif'         => true,
                ],
                'admin' => [
                    'nom'      => 'Agossou',
                    'prenom'   => 'Sika',
                    'email'    => 'admin@fidjrosse-events.bj',
                    'password' => 'fidjrosse2025!',
                    'telephone'=> '+229 97 77 88 99',
                ],
            ],
        ];

        foreach ($companies as $entry) {
            // Créer l'entreprise
            $company = Company::updateOrCreate(
                ['slug' => $entry['company']['slug']],
                $entry['company']
            );

            // Créer l'admin rattaché
            User::updateOrCreate(
                ['email' => $entry['admin']['email']],
                [
                    'nom'        => $entry['admin']['nom'],
                    'prenom'     => $entry['admin']['prenom'],
                    'email'      => $entry['admin']['email'],
                    'telephone'  => $entry['admin']['telephone'],
                    'password'   => Hash::make($entry['admin']['password']),
                    'role'       => 'company_admin',
                    'company_id' => $company->id,
                ]
            );

            $this->command->info("✓ {$company->nom} créée — admin : {$entry['admin']['email']}");
        }

        // Super admin global
        User::updateOrCreate(
            ['email' => 'superadmin@reservia-benin.bj'],
            [
                'nom'      => 'Admin',
                'prenom'   => 'Super',
                'email'    => 'superadmin@reservia-benin.bj',
                'password' => Hash::make('superadmin2025!'),
                'role'     => 'super_admin',
                'company_id' => null,
            ]
        );

        $this->command->info('✓ Super Admin global créé — superadmin@reservia-benin.bj');
    }
}
