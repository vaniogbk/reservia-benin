import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { companyAdminApi } from '../../services/api'
import CompanyAdminLayout from '../../components/layout/CompanyAdminLayout'

const MOCK_HEBERGEMENTS = [
  { id: 1, nom: 'Suite Présidentielle',     type: 'hotel',    ville: 'Cotonou',    prix_nuit_fcfa: 180_000, note_moyenne: 4.9, actif: true,  reservations_count: 24 },
  { id: 2, nom: 'Chambre Deluxe Vue Mer',   type: 'hotel',    ville: 'Cotonou',    prix_nuit_fcfa: 75_000,  note_moyenne: 4.7, actif: true,  reservations_count: 58 },
  { id: 3, nom: 'Bungalow Piscine',         type: 'villa',    ville: 'Cotonou',    prix_nuit_fcfa: 95_000,  note_moyenne: 4.5, actif: true,  reservations_count: 31 },
  { id: 4, nom: 'Suite Junior',             type: 'hotel',    ville: 'Cotonou',    prix_nuit_fcfa: 55_000,  note_moyenne: 4.3, actif: false, reservations_count: 12 },
]

const TYPE_BADGE = {
  hotel:    'bg-blue-100 text-blue-700',
  villa:    'bg-purple-100 text-purple-700',
  ecolodge: 'bg-green-100 text-green-700',
  gite:     'bg-amber-100 text-amber-700',
  auberge:  'bg-gray-100 text-gray-600',
}

export default function CompanyAdminHebergements() {
  const [search, setSearch] = useState('')

  const { data, isError, isLoading } = useQuery({
    queryKey: ['company-hebergements', search],
    queryFn: () => companyAdminApi.hebergements({ search }),
    retry: false,
  })

  const hebergements = data?.data?.data || (isError ? MOCK_HEBERGEMENTS : [])
  const filtered = search
    ? hebergements.filter(h => h.nom.toLowerCase().includes(search.toLowerCase()))
    : hebergements

  return (
    <CompanyAdminLayout title="Hébergements">
      <div className="flex items-center justify-between mb-6">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un hébergement…"
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
                {['Nom', 'Type', 'Ville', 'Prix / nuit', 'Note', 'Réservations', 'Statut'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark text-sm">{h.nom}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${TYPE_BADGE[h.type] || 'bg-gray-100 text-gray-500'}`}>
                      {h.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{h.ville}</td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {h.prix_nuit_fcfa?.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                      {h.note_moyenne}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">{h.reservations_count ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${h.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                      {h.actif ? 'Actif' : 'Inactif'}
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
