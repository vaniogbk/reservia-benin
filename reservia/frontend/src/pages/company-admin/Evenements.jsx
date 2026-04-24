import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { companyAdminApi } from '../../services/api'
import CompanyAdminLayout from '../../components/layout/CompanyAdminLayout'

const MOCK_EVENEMENTS = [
  { id: 1, nom: 'Gala Annuel Marina',       categorie: 'gala',       lieu: 'Grande salle',   date_debut: '2025-06-15', prix_fcfa: 25_000, capacite_totale: 300, places_restantes: 120, actif: true,  reservations_count: 180 },
  { id: 2, nom: 'Conférence Business Bénin', categorie: 'conference', lieu: 'Salle Atlas',    date_debut: '2025-05-20', prix_fcfa: 50_000, capacite_totale: 150, places_restantes: 60,  actif: true,  reservations_count: 90  },
  { id: 3, nom: 'Soirée Découverte Vodoun', categorie: 'culturel',   lieu: 'Espace extérieur',date_debut: '2025-04-28', prix_fcfa: 15_000, capacite_totale: 200, places_restantes: 0,   actif: false, reservations_count: 200 },
]

export default function CompanyAdminEvenements() {
  const [search, setSearch] = useState('')

  const { data, isError, isLoading } = useQuery({
    queryKey: ['company-evenements', search],
    queryFn: () => companyAdminApi.evenements({ search }),
    retry: false,
  })

  const evenements = data?.data?.data || (isError ? MOCK_EVENEMENTS : [])
  const filtered = search
    ? evenements.filter(e => e.nom.toLowerCase().includes(search.toLowerCase()))
    : evenements

  return (
    <CompanyAdminLayout title="Événements">
      <div className="flex items-center justify-between mb-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un événement…"
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto mb-2" />
            Chargement…
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {['Nom', 'Catégorie', 'Lieu', 'Date', 'Prix', 'Places restantes', 'Statut'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark text-sm">{e.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{e.categorie}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{e.lieu}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {e.date_debut ? new Date(e.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {e.prix_fcfa?.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className={`font-bold ${e.places_restantes === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {e.places_restantes} / {e.capacite_totale}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${e.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                      {e.actif ? 'Actif' : 'Terminé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CompanyAdminLayout>
  )
}
