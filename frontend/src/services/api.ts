/**
 * API client configuration using Axios
 */
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API service functions (will be expanded in future phases)
export const api = {
  // Health check
  healthCheck: () => apiClient.get('/health'),

  // Auth endpoints (Phase 1)
  // auth: {
  //   register: (data) => apiClient.post('/auth/register', data),
  //   login: (data) => apiClient.post('/auth/login', data),
  //   me: () => apiClient.get('/auth/me'),
  // },
}

export default api
