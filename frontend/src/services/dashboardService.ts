/**
 * Dashboard Service
 * API calls for dashboard statistics and analytics
 */
import { apiClient } from './api'
import { authStorage } from './authStorage'
import {
  computeDashboardStats,
  computeKillZoneData,
  computeCategoryBreakdown,
} from '../utils/calculations'

export type QuadrantType = 'kill_zone' | 'silent_bleed' | 'premium_investment' | 'bargain' | 'neutral'

export interface DashboardStats {
  monthly_burn: number
  yearly_cost: number
  active_count: number
  total_count: number
  cancelled_count: number
  realized_monthly_savings: number
  realized_yearly_savings: number
  kill_zone_count: number
  kill_zone_monthly_waste: number
  kill_zone_yearly_waste: number
  average_value_score: number
  weighted_value_score: number
}

export interface KillZoneDataPoint {
  id: string
  name: string
  cost: number // Monthly normalized cost
  raw_cost: number
  value_score: number
  category: string | null
  billing_cycle: 'monthly' | 'yearly'
  quadrant: QuadrantType
  recommendation: string
}

export interface CategoryBreakdown {
  category: string
  monthly_cost: number
  yearly_cost: number
  count: number
  percentage: number
}

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    // Check if backend available
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const subs = authStorage.getUserSubscriptions()
      return computeDashboardStats(subs)
    }

    try {
      const response = await apiClient.get<DashboardStats>('/dashboard/stats')
      return response.data
    } catch {
      const subs = authStorage.getUserSubscriptions()
      return computeDashboardStats(subs)
    }
  },

  /**
   * Get Kill Zone scatter plot data
   */
  getKillZoneData: async (): Promise<KillZoneDataPoint[]> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const subs = authStorage.getUserSubscriptions()
      return computeKillZoneData(subs)
    }

    try {
      const response = await apiClient.get<KillZoneDataPoint[]>('/dashboard/kill-zone')
      return response.data
    } catch {
      const subs = authStorage.getUserSubscriptions()
      return computeKillZoneData(subs)
    }
  },

  /**
   * Get category spending breakdown
   */
  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const subs = authStorage.getUserSubscriptions()
      return computeCategoryBreakdown(subs)
    }

    try {
      const response = await apiClient.get<CategoryBreakdown[]>('/dashboard/category-breakdown')
      return response.data
    } catch {
      const subs = authStorage.getUserSubscriptions()
      return computeCategoryBreakdown(subs)
    }
  },
}
