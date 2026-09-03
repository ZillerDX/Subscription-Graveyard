/**
 * Financial, Usage Time & Quadrant Calculation Utilities
 * Time-usage based evaluation: "คุณใช้เวลากับบริการนี้กี่ชั่วโมง? ถ้าน้อย = ไม่คุ้ม"
 */
import type { Subscription } from '../types/subscription'
import type { DashboardStats, KillZoneDataPoint, CategoryBreakdown, QuadrantType } from '../services/dashboardService'

// Thresholds for Kill Zone Time-Usage Analysis
export const COST_THRESHOLD = 20 // $20/month divider between low & high expense
export const HOURS_THRESHOLD = 8 // 8 hours/month (approx 2 hrs/week). Less than this = underused/wasteful!

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
 * Get estimated or configured monthly usage hours
 */
export const getMonthlyHours = (sub: Subscription): number => {
  if (typeof sub.monthly_hours === 'number' && !isNaN(sub.monthly_hours)) {
    return Math.max(0, sub.monthly_hours)
  }
  // If legacy data has value_score (1-5), map to sensible hours:
  const map: Record<number, number> = { 1: 1, 2: 4, 3: 15, 4: 35, 5: 60 }
  return map[sub.value_score] || 10
}

/**
 * Compute cost per hour of usage ($/hr)
 */
export const getCostPerHour = (monthlyCost: number, monthlyHours: number): number => {
  const safeHours = Math.max(monthlyHours, 0.1)
  return Math.round((monthlyCost / safeHours) * 100) / 100
}

/**
 * Classify a subscription into one of four quadrants based on Cost & Monthly Usage Hours
 */
export const classifyQuadrant = (
  monthlyCost: number,
  monthlyHours: number
): { quadrant: QuadrantType; recommendation: string; costPerHour: number } => {
  const costPerHour = getCostPerHour(monthlyCost, monthlyHours)
  const isHighCost = monthlyCost >= COST_THRESHOLD
  const isLowUsage = monthlyHours < HOURS_THRESHOLD

  if (isHighCost && isLowUsage) {
    return {
      quadrant: 'kill_zone',
      recommendation: `ไม่คุ้มค่าอย่างยิ่ง! จ่ายสูง ($${monthlyCost.toFixed(2)}/ด.) แต่ใช้เพียง ${monthlyHours} ชม. (ตก $${costPerHour.toFixed(2)}/ชม.) ควรยกเลิกทันที`,
      costPerHour,
    }
  }

  if (!isHighCost && isLowUsage) {
    return {
      quadrant: 'silent_bleed',
      recommendation: `เสี่ยงเสียเงินฟรี! ถึงราคาจะไม่แพง ($${monthlyCost.toFixed(2)}/ด.) แต่แทบไม่ได้เปิดใช้ (${monthlyHours} ชม./ด.) หากไม่จำเป็นควรยกเลิก`,
      costPerHour,
    }
  }

  if (isHighCost && !isLowUsage) {
    return {
      quadrant: 'premium_investment',
      recommendation: `คุ้มค่าสมราคา! ถึงจ่ายสูง ($${monthlyCost.toFixed(2)}/ด.) แต่ใช้งานอย่างคุ้มค่า (${monthlyHours} ชม./ด. ตกเพียง $${costPerHour.toFixed(2)}/ชม.)`,
      costPerHour,
    }
  }

  return {
    quadrant: 'bargain',
    recommendation: `คุ้มค่าเกินราคา! จ่ายน้อย ($${monthlyCost.toFixed(2)}/ด.) ใช้งานบ่อยมาก (${monthlyHours} ชม./ด. ตกเพียง $${costPerHour.toFixed(2)}/ชม.)`,
    costPerHour,
  }
}

/**
 * Derived 1-5 score from hours and cost for backwards compatibility and visual stars
 */
export const getScoreFromHoursAndCost = (monthlyCost: number, monthlyHours: number): number => {
  const cph = getCostPerHour(monthlyCost, monthlyHours)
  if (monthlyHours <= 2 || cph >= 8.0) return 1
  if (monthlyHours < HOURS_THRESHOLD || cph >= 4.0) return 2
  if (monthlyHours < 20 || cph >= 2.0) return 3
  if (monthlyHours < 40 || cph >= 1.0) return 4
  return 5
}

/**
 * Compute all dashboard stats from a list of subscriptions
 */
export const computeDashboardStats = (subscriptions: Subscription[]): DashboardStats => {
  const active = subscriptions.filter((s) => s.status === 'active')
  const cancelled = subscriptions.filter((s) => s.status === 'cancelled')

  // Total monthly burn from active subscriptions
  const monthly_burn_raw = active.reduce((sum, s) => {
    return sum + getMonthlyCost(s)
  }, 0)

  const monthly_burn = Math.round(monthly_burn_raw * 100) / 100
  const yearly_cost = Math.round(monthly_burn * 12 * 100) / 100

  // Total hours of service used per month
  const total_monthly_hours = active.reduce((sum, s) => {
    return sum + getMonthlyHours(s)
  }, 0)

  // Average cost per hour of usage across all active subscriptions
  const avg_cost_per_hour = total_monthly_hours > 0
    ? Math.round((monthly_burn / total_monthly_hours) * 100) / 100
    : 0

  // Realized savings from cancelled subscriptions in the graveyard
  const realized_monthly_raw = cancelled.reduce((sum, s) => {
    return sum + getMonthlyCost(s)
  }, 0)
  const realized_monthly_savings = Math.round(realized_monthly_raw * 100) / 100
  const realized_yearly_savings = Math.round(realized_monthly_savings * 12 * 100) / 100

  // Kill Zone Waste (Active subscriptions with Cost >= $20 and Usage < 8 hrs)
  const killZoneSubs = active.filter((s) => {
    const m = getMonthlyCost(s)
    const h = getMonthlyHours(s)
    return m >= COST_THRESHOLD && h < HOURS_THRESHOLD
  })

  const kill_zone_waste_raw = killZoneSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const kill_zone_monthly_waste = Math.round(kill_zone_waste_raw * 100) / 100
  const kill_zone_yearly_waste = Math.round(kill_zone_monthly_waste * 12 * 100) / 100

  // Average Value Score
  const average_value_score =
    active.length > 0
      ? Math.round(
          (active.reduce((sum, s) => sum + getScoreFromHoursAndCost(getMonthlyCost(s), getMonthlyHours(s)), 0) /
            active.length) *
            10
        ) / 10
      : 0

  // Cost-Weighted Value Score
  const weighted_value_score =
    monthly_burn > 0
      ? Math.round(
          (active.reduce(
            (sum, s) =>
              sum +
              getScoreFromHoursAndCost(getMonthlyCost(s), getMonthlyHours(s)) * getMonthlyCost(s),
            0
          ) /
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
    total_monthly_hours,
    avg_cost_per_hour,
  }
}

/**
 * Compute Kill Zone scatter plot data points
 */
export const computeKillZoneData = (subscriptions: Subscription[]): KillZoneDataPoint[] => {
  const active = subscriptions.filter((s) => s.status === 'active')

  return active.map((s) => {
    const monthlyCost = getMonthlyCost(s)
    const monthlyHours = getMonthlyHours(s)
    const { quadrant, recommendation, costPerHour } = classifyQuadrant(monthlyCost, monthlyHours)
    const derivedScore = getScoreFromHoursAndCost(monthlyCost, monthlyHours)

    return {
      id: s.id,
      name: s.name,
      cost: monthlyCost,
      raw_cost: Number(s.cost) || 0,
      value_score: derivedScore,
      monthly_hours: monthlyHours,
      cost_per_hour: costPerHour,
      logo_key: s.logo_key || null,
      category: s.category || 'Other',
      billing_cycle: s.billing_cycle,
      quadrant,
      recommendation,
    }
  })
}

/**
 * Compute Category Spending Breakdown
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
