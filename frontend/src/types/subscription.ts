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
  value_score: number
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
  value_score: number
  category?: string
  emoji?: string
}

export interface SubscriptionUpdate {
  name?: string
  cost?: number
  billing_cycle?: BillingCycle
  value_score?: number
  category?: string
  emoji?: string
}
