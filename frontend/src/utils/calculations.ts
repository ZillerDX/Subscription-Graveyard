/**
 * Financial and Quadrant Calculation Utilities
 * Ensures mathematically sound normalization, rounding, and categorization.
 */
import type { Subscription } from '../types/subscription'
import type { DashboardStats, KillZoneDataPoint, CategoryBreakdown, QuadrantType } from '../services/dashboardService'

// Thresholds for Kill Zone Analysis
export const COST_THRESHOLD = 20 // $20/month is standard divider between low & high cost
export const VALUE_THRESHOLD = 3 // 1-2: Low Value, 3: Neutral, 4-5: High Value

/**
 * Get normalized monthly cost of a subscription
 */
export const getMonthlyCost = (sub: Subscription): number => {
  const cost = Number(sub.cost) || 0
  const monthly = sub.billing_cycle === 'monthly' ? cost : cost / 12
  return Math.round(monthly * 100) / 100
}

/**
 * Get normalized yearly cost of a subscription
 */
export const getYearlyCost = (sub: Subscription): number => {
  const cost = Number(sub.cost) || 0
  const yearly = sub.billing_cycle === 'yearly' ? cost : cost * 12
  return Math.round(yearly * 100) / 100
}

/**
 * Classify a subscription into one of four quadrants
 */
export const classifyQuadrant = (monthlyCost: number, valueScore: number): { quadrant: QuadrantType; recommendation: string } => {
  const isHighCost = monthlyCost >= COST_THRESHOLD
  const isLowValue = valueScore <= 2
  const isHighValue = valueScore >= 4

  if (isHighCost && isLowValue) {
    return {
      quadrant: 'kill_zone',
      recommendation: 'Target to Cancel! High monthly drain with poor perceived value.',
    }
  }

  if (!isHighCost && isLowValue) {
    return {
      quadrant: 'silent_bleed',
      recommendation: 'Silent Bleeder. Small recurring charge with minimal utility.',
    }
  }

  if (isHighCost && isHighValue) {
    return {
      quadrant: 'premium_investment',
      recommendation: 'Premium Investment. Expensive, but you rate it highly. Keep active.',
    }
  }

  if (!isHighCost && isHighValue) {
    return {
      quadrant: 'bargain',
      recommendation: 'High Value Bargain. Excellent satisfaction per dollar spent.',
    }
  }

  return {
    quadrant: 'neutral',
    recommendation: 'Neutral Value. Average satisfaction; review periodically.',
  }
}

/**
 * Compute all dashboard stats from a list of subscriptions
 */
export const computeDashboardStats = (subscriptions: Subscription[]): DashboardStats => {
  const active = subscriptions.filter((s) => s.status === 'active')
  const cancelled = subscriptions.filter((s) => s.status === 'cancelled')

  // Total monthly burn from active subscriptions
  const monthly_burn_raw = active.reduce((sum, s) => {
    const cost = Number(s.cost) || 0
    return sum + (s.billing_cycle === 'monthly' ? cost : cost / 12)
  }, 0)

  const monthly_burn = Math.round(monthly_burn_raw * 100) / 100
  // Guarantee exact consistency: yearly is always exact 12x monthly burn
  const yearly_cost = Math.round(monthly_burn * 12 * 100) / 100

  // Realized savings from cancelled subscriptions in the graveyard
  const realized_monthly_raw = cancelled.reduce((sum, s) => {
    const cost = Number(s.cost) || 0
    return sum + (s.billing_cycle === 'monthly' ? cost : cost / 12)
  }, 0)
  const realized_monthly_savings = Math.round(realized_monthly_raw * 100) / 100
  const realized_yearly_savings = Math.round(realized_monthly_savings * 12 * 100) / 100

  // Kill Zone Waste (Active subscriptions with Cost >= $20 and Value <= 2)
  const killZoneSubs = active.filter((s) => {
    const m = getMonthlyCost(s)
    return m >= COST_THRESHOLD && s.value_score <= 2
  })

  const kill_zone_waste_raw = killZoneSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const kill_zone_monthly_waste = Math.round(kill_zone_waste_raw * 100) / 100
  const kill_zone_yearly_waste = Math.round(kill_zone_monthly_waste * 12 * 100) / 100

  // Average Value Score
  const average_value_score =
    active.length > 0
      ? Math.round((active.reduce((sum, s) => sum + s.value_score, 0) / active.length) * 10) / 10
      : 0

  // Cost-Weighted Value Score: sum(value * cost) / sum(cost)
  const weighted_value_score =
    monthly_burn > 0
      ? Math.round(
          (active.reduce((sum, s) => sum + s.value_score * getMonthlyCost(s), 0) /
            monthly_burn) *
            10
        ) / 10
      : 0

  return {
    monthly_burn,
    yearly_cost,
    active_count: active.length,
    total_count: subscriptions.length,
    cancelled_count: cancelled.length,
    realized_monthly_savings,
    realized_yearly_savings,
    kill_zone_count: killZoneSubs.length,
    kill_zone_monthly_waste,
    kill_zone_yearly_waste,
    average_value_score,
    weighted_value_score,
  }
}

/**
 * Compute Kill Zone scatter plot data points
 */
export const computeKillZoneData = (subscriptions: Subscription[]): KillZoneDataPoint[] => {
  const active = subscriptions.filter((s) => s.status === 'active')

  return active.map((s) => {
    const monthlyCost = getMonthlyCost(s)
    const { quadrant, recommendation } = classifyQuadrant(monthlyCost, s.value_score)

    return {
      id: s.id,
      name: s.name,
      cost: monthlyCost,
      raw_cost: Number(s.cost) || 0,
      value_score: s.value_score,
      category: s.category || 'Other',
      billing_cycle: s.billing_cycle,
      quadrant,
      recommendation,
    }
  })
}

/**
 * Compute Category Spending Breakdown with percentage
 */
export const computeCategoryBreakdown = (subscriptions: Subscription[]): CategoryBreakdown[] => {
  const active = subscriptions.filter((s) => s.status === 'active')
  const totalBurn = active.reduce((sum, s) => sum + getMonthlyCost(s), 0)

  const map: { [key: string]: { monthly_cost: number; count: number } } = {}

  active.forEach((s) => {
    const cat = s.category || 'Uncategorized'
    const m = getMonthlyCost(s)
    if (!map[cat]) {
      map[cat] = { monthly_cost: 0, count: 0 }
    }
    map[cat].monthly_cost += m
    map[cat].count += 1
  })

  return Object.entries(map)
    .map(([category, data]) => {
      const monthly_cost = Math.round(data.monthly_cost * 100) / 100
      const percentage = totalBurn > 0 ? Math.round((monthly_cost / totalBurn) * 1000) / 10 : 0
      return {
        category,
        monthly_cost,
        yearly_cost: Math.round(monthly_cost * 12 * 100) / 100,
        count: data.count,
        percentage,
      }
    })
    .sort((a, b) => b.monthly_cost - a.monthly_cost)
}
