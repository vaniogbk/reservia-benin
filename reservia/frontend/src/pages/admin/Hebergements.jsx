import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, hebergementApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'

export default function AdminHebergements() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['hebergements-admin'], queryFn: () => hebergementApi.liste({ per_page: 50 }) })
  const hebergements = data?.data?.data || []

  const deleteMutation = useMutation({
    mutationFn: hebergementApi.supprimer,
    onSuccess: () => { toast.success('Hébergement supprimé'); qc.invalidateQueries(['hebergements-admin']) },
    onError: () => toast.error('Erreur lors de la suppression')
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, actif }) => hebergementApi.modifier(id, { actif }),
    onSuccess: () => { toast.success('Statut mis à jour'); qc.invalidateQueries(['hebergements-admin']) }
  })

  const EMOJI = { hotel:'🏨', ecolodge:'🌿', gite:'🏡', villa:'🌊', auberge:'🏛️' }

  return (
    <AdminLayout title="Gestion des Hébergements">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{hebergements.length} hébergements</span>
        </div>
        {isLoading ? (
          <div className="p-8 space-y-4">{Array(5).fill(0).map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Hébergement','Type','Ville','Prix / nuit','Note','Statut','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hebergements.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span>{EMOJI[h.type]}</span>
                        <span className="font-medium text-dark">{h.nom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-500">{h.type}</td>
                    <td className="px-5 py-4 text-gray-700">{h.ville}</td>
                    <td className="px-5 py-4 font-medium">{h.prix_nuit_fcfa?.toLocaleString('fr-FR')} F</td>
                    <td className="px-5 py-4 text-amber-600 font-semibold">★ {h.note_moyenne}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleMutation.mutate({ id: h.id, actif: !h.actif })}
                        className={`badge cursor-pointer transition-all ${h.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {h.actif ? '● Actif' : '○ Inactif'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { if(confirm('Supprimer cet hébergement ?')) deleteMutation.mutate(h.id) }}
                        className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
