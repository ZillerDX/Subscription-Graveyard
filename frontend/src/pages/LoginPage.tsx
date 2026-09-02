/**
 * Login Page — Premium split-panel design
 * Left: animated brand hero  |  Right: clean form
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMail, FiLock, FiArrowRight, FiPlay,
  FiActivity, FiEye, FiEyeOff, FiAlertCircle,
  FiTrendingDown, FiShield, FiDollarSign,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

/* ── Mini preview card for the hero panel ────────────────── */
function HeroMetricCard({
  label, value, sub, color, delay,
}: {
  label: string; value: string; sub: string
  color: 'rose' | 'emerald' | 'indigo'; delay: number
}) {
  const colorMap = {
    rose:    { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    indigo:  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  }
  const c = colorMap[color]
  return (
    <div
      className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
      <p className={`text-xl font-bold tracking-tight tabular ${c.text}`}>{value}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
    </div>
  )
}

const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login({ email, password })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Try the demo instead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying session…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-8 animate-fade-in">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-modal border border-zinc-800/80">

        {/* ── Left: Brand Hero Panel ── */}
        <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-10 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-5%] right-[-10%] w-[250px] h-[250px] bg-indigo-600/8 rounded-full blur-[80px] pointer-events-none" />

          {/* Brand mark */}
          <div className="relative z-10 flex items-center gap-3 mb-12 animate-fade-in-down">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-rose">
              <FiActivity className="w-5 h-5 text-white shrink-0" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">Subscription Graveyard</p>
              <p className="text-[11px] text-zinc-500">Financial Kill Zone Analytics</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 mb-10 animate-fade-in-up delay-100">
            <p className="eyebrow mb-3">Smart Subscription Tracker</p>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Stop bleeding money<br />
              <span className="text-gradient-rose">on zombie subs</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mt-3">
              Visualize your recurring spend, identify low-value subscriptions, and cancel them before they cost you another month.
            </p>
          </div>

          {/* Mini metric preview cards */}
          <div className="relative z-10 grid grid-cols-1 gap-3">
            <HeroMetricCard label="Monthly Burn Rate" value="$234.50" sub="Across 12 active subscriptions" color="rose" delay={200} />
            <HeroMetricCard label="Kill Zone Targets" value="3 subs" sub="Saving $67.00/mo if cancelled" color="indigo" delay={300} />
            <HeroMetricCard label="Graveyard Savings" value="+$420.00/yr" sub="Already realized this year" color="emerald" delay={400} />
          </div>

          {/* Feature pills */}
          <div className="relative z-10 mt-8 flex flex-wrap gap-2 animate-fade-in-up delay-500">
            {[
              { icon: FiDollarSign, text: 'Real cost tracking' },
              { icon: FiTrendingDown, text: 'Kill Zone analysis' },
              { icon: FiShield, text: 'Local-first & private' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/60 rounded-full text-[11px] font-semibold text-zinc-400">
                <Icon className="w-3 h-3 shrink-0 text-brand-400" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Auth Form Panel ── */}
        <div className="bg-zinc-900/95 border-l border-zinc-800/80 p-8 sm:p-10 flex flex-col justify-center">
          {/* Mobile brand (visible only on sm) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <FiActivity className="w-4.5 h-4.5 text-white shrink-0" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">Subscription Graveyard</p>
              <p className="text-[11px] text-zinc-500">Kill zombie subscriptions</p>
            </div>
          </div>

          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-zinc-400 mt-1">Sign in to your account to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/8 border border-rose-500/25 rounded-xl flex items-start gap-3 animate-fade-in">
              <FiAlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up delay-100">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-md pl-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-md pl-10 pr-10"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <FiEyeOff className="w-4 h-4 shrink-0" />
                    : <FiEye    className="w-4 h-4 shrink-0" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-sm py-3 mt-1 rounded-xl shadow-glow-rose"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative bg-zinc-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Or instant access
              </div>
            </div>

            {/* Demo button */}
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-emerald-500/25 bg-emerald-500/8 hover:bg-emerald-500/14 text-emerald-400 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 active:scale-[0.98] cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <FiPlay className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              Launch Interactive Demo
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold tracking-wider uppercase border border-emerald-500/20">
                Preloaded
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center animate-fade-in delay-300">
            <p className="text-xs text-zinc-500">
              No account?{' '}
              <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
