const config = {
  en_attente: { label: 'En attente',  bg: 'bg-amber-100',  text: 'text-amber-700' },
  confirmee:  { label: 'Confirmée',   bg: 'bg-green-100',  text: 'text-green-700' },
  annulee:    { label: 'Annulée',     bg: 'bg-red-100',    text: 'text-red-700'   },
  remboursee: { label: 'Remboursée',  bg: 'bg-blue-100',   text: 'text-blue-700'  },
  reussi:     { label: 'Réussi',      bg: 'bg-green-100',  text: 'text-green-700' },
  echoue:     { label: 'Échoué',      bg: 'bg-red-100',    text: 'text-red-700'   },
}

export default function StatutBadge({ statut }) {
  const c = config[statut] || { label: statut, bg: 'bg-gray-100', text: 'text-gray-700' }
  return (
    <span className={`badge ${c.bg} ${c.text} text-xs font-semibold px-3 py-1 rounded-full`}>
      {c.label}
    </span>
  )
}
