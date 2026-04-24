import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { companyAdminApi } from '../../services/api'
import CompanyAdminLayout from '../../components/layout/CompanyAdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { COMPANY_ADMIN_STATS_MOCK } from '../../data/companyAdminStats'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'

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

export default function CompanyAdminDashboard() {
  const { companyId } = useParams()
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-admin-dashboard', companyId],
    queryFn: companyAdminApi.dashboard,
    retry: false,
  })

  const d = (data?.data && Object.keys(data.data).length > 0)
    ? data.data
    : (isError || !isLoading ? COMPANY_ADMIN_STATS_MOCK : null)
  const isDemo = !data?.data || isError

  const kpis = d?.kpis
  const companyName = d?.company?.nom || 'Mon entreprise'
  const cid = companyId || user?.company_id

  const chartData = d?.graphiques?.reservations_par_mois?.map(r => ({
    name: `M${r.mois}`, total: r.total,
  })) || []

  return (
    <CompanyAdminLayout title="Tableau de bord" companyName={companyName}>
      {isDemo && !isLoading && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl text-amber-500"><i className="fa-solid fa-screwdriver-wrench"></i></span>
            <div>
              <p className="font-semibold text-sm">Mode Démonstration — {companyName}</p>
              <p className="text-xs opacity-80">Backend hors-ligne. Données simulées pour votre entreprise.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KPI icon="fa-money-bill-trend-up" label="Revenus ce mois"       value={`${kpis?.revenus_mois_fcfa?.toLocaleString('fr-FR')} FCFA`} sub="+8% ↑"       color="bg-green-100 text-green-700" />
            <KPI icon="fa-clipboard-check"     label="Réservations actives"  value={kpis?.reservations_actives}                                 sub="en cours"     color="bg-blue-100 text-blue-700" />
            <KPI icon="fa-star"                label="Note moyenne"          value={kpis?.note_moyenne}                                         sub="sur 5"        color="bg-amber-100 text-amber-700" />
            <KPI icon="fa-hotel"               label="Hébergements"          value={kpis?.total_hebergements}                                   sub="En ligne"     color="bg-teal-100 text-teal-700" />
            <KPI icon="fa-ticket"              label="Événements"            value={kpis?.total_evenements}                                     sub="Programmés"   color="bg-indigo-100 text-indigo-700" />
            <KPI icon="fa-users"               label="Utilisateurs"          value={kpis?.total_utilisateurs}                                   sub="Rattachés"    color="bg-purple-100 text-purple-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-dark mb-4">Réservations — 6 derniers mois</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`${v} réservations`]} />
                  <Bar dataKey="total" fill="#1B6CA8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Raccourcis */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-dark mb-4">Accès rapide</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { to: `/company/${cid}/admin/reservations`, icon: 'fa-clipboard-list', label: 'Réservations', color: 'bg-blue-50 text-blue-600' },
                  { to: `/company/${cid}/admin/hebergements`, icon: 'fa-hotel',           label: 'Hébergements', color: 'bg-teal-50 text-teal-600' },
                  { to: `/company/${cid}/admin/evenements`,   icon: 'fa-ticket',          label: 'Événements',   color: 'bg-indigo-50 text-indigo-600' },
                  { to: `/company/${cid}/admin/users`,        icon: 'fa-users',           label: 'Utilisateurs', color: 'bg-purple-50 text-purple-600' },
                ].map(({ to, icon, label, color }) => (
                  <Link key={to} to={to}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium hover:opacity-80 transition-opacity ${color}`}>
                    <i className={`fa-solid ${icon} text-xl`}></i>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-dark">Dernières réservations</h2>
              <Link to={`/company/${cid}/admin/reservations`} className="text-sm text-primary hover:underline flex items-center gap-1">
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
    </CompanyAdminLayout>
  )
}
