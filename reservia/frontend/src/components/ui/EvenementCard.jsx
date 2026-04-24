import { Link } from 'react-router-dom'
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

export default function EvenementCard({ item }) {
  const date = new Date(item.date_debut)
  return (
    <Link to={`/evenements/${item.id}`} className="card group flex flex-col overflow-hidden">
      {/* Image header */}
      <div className="relative h-44 overflow-hidden bg-dark">
        {item.images && item.images[0] ? (
          <img
            src={item.images[0].startsWith('http') ? item.images[0] : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${item.images[0]}`}
            alt={item.nom}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div className="w-full h-full flex items-center justify-center text-6xl text-white/10"
          style={{ background: '#1E1810' }}>
          <i className={`fa-solid ${IC_CATEGORIE[item.categorie] || 'fa-ticket'}`}></i>
        </div>
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category emoji badge */}
        <div className="absolute top-3 left-3 text-3xl drop-shadow-lg text-white/50">
          <i className={`fa-solid ${IC_CATEGORIE[item.categorie] || 'fa-ticket'}`}></i>
        </div>

        {/* Date badge */}
        <div className="absolute top-3 right-3 bg-terracotta text-white rounded-xl px-3 py-2 text-center shadow-lg">
          <div className="font-display text-2xl font-light leading-none">{format(date, 'd')}</div>
          <div className="text-xs tracking-widest uppercase opacity-90">{format(date, 'MMM', { locale: fr })}</div>
        </div>

        {/* Category label */}
        <div className="absolute bottom-3 left-3 badge bg-white/20 backdrop-blur-sm text-white text-xs capitalize border border-white/20">
          {item.categorie}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1">
        <h3 className="font-display text-xl text-dark mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {item.nom}
        </h3>
        <p className="text-xs text-earth mb-3"><i className="fa-solid fa-location-dot mr-1"></i> {item.lieu}, {item.ville}</p>
        <p className="text-sm text-dark/60 line-clamp-2">{item.description}</p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-earth/20 flex items-center justify-between">
        <div>
          {item.prix_fcfa === 0 ? (
            <span className="font-semibold text-green-600">Gratuit</span>
          ) : (
            <>
              <span className="font-semibold text-dark">{item.prix_fcfa?.toLocaleString('fr-FR')} FCFA</span>
              <span className="text-xs text-earth"> / pers.</span>
            </>
          )}
        </div>
        <span className="text-xs text-earth"><i className="fa-solid fa-user-tag mr-1"></i> {item.places_restantes} places</span>
      </div>
    </Link>
  )
}
