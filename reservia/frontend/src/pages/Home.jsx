import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { hebergementApi, evenementApi } from '../services/api'
import SearchBar from '../components/ui/SearchBar'
import HebergementCard from '../components/ui/HebergementCard'
import EvenementCard from '../components/ui/EvenementCard'
import { HEBERGEMENTS_MOCK } from '../data/hebergements'
import { EVENEMENTS_MOCK } from '../data/evenements'

const STATS = [
  { num: '320+', label: 'Hébergements au Bénin' },
  { num: '85', label: 'Événements ce mois' },
  { num: '97%', label: 'Satisfaction client' },
  { num: '12', label: 'Départements couverts' },
]

export default function Home() {
  const { data: hebs } = useQuery({ queryKey: ['hebergements-home'], queryFn: () => hebergementApi.liste({ per_page: 3 }) })
  const { data: evts } = useQuery({ queryKey: ['evenements-home'], queryFn: () => evenementApi.liste({ per_page: 3 }) })

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(196,96,58,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(200,169,122,0.2) 0%, transparent 50%), #F5EFE0' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(200,169,122,0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20">
          <div className="inline-block bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-semibold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6">
            <i className="fa-solid fa-sparkles mr-2"></i> Plateforme de réservation — Bénin
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-light leading-[1.05] text-dark mb-6">
            Découvrez le<br /><em className="italic text-terracotta">Bénin</em><br />autrement
          </h1>
          <p className="text-lg text-earth max-w-lg mb-10 leading-relaxed">
            Réservez des hébergements authentiques et des événements uniques à travers tout le Bénin. Paiement sécurisé en FCFA.
          </p>
          <div className="flex gap-4 flex-wrap mb-16">
            <Link to="/hebergements" className="btn-primary text-base px-8 py-4">Explorer les hébergements</Link>
            <Link to="/evenements" className="btn-outline text-base px-8 py-4">Voir les événements</Link>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Stats */}
      <div className="bg-dark grid grid-cols-2 md:grid-cols-4">
        {STATS.map(s => (
          <div key={s.label} className="py-8 px-6 text-center border-r border-white/10 last:border-r-0">
            <div className="font-display text-4xl font-light text-earth">{s.num}</div>
            <div className="text-xs text-white/50 mt-2 font-medium tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Hébergements vedettes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl font-light text-dark">Coups de <em className="italic text-terracotta">cœur</em></h2>
          <Link to="/hebergements" className="text-sm text-terracotta hover:underline font-medium flex items-center gap-1">
            Voir tout <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hebs?.data?.data?.length > 0 ? hebs.data.data.map(h => <HebergementCard key={h.id} item={h} />) :
            HEBERGEMENTS_MOCK.slice(0, 3).map(h => <HebergementCard key={h.id} item={h} />)}
        </div>
      </section>

      {/* Événements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl font-light text-dark">Événements à <em className="italic text-terracotta">venir</em></h2>
          <Link to="/evenements" className="text-sm text-terracotta hover:underline font-medium flex items-center gap-1">
            Voir tout <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {evts?.data?.data?.length > 0 ? evts.data.data.map(e => <EvenementCard key={e.id} item={e} />) :
            EVENEMENTS_MOCK.slice(0, 3).map(e => <EvenementCard key={e.id} item={e} />)}
        </div>
      </section>
    </div>
  )
}
