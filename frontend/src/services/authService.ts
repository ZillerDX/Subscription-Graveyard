/**
 * Authentication API service
 */
import { apiClient } from './api'
import type { LoginCredentials, RegisterCredentials, AuthToken, User } from '../types/auth'
import { isDemoMode, DEMO_USER } from './demoStorage'

export const authService = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<AuthToken> => {
    const response = await apiClient.post<AuthToken>('/auth/register', credentials)
    return response.data
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthToken> => {
    const response = await apiClient.post<AuthToken>('/auth/login', credentials)
    return response.data
  },

  /**
   * Get current user info
   */
  me: async (): Promise<User> => {
    if (isDemoMode()) {
      return DEMO_USER
    }
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
}
