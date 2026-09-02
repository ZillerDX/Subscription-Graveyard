/**
 * Register Page Component - Modern Redesign
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiPlay } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const RegisterPage: React.FC = () => {
  const { register, loginAsDemo, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
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
        <div className="text-lg font-semibold text-gray-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto animate-slideUp">
      {/* Logo and Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-3xl shadow-2xl mb-4 animate-float">
          <span className="text-5xl">💸</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
          Subscription Graveyard
        </h1>
        <p className="text-base text-gray-800 font-bold">Kill Your Zombie Subs</p>
      </div>

      <div className="bg-white shadow-2xl rounded-3xl p-10 border-2 border-gray-300">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-800 mb-8 font-semibold">
          Start tracking your subscriptions today
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl animate-shake">
            <p className="text-sm text-red-900 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-extrabold text-gray-900 mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-400 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500 text-base font-semibold text-gray-900 placeholder-gray-500 transition-all hover:border-gray-500"
                placeholder="you@example.com"
                style={{ backgroundColor: '#ffffff', color: '#111827' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-extrabold text-gray-900 mb-2 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-400 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500 text-base font-semibold text-gray-900 placeholder-gray-500 transition-all hover:border-gray-500"
                placeholder="••••••••"
                minLength={8}
                style={{ backgroundColor: '#ffffff', color: '#111827' }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-800 font-bold flex items-center space-x-1">
              <FiCheckCircle className="w-4 h-4 text-zombie-600" />
              <span>Must be at least 8 characters</span>
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-extrabold text-gray-900 mb-2 uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-400 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-300 focus:border-primary-500 text-base font-semibold text-gray-900 placeholder-gray-500 transition-all hover:border-gray-500"
                placeholder="••••••••"
                minLength={8}
                style={{ backgroundColor: '#ffffff', color: '#111827' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-4 px-6 mt-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative bg-white px-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Or explore instantly
            </div>
          </div>

          <button
            type="button"
            onClick={loginAsDemo}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 border-2 border-emerald-500/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-500/60 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <FiPlay className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>Try Interactive Demo (No Backend Required)</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-800 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-primary-600 hover:text-primary-800 underline decoration-2 underline-offset-2 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
