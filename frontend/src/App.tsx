import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import {
  FiHome, FiList, FiLogOut, FiActivity, FiMenu, FiX
} from 'react-icons/fi'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SubscriptionsPage from './pages/SubscriptionsPage'

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#18181b',
            color: '#fafafa',
            border: '1px solid #3f3f46',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 16px 40px -8px rgba(0,0,0,0.7)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#18181b' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#18181b' } },
        }}
      />
      <AppContent />
    </AuthProvider>
  )
}

/* ─── Nav link data ───────────────────────────────────────── */
const NAV_LINKS = [
  { to: '/',              icon: FiHome, label: 'Dashboard' },
  { to: '/subscriptions', icon: FiList, label: 'Subscriptions' },
]

/* ─── User monogram ───────────────────────────────────────── */
function UserMonogram({ email }: { email?: string }) {
  const initials = email
    ? email.substring(0, 2).toUpperCase()
    : 'SG'
  return (
    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm">
      {initials}
    </div>
  )
}

function AppContent() {
  const { isAuthenticated, user, isDemo, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative font-sans antialiased">
      {/* ── Global ambient gradient orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        <div className="absolute top-[-15%] left-[10%] w-[600px] h-[400px] bg-brand-600/5 rounded-full blur-[160px] animate-float" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[30%] right-[5%] w-[500px] h-[450px] bg-indigo-600/5 rounded-full blur-[180px] animate-float" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[300px] bg-emerald-600/4 rounded-full blur-[140px] animate-float" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* ── Navigation Bar ── */}
      {!isAuthPage && (
        <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Brand */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm group-hover:shadow-glow-rose transition-all duration-300">
                  <FiActivity className="w-4 h-4 text-white shrink-0" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-tight text-white leading-none">
                      Subscription Graveyard
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700/50 leading-none">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium mt-0.5 leading-none">
                    Kill zombie subscriptions
                  </p>
                </div>
              </Link>

              {/* Desktop nav links */}
              {isAuthenticated && (
                <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                  {NAV_LINKS.map(({ to, icon: Icon, label }) => {
                    const isActive = location.pathname === to
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                          isActive
                            ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {label}
                      </Link>
                    )
                  })}
                </nav>
              )}

              {/* Right side user menu */}
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  {/* Demo badge */}
                  {isDemo && (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full tracking-wider uppercase">
                      Demo
                    </span>
                  )}

                  {/* User pill */}
                  <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                    <UserMonogram email={user?.email} />
                    <span className="text-zinc-300 font-medium max-w-[120px] truncate">
                      {user?.email}
                    </span>
                  </div>

                  {/* Sign out */}
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-rose-400 bg-zinc-900/60 hover:bg-rose-500/8 border border-zinc-800 hover:border-rose-500/25 rounded-lg transition-all duration-150 active:scale-[0.97]"
                  >
                    <FiLogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>

                  {/* Mobile menu toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                  >
                    {mobileMenuOpen
                      ? <FiX className="w-4 h-4 shrink-0" />
                      : <FiMenu className="w-4 h-4 shrink-0" />
                    }
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          {isAuthenticated && mobileMenuOpen && (
            <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl animate-slide-down">
              <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                {NAV_LINKS.map(({ to, icon: Icon, label }) => {
                  const isActive = location.pathname === to
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                        isActive
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  )
                })}
                <div className="px-4 py-2 flex items-center gap-3 border-t border-zinc-800/60 mt-1 pt-3">
                  <UserMonogram email={user?.email} />
                  <span className="text-xs text-zinc-400 font-medium truncate">{user?.email}</span>
                </div>
              </div>
            </div>
          )}
        </header>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <Routes>
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* ── Footer ── */}
      {!isAuthPage && (
        <footer className="mt-auto border-t border-zinc-800/60 bg-zinc-950 py-5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-brand-600/20 flex items-center justify-center">
                <FiActivity className="w-2.5 h-2.5 text-brand-400 shrink-0" />
              </div>
              <span className="font-semibold text-zinc-500">Subscription Graveyard</span>
              <span className="text-zinc-700">—</span>
              <span>Kill wasteful recurring expenses</span>
            </div>
            <span>Local-first · No backend required</span>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
