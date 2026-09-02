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
import { authStorage } from './authStorage'

export const subscriptionService = {
  /**
   * Get all subscriptions
   */
  getAll: async (status?: SubscriptionStatus, category?: string): Promise<Subscription[]> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      let list = authStorage.getUserSubscriptions()
      if (status) {
        list = list.filter((s) => s.status === status)
      }
      if (category) {
        list = list.filter((s) => s.category?.toLowerCase() === category.toLowerCase())
      }
      return list
    }

    try {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (category) params.append('category', category)

      const response = await apiClient.get<Subscription[]>(
        `/subscriptions${params.toString() ? `?${params.toString()}` : ''}`
      )
      return response.data
    } catch {
      let list = authStorage.getUserSubscriptions()
      if (status) {
        list = list.filter((s) => s.status === status)
      }
      if (category) {
        list = list.filter((s) => s.category?.toLowerCase() === category.toLowerCase())
      }
      return list
    }
  },

  /**
   * Get a single subscription by ID
   */
  getById: async (id: string): Promise<Subscription> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const list = authStorage.getUserSubscriptions()
      const found = list.find((s) => s.id === id)
      if (!found) throw new Error('Subscription not found')
      return found
    }

    try {
      const response = await apiClient.get<Subscription>(`/subscriptions/${id}`)
      return response.data
    } catch {
      const list = authStorage.getUserSubscriptions()
      const found = list.find((s) => s.id === id)
      if (!found) throw new Error('Subscription not found')
      return found
    }
  },

  /**
   * Create a new subscription
   */
  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const list = authStorage.getUserSubscriptions()
      const user = authStorage.getCurrentUser()
      const newSub: Subscription = {
        id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: user?.id || 'demo-user-id',
        name: data.name.trim(),
        cost: Number(data.cost) || 0,
        billing_cycle: data.billing_cycle,
        value_score: data.value_score,
        category: data.category?.trim() || null,
        emoji: null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      list.unshift(newSub)
      authStorage.saveUserSubscriptions(list)
      return newSub
    }

    try {
      const response = await apiClient.post<Subscription>('/subscriptions', data)
      return response.data
    } catch {
      const list = authStorage.getUserSubscriptions()
      const user = authStorage.getCurrentUser()
      const newSub: Subscription = {
        id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: user?.id || 'demo-user-id',
        name: data.name.trim(),
        cost: Number(data.cost) || 0,
        billing_cycle: data.billing_cycle,
        value_score: data.value_score,
        category: data.category?.trim() || null,
        emoji: null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      list.unshift(newSub)
      authStorage.saveUserSubscriptions(list)
      return newSub
    }
  },

  /**
   * Update a subscription
   */
  update: async (id: string, data: SubscriptionUpdate): Promise<Subscription> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const list = authStorage.getUserSubscriptions()
      const index = list.findIndex((s) => s.id === id)
      if (index === -1) throw new Error('Subscription not found')
      const current = list[index]
      const updated: Subscription = {
        ...current,
        name: data.name !== undefined ? data.name.trim() : current.name,
        cost: data.cost !== undefined ? Number(data.cost) : current.cost,
        billing_cycle: data.billing_cycle !== undefined ? data.billing_cycle : current.billing_cycle,
        value_score: data.value_score !== undefined ? data.value_score : current.value_score,
        category: data.category !== undefined ? data.category?.trim() || null : current.category,
        emoji: null,
        updated_at: new Date().toISOString(),
      }
      list[index] = updated
      authStorage.saveUserSubscriptions(list)
      return updated
    }

    try {
      const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, data)
      return response.data
    } catch {
      const list = authStorage.getUserSubscriptions()
      const index = list.findIndex((s) => s.id === id)
      if (index === -1) throw new Error('Subscription not found')
      const current = list[index]
      const updated: Subscription = {
        ...current,
        name: data.name !== undefined ? data.name.trim() : current.name,
        cost: data.cost !== undefined ? Number(data.cost) : current.cost,
        billing_cycle: data.billing_cycle !== undefined ? data.billing_cycle : current.billing_cycle,
        value_score: data.value_score !== undefined ? data.value_score : current.value_score,
        category: data.category !== undefined ? data.category?.trim() || null : current.category,
        emoji: null,
        updated_at: new Date().toISOString(),
      }
      list[index] = updated
      authStorage.saveUserSubscriptions(list)
      return updated
    }
  },

  /**
   * Cancel a subscription (soft delete - sends to Graveyard)
   */
  cancel: async (id: string): Promise<Subscription> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const list = authStorage.getUserSubscriptions()
      const sub = list.find((s) => s.id === id)
      if (!sub) throw new Error('Subscription not found')
      sub.status = 'cancelled'
      sub.updated_at = new Date().toISOString()
      authStorage.saveUserSubscriptions(list)
      return sub
    }

    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/cancel`)
      return response.data
    } catch {
      const list = authStorage.getUserSubscriptions()
      const sub = list.find((s) => s.id === id)
      if (!sub) throw new Error('Subscription not found')
      sub.status = 'cancelled'
      sub.updated_at = new Date().toISOString()
      authStorage.saveUserSubscriptions(list)
      return sub
    }
  },

  /**
   * Reactivate a cancelled subscription
   */
  reactivate: async (id: string): Promise<Subscription> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const list = authStorage.getUserSubscriptions()
      const sub = list.find((s) => s.id === id)
      if (!sub) throw new Error('Subscription not found')
      sub.status = 'active'
      sub.updated_at = new Date().toISOString()
      authStorage.saveUserSubscriptions(list)
      return sub
    }

    try {
      const response = await apiClient.patch<Subscription>(`/subscriptions/${id}/reactivate`)
      return response.data
    } catch {
      const list = authStorage.getUserSubscriptions()
      const sub = list.find((s) => s.id === id)
      if (!sub) throw new Error('Subscription not found')
      sub.status = 'active'
      sub.updated_at = new Date().toISOString()
      authStorage.saveUserSubscriptions(list)
      return sub
    }
  },

  /**
   * Delete a subscription permanently (hard delete)
   */
  delete: async (id: string): Promise<void> => {
    const isLocalOrNoBackend = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')
    if (isLocalOrNoBackend) {
      const list = authStorage.getUserSubscriptions()
      const filtered = list.filter((s) => s.id !== id)
      authStorage.saveUserSubscriptions(filtered)
      return
    }

    try {
      await apiClient.delete(`/subscriptions/${id}`)
    } catch {
      const list = authStorage.getUserSubscriptions()
      const filtered = list.filter((s) => s.id !== id)
      authStorage.saveUserSubscriptions(filtered)
    }
  },
}
