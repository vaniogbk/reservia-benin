import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '../../services/api'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'
import { SUPER_ADMIN_STATS_MOCK } from '../../data/superAdminStats'
import toast from 'react-hot-toast'

const EMPTY_FORM = { nom: '', email_contact: '', telephone: '', ville: '', pays: 'Bénin', description: '', logo_url: '' }

export default function SuperAdminCompanies() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(null) // null | 'create' | company object
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')

  const { data, isError } = useQuery({
    queryKey: ['super-admin-companies', search],
    queryFn: () => superAdminApi.companies({ search }),
    retry: false,
  })

  const companies = data?.data?.data || (isError ? SUPER_ADMIN_STATS_MOCK.companies : [])
  const filtered = search
    ? companies.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()))
    : companies

  const saveMutation = useMutation({
    mutationFn: (payload) => modal?.id
      ? superAdminApi.updateCompany(modal.id, payload)
      : superAdminApi.createCompany(payload),
    onSuccess: () => {
      toast.success(modal?.id ? 'Entreprise mise à jour' : 'Entreprise créée')
      qc.invalidateQueries(['super-admin-companies'])
      setModal(null)
    },
    onError: () => toast.error('Erreur lors de la sauvegarde'),
  })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteCompany,
    onSuccess: () => {
      toast.success('Entreprise supprimée')
      qc.invalidateQueries(['super-admin-companies'])
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const openCreate = () => { setForm(EMPTY_FORM); setModal('create') }
  const openEdit   = (c) => { setForm({ nom: c.nom, email_contact: c.email_contact, telephone: c.telephone || '', ville: c.ville || '', pays: c.pays || 'Bénin', description: c.description || '', logo_url: c.logo_url || '' }); setModal(c) }
  const handleSubmit = (e) => { e.preventDefault(); saveMutation.mutate(form) }

  return (
    <SuperAdminLayout title="Gestion des entreprises">
      <div className="flex items-center justify-between mb-6">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une entreprise…"
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button onClick={openCreate}
          className="bg-terracotta text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-terracotta-700 transition-colors flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Nouvelle entreprise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-dark">{c.nom}</h3>
                <p className="text-xs text-gray-500">{c.ville} · {c.email_contact}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                {c.actif ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm mt-1">
              <div className="bg-gray-50 rounded-xl p-2">
                <div className="font-display text-xl text-dark">{c.users_count ?? '—'}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Utilisateurs</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <div className="font-display text-xl text-dark">{c.hebergements_count ?? '—'}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Héberg.</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-2">
                <div className="font-display text-xl text-dark">{c.evenements_count ?? '—'}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Événements</div>
              </div>
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={() => openEdit(c)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <i className="fa-solid fa-pen text-xs mr-1"></i> Modifier
              </button>
              <button onClick={() => window.confirm('Supprimer cette entreprise ?') && deleteMutation.mutate(c.id)}
                className="border border-red-100 text-red-400 text-sm py-2 px-4 rounded-xl hover:bg-red-50 transition-colors">
                <i className="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal création / édition */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-dark">{modal?.id ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { key: 'nom',           label: 'Nom *',              type: 'text',  required: true },
                { key: 'email_contact', label: 'Email contact *',    type: 'email', required: true },
                { key: 'telephone',     label: 'Téléphone',          type: 'text' },
                { key: 'ville',         label: 'Ville',              type: 'text' },
                { key: 'pays',          label: 'Pays',               type: 'text' },
                { key: 'logo_url',      label: 'URL du logo',        type: 'url'  },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} required={required} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit" disabled={saveMutation.isPending}
                  className="flex-1 bg-terracotta text-white py-2 rounded-xl text-sm font-semibold hover:bg-terracotta-700 disabled:opacity-60">
                  {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  )
}
