import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '../../services/api'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'
import toast from 'react-hot-toast'

const ROLES = ['client', 'prestataire', 'admin', 'company_admin', 'super_admin']

const ROLE_BADGE = {
  client:        'bg-gray-100 text-gray-600',
  prestataire:   'bg-blue-100 text-blue-700',
  admin:         'bg-amber-100 text-amber-700',
  company_admin: 'bg-purple-100 text-purple-700',
  super_admin:   'bg-terracotta/10 text-terracotta',
}

const MOCK_USERS = [
  { id: 1,  prenom: 'Amoussa',  nom: 'Koffi',         email: 'a.koffi@marina.bj',       role: 'company_admin', company: { nom: 'Hôtel Bénin Marina' }, reservations_count: 0  },
  { id: 2,  prenom: 'Sika',     nom: 'Agossou',       email: 's.agossou@client.bj',      role: 'client',        company: null, reservations_count: 4  },
  { id: 3,  prenom: 'Marc',     nom: 'Loko',          email: 'm.loko@pendjari.bj',        role: 'company_admin', company: { nom: 'Écolodge Pendjari' }, reservations_count: 0  },
  { id: 4,  prenom: 'Fatima',   nom: 'Diallo',        email: 'f.diallo@prestataire.bj',   role: 'prestataire',   company: null, reservations_count: 2  },
  { id: 5,  prenom: 'Jean',     nom: 'Dupont',        email: 'j.dupont@client.bj',        role: 'client',        company: null, reservations_count: 7  },
  { id: 998, prenom: 'Super',   nom: 'Admin',         email: 'superadmin@reservia-benin.com', role: 'super_admin', company: null, reservations_count: 0 },
]

export default function SuperAdminUsers() {
  const qc = useQueryClient()
  const [roleFilter, setRoleFilter] = useState('')
  const [editUser, setEditUser] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [newCompanyId, setNewCompanyId] = useState('')

  const { data, isError } = useQuery({
    queryKey: ['super-admin-users', roleFilter],
    queryFn: () => superAdminApi.utilisateurs({ role: roleFilter || undefined }),
    retry: false,
  })

  const users = data?.data?.data || (isError ? MOCK_USERS : [])

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role, company_id }) => superAdminApi.updateRole(id, { role, company_id: company_id || null }),
    onSuccess: () => {
      toast.success('Rôle mis à jour')
      qc.invalidateQueries(['super-admin-users'])
      setEditUser(null)
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const openEdit = (u) => { setEditUser(u); setNewRole(u.role); setNewCompanyId(u.company?.id || '') }

  return (
    <SuperAdminLayout title="Gestion des utilisateurs">
      <div className="flex items-center gap-4 mb-6">
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les rôles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              {['Utilisateur', 'Email', 'Rôle', 'Entreprise', 'Réservations', 'Actions'].map(h => (
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
                <td className="px-6 py-4 text-sm text-gray-600">{u.company?.nom || '—'}</td>
                <td className="px-6 py-4 text-sm text-center">{u.reservations_count ?? 0}</td>
                <td className="px-6 py-4">
                  <button onClick={() => openEdit(u)}
                    className="text-sm text-primary hover:underline flex items-center gap-1">
                    <i className="fa-solid fa-pen text-xs"></i> Modifier rôle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal édition rôle */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="font-semibold text-dark mb-4">
              Modifier le rôle — {editUser.prenom} {editUser.nom}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {['company_admin', 'admin', 'prestataire'].includes(newRole) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Entreprise (optionnel)</label>
                  <input type="number" value={newCompanyId} onChange={e => setNewCompanyId(e.target.value)}
                    placeholder="ex: 1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditUser(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">
                Annuler
              </button>
              <button
                onClick={() => updateRoleMutation.mutate({ id: editUser.id, role: newRole, company_id: newCompanyId })}
                disabled={updateRoleMutation.isPending}
                className="flex-1 bg-terracotta text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-60">
                {updateRoleMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}
