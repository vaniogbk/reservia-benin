import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { ADMIN_STATS_MOCK } from '../../data/adminStats'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const KPI = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-2xl text-dark/30"><i className={`fa-solid ${icon}`}></i></span>
      <span className={`badge text-[10px] font-bold tracking-wider uppercase ${color}`}>{sub}</span>
    </div>
    <div className="font-display text-3xl text-dark">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
)

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.dashboard, retry: false })

  const d = (data?.data && Object.keys(data.data).length > 0) ? data.data : (isError || !isLoading ? ADMIN_STATS_MOCK : null)
  const isDemoMode = !data?.data || Object.keys(data.data).length === 0

  const kpis = d?.kpis
  const revenusMois = kpis?.revenus_mois_fcfa?.toLocaleString('fr-FR')

  const chartData = d?.graphiques?.reservations_par_mois?.map(r => ({
    name: `M${r.mois}`, total: r.total
  })) || []

  return (
    <AdminLayout title="Tableau de bord">
      {isDemoMode && !isLoading && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <span className="text-xl text-amber-500"><i className="fa-solid fa-screwdriver-wrench"></i></span>
            <div>
              <p className="font-semibold text-sm">Mode Démonstration</p>
              <p className="text-xs opacity-80">Le backend est hors-ligne. Affichage des données béninoises simulées.</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-amber-200/50 rounded-full text-[10px] font-bold tracking-widest uppercase">OFFLINE</div>
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPI icon="fa-money-bill-trend-up" label="Revenus ce mois" value={`${revenusMois} FCFA`} sub="+12% ↑" color="bg-green-100 text-green-700" />
            <KPI icon="fa-clipboard-check" label="Réservations actives" value={kpis?.reservations_actives} sub="en cours" color="bg-blue-100 text-blue-700" />
            <KPI icon="fa-star" label="Note moyenne" value={kpis?.note_moyenne} sub="sur 5" color="bg-amber-100 text-amber-700" />
            <KPI icon="fa-users" label="Nouveaux utilisateurs" value={kpis?.utilisateurs_ce_mois} sub="ce mois" color="bg-purple-100 text-purple-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Graphique */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-dark mb-4">Réservations par mois</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`${v} réservations`]} />
                  <Bar dataKey="total" fill="#1B6CA8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Répartition revenus */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-dark mb-4">Répartition revenus</h2>
              <div className="space-y-4">
                {d?.graphiques?.repartition_revenus?.map(r => {
                  const total = d.graphiques.repartition_revenus.reduce((a, x) => a + x.montant, 0)
                  const pct = total ? Math.round((r.montant / total) * 100) : 0
                  return (
                    <div key={r.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{r.label}</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.montant?.toLocaleString('fr-FR')} FCFA</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Dernières réservations */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-dark">Dernières réservations</h2>
              <Link to="/admin/reservations" className="text-sm text-primary hover:underline flex items-center gap-1">
                Voir tout <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    {['Référence', 'Client', 'Prestation', 'Montant', 'Statut'].map(h => (
                      <th key={h} className="px-6 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {d?.dernieres_reservations?.slice(0, 6).map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-terracotta font-semibold">{r.reference}</td>
                      <td className="px-6 py-4 text-sm text-dark">{r.user?.prenom} {r.user?.nom}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.reservable?.nom}</td>
                      <td className="px-6 py-4 text-sm font-medium">{r.montant_total_fcfa?.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-6 py-4"><StatutBadge statut={r.statut} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
