import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { superAdminApi } from '../../services/api'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'

const STATUT_COLORS = {
  reussi:  'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  echec:   'bg-red-100 text-red-500',
}

const MOCK_PAYMENTS = [
  { id: 1, reservation: { reference: 'RES-2025-A1B2C3', user: { prenom: 'Amoussa', nom: 'Koffi' } }, methode: 'fedapay',  montant_fcfa: 150_000, statut: 'reussi',  paye_le: '2025-04-10T09:23:00Z' },
  { id: 2, reservation: { reference: 'RES-2025-D4E5F6', user: { prenom: 'Sika',    nom: 'Agossou' } }, methode: 'cinetpay', montant_fcfa: 30_000,  statut: 'pending', paye_le: null },
  { id: 3, reservation: { reference: 'RES-2025-G7H8I9', user: { prenom: 'Marc',    nom: 'Loko' } },    methode: 'fedapay',  montant_fcfa: 90_000,  statut: 'reussi',  paye_le: '2025-04-08T14:12:00Z' },
  { id: 4, reservation: { reference: 'RES-2025-J0K1L2', user: { prenom: 'Fatima',  nom: 'Diallo' } }, methode: 'fedapay',  montant_fcfa: 240_000, statut: 'echec',   paye_le: null },
  { id: 5, reservation: { reference: 'RES-2025-M3N4O5', user: { prenom: 'Jean',    nom: 'Dupont' } }, methode: 'cinetpay', montant_fcfa: 420_000, statut: 'reussi',  paye_le: '2025-04-12T11:05:00Z' },
]

export default function SuperAdminPayments() {
  const [statutFilter, setStatutFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isError, isLoading } = useQuery({
    queryKey: ['super-admin-payments', statutFilter, page],
    queryFn: () => superAdminApi.paiements({ statut: statutFilter || undefined, page }),
    retry: false,
  })

  const payments = data?.data?.data || (isError ? MOCK_PAYMENTS : [])
  const meta = data?.data

  const totalReussi = (isError ? MOCK_PAYMENTS : payments)
    .filter(p => p.statut === 'reussi')
    .reduce((s, p) => s + (p.montant_fcfa || 0), 0)

  return (
    <SuperAdminLayout title="Paiements — Global">
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { label: 'Revenus confirmés (page)', value: `${totalReussi.toLocaleString('fr-FR')} FCFA`, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Paiements en attente',      value: payments.filter(p => p.statut === 'pending').length, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Paiements échoués',         value: payments.filter(p => p.statut === 'echec').length,  color: 'bg-red-50 border-red-200 text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border p-5 ${color}`}>
            <div className="text-2xl font-display font-bold">{value}</div>
            <div className="text-sm mt-1 opacity-80">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          <option value="reussi">Réussi</option>
          <option value="pending">En attente</option>
          <option value="echec">Échoué</option>
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
                {['Référence', 'Client', 'Méthode', 'Montant', 'Statut', 'Date paiement'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-terracotta font-semibold">
                    {p.reservation?.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark">
                    {p.reservation?.user?.prenom} {p.reservation?.user?.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">{p.methode}</td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {p.montant_fcfa?.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${STATUT_COLORS[p.statut] || 'bg-gray-100 text-gray-500'}`}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {p.paye_le ? new Date(p.paye_le).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
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
    </SuperAdminLayout>
  )
}
