/**
 * Dashboard Service
 * API calls for dashboard statistics and analytics
 */
import { apiClient } from './api'
import { isDemoMode, demoDashboardService } from './demoStorage'

export interface DashboardStats {
  monthly_burn: number
  yearly_cost: number
  active_count: number
  total_count: number
}

export interface KillZoneDataPoint {
  id: string
  name: string
  cost: number  // Monthly normalized cost
  value_score: number
  category: string | null
  billing_cycle: 'monthly' | 'yearly'
}

export interface CategoryBreakdown {
  category: string
  monthly_cost: number
  count: number
}

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    if (isDemoMode()) {
      return demoDashboardService.getStats()
    }

    const response = await apiClient.get<DashboardStats>('/dashboard/stats')
    return response.data
  },

  /**
   * Get Kill Zone scatter plot data
   */
  getKillZoneData: async (): Promise<KillZoneDataPoint[]> => {
    if (isDemoMode()) {
      return demoDashboardService.getKillZoneData()
    }

    const response = await apiClient.get<KillZoneDataPoint[]>('/dashboard/kill-zone')
    return response.data
  },

  /**
   * Get category spending breakdown
   */
  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    if (isDemoMode()) {
      return demoDashboardService.getCategoryBreakdown()
    }

    const response = await apiClient.get<CategoryBreakdown[]>('/dashboard/category-breakdown')
    return response.data
  },
}
