export const COMPANY_ADMIN_STATS_MOCK = {
  company: { id: 1, nom: 'Hôtel Bénin Marina', logo_url: null, ville: 'Cotonou' },
  kpis: {
    revenus_mois_fcfa:    1_850_000,
    reservations_actives: 12,
    total_hebergements:   24,
    total_evenements:     6,
    total_utilisateurs:   52,
    note_moyenne:         4.6,
  },
  graphiques: {
    reservations_par_mois: [
      { mois: 11, annee: 2024, total: 38 },
      { mois: 12, annee: 2024, total: 55 },
      { mois: 1,  annee: 2025, total: 41 },
      { mois: 2,  annee: 2025, total: 47 },
      { mois: 3,  annee: 2025, total: 62 },
      { mois: 4,  annee: 2025, total: 48 },
    ],
  },
  dernieres_reservations: [
    { id: 1, reference: 'RES-2025-A1B2C3', user: { prenom: 'Amoussa', nom: 'Koffi' }, reservable: { nom: 'Suite Présidentielle' }, montant_total_fcfa: 420_000, statut: 'confirmee' },
    { id: 2, reference: 'RES-2025-P6Q7R8', user: { prenom: 'Yves',    nom: 'Houénou' }, reservable: { nom: 'Chambre Deluxe Vue Mer' }, montant_total_fcfa: 85_000, statut: 'confirmee' },
    { id: 3, reference: 'RES-2025-S9T0U1', user: { prenom: 'Chloé',   nom: 'Zinzindohoué' }, reservable: { nom: 'Salle Conférence Atlas' }, montant_total_fcfa: 150_000, statut: 'en_attente' },
    { id: 4, reference: 'RES-2025-V2W3X4', user: { prenom: 'Kofi',    nom: 'Mensah' }, reservable: { nom: 'Bungalow Piscine' }, montant_total_fcfa: 120_000, statut: 'confirmee' },
    { id: 5, reference: 'RES-2025-Y5Z6A7', user: { prenom: 'Marie',   nom: 'Dossou' }, reservable: { nom: 'Suite Junior' }, montant_total_fcfa: 65_000, statut: 'annulee' },
  ],
}
