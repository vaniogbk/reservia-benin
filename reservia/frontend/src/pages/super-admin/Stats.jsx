import { useQuery } from '@tanstack/react-query'
import { superAdminApi } from '../../services/api'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'
import { SUPER_ADMIN_STATS_MOCK } from '../../data/superAdminStats'

const StatCard = ({ icon, label, value, color }) => (
  <div className={`rounded-2xl p-6 flex items-center gap-5 ${color}`}>
    <div className="text-4xl opacity-70"><i className={`fa-solid ${icon}`}></i></div>
    <div>
      <div className="font-display text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</div>
      <div className="text-sm mt-0.5 opacity-80">{label}</div>
    </div>
  </div>
)

export default function SuperAdminStats() {
  const { data, isError } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: superAdminApi.statistiques,
    retry: false,
  })

  const d = data?.data || (isError ? SUPER_ADMIN_STATS_MOCK.kpis : null)

  return (
    <SuperAdminLayout title="Statistiques globales">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard icon="fa-building"        label="Entreprises inscrites"   value={d?.total_companies    ?? SUPER_ADMIN_STATS_MOCK.kpis.total_companies}    color="bg-blue-50 text-blue-800" />
        <StatCard icon="fa-users"           label="Utilisateurs totaux"     value={d?.total_utilisateurs ?? SUPER_ADMIN_STATS_MOCK.kpis.total_utilisateurs}  color="bg-purple-50 text-purple-800" />
        <StatCard icon="fa-hotel"           label="Hébergements"            value={d?.total_hebergements ?? 89}                                               color="bg-sand text-dark" />
        <StatCard icon="fa-ticket"          label="Événements"              value={d?.total_evenements   ?? 34}                                               color="bg-amber-50 text-amber-800" />
        <StatCard icon="fa-clipboard-list"  label="Réservations totales"    value={d?.total_reservations ?? SUPER_ADMIN_STATS_MOCK.kpis.total_reservations}  color="bg-gray-100 text-dark" />
        <StatCard icon="fa-money-bill-wave" label="Revenus totaux (FCFA)"   value={`${(d?.revenus_total ?? SUPER_ADMIN_STATS_MOCK.kpis.revenus_total_fcfa)?.toLocaleString('fr-FR')} FCFA`} color="bg-green-50 text-green-800" />
      </div>
    </SuperAdminLayout>
  )
}
