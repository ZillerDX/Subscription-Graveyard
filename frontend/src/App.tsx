import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FiHome, FiList, FiLogOut, FiUser, FiActivity } from 'react-icons/fi'
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
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#0f172a',
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { isAuthenticated, user, isDemo, logout } = useAuth()
  const location = useLocation()

  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col relative font-sans antialiased selection:bg-rose-500/20 selection:text-rose-200">
      {/* Subtle ambient light accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[350px] bg-rose-900/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[400px] bg-indigo-900/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation Bar */}
      {!isAuthPage && (
        <header className="sticky top-0 z-40 bg-[#090D16]/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Brand Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-sm group-hover:border-rose-500/40 group-hover:bg-rose-500/20 transition-all duration-200">
                  <FiActivity className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                      Subscription Graveyard
                    </span>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Kill zombie subscriptions</p>
                </div>
              </Link>

              {/* Navigation Links */}
              {isAuthenticated && (
                <nav className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                      location.pathname === '/'
                        ? 'bg-slate-800 text-white shadow-xs border border-slate-700/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <FiHome className="w-3.5 h-3.5 shrink-0" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/subscriptions"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                      location.pathname === '/subscriptions'
                        ? 'bg-slate-800 text-white shadow-xs border border-slate-700/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <FiList className="w-3.5 h-3.5 shrink-0" />
                    <span>Subscriptions</span>
                  </Link>
                </nav>
              )}

              {/* User Menu */}
              {isAuthenticated && (
                <div className="flex items-center space-x-2.5">
                  {isDemo && (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md tracking-wide">
                      Live Demo
                    </span>
                  )}
                  <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
                    <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300">
                      <FiUser className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className="text-slate-300 font-medium max-w-[140px] truncate">
                      {user?.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-900/50 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 rounded-lg transition-all duration-150"
                  >
                    <FiLogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <SubscriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="mt-auto border-t border-slate-800/80 bg-[#090D16] py-6 relative z-10 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <FiActivity className="w-2.5 h-2.5 shrink-0" />
              </div>
              <span className="font-semibold text-slate-400">Subscription Graveyard</span>
              <span>— Kill wasteful recurring expenses</span>
            </div>
            <div className="text-slate-500">
              Clean, local-first analytics & Kill Zone intelligence
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
