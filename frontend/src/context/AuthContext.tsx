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

      // Store token
      localStorage.setItem('token', response.access_token)
      setToken(response.access_token)

      // Fetch user data
      const userData = await authService.me()
      setUser(userData)

      // Show success toast
      toast.success('Account created successfully! Welcome to Subscription Graveyard.')

      // Navigate to dashboard
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
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

      // Store token
      localStorage.setItem('token', response.access_token)
      setToken(response.access_token)

      // Fetch user data
      const userData = await authService.me()
      setUser(userData)

      // Show success toast
      toast.success(`Welcome back, ${userData.email}!`)

      // Navigate to dashboard
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
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
