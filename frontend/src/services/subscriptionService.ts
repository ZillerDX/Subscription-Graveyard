/**
 * Subscription API service
 */
import { apiClient } from './api'
import type {
  Subscription,
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionStatus,
} from '../types/subscription'
import { isDemoMode, demoSubscriptionService } from './demoStorage'

export const subscriptionService = {
  /**
   * Get all subscriptions
   */
  getAll: async (status?: SubscriptionStatus, category?: string): Promise<Subscription[]> => {
    if (isDemoMode()) {
      return demoSubscriptionService.getAll(status, category)
    }

    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (category) params.append('category', category)

    const response = await apiClient.get<Subscription[]>(
      `/subscriptions${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },

  /**
   * Get a single subscription by ID
   */
  getById: async (id: string): Promise<Subscription> => {
    if (isDemoMode()) {
      return demoSubscriptionService.getById(id)
    }

    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`)
    return response.data
  },

  /**
   * Create a new subscription
   */
  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    if (isDemoMode()) {
      return demoSubscriptionService.create(data)
    }

    const response = await apiClient.post<Subscription>('/subscriptions', data)
    return response.data
  },

  /**
   * Update a subscription
   */
  update: async (id: string, data: SubscriptionUpdate): Promise<Subscription> => {
    if (isDemoMode()) {
      return demoSubscriptionService.update(id, data)
    }

    const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, data)
    return response.data
  },

  /**
   * Cancel a subscription (soft delete)
   */
  cancel: async (id: string): Promise<Subscription> => {
    if (isDemoMode()) {
      return demoSubscriptionService.cancel(id)
    }

    const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/cancel`)
    return response.data
  },

  /**
   * Reactivate a cancelled subscription
   */
  reactivate: async (id: string): Promise<Subscription> => {
    if (isDemoMode()) {
      return demoSubscriptionService.reactivate(id)
    }

    const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/reactivate`)
    return response.data
  },

  /**
   * Delete a subscription permanently (hard delete)
   */
  delete: async (id: string): Promise<void> => {
    if (isDemoMode()) {
      return demoSubscriptionService.delete(id)
    }

    await apiClient.delete(`/subscriptions/${id}`)
  },
}
