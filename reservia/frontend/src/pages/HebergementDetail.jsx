import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { hebergementApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { HEBERGEMENTS_MOCK } from '../data/hebergements'

export default function HebergementDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['hebergement', id],
    queryFn: () => hebergementApi.detail(id),
    retry: false
  })

  const h = (data?.data && Object.keys(data.data).length > 0)
    ? data.data
    : (isError || !isLoading ? HEBERGEMENTS_MOCK.find(item => item.id === id) : null)

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  )
  if (!h) return null

  const ICONS = {
    hotel: 'fa-hotel',
    ecolodge: 'fa-leaf',
    gite: 'fa-house-chimney',
    villa: 'fa-water-ladder',
    auberge: 'fa-building-columns'
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="h-96 flex items-center justify-center relative overflow-hidden bg-sand">
        {h.image ? (
          <img src={h.image} alt={h.nom} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-8xl relative z-10 text-earth/20">
            <i className={`fa-solid ${ICONS[h.type] || 'fa-house'}`}></i>
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8 flex gap-2 z-10">
          <span className="badge bg-white/90 backdrop-blur-sm text-terracotta shadow-sm capitalize font-bold">{h.type}</span>
          <span className="badge bg-white/90 backdrop-blur-sm text-earth shadow-sm font-bold">
            <i className="fa-solid fa-star mr-1 text-[10px]"></i> {h.note_moyenne}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Infos */}
        <div className="lg:col-span-2">
          <p className="text-xs tracking-widest uppercase text-earth mb-2">
            <i className="fa-solid fa-location-dot mr-1"></i> {h.ville}, {h.departement}
          </p>
          <h1 className="font-display text-4xl font-light text-dark mb-4">{h.nom}</h1>
          <p className="text-dark/70 leading-relaxed mb-6">{h.description}</p>

          {h.commodites?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-dark mb-3">Commodités</h3>
              <div className="flex flex-wrap gap-2">
                {h.commodites.map(c => (
                  <span key={c} className="px-3 py-1.5 bg-sand rounded-full text-sm text-earth font-medium">
                    <i className="fa-solid fa-circle-check mr-1 opacity-50"></i> {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 bg-sand rounded-2xl p-5">
            <div className="text-center"><div className="font-display text-2xl">{h.nb_chambres}</div><div className="text-xs text-earth mt-1">Chambres</div></div>
            <div className="text-center border-x border-earth/20"><div className="font-display text-2xl">{h.capacite_max}</div><div className="text-xs text-earth mt-1">Voyageurs max</div></div>
            <div className="text-center"><div className="font-display text-2xl"><i className="fa-solid fa-star text-sm mr-1"></i>{h.note_moyenne}</div><div className="text-xs text-earth mt-1">{h.nb_avis} avis</div></div>
          </div>
        </div>

        {/* Booking widget */}
        <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24">
          <div className="text-center mb-6">
            <div className="font-display text-3xl text-dark">{h.prix_nuit_fcfa?.toLocaleString('fr-FR')} FCFA</div>
            <div className="text-earth text-sm">par nuit</div>
          </div>
          {user ? (
            <Link to={`/reservation/hebergement/${h.id}`}
              className="btn-terracotta w-full justify-center text-base py-4 flex items-center gap-2">
              Réserver maintenant <i className="fa-solid fa-arrow-right"></i>
            </Link>
          ) : (
            <Link to="/login"
              className="btn-primary w-full justify-center text-base py-4">
              Connexion pour réserver
            </Link>
          )}
          <p className="text-center text-xs text-earth mt-4"><i className="fa-solid fa-lock mr-1"></i> Paiement sécurisé en FCFA</p>
          <p className="text-center text-xs text-earth mt-1"><i className="fa-solid fa-circle-check mr-1 text-green-600/50"></i> Annulation possible avant 48h</p>
        </div>
      </div>
    </div>
  )
}
