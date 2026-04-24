import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const ROLE_CONFIG = {
  client:      { label: 'Client',      bg: 'bg-blue-100',   text: 'text-blue-700'   },
  prestataire: { label: 'Prestataire', bg: 'bg-amber-100',  text: 'text-amber-700'  },
  admin:       { label: 'Admin',       bg: 'bg-purple-100', text: 'text-purple-700' },
}

export default function AdminUtilisateurs() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.utilisateurs() })
  const utilisateurs = data?.data?.data || []

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => adminApi.updateRole(id, role),
    onSuccess: () => { toast.success('Rôle mis à jour'); qc.invalidateQueries(['admin-users']) },
    onError: () => toast.error('Erreur')
  })

  return (
    <AdminLayout title="Gestion des Utilisateurs">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">{utilisateurs.length} utilisateurs</span>
        </div>
        {isLoading ? (
          <div className="p-8 space-y-4">{Array(5).fill(0).map((_,i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Utilisateur','Email','Téléphone','Rôle','Réservations','Inscrit le','Modifier rôle'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {utilisateurs.map(u => {
                  const r = ROLE_CONFIG[u.role] || ROLE_CONFIG.client
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {u.prenom?.[0]}{u.nom?.[0]}
                          </div>
                          <span className="font-medium text-dark">{u.prenom} {u.nom}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4 text-gray-500">{u.telephone || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${r.bg} ${r.text} text-xs`}>{r.label}</span>
                      </td>
                      <td className="px-5 py-4 text-center font-semibold">{u.reservations_count}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{format(new Date(u.created_at), 'dd/MM/yyyy', { locale: fr })}</td>
                      <td className="px-5 py-4">
                        <select value={u.role}
                          onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-primary transition-colors cursor-pointer">
                          <option value="client">Client</option>
                          <option value="prestataire">Prestataire</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
