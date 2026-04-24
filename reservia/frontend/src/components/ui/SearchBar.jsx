import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEPARTEMENTS = ['Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo', 'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou']

export default function SearchBar({ defaultType = 'hebergement' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ type: defaultType, ville: '', date_arrivee: '', date_depart: '', nb_personnes: '2' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(Object.entries(form).filter(([, v]) => v))
    const path = form.type === 'hebergement' ? '/hebergements' : '/evenements'
    navigate(`${path}?${params}`)
  }

  return (
    <form onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-2xl p-3 flex flex-wrap gap-2 items-center max-w-4xl">
      <div className="flex gap-1 bg-sand rounded-xl p-1">
        {['hebergement', 'evenement'].map(t => (
          <button key={t} type="button" onClick={() => set('type', t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${form.type === t ? 'bg-dark text-white shadow' : 'text-earth hover:text-dark'}`}>
            {t === 'hebergement' ? (
              <><i className="fa-solid fa-hotel mr-2"></i> Hébergement</>
            ) : (
              <><i className="fa-solid fa-ticket mr-2"></i> Événement</>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 min-w-[160px] border-l border-earth/20 px-4">
        <label className="form-label text-[10px]">Destination</label>
        <input className="w-full outline-none bg-transparent text-sm text-dark placeholder-dark/30 font-medium"
          placeholder="Cotonou, Abomey..." value={form.ville} onChange={e => set('ville', e.target.value)} />
      </div>
      {form.type === 'hebergement' && (
        <>
          <div className="border-l border-earth/20 px-4">
            <label className="form-label text-[10px]">Arrivée</label>
            <input type="date" className="outline-none bg-transparent text-sm text-dark"
              value={form.date_arrivee} onChange={e => set('date_arrivee', e.target.value)} />
          </div>
          <div className="border-l border-earth/20 px-4">
            <label className="form-label text-[10px]">Départ</label>
            <input type="date" className="outline-none bg-transparent text-sm text-dark"
              value={form.date_depart} onChange={e => set('date_depart', e.target.value)} />
          </div>
        </>
      )}
      <div className="border-l border-earth/20 px-4">
        <label className="form-label text-[10px]">Personnes</label>
        <select className="outline-none bg-transparent text-sm text-dark font-medium"
          value={form.nb_personnes} onChange={e => set('nb_personnes', e.target.value)}>
          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      <button type="submit" className="btn-terracotta px-6 py-3 rounded-xl whitespace-nowrap flex items-center gap-2">
        <i className="fa-solid fa-magnifying-glass"></i> Rechercher
      </button>
    </form>
  )
}
