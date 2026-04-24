import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="font-display text-2xl text-white mb-3">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            La plateforme de référence pour réserver hébergements et événements au Bénin.
            12 départements couverts, paiement sécurisé en FCFA.
          </p>
          <div className="flex gap-3 text-sm">
            <span className="badge bg-terracotta/20 text-terracotta"><i className="fa-solid fa-flag mr-1"></i> Made in Bénin</span>
            <span className="badge bg-earth/20 text-earth"><i className="fa-solid fa-credit-card mr-1"></i> FedaPay</span>
            <span className="badge bg-earth/20 text-earth"><i className="fa-solid fa-mobile-screen-button mr-1"></i> MTN MoMo</span>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-3 text-sm tracking-wider uppercase">Navigation</div>
          {[['/', 'Accueil'], ['/hebergements', 'Hébergements'], ['/evenements', 'Événements']].map(([p, l]) => (
            <Link key={p} to={p} className="block text-sm py-1 hover:text-white transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <div className="font-semibold text-white mb-3 text-sm tracking-wider uppercase">Contact</div>
          <div className="text-sm space-y-2">
            <p><i className="fa-solid fa-location-dot w-5 text-terracotta"></i> Cotonou, Bénin</p>
            <p><i className="fa-solid fa-envelope w-5 text-terracotta"></i> contact@reservia-benin.com</p>
            <p><i className="fa-solid fa-phone w-5 text-terracotta"></i> +229 61 00 00 00</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-white/40">
        © 2026 Réservia Bénin — Tous droits réservés
      </div>
    </footer>
  )
}
