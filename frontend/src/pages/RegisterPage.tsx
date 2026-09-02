/**
 * Modern SaaS Register Page
 * Supports instant client-side account creation and validation
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight, FiPlay, FiActivity, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const RegisterPage: React.FC = () => {
  const { register, loginAsDemo, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        <div className="flex items-center space-x-3 text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying session...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto pt-4 pb-12 animate-slideUp">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-4 shadow-sm">
          <FiActivity className="w-6 h-6 shrink-0" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Create Account
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Start tracking and eliminating recurring subscription waste
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-7 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white tracking-tight">Get Started</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your data is isolated and safely saved in your browser
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 animate-fadeIn">
            <FiAlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <FiMail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400 flex items-center space-x-1">
              <FiCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Minimum 6 characters</span>
            </p>
          </div>

          <div>
            <label
              htmlFor="reg-confirm"
              className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 mt-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow-rose-500/20 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <FiArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>

          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Or Instant Access
            </div>
          </div>

          <button
            type="button"
            onClick={loginAsDemo}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer"
          >
            <FiPlay className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>Launch Interactive Demo (Preloaded Data)</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
