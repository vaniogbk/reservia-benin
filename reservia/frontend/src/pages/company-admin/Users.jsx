import { useQuery } from '@tanstack/react-query'
import { companyAdminApi } from '../../services/api'
import CompanyAdminLayout from '../../components/layout/CompanyAdminLayout'

const MOCK_USERS = [
  { id: 1, prenom: 'Amoussa', nom: 'Koffi',       email: 'a.koffi@marina.bj',       role: 'company_admin', reservations_count: 0,  created_at: '2024-09-01' },
  { id: 2, prenom: 'Yves',    nom: 'Houénou',      email: 'y.hoenou@client.bj',       role: 'client',        reservations_count: 5,  created_at: '2024-10-15' },
  { id: 3, prenom: 'Chloé',   nom: 'Zinzindohoué', email: 'c.zinz@prestataire.bj',   role: 'prestataire',   reservations_count: 0,  created_at: '2024-11-03' },
  { id: 4, prenom: 'Kofi',    nom: 'Mensah',       email: 'k.mensah@client.bj',       role: 'client',        reservations_count: 3,  created_at: '2025-01-22' },
  { id: 5, prenom: 'Marie',   nom: 'Dossou',       email: 'm.dossou@client.bj',       role: 'client',        reservations_count: 2,  created_at: '2025-02-08' },
]

const ROLE_BADGE = {
  client:        'bg-gray-100 text-gray-600',
  prestataire:   'bg-blue-100 text-blue-700',
  company_admin: 'bg-purple-100 text-purple-700',
}

export default function CompanyAdminUsers() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['company-users'],
    queryFn: companyAdminApi.utilisateurs,
    retry: false,
  })

  const users = data?.data?.data || (isError ? MOCK_USERS : [])

  return (
    <CompanyAdminLayout title="Utilisateurs">
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
                {['Utilisateur', 'Email', 'Rôle', 'Réservations', 'Inscrit le'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </div>
                      <span className="text-sm font-medium text-dark">{u.prenom} {u.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${ROLE_BADGE[u.role] || 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">{u.reservations_count ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
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
