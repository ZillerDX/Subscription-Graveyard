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

export const subscriptionService = {
  /**
   * Get all subscriptions
   */
  getAll: async (status?: SubscriptionStatus, category?: string): Promise<Subscription[]> => {
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
    const response = await apiClient.get<Subscription>(`/subscriptions/${id}`)
    return response.data
  },

  /**
   * Create a new subscription
   */
  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>('/subscriptions', data)
    return response.data
  },

  /**
   * Update a subscription
   */
  update: async (id: string, data: SubscriptionUpdate): Promise<Subscription> => {
    const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, data)
    return response.data
  },

  /**
   * Cancel a subscription (soft delete)
   */
  cancel: async (id: string): Promise<Subscription> => {
    const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/cancel`)
    return response.data
  },

  /**
   * Reactivate a cancelled subscription
   */
  reactivate: async (id: string): Promise<Subscription> => {
    const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/reactivate`)
    return response.data
  },

  /**
   * Delete a subscription permanently (hard delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/subscriptions/${id}`)
  },
}
