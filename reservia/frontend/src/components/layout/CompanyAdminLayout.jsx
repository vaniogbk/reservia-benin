import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function CompanyAdminLayout({ children, title, companyName }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { companyId } = useParams()
  const { logout, user } = useAuth()

  const cid = companyId || user?.company_id

  const NAV = [
    { path: `/company/${cid}/admin`,              icon: 'fa-gauge-high',    label: 'Dashboard' },
    { path: `/company/${cid}/admin/reservations`, icon: 'fa-clipboard-list',label: 'Réservations' },
    { path: `/company/${cid}/admin/hebergements`, icon: 'fa-hotel',         label: 'Hébergements' },
    { path: `/company/${cid}/admin/evenements`,   icon: 'fa-ticket',        label: 'Événements' },
    { path: `/company/${cid}/admin/users`,        icon: 'fa-users',         label: 'Utilisateurs' },
  ]

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
          <div className="text-[10px] text-white/40 mt-1 tracking-widest uppercase font-bold">
            {companyName || 'Espace Entreprise'}
          </div>
        </div>

        {/* Profil */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin entreprise</p>
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
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full tracking-widest uppercase">
            {companyName || 'Entreprise'}
          </span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
