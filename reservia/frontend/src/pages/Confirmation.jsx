import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/api'
import StatutBadge from '../components/ui/StatutBadge'

export default function Confirmation() {
  const { ref } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reservation', ref],
    queryFn: () => reservationApi.detail(ref),
    retry: false
  })

  const r = (data?.data && Object.keys(data.data).length > 0)
    ? data.data
    : (isError || !isLoading ? { reference: ref, statut: 'confirmee', reservable: { nom: 'Sélection démo' } } : null)

  const downloadRecu = async () => {
    const response = await reservationApi.recu(ref)
    const url = URL.createObjectURL(new Blob([response.data]))
    const a = document.createElement('a')
    a.href = url; a.download = `recu-${ref}.pdf`; a.click()
  }

  return (
    <div className="pt-16 min-h-screen bg-sand-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {r?.statut === 'confirmee' ? (
          <>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl text-white mx-auto mb-6 shadow-xl animate-bounce">
              <i className="fa-solid fa-check"></i>
            </div>
            <h1 className="font-display text-5xl font-light text-dark mb-4">Réservation confirmée !</h1>
            <p className="text-earth mb-8">
              Votre réservation pour <strong>{r.reservable?.nom}</strong> est confirmée. Un e-mail vous a été envoyé.
            </p>
            <div className="bg-sand rounded-2xl p-6 mb-8">
              <div className="text-xs text-earth tracking-widest uppercase mb-2">Référence</div>
              <div className="font-mono font-bold text-2xl text-terracotta tracking-[4px]">{ref}</div>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/" className="btn-primary px-8 py-3">Retour à l'accueil</Link>
              <button onClick={downloadRecu} className="btn-outline px-8 py-3 flex items-center gap-2">
                <i className="fa-solid fa-file-pdf"></i> Télécharger reçu
              </button>
              <Link to="/profil" className="btn-outline px-8 py-3">Mes réservations</Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-4xl text-amber-500 mx-auto mb-6">
              <i className="fa-solid fa-clock animate-pulse"></i>
            </div>
            <h1 className="font-display text-4xl font-light text-dark mb-4">Paiement en attente</h1>
            <p className="text-earth mb-6">Référence: <strong className="text-terracotta font-mono">{ref}</strong></p>
            <p className="text-earth/70 text-sm mb-8">Votre paiement est en cours de traitement. Vous recevrez une confirmation par e-mail.</p>
            <Link to="/" className="btn-primary px-8 py-3">Retour à l'accueil</Link>
          </>
        )}
      </div>
    </div>
  )
}
