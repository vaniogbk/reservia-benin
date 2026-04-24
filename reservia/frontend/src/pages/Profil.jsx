import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StatutBadge from '../components/ui/StatutBadge'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Profil() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({ queryKey: ['mes-reservations'], queryFn: reservationApi.mesList })
  const reservations = data?.data?.data || []

  return (
    <div className="pt-16 min-h-screen bg-sand-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl flex items-center justify-center font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl text-dark">{user?.prenom} {user?.nom}</h1>
            <p className="text-earth">{user?.email}</p>
            <span className={`badge text-xs mt-1 ${user?.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-sand text-earth'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <h2 className="font-display text-3xl text-dark mb-6">Mes Réservations</h2>

        {isLoading ? (
          <div className="space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-white h-24 animate-pulse" />)}</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-5xl mb-4 text-earth/20"><i className="fa-solid fa-clipboard-list"></i></div>
            <p className="font-display text-2xl text-dark mb-2">Aucune réservation</p>
            <p className="text-earth mb-6">Commencez par explorer nos hébergements et événements</p>
            <Link to="/hebergements" className="btn-primary px-8 py-3">Explorer</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-sand flex items-center justify-center text-xl text-earth flex-shrink-0">
                  <i className={`fa-solid ${r.reservable_type?.includes('Hebergement') ? 'fa-hotel' : 'fa-ticket'}`}></i>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-dark">{r.reservable?.nom}</div>
                  <div className="text-sm text-earth">
                    {r.date_arrivee ? `${format(new Date(r.date_arrivee), 'dd MMM yyyy', { locale: fr })} → ${format(new Date(r.date_depart), 'dd MMM yyyy', { locale: fr })}` : 'Événement ponctuel'}
                  </div>
                  <div className="font-mono text-xs text-terracotta mt-1">{r.reference}</div>
                </div>
                <div className="text-right">
                  <StatutBadge statut={r.statut} />
                  <div className="text-sm font-semibold text-dark mt-2">{r.montant_total_fcfa?.toLocaleString('fr-FR')} FCFA</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
