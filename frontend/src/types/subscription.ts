/**
 * TypeScript types for subscriptions
 */

export type BillingCycle = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'cancelled'

export interface Subscription {
  id: string
  user_id: string
  name: string
  cost: number
  billing_cycle: BillingCycle
  value_score: number // (1-5) derived from hours & cost
  daily_hours?: number // Hours used per day (e.g. 0.5, 1, 2)
  monthly_hours?: number // Converted hours used per month (~daily_hours * 30.4)
  logo_key?: string | null // Identifier for real brand vector logo (e.g. 'youtube', 'netflix')
  category?: string | null
  emoji?: string | null
  status: SubscriptionStatus
  created_at: string
  updated_at: string
}

export interface SubscriptionCreate {
  name: string
  cost: number
  billing_cycle: BillingCycle
  value_score?: number
  daily_hours?: number
  monthly_hours?: number
  logo_key?: string | null
  category?: string
  emoji?: string
}

export interface SubscriptionUpdate {
  name?: string
  cost?: number
  billing_cycle?: BillingCycle
  value_score?: number
  daily_hours?: number
  monthly_hours?: number
  logo_key?: string | null
  category?: string
  emoji?: string
}

export type CategoryPriority = 'high' | 'medium' | 'low'

export interface UserPreferences {
  categoryPriorities: Record<string, CategoryPriority>
  completedSurvey: boolean
  updated_at: string
}
