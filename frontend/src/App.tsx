import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import {
  FiHome,
  FiList,
  FiLogOut,
  FiActivity,
  FiMenu,
  FiX,
  FiUser,
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
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#2D2D2D',
            border: '1px solid #F0E6E6',
            borderRadius: '14px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 12px 30px -6px rgba(74, 74, 74, 0.12)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#E11D48',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  )
}

const NAV_LINKS = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/subscriptions', icon: FiList, label: 'Subscriptions' },
]

function AppContent() {
  const { isAuthenticated, user, isDemo, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] flex flex-col relative font-sans antialiased">
      {/* ── Navigation Bar (Toggl Track Minimal Style) ── */}
      {!isAuthPage && (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0E6E6] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand Logo & Name */}
              <Link to="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B02A82] to-[#E2B4BD] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                  <FiActivity className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#2D2D2D] leading-none">
                      Subscription Graveyard
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FCE7F3] text-[#B02A82] border border-[#FBCFE8] leading-none">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A8A8A] font-medium mt-0.5 leading-none">
                    Smart Time-Usage Analytics
                  </p>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              {isAuthenticated && (
                <nav className="hidden md:flex items-center gap-1 bg-[#FFF5F5] p-1 rounded-xl border border-[#F0E6E6]">
                  {NAV_LINKS.map(({ to, icon: Icon, label }) => {
                    const isActive = location.pathname === to
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-150 ${
                          isActive
                            ? 'bg-white text-[#B02A82] shadow-xs'
                            : 'text-[#757575] hover:text-[#2D2D2D]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{label}</span>
                      </Link>
                    )
                  })}
                </nav>
              )}

              {/* User Menu & Actions */}
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  {isDemo && (
                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-[#F7D6D0]/60 text-[#7A4036] border border-[#F7D6D0] rounded-full uppercase tracking-wider">
                      Demo Mode
                    </span>
                  )}

                  {/* User Avatar & Email */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl text-xs">
                    <div className="w-5 h-5 rounded-full bg-[#E2B4BD]/50 text-[#7A3E4E] flex items-center justify-center font-bold text-[10px]">
                      <FiUser className="w-3 h-3" />
                    </div>
                    <span className="text-[#4A4A4A] font-semibold max-w-[130px] truncate">
                      {user?.email}
                    </span>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#757575] hover:text-rose-600 bg-white hover:bg-rose-50 border border-[#F0E6E6] hover:border-rose-200 rounded-xl transition-all duration-150 active:scale-[0.97]"
                  >
                    <FiLogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">ออกจากระบบ</span>
                  </button>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden flex items-center justify-center w-8 h-8 rounded-xl border border-[#F0E6E6] bg-white text-[#5A5A5A]"
                  >
                    {mobileMenuOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Dropdown Nav */}
          {isAuthenticated && mobileMenuOpen && (
            <div className="md:hidden border-t border-[#F0E6E6] bg-white px-4 py-3 space-y-1 animate-fade-in">
              {NAV_LINKS.map(({ to, icon: Icon, label }) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-[#FCE7F3] text-[#B02A82]'
                        : 'text-[#5A5A5A] hover:bg-[#FFF5F5]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                )
              })}
              <div className="pt-2 border-t border-[#F0E6E6] text-xs text-[#8A8A8A] flex items-center gap-2">
                <FiUser className="w-3.5 h-3.5 text-[#B02A82]" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          )}
        </header>
      )}

      {/* ── Main Page Content ── */}
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

      {/* ── Minimal Footer ── */}
      {!isAuthPage && (
        <footer className="mt-auto border-t border-[#F0E6E6] bg-white py-4 text-xs text-[#8A8A8A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-[#B02A82] text-white flex items-center justify-center">
                <FiActivity className="w-2.5 h-2.5" />
              </div>
              <span className="font-bold text-[#4A4A4A]">Subscription Graveyard</span>
              <span>— วิเคราะห์และตัดค่าใช้จ่ายบริการที่ไม่คุ้มค่า</span>
            </div>
            <span>Minimal Light Style · Local-first & Private</span>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
