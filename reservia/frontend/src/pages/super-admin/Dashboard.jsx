import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { superAdminApi } from '../../services/api'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { SUPER_ADMIN_STATS_MOCK } from '../../data/superAdminStats'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const KPI = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-2xl text-dark/30"><i className={`fa-solid ${icon}`}></i></span>
      <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${color}`}>{sub}</span>
    </div>
    <div className="font-display text-3xl text-dark">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
)

export default function SuperAdminDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['super-admin-dashboard'],
    queryFn: superAdminApi.dashboard,
    retry: false,
  })

  const d = (data?.data && Object.keys(data.data).length > 0)
    ? data.data
    : (isError || !isLoading ? SUPER_ADMIN_STATS_MOCK : null)
  const isDemo = !data?.data || isError

  const kpis = d?.kpis
  const chartData = d?.graphiques?.reservations_par_mois?.map(r => ({
    name: `M${r.mois}`, total: r.total,
  })) || []

  return (
    <SuperAdminLayout title="Dashboard Global">
      {isDemo && !isLoading && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl text-amber-500"><i className="fa-solid fa-screwdriver-wrench"></i></span>
            <div>
              <p className="font-semibold text-sm">Mode Démonstration — Données béninoises simulées</p>
              <p className="text-xs opacity-80">Le backend est hors-ligne. Vue d'ensemble de toutes les entreprises.</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-amber-200/50 rounded-full text-[10px] font-bold tracking-widest uppercase">DEMO</div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KPI icon="fa-money-bill-wave"  label="Revenus totaux"        value={`${kpis?.revenus_total_fcfa?.toLocaleString('fr-FR')} FCFA`}  sub="Cumulé"       color="bg-green-100 text-green-700" />
            <KPI icon="fa-chart-line"       label="Revenus ce mois"       value={`${kpis?.revenus_mois_fcfa?.toLocaleString('fr-FR')} FCFA`}    sub="Ce mois"      color="bg-emerald-100 text-emerald-700" />
            <KPI icon="fa-building"         label="Entreprises actives"   value={kpis?.total_companies}                                          sub="Inscrites"    color="bg-blue-100 text-blue-700" />
            <KPI icon="fa-users"            label="Utilisateurs"          value={kpis?.total_utilisateurs}                                       sub="Total"        color="bg-purple-100 text-purple-700" />
            <KPI icon="fa-clipboard-check"  label="Réservations actives"  value={kpis?.reservations_actives}                                     sub="En cours"     color="bg-amber-100 text-amber-700" />
            <KPI icon="fa-layer-group"      label="Réservations totales"  value={kpis?.total_reservations}                                       sub="Historique"   color="bg-slate-100 text-slate-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Graphique réservations */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-dark mb-4">Réservations — 6 derniers mois (toutes entreprises)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`${v} réservations`]} />
                  <Bar dataKey="total" fill="#C4603A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top entreprises */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-dark mb-4">Top entreprises</h2>
              <div className="space-y-3">
                {d?.graphiques?.revenus_par_company?.map((c, i) => {
                  const max = d.graphiques.revenus_par_company[0]?.revenus || 1
                  const pct = Math.round((c.revenus / max) * 100)
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 truncate max-w-[140px]">{c.nom}</span>
                        <span className="font-medium text-xs">{c.revenus?.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 rounded-full bg-terracotta transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <Link to="/super-admin/companies" className="mt-4 block text-center text-sm text-primary hover:underline">
                Gérer les entreprises →
              </Link>
            </div>
          </div>

          {/* Dernières réservations globales */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-dark">Dernières réservations (global)</h2>
              <Link to="/super-admin/reservations" className="text-sm text-primary hover:underline flex items-center gap-1">
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
                  {d?.dernieres_reservations?.slice(0, 5).map(r => (
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
    </SuperAdminLayout>
  )
}
