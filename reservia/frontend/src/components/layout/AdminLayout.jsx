import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { path: '/admin', icon: 'fa-chart-line', label: 'Dashboard' },
  { path: '/admin/reservations', icon: 'fa-clipboard-list', label: 'Réservations' },
  { path: '/admin/hebergements', icon: 'fa-hotel', label: 'Hébergements' },
  { path: '/admin/evenements', icon: 'fa-ticket', label: 'Événements' },
  { path: '/admin/utilisateurs', icon: 'fa-users', label: 'Utilisateurs' },
]

export default function AdminLayout({ children, title }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnecté')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <div className="font-display text-xl">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <div className="text-xs text-white/40 mt-1 tracking-widest">ADMINISTRATION</div>
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
        <div className="p-4 border-t border-white/10 space-y-2">
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
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <h1 className="font-display text-2xl text-dark">{title}</h1>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
