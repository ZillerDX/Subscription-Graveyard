/**
 * Login Page Component - Modern Redesign
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
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
          Welcome Back! 👋
        </h2>
        <p className="text-center text-gray-800 mb-8 font-semibold">
          Sign in to your account to continue
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl animate-shake">
            <p className="text-sm text-red-900 font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-4 px-6 mt-2 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-800 font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-primary-600 hover:text-primary-800 underline decoration-2 underline-offset-2 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
