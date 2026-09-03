/**
 * Financial, Usage Time & Quadrant Calculation Utilities
 * Telemetry: Daily Usage, Monthly/Yearly conversions, and Personalized Category Priority Matrix
 *
 * Research Benchmarks & Theoretical Foundation:
 * 1. 50/30/20 Rule (Senator Elizabeth Warren & Amelia Warren Tyagi):
 *    Subscriptions are discretionary "Wants" (max 30% of net income). High-priority tools that directly
 *    generate income or health (Productivity/Fitness) are treated as semi-investments with higher cost tolerance.
 * 2. Micro-Cost per Engagement Hour (Statista / BLS Leisure Economics):
 *    Average benchmark leisure/entertainment cost is <$0.50-$1.00/hour. If recurring entertainment exceeds
 *    $2.50-$3.00/hour (or under 15-20 mins/day of engagement), it is classified as a "Zombie Subscription".
 * 3. Subscription Fatigue Index (Chase / Waterstone Financial Surveys):
 *    Over 71% of surveyed consumers lose $50-$150/month to neglected subscriptions because they fail to
 *    quantify their actual daily engagement against monthly billing.
 */
import type { Subscription, CategoryPriority, UserPreferences } from '../types/subscription'
import type { DashboardStats, KillZoneDataPoint, CategoryBreakdown, QuadrantType } from '../services/dashboardService'
import { authStorage } from '../services/authStorage'

// Standard baseline thresholds
export const BASE_COST_THRESHOLD = 20 // $20/mo divider
export const BASE_HOURS_THRESHOLD = 8 // 8 hrs/mo (~16 mins/day)

// Daily to monthly conversion factor (365 days / 12 months)
export const DAYS_PER_MONTH = 30.4167

/**
 * Convert daily hours to monthly hours
 */
export const dailyToMonthlyHours = (dailyHours: number): number => {
  const safe = Math.max(0, dailyHours)
  return Math.round(safe * DAYS_PER_MONTH * 10) / 10
}

/**
 * Convert daily hours to yearly hours
 */
export const dailyToYearlyHours = (dailyHours: number): number => {
  const safe = Math.max(0, dailyHours)
  return Math.round(safe * 365 * 10) / 10
}

/**
 * Convert monthly hours to daily hours
 */
export const monthlyToDailyHours = (monthlyHours: number): number => {
  const safe = Math.max(0, monthlyHours)
  return Math.round((safe / DAYS_PER_MONTH) * 100) / 100
}

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
 * Get monthly usage hours with daily fallback
 */
export const getMonthlyHours = (sub: Subscription): number => {
  if (typeof sub.monthly_hours === 'number' && !isNaN(sub.monthly_hours)) {
    return Math.max(0, sub.monthly_hours)
  }
  if (typeof sub.daily_hours === 'number' && !isNaN(sub.daily_hours)) {
    return dailyToMonthlyHours(sub.daily_hours)
  }
  const map: Record<number, number> = { 1: 1, 2: 4, 3: 15, 4: 35, 5: 60 }
  return map[sub.value_score] || 15
}

/**
 * Get estimated daily hours with monthly fallback
 */
export const getDailyHours = (sub: Subscription): number => {
  if (typeof sub.daily_hours === 'number' && !isNaN(sub.daily_hours)) {
    return Math.max(0, sub.daily_hours)
  }
  return monthlyToDailyHours(getMonthlyHours(sub))
}

/**
 * Format daily hours for friendly display (e.g. "15 นาที/วัน" or "1.5 ชม./วัน")
 */
export const formatDailyHours = (dailyHours: number, lang: 'th' | 'en' = 'th'): string => {
  if (dailyHours <= 0) {
    return lang === 'th' ? '0 ชม. (แทบไม่ใช้)' : '0 hrs (Never used)'
  }
  if (dailyHours < 1) {
    const mins = Math.round(dailyHours * 60)
    return lang === 'th' ? `${mins} นาที/วัน` : `${mins} min/day`
  }
  return lang === 'th' ? `${dailyHours.toFixed(1)} ชม./วัน` : `${dailyHours.toFixed(1)} hrs/day`
}

/**
 * Compute cost per hour of usage ($/hr)
 */
export const getCostPerHour = (monthlyCost: number, monthlyHours: number): number => {
  const safeHours = Math.max(monthlyHours, 0.1)
  return Math.round((monthlyCost / safeHours) * 100) / 100
}

/**
 * Dynamic Thresholds calibrated by User's Category Priority:
 * - High Priority (e.g. Work/Productivity): Tolerates up to $35/mo and requires only 5 hrs/mo (~10 mins/day).
 * - Low Priority (e.g. Low-priority Gaming/Shopping): Cost limit $15/mo, requires at least 15 hrs/mo (~30 mins/day).
 * - Medium Priority: Standard $20/mo and 8 hrs/mo (~16 mins/day).
 */
export const getCategoryThresholds = (
  category?: string | null,
  preferences?: UserPreferences
): { costThreshold: number; hoursThreshold: number; priority: CategoryPriority } => {
  const prefs = preferences || authStorage.getUserPreferences()
  const cat = category || 'Other'
  const priority = prefs.categoryPriorities[cat] || 'medium'

  if (priority === 'high') {
    return { costThreshold: 35, hoursThreshold: 5, priority }
  }
  if (priority === 'low') {
    return { costThreshold: 15, hoursThreshold: 15, priority }
  }
  return { costThreshold: BASE_COST_THRESHOLD, hoursThreshold: BASE_HOURS_THRESHOLD, priority }
}

/**
 * Classify a subscription into one of four quadrants based on Cost, Usage Hours & Personalized Priority
 */
export type ValueZone = 'worth' | 'waste'

export const isWasteZone = (quadrant: QuadrantType): boolean =>
  quadrant === 'kill_zone' || quadrant === 'silent_bleed'

export const isWorthItZone = (quadrant: QuadrantType): boolean =>
  quadrant === 'bargain' || quadrant === 'premium_investment'

/**
 * Classify a subscription into one of four quadrants and a primary Zone (Worth vs Waste)
 */
export const classifyQuadrant = (
  monthlyCost: number,
  monthlyHours: number,
  category?: string | null,
  preferences?: UserPreferences
): {
  quadrant: QuadrantType
  zone: ValueZone
  recommendation: string
  costPerHour: number
  priority: CategoryPriority
} => {
  const costPerHour = getCostPerHour(monthlyCost, monthlyHours)
  const { costThreshold, hoursThreshold, priority } = getCategoryThresholds(category, preferences)

  const isHighCost = monthlyCost >= costThreshold
  const isLowUsage = monthlyHours < hoursThreshold

  if (isHighCost && isLowUsage) {
    return {
      quadrant: 'kill_zone',
      zone: 'waste',
      recommendation: `ไม่คุ้มค่าอย่างยิ่ง! ค่าบริการ $${monthlyCost.toFixed(2)}/ด. แต่ใช้เพียง ${monthlyHours} ชม./ด. (ตก $${costPerHour.toFixed(2)}/ชม.) เกินเกณฑ์มาตรฐานที่ยอมรับได้ แนะนำให้ยกเลิกทันที`,
      costPerHour,
      priority,
    }
  }

  if (!isHighCost && isLowUsage) {
    return {
      quadrant: 'silent_bleed',
      zone: 'waste',
      recommendation: `เสี่ยงเป็น Silent Bleeder! ถึงราคาจะไม่สูง ($${monthlyCost.toFixed(2)}/ด.) แต่แทบไม่ได้เปิดใช้ (${monthlyHours} ชม./ด. ตก $${costPerHour.toFixed(2)}/ชม.) ควรทบทวนความจำเป็น`,
      costPerHour,
      priority,
    }
  }

  if (isHighCost && !isLowUsage) {
    return {
      quadrant: 'premium_investment',
      zone: 'worth',
      recommendation: `คุ้มค่าสมราคา! แม้จะจ่ายสูง ($${monthlyCost.toFixed(2)}/ด.) แต่เปิดใช้งานสม่ำเสมอ (${monthlyHours} ชม./ด. ตกเพียง $${costPerHour.toFixed(2)}/ชม.)`,
      costPerHour,
      priority,
    }
  }

  return {
    quadrant: 'bargain',
    zone: 'worth',
    recommendation: `คุ้มค่าเกินราคา! จ่ายน้อย ($${monthlyCost.toFixed(2)}/ด.) ใช้งานบ่อยมาก (${monthlyHours} ชม./ด. ตกเพียง $${costPerHour.toFixed(2)}/ชม.) คุ้มค่าสูงสุด`,
    costPerHour,
    priority,
  }
}

/**
 * Derived 1-5 score from hours, cost and category
 */
export const getScoreFromHoursAndCost = (
  monthlyCost: number,
  monthlyHours: number,
  category?: string | null
): number => {
  const cph = getCostPerHour(monthlyCost, monthlyHours)
  const { hoursThreshold } = getCategoryThresholds(category)

  if (monthlyHours <= 2 || cph >= 8.0) return 1
  if (monthlyHours < hoursThreshold || cph >= 4.0) return 2
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
  const prefs = authStorage.getUserPreferences()

  const monthly_burn_raw = active.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const monthly_burn = Math.round(monthly_burn_raw * 100) / 100
  const yearly_cost = Math.round(monthly_burn * 12 * 100) / 100

  const total_monthly_hours = active.reduce((sum, s) => sum + getMonthlyHours(s), 0)
  const avg_cost_per_hour = total_monthly_hours > 0
    ? Math.round((monthly_burn / total_monthly_hours) * 100) / 100
    : 0

  const realized_monthly_raw = cancelled.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const realized_monthly_savings = Math.round(realized_monthly_raw * 100) / 100
  const realized_yearly_savings = Math.round(realized_monthly_savings * 12 * 100) / 100

  // Kill Zone waste with personalized category thresholds
  const killZoneSubs = active.filter((s) => {
    const m = getMonthlyCost(s)
    const h = getMonthlyHours(s)
    const { costThreshold, hoursThreshold } = getCategoryThresholds(s.category, prefs)
    return m >= costThreshold && h < hoursThreshold
  })

  const kill_zone_waste_raw = killZoneSubs.reduce((sum, s) => sum + getMonthlyCost(s), 0)
  const kill_zone_monthly_waste = Math.round(kill_zone_waste_raw * 100) / 100
  const kill_zone_yearly_waste = Math.round(kill_zone_monthly_waste * 12 * 100) / 100

  const average_value_score =
    active.length > 0
      ? Math.round(
          (active.reduce(
            (sum, s) => sum + getScoreFromHoursAndCost(getMonthlyCost(s), getMonthlyHours(s), s.category),
            0
          ) /
            active.length) *
            10
        ) / 10
      : 0

  const weighted_value_score =
    monthly_burn > 0
      ? Math.round(
          (active.reduce(
            (sum, s) =>
              sum +
              getScoreFromHoursAndCost(getMonthlyCost(s), getMonthlyHours(s), s.category) *
                getMonthlyCost(s),
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
  const prefs = authStorage.getUserPreferences()

  return active.map((s) => {
    const monthlyCost = getMonthlyCost(s)
    const monthlyHours = getMonthlyHours(s)
    const { quadrant, recommendation, costPerHour } = classifyQuadrant(
      monthlyCost,
      monthlyHours,
      s.category,
      prefs
    )
    const derivedScore = getScoreFromHoursAndCost(monthlyCost, monthlyHours, s.category)

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
