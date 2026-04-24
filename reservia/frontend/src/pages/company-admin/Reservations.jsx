import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { companyAdminApi } from '../../services/api'
import CompanyAdminLayout from '../../components/layout/CompanyAdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { COMPANY_ADMIN_STATS_MOCK } from '../../data/companyAdminStats'

export default function CompanyAdminReservations() {
  const [statutFilter, setStatutFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isError, isLoading } = useQuery({
    queryKey: ['company-reservations', statutFilter, page],
    queryFn: () => companyAdminApi.reservations({ statut: statutFilter || undefined, page }),
    retry: false,
  })

  const reservations = data?.data?.data || (isError ? COMPANY_ADMIN_STATS_MOCK.dernieres_reservations : [])
  const meta = data?.data

  return (
    <CompanyAdminLayout title="Réservations">
      <div className="flex items-center gap-4 mb-6">
        <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_attente">En attente</option>
          <option value="annulee">Annulée</option>
        </select>
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
                {['Référence', 'Client', 'Prestation', 'Montant', 'Statut', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservations.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-terracotta font-semibold">{r.reference}</td>
                  <td className="px-6 py-4 text-sm text-dark">{r.user?.prenom} {r.user?.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{r.reservable?.nom}</td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {r.montant_total_fcfa?.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4"><StatutBadge statut={r.statut} /></td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta?.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors
                ${p === page ? 'bg-terracotta text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </CompanyAdminLayout>
  )
}
