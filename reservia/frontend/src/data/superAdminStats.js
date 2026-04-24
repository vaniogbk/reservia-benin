export const SUPER_ADMIN_STATS_MOCK = {
  kpis: {
    revenus_total_fcfa:   42_500_000,
    revenus_mois_fcfa:    6_200_000,
    total_companies:      8,
    total_utilisateurs:   347,
    total_reservations:   1284,
    reservations_actives: 58,
  },
  graphiques: {
    reservations_par_mois: [
      { mois: 11, annee: 2024, total: 180 },
      { mois: 12, annee: 2024, total: 240 },
      { mois: 1,  annee: 2025, total: 210 },
      { mois: 2,  annee: 2025, total: 195 },
      { mois: 3,  annee: 2025, total: 265 },
      { mois: 4,  annee: 2025, total: 194 },
    ],
    revenus_par_company: [
      { id: 1, nom: 'Hôtel Bénin Marina',   revenus: 15_200_000 },
      { id: 2, nom: 'Écolodge Pendjari',    revenus: 9_400_000 },
      { id: 3, nom: 'Villa Fidjrossè',      revenus: 7_800_000 },
      { id: 4, nom: 'Résidence Cotonou',    revenus: 5_600_000 },
      { id: 5, nom: 'Safari Bénin Tours',   revenus: 4_500_000 },
    ],
  },
  dernieres_reservations: [
    { id: 1, reference: 'RES-2025-A1B2C3', user: { prenom: 'Amoussa', nom: 'Koffi', company_id: 1 }, reservable: { nom: 'Hôtel Bénin Marina' }, montant_total_fcfa: 150_000, statut: 'confirmee' },
    { id: 2, reference: 'RES-2025-D4E5F6', user: { prenom: 'Sika',    nom: 'Agossou', company_id: 2 }, reservable: { nom: 'Fête du Vodoun' }, montant_total_fcfa: 30_000, statut: 'en_attente' },
    { id: 3, reference: 'RES-2025-G7H8I9', user: { prenom: 'Marc',    nom: 'Loko', company_id: 2 }, reservable: { nom: 'Écolodge Pendjari' }, montant_total_fcfa: 90_000, statut: 'confirmee' },
    { id: 4, reference: 'RES-2025-J0K1L2', user: { prenom: 'Fatima',  nom: 'Diallo', company_id: 3 }, reservable: { nom: 'Villa Fidjrossè' }, montant_total_fcfa: 240_000, statut: 'annulee' },
    { id: 5, reference: 'RES-2025-M3N4O5', user: { prenom: 'Jean',    nom: 'Dupont', company_id: 1 }, reservable: { nom: 'Suite Présidentielle' }, montant_total_fcfa: 420_000, statut: 'confirmee' },
  ],
  companies: [
    { id: 1, nom: 'Hôtel Bénin Marina',  slug: 'hotel-benin-marina', email_contact: 'contact@marinahotel.bj', ville: 'Cotonou', actif: true, users_count: 52,  hebergements_count: 24, evenements_count: 6  },
    { id: 2, nom: 'Écolodge Pendjari',   slug: 'ecolodge-pendjari',  email_contact: 'info@pendjari.bj',      ville: 'Natitingou', actif: true, users_count: 18, hebergements_count: 8,  evenements_count: 3  },
    { id: 3, nom: 'Villa Fidjrossè',     slug: 'villa-fidjrosse',    email_contact: 'book@fidjrosse.bj',     ville: 'Cotonou', actif: true, users_count: 9,  hebergements_count: 5,  evenements_count: 2  },
    { id: 4, nom: 'Résidence Cotonou',   slug: 'residence-cotonou',  email_contact: 'hello@residcot.bj',     ville: 'Cotonou', actif: true, users_count: 31, hebergements_count: 15, evenements_count: 4  },
    { id: 5, nom: 'Safari Bénin Tours',  slug: 'safari-benin-tours', email_contact: 'tour@safari-benin.bj',  ville: 'Porto-Novo', actif: false, users_count: 7, hebergements_count: 2, evenements_count: 8 },
  ],
}
