import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { path: '/super-admin',              icon: 'fa-gauge-high',    label: 'Dashboard global' },
  { path: '/super-admin/companies',    icon: 'fa-building',      label: 'Entreprises' },
  { path: '/super-admin/users',        icon: 'fa-users',         label: 'Utilisateurs' },
  { path: '/super-admin/reservations', icon: 'fa-clipboard-list',label: 'Réservations' },
  { path: '/super-admin/payments',     icon: 'fa-credit-card',   label: 'Paiements' },
  { path: '/super-admin/stats',        icon: 'fa-chart-pie',     label: 'Statistiques' },
]

export default function SuperAdminLayout({ children, title }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnecté')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F1A2B] text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <div className="font-display text-xl">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <div className="text-[10px] text-white/40 mt-1 tracking-widest uppercase font-bold">
            Super Administration
          </div>
        </div>

        {/* Profil */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-xs font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ path, icon, label }) => (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${location.pathname === path
                  ? 'bg-terracotta text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <i className={`fa-solid ${icon} w-5`}></i>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <i className="fa-solid fa-arrow-left w-5"></i> Retour au site
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <i className="fa-solid fa-right-from-bracket w-5"></i> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-64 flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="font-display text-2xl text-dark">{title}</h1>
          <span className="text-xs bg-terracotta/10 text-terracotta font-bold px-3 py-1 rounded-full tracking-widest uppercase">
            Super Admin
          </span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
