import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AdminReservations() {
  const [statut, setStatut] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reservations', statut],
    queryFn: () => adminApi.reservations({ statut })
  })
  const reservations = data?.data?.data || []

  return (
    <AdminLayout title="Gestion des Réservations">
      <div className="flex gap-3 mb-6">
        {[['', 'Toutes'], ['en_attente', 'En attente'], ['confirmee', 'Confirmées'], ['annulee', 'Annulées']].map(([v, l]) => (
          <button key={v} onClick={() => setStatut(v)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${statut === v ? 'bg-dark text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">{Array(5).fill(0).map((_,i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Référence','Client','Prestation','Dates','Montant','Paiement','Statut'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-5 py-4 font-mono text-terracotta font-semibold text-xs">{r.reference}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-dark">{r.user?.prenom} {r.user?.nom}</div>
                      <div className="text-xs text-gray-400">{r.user?.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-700 max-w-[140px] truncate">{r.reservable?.nom}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {r.date_arrivee ? `${format(new Date(r.date_arrivee),'dd/MM/yy', {locale:fr})} → ${format(new Date(r.date_depart),'dd/MM/yy', {locale:fr})}` : '—'}
                    </td>
                    <td className="px-5 py-4 font-medium">{r.montant_total_fcfa?.toLocaleString('fr-FR')} F</td>
                    <td className="px-5 py-4 text-xs text-gray-500 capitalize">{r.paiement?.methode?.replace('_',' ') || '—'}</td>
                    <td className="px-5 py-4"><StatutBadge statut={r.statut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservations.length === 0 && (
              <div className="text-center py-12 text-gray-400">Aucune réservation trouvée</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
