export const ADMIN_STATS_MOCK = {
    kpis: {
        revenus_mois_fcfa: 4850000,
        reservations_actives: 12,
        note_moyenne: 4.7,
        utilisateurs_ce_mois: 28,
    },
    graphiques: {
        reservations_par_mois: [
            { mois: 9, total: 45 },
            { mois: 10, total: 52 },
            { mois: 11, total: 48 },
            { mois: 12, total: 70 },
            { mois: 1, total: 85 },
            { mois: 2, total: 62 },
        ],
        repartition_revenus: [
            { label: 'Hébergements', montant: 3200000 },
            { label: 'Événements', montant: 1650000 },
        ],
    },
    dernieres_reservations: [
        {
            id: 1,
            reference: 'RSV-7429',
            user: { prenom: 'Amoussa', nom: 'Koffi' },
            reservable: { nom: 'Hôtel Bénin Marina' },
            montant_total_fcfa: 150000,
            statut: 'confirme',
        },
        {
            id: 2,
            reference: 'RSV-8102',
            user: { prenom: 'Sika', nom: 'Agossou' },
            reservable: { nom: 'Fête du Vodoun' },
            montant_total_fcfa: 30000,
            statut: 'en_attente',
        },
        {
            id: 3,
            reference: 'RSV-9031',
            user: { prenom: 'Marc', nom: 'Loko' },
            reservable: { nom: 'Écolodge Pendjari' },
            montant_total_fcfa: 90000,
            statut: 'confirme',
        },
        {
            id: 4,
            reference: 'RSV-2218',
            user: { prenom: 'Fatima', nom: 'Diallo' },
            reservable: { nom: 'Villa Fidjrossè' },
            montant_total_fcfa: 240000,
            statut: 'annule',
        },
        {
            id: 5,
            reference: 'RSV-5541',
            user: { prenom: 'Jean', nom: 'Dupont' },
            reservable: { nom: 'Festival Gastronomie' },
            montant_total_fcfa: 12000,
            statut: 'confirme',
        },
    ]
}
