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
  value_score: number // Kept for backwards compatibility (1-5), derived or direct
  monthly_hours?: number // Hours used per month
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
  monthly_hours?: number
  logo_key?: string | null
  category?: string
  emoji?: string
}
