import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { hebergementApi } from '../services/api'
import HebergementCard from '../components/ui/HebergementCard'
import { HEBERGEMENTS_MOCK } from '../data/hebergements'

const TYPES = ['hotel', 'ecolodge', 'gite', 'villa', 'auberge']
const DEPTS = ['Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo', 'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou']

export default function Hebergements() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState({
    ville: params.get('ville') || '',
    type: params.get('type') || '',
    departement: params.get('departement') || '',
    prix_max: params.get('prix_max') || '',
    nb_personnes: params.get('nb_personnes') || '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['hebergements', filters],
    queryFn: () => hebergementApi.liste({ ...filters }),
  })


  const hebergements = data?.data?.data?.length > 0 ? data.data.data : HEBERGEMENTS_MOCK

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  return (
    <div className="pt-16">
      <div className="bg-dark py-14 px-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(196,96,58,0.5), transparent)' }} />
        <h1 className="font-display text-5xl font-light text-white relative z-10">Hébergements</h1>
        <p className="text-white/50 mt-2 relative z-10">320 propriétés dans 12 départements</p>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-earth/20 px-8 py-4 flex flex-wrap gap-3">
        <select className="form-input w-auto py-2 px-3 text-sm" value={filters.type} onChange={e => set('type', e.target.value)}>
          <option value="">Tous les types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-input w-auto py-2 px-3 text-sm" value={filters.departement} onChange={e => set('departement', e.target.value)}>
          <option value="">Tous les départements</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input className="form-input w-40 py-2 px-3 text-sm" type="number" placeholder="Prix max FCFA"
          value={filters.prix_max} onChange={e => set('prix_max', e.target.value)} />
        <input className="form-input w-40 py-2 px-3 text-sm" placeholder="Ville, région..."
          value={filters.ville} onChange={e => set('ville', e.target.value)} />
        {Object.values(filters).some(Boolean) && (
          <button onClick={() => setFilters({ ville: '', type: '', departement: '', prix_max: '', nb_personnes: '' })}
            className="px-4 py-2 rounded-xl text-sm text-terracotta border border-terracotta/30 hover:bg-terracotta/10 transition-colors">
            Réinitialiser ✕
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-sand h-72 animate-pulse" />)}
          </div>
        ) : hebergements.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-earth font-display text-2xl">Aucun résultat trouvé</p>
            <p className="text-earth/60 mt-2">Essayez d'autres critères de recherche</p>
          </div>
        ) : (
          <>
            <p className="text-earth text-sm mb-6">{hebergements.length} résultat(s)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hebergements.map(h => <HebergementCard key={h.id} item={h} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
