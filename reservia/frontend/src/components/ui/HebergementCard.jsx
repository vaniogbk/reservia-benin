import { Link } from 'react-router-dom'

const ICONS = {
  hotel: 'fa-hotel',
  ecolodge: 'fa-leaf',
  gite: 'fa-house-chimney',
  villa: 'fa-water-ladder',
  auberge: 'fa-building-columns'
}

export default function HebergementCard({ item }) {
  return (
    <Link to={`/hebergements/${item.id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-sand">
        {item.images && item.images[0] ? (
          <img
            src={item.images[0].startsWith('http') ? item.images[0] : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${item.images[0]}`}
            alt={item.nom}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        {/* Fallback emoji */}
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl bg-sand text-earth/20"
          style={{ display: (item.images && item.images[0]) ? 'none' : 'flex' }}
        >
          <i className={`fa-solid ${ICONS[item.type] || 'fa-house'}`}></i>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 badge bg-white/90 backdrop-blur-sm text-terracotta shadow-sm font-semibold">
          <i className="fa-solid fa-star mr-1 text-[10px]"></i> {item.note_moyenne}
        </div>
        <div className="absolute top-3 right-3 badge bg-dark/70 backdrop-blur-sm text-white text-xs capitalize">
          {item.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs tracking-widest uppercase text-earth mb-1">
          <i className="fa-solid fa-location-dot mr-1"></i> {item.ville}, {item.departement}
        </p>
        <h3 className="font-display text-xl text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {item.nom}
        </h3>
        {item.description && (
          <p className="text-sm text-earth/70 line-clamp-2 mb-3">{item.description}</p>
        )}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.commodites?.slice(0, 3).map(c => (
            <span key={c} className="inline-block px-2 py-0.5 bg-sand text-earth text-xs rounded-full">{c}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-earth/20">
          <div>
            <span className="font-semibold text-dark">{item.prix_nuit_fcfa?.toLocaleString('fr-FR')} FCFA</span>
            <span className="text-xs text-earth"> / nuit</span>
          </div>
          <span className="text-xs text-earth"><i className="fa-solid fa-users mr-1"></i> max {item.capacite_max}</span>
        </div>
      </div>
    </Link>
  )
}
