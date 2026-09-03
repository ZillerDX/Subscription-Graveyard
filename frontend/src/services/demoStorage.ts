/**
 * Demo Storage Service
 * Provides offline interactive storage for GitHub Pages demo visitors
 */
import type { User } from '../types/auth'
import type {
  Subscription,
  SubscriptionCreate,
  SubscriptionUpdate,
  SubscriptionStatus,
} from '../types/subscription'
import type { DashboardStats, KillZoneDataPoint, CategoryBreakdown } from './dashboardService'
import {
  computeDashboardStats,
  computeKillZoneData,
  computeCategoryBreakdown,
} from '../utils/calculations'

const DEMO_STORAGE_KEY = 'demo_subscriptions'
export const DEMO_TOKEN = 'demo_token'

export const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'demo@subscription-graveyard.dev',
  created_at: new Date().toISOString(),
}

const INITIAL_DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'demo-1',
    user_id: DEMO_USER.id,
    name: 'Netflix Premium',
    cost: 16.99,
    billing_cycle: 'monthly',
    value_score: 4,
    category: 'Entertainment',
    emoji: '🍿',
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'demo-2',
    user_id: DEMO_USER.id,
    name: 'Gym Membership',
    cost: 75.00,
    billing_cycle: 'monthly',
    value_score: 1,
    category: 'Health & Fitness',
    emoji: '🏋️',
    status: 'active',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'demo-3',
    user_id: DEMO_USER.id,
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    billing_cycle: 'monthly',
    value_score: 2,
    category: 'Work & Tools',
    emoji: '🎨',
    status: 'active',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'demo-4',
    user_id: DEMO_USER.id,
    name: 'Spotify Premium',
    cost: 10.99,
    billing_cycle: 'monthly',
    value_score: 5,
    category: 'Entertainment',
    emoji: '🎵',
    status: 'active',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: 'demo-5',
    user_id: DEMO_USER.id,
    name: 'ChatGPT Plus',
    cost: 20.00,
    billing_cycle: 'monthly',
    value_score: 5,
    category: 'Work & Tools',
    emoji: '🤖',
    status: 'active',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'demo-6',
    user_id: DEMO_USER.id,
    name: 'Cloud Storage 2TB',
    cost: 9.99,
    billing_cycle: 'monthly',
    value_score: 4,
    category: 'Utilities',
    emoji: '☁️',
    status: 'active',
    created_at: new Date(Date.now() - 100 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 100 * 86400000).toISOString(),
  },
  {
    id: 'demo-7',
    user_id: DEMO_USER.id,
    name: 'Amazon Prime',
    cost: 139.00,
    billing_cycle: 'yearly',
    value_score: 3,
    category: 'Shopping',
    emoji: '📦',
    status: 'active',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'demo-8',
    user_id: DEMO_USER.id,
    name: 'Obsolete News Subscription',
    cost: 14.99,
    billing_cycle: 'monthly',
    value_score: 1,
    category: 'Reading',
    emoji: '📰',
    status: 'cancelled',
    created_at: new Date(Date.now() - 200 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
]

export const isDemoMode = (): boolean => {
  return localStorage.getItem('token') === DEMO_TOKEN
}

export const getStoredDemoSubscriptions = (): Subscription[] => {
  const stored = localStorage.getItem(DEMO_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SUBSCRIPTIONS))
    return INITIAL_DEMO_SUBSCRIPTIONS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return INITIAL_DEMO_SUBSCRIPTIONS
  }
}

export const saveDemoSubscriptions = (subs: Subscription[]): void => {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(subs))
}

export const demoSubscriptionService = {
  getAll: async (status?: SubscriptionStatus, category?: string): Promise<Subscription[]> => {
    let list = getStoredDemoSubscriptions()
    if (status) {
      list = list.filter((s) => s.status === status)
    }
    if (category) {
      list = list.filter((s) => s.category?.toLowerCase() === category.toLowerCase())
    }
    return list
  },

  getById: async (id: string): Promise<Subscription> => {
    const list = getStoredDemoSubscriptions()
    const found = list.find((s) => s.id === id)
    if (!found) throw new Error('Subscription not found')
    return found
  },

  create: async (data: SubscriptionCreate): Promise<Subscription> => {
    const list = getStoredDemoSubscriptions()
    const hours = typeof data.monthly_hours === 'number' ? data.monthly_hours : 15
    const newSub: Subscription = {
      id: `demo-${Date.now()}`,
      user_id: DEMO_USER.id,
      name: data.name,
      cost: Number(data.cost) || 0,
      billing_cycle: data.billing_cycle,
      value_score: data.value_score || 3,
      monthly_hours: hours,
      logo_key: data.logo_key || null,
      category: data.category || null,
      emoji: data.emoji || null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    list.unshift(newSub)
    saveDemoSubscriptions(list)
    return newSub
  },

  update: async (id: string, data: SubscriptionUpdate): Promise<Subscription> => {
    const list = getStoredDemoSubscriptions()
    const index = list.findIndex((s) => s.id === id)
    if (index === -1) throw new Error('Subscription not found')
    const current = list[index]
    const updated: Subscription = {
      ...current,
      name: data.name !== undefined ? data.name : current.name,
      cost: data.cost !== undefined ? Number(data.cost) : current.cost,
      billing_cycle: data.billing_cycle !== undefined ? data.billing_cycle : current.billing_cycle,
      value_score: data.value_score !== undefined ? data.value_score : current.value_score,
      monthly_hours: data.monthly_hours !== undefined ? data.monthly_hours : current.monthly_hours,
      logo_key: data.logo_key !== undefined ? data.logo_key : current.logo_key,
      category: data.category !== undefined ? data.category : current.category,
      emoji: data.emoji !== undefined ? data.emoji : current.emoji,
      updated_at: new Date().toISOString(),
    }
    list[index] = updated
    saveDemoSubscriptions(list)
    return updated
  },

  cancel: async (id: string): Promise<Subscription> => {
    const list = getStoredDemoSubscriptions()
    const sub = list.find((s) => s.id === id)
    if (!sub) throw new Error('Subscription not found')
    sub.status = 'cancelled'
    sub.updated_at = new Date().toISOString()
    saveDemoSubscriptions(list)
    return sub
  },

  reactivate: async (id: string): Promise<Subscription> => {
    const list = getStoredDemoSubscriptions()
    const sub = list.find((s) => s.id === id)
    if (!sub) throw new Error('Subscription not found')
    sub.status = 'active'
    sub.updated_at = new Date().toISOString()
    saveDemoSubscriptions(list)
    return sub
  },

  delete: async (id: string): Promise<void> => {
    const list = getStoredDemoSubscriptions()
    const filtered = list.filter((s) => s.id !== id)
    saveDemoSubscriptions(filtered)
  },
}

export const demoDashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const list = getStoredDemoSubscriptions()
    return computeDashboardStats(list)
  },

  getKillZoneData: async (): Promise<KillZoneDataPoint[]> => {
    const list = getStoredDemoSubscriptions()
    return computeKillZoneData(list)
  },

  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    const list = getStoredDemoSubscriptions()
    return computeCategoryBreakdown(list)
  },
}
