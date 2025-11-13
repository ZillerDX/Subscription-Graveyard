/**
 * Environment Configuration
 * Manages different API URLs for development and production
 */

interface Environment {
  apiBaseUrl: string
  environment: 'development' | 'production'
}

const getEnvironment = (): Environment => {
  // Check if we're in production
  const isProduction = import.meta.env.PROD

  // Production API URL (set via environment variable or default)
  const productionApiUrl = import.meta.env.VITE_API_URL || 'https://your-api.railway.app'

  // Development API URL
  const developmentApiUrl = 'http://localhost:8000'

  return {
    apiBaseUrl: isProduction ? productionApiUrl : developmentApiUrl,
    environment: isProduction ? 'production' : 'development',
  }
}

export const config = getEnvironment()

export default config
