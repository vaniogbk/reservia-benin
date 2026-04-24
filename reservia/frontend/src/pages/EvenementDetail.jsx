import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { evenementApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { EVENEMENTS_MOCK } from '../data/evenements'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const IC_CATEGORIE = {
  vodoun: 'fa-drum',
  gastronomie: 'fa-utensils',
  culture: 'fa-masks-theater',
  seminaire: 'fa-briefcase',
  nature: 'fa-hippo',
  art: 'fa-palette'
}

export default function EvenementDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['evenement', id],
    queryFn: () => evenementApi.detail(id),
    retry: false
  })

  const e = (data?.data && Object.keys(data.data).length > 0)
    ? data.data
    : (isError || !isLoading ? EVENEMENTS_MOCK.find(item => item.id === id) : null)

  if (isLoading) return <div className="pt-16 flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
  if (!e) return null

  return (
    <div className="pt-16">
      <div className="h-96 py-16 px-8 relative overflow-hidden flex items-end">
        {e.image ? (
          <img src={e.image} alt={e.nom} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-4xl font-sans">
          <span className="text-6xl mb-4 block drop-shadow-lg text-white/50">
            <i className={`fa-solid ${IC_CATEGORIE[e.categorie] || 'fa-ticket'}`}></i>
          </span>
          <h1 className="font-display text-6xl font-light text-white mb-3 drop-shadow-lg">{e.nom}</h1>
          <p className="text-white/80 text-lg">
            <i className="fa-solid fa-location-dot mr-1"></i> {e.lieu} · {e.ville}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 bg-sand rounded-2xl p-5 mb-8">
            <div className="text-center">
              <div className="font-display text-xl text-dark">
                {format(new Date(e.date_debut), 'dd MMM', { locale: fr })}
              </div>
              <div className="text-xs text-earth mt-1">Date</div>
            </div>
            <div className="text-center border-x border-earth/20">
              <div className="font-display text-xl text-dark">{e.capacite_totale}</div>
              <div className="text-xs text-earth mt-1">Capacité</div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl text-dark">{e.places_restantes}</div>
              <div className="text-xs text-earth mt-1">Places restantes</div>
            </div>
          </div>
          <h2 className="font-semibold text-dark text-lg mb-3">À propos</h2>
          <p className="text-dark/70 leading-relaxed">{e.description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24">
          <div className="text-center mb-6">
            <div className="font-display text-3xl text-dark">{e.prix_fcfa?.toLocaleString('fr-FR')} FCFA</div>
            <div className="text-earth text-sm">par personne</div>
          </div>
          {e.places_restantes > 0 ? (
            user ? (
              <Link to={`/reservation/evenement/${e.id}`}
                className="btn-terracotta w-full justify-center text-base py-4 flex items-center gap-2">
                S'inscrire <i className="fa-solid fa-arrow-right"></i>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary w-full justify-center text-base py-4">
                Connexion pour s'inscrire
              </Link>
            )
          ) : (
            <div className="text-center py-4 bg-red-50 rounded-xl text-red-500 font-medium">
              Complet — Plus de places
            </div>
          )}
          <div className="mt-4 text-xs text-earth text-center space-y-2">
            <p><i className="fa-solid fa-lock mr-1"></i> Paiement sécurisé en FCFA</p>
            <p><i className="fa-solid fa-ticket mr-1"></i> Billet PDF envoyé par e-mail</p>
          </div>
        </div>
      </div>
    </div>
  )
}
