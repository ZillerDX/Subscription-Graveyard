/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth functions
 */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import type { AuthContextType, LoginCredentials, RegisterCredentials, User } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  // Load user data on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await authService.me()
          setUser(userData)
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [token])

  /**
   * Register new user
   */
  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials)
      localStorage.setItem('token', response.access_token)
      setToken(response.access_token)

      const userData = await authService.me()
      setUser(userData)

      toast.success('Account created successfully! Welcome aboard.')
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('token', response.access_token)
      setToken(response.access_token)

      const userData = await authService.me()
      setUser(userData)

      toast.success(`Welcome back, ${userData.email}`)
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Login as demo user
   */
  const loginAsDemo = () => {
    const res = authService.loginDemo()
    setToken(res.access_token)
    setUser({
      id: 'demo-user-id',
      email: 'demo@subscription-graveyard.dev',
      created_at: new Date('2025-01-01T00:00:00Z').toISOString(),
    })
    toast.success('Demo environment loaded.')
    navigate('/')
  }

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('sg_active_session')
    setToken(null)
    setUser(null)
    toast.success('Signed out successfully')
    navigate('/login')
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    isDemo: token === 'demo_token',
    login,
    register,
    loginAsDemo,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
