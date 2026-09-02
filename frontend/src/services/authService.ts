/**
 * Authentication API service
 */
import { apiClient } from './api'
import type { LoginCredentials, RegisterCredentials, AuthToken, User } from '../types/auth'
import { authStorage } from './authStorage'

export const authService = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<AuthToken> => {
    // If backend is available, try it; otherwise use authStorage
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend && typeof window !== 'undefined') {
      try {
        const response = await apiClient.post<AuthToken>('/auth/register', credentials)
        return response.data
      } catch (err: any) {
        // If network error (backend not running or GitHub Pages), seamlessly use authStorage
        if (!err.response || err.response.status === 404 || err.message?.includes('Network Error')) {
          return authStorage.register(credentials)
        }
        throw err
      }
    }
    try {
      const response = await apiClient.post<AuthToken>('/auth/register', credentials)
      return response.data
    } catch {
      return authStorage.register(credentials)
    }
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthToken> => {
    try {
      const response = await apiClient.post<AuthToken>('/auth/login', credentials)
      return response.data
    } catch (err: any) {
      // If network error (backend not running or GitHub Pages), seamlessly use authStorage
      if (!err.response || err.response.status === 404 || err.message?.includes('Network Error') || err.code === 'ERR_NETWORK') {
        return authStorage.login(credentials)
      }
      throw err
    }
  },

  /**
   * Quick Demo Login
   */
  loginDemo: (): AuthToken => {
    return authStorage.loginAsDemo()
  },

  /**
   * Get current user info
   */
  me: async (): Promise<User> => {
    const localUser = authStorage.getCurrentUser()
    if (localUser) {
      return localUser
    }
    try {
      const response = await apiClient.get<User>('/auth/me')
      return response.data
    } catch {
      if (localUser) return localUser
      throw new Error('Not authenticated')
    }
  },
}
