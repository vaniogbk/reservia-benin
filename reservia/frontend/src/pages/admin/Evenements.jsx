import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { evenementApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const CAT = { vodoun:'🥁', gastronomie:'🍛', culture:'🎭', seminaire:'💼', nature:'🦁', art:'🎨' }

export default function AdminEvenements() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['evenements-admin'], queryFn: () => evenementApi.liste({ per_page: 50 }) })
  const evenements = data?.data?.data || []

  const deleteMutation = useMutation({
    mutationFn: evenementApi.supprimer,
    onSuccess: () => { toast.success('Événement supprimé'); qc.invalidateQueries(['evenements-admin']) }
  })

  return (
    <AdminLayout title="Gestion des Événements">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">{evenements.length} événements</span>
        </div>
        {isLoading ? (
          <div className="p-8 space-y-4">{Array(4).fill(0).map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Événement','Catégorie','Ville','Date','Prix','Places','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {evenements.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 text-sm">
                    <td className="px-5 py-4 font-medium text-dark">{e.nom}</td>
                    <td className="px-5 py-4">
                      <span className="text-lg">{CAT[e.categorie]}</span>
                      <span className="ml-2 text-xs text-gray-500 capitalize">{e.categorie}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{e.ville}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{format(new Date(e.date_debut), 'dd MMM yyyy', { locale: fr })}</td>
                    <td className="px-5 py-4 font-medium">{e.prix_fcfa?.toLocaleString('fr-FR')} F</td>
                    <td className="px-5 py-4">
                      <div className="text-xs">
                        <span className="text-green-600 font-semibold">{e.places_restantes}</span>
                        <span className="text-gray-400"> / {e.capacite_totale}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { if(confirm('Supprimer cet événement ?')) deleteMutation.mutate(e.id) }}
                        className="text-red-400 hover:text-red-600 text-xs font-medium">
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
