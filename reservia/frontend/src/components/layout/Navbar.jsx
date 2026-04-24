import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnexion réussie')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-earth/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-semibold text-dark">
            Réser<span className="text-terracotta italic">via</span>
            <span className="ml-1 text-xs font-sans font-normal text-earth tracking-wider">BÉNIN</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {[['/', 'Accueil'], ['/hebergements', 'Hébergements'], ['/evenements', 'Événements']].map(([path, label]) => (
              <Link key={path} to={path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${isActive(path) ? 'bg-dark text-white' : 'text-earth hover:text-dark hover:bg-sand'}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 text-sm font-medium text-primary hover:underline flex items-center gap-1">
                    <i className="fa-solid fa-user-shield"></i> Admin
                  </Link>
                )}
                <Link to="/profil" className="flex items-center gap-2 px-4 py-2 rounded-full bg-sand hover:bg-earth/20 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </div>
                  <span className="text-sm font-medium text-dark">{user.prenom}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm text-earth hover:text-dark transition-colors flex items-center gap-1">
                  <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark hover:text-terracotta transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="btn-terracotta text-sm px-5 py-2">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-sand" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-dark mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-dark mb-1" />
            <div className="w-5 h-0.5 bg-dark" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-earth/20 space-y-2">
            {[['/', 'Accueil'], ['/hebergements', 'Hébergements'], ['/evenements', 'Événements']].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-dark hover:text-terracotta">
                {label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-dark">Connexion</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-terracotta font-semibold">S'inscrire</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
