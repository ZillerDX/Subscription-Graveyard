/**
 * Register Page — Premium split-panel with password strength indicator
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMail, FiLock, FiArrowRight, FiActivity,
  FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle,
  FiPlay, FiUserPlus,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

/* ── Password strength helper ────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 6)  score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Too weak',  color: 'bg-rose-500' }
  if (score === 2) return { score, label: 'Weak',     color: 'bg-orange-500' }
  if (score === 3) return { score, label: 'Fair',     color: 'bg-amber-500' }
  if (score === 4) return { score, label: 'Strong',   color: 'bg-lime-500' }
  return                  { score, label: 'Very strong', color: 'bg-emerald-500' }
}

const RegisterPage: React.FC = () => {
  const { register, loginAsDemo, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const strength = getStrength(password)
  const passwordsMatch = confirmPassword !== '' && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setIsSubmitting(true)
    try {
      await register({ email, password })
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span>Setting up account…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-8 animate-fade-in">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-modal border border-zinc-800/80">

        {/* ── Left Hero Panel ── */}
        <div className="hidden lg:flex flex-col relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[0%] right-[-10%] w-[250px] h-[250px] bg-emerald-600/8 rounded-full blur-[80px] pointer-events-none" />

          {/* Brand */}
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
            <p className="eyebrow mb-3">Free, Private, Local-first</p>
            <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
              Take control of your<br />
              <span className="text-gradient-rose">recurring expenses</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mt-3">
              No credit card required. Your data stays on your device — no servers, no tracking. Just pure subscription intelligence.
            </p>
          </div>

          {/* Benefits list */}
          <div className="relative z-10 space-y-4 animate-fade-in-up delay-200">
            {[
              'Visual Kill Zone scatter plot — see your worst subscriptions at a glance',
              'Automatic monthly & yearly cost normalization',
              'Graveyard savings tracker — see exactly how much you\'ve recovered',
              'One-click CSV export for personal finance spreadsheets',
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Registration Form ── */}
        <div className="bg-zinc-900/95 border-l border-zinc-800/80 p-8 sm:p-10 flex flex-col justify-center">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <FiActivity className="w-4 h-4 text-white shrink-0" />
            </div>
            <p className="text-sm font-bold text-white tracking-tight">Subscription Graveyard</p>
          </div>

          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-2xl font-bold tracking-tight text-white">Create account</h1>
            <p className="text-sm text-zinc-400 mt-1">Start tracking subscriptions in seconds</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/8 border border-rose-500/25 rounded-xl flex items-start gap-3 animate-fade-in animate-shake">
              <FiAlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up delay-100">
            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <input
                  id="reg-email"
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
              <label htmlFor="reg-password" className="label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-md pl-10 pr-10"
                  placeholder="min. 6 characters"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4 shrink-0" /> : <FiEye className="w-4 h-4 shrink-0" />}
                </button>
              </div>
              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="label">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4 h-4 text-zinc-500 shrink-0" />
                </div>
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-md pl-10 pr-10 ${
                    confirmPassword && !passwordsMatch ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/50' : ''
                  }`}
                  placeholder="repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <FiEyeOff className="w-4 h-4 shrink-0" /> : <FiEye className="w-4 h-4 shrink-0" />}
                </button>
                {confirmPassword && (
                  <div className="absolute inset-y-0 right-8 flex items-center pr-1">
                    <FiCheckCircle
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        passwordsMatch ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    />
                  </div>
                )}
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
                  Creating account…
                </>
              ) : (
                <>
                  <FiUserPlus className="w-4 h-4 shrink-0" />
                  Create Free Account
                  <FiArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative bg-zinc-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                Or instant access
              </div>
            </div>

            {/* Demo */}
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-emerald-500/25 bg-emerald-500/8 hover:bg-emerald-500/14 text-emerald-400 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 active:scale-[0.98] cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <FiPlay className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              Try Interactive Demo
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center animate-fade-in delay-300">
            <p className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
