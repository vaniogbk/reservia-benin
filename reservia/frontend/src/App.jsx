import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages publiques
import Home from './pages/Home'
import Hebergements from './pages/Hebergements'
import HebergementDetail from './pages/HebergementDetail'
import Evenements from './pages/Evenements'
import EvenementDetail from './pages/EvenementDetail'
import Reservation from './pages/Reservation'
import Confirmation from './pages/Confirmation'
import Profil from './pages/Profil'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminDemo from './pages/AdminDemo'

// Admin entreprise (legacy)
import Dashboard from './pages/admin/Dashboard'
import AdminReservations from './pages/admin/Reservations'
import AdminHebergements from './pages/admin/Hebergements'
import AdminEvenements from './pages/admin/Evenements'
import AdminUtilisateurs from './pages/admin/Utilisateurs'

// Super Admin
import SuperAdminDashboard from './pages/super-admin/Dashboard'
import SuperAdminCompanies from './pages/super-admin/Companies'
import SuperAdminUsers from './pages/super-admin/Users'
import SuperAdminReservations from './pages/super-admin/Reservations'
import SuperAdminPayments from './pages/super-admin/Payments'
import SuperAdminStats from './pages/super-admin/Stats'

// Company Admin
import CompanyAdminDashboard from './pages/company-admin/Dashboard'
import CompanyAdminReservations from './pages/company-admin/Reservations'
import CompanyAdminHebergements from './pages/company-admin/Hebergements'
import CompanyAdminEvenements from './pages/company-admin/Evenements'
import CompanyAdminUsers from './pages/company-admin/Users'

// ── Guards de routes ──────────────────────────────────────────────────────────

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function SuperAdminRoute({ children }) {
  const { user, loading, isSuperAdmin } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (!isSuperAdmin) return <Navigate to="/" replace />
  return children
}

function CompanyAdminRoute({ children }) {
  const { user, loading, isCompanyAdmin, isSuperAdmin } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  // Super admin peut aussi accéder aux vues company
  if (!isCompanyAdmin && !isSuperAdmin) return <Navigate to="/" replace />
  return children
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  )
}

// ── Layout principal public ───────────────────────────────────────────────────

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public (avec Navbar + Footer) ── */}
          <Route element={<PublicWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/hebergements" element={<Hebergements />} />
            <Route path="/hebergements/:id" element={<HebergementDetail />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/evenements/:id" element={<EvenementDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-demo" element={<AdminDemo />} />
            <Route path="/reservation/:type/:id" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
            <Route path="/confirmation/:ref" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
          </Route>

          {/* ── Admin entreprise legacy (sans Navbar publique) ── */}
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />
          <Route path="/admin/hebergements" element={<AdminRoute><AdminHebergements /></AdminRoute>} />
          <Route path="/admin/evenements" element={<AdminRoute><AdminEvenements /></AdminRoute>} />
          <Route path="/admin/utilisateurs" element={<AdminRoute><AdminUtilisateurs /></AdminRoute>} />

          {/* ── Super Admin ── */}
          <Route path="/super-admin" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />
          <Route path="/super-admin/companies" element={<SuperAdminRoute><SuperAdminCompanies /></SuperAdminRoute>} />
          <Route path="/super-admin/users" element={<SuperAdminRoute><SuperAdminUsers /></SuperAdminRoute>} />
          <Route path="/super-admin/reservations" element={<SuperAdminRoute><SuperAdminReservations /></SuperAdminRoute>} />
          <Route path="/super-admin/payments" element={<SuperAdminRoute><SuperAdminPayments /></SuperAdminRoute>} />
          <Route path="/super-admin/stats" element={<SuperAdminRoute><SuperAdminStats /></SuperAdminRoute>} />

          {/* ── Company Admin ── */}
          <Route path="/company/:companyId/admin" element={<CompanyAdminRoute><CompanyAdminDashboard /></CompanyAdminRoute>} />
          <Route path="/company/:companyId/admin/reservations" element={<CompanyAdminRoute><CompanyAdminReservations /></CompanyAdminRoute>} />
          <Route path="/company/:companyId/admin/hebergements" element={<CompanyAdminRoute><CompanyAdminHebergements /></CompanyAdminRoute>} />
          <Route path="/company/:companyId/admin/evenements" element={<CompanyAdminRoute><CompanyAdminEvenements /></CompanyAdminRoute>} />
          <Route path="/company/:companyId/admin/users" element={<CompanyAdminRoute><CompanyAdminUsers /></CompanyAdminRoute>} />

          {/* Redirection par défaut pour les rôles admin au login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

// Wrapper qui ajoute Navbar + Footer uniquement sur les routes publiques
import { Outlet } from 'react-router-dom'
function PublicWrapper() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}
