import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FiHome, FiList, FiLogOut, FiUser } from 'react-icons/fi'
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
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000"></div>
      </div>

      {/* Navigation Bar */}
      {!isAuthPage && (
        <header className="glass sticky top-0 z-40 border-b border-white/20 shadow-xl animate-slideDown">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3 animate-slideInLeft">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Subscription Graveyard
                  </h1>
                  <p className="text-xs font-bold bg-gradient-to-r from-death-600 to-death-500 bg-clip-text text-transparent">Kill Your Zombie Subs</p>
                </div>
              </div>

              {/* Navigation Links */}
              {isAuthenticated && (
                <nav className="flex items-center space-x-2 animate-fadeIn">
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      location.pathname === '/'
                        ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/40 transform scale-105'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <FiHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/subscriptions"
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      location.pathname === '/subscriptions'
                        ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/40 transform scale-105'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                    <span>Subscriptions</span>
                  </Link>
                </nav>
              )}

              {/* User Menu */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 animate-slideInRight">
                  {isDemo && (
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-lg shadow-xs">
                      Live Demo
                    </span>
                  )}
                  <div className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-900 max-w-[150px] truncate">
                      {user?.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-bold text-gray-700 bg-white/60 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:bg-death-50 hover:border-death-300 hover:text-death-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
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
        <footer className="mt-auto glass border-t border-white/20 relative z-10">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                💀 Subscription Graveyard
              </p>
              <p className="text-xs font-semibold text-gray-600">
                Track • Analyze • Kill Your Subscriptions
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
