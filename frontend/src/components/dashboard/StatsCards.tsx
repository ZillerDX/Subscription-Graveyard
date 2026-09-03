/**
 * Dashboard Stat Cards — Minimal Toggl Style
 * Telemetry: Monthly Burn, Usage Hours, Cost per Hour, Kill Zone Waste, Realized Savings
 * Dual-Language support
 */
import React from 'react'
import {
  FiDollarSign,
  FiClock,
  FiActivity,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi'
import type { DashboardStats } from '../../services/dashboardService'
import { useLanguage } from '../../context/LanguageContext'

interface StatsCardsProps {
  stats: DashboardStats
  isLoading?: boolean
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#F0E6E6] rounded-2xl p-5 shadow-xs animate-pulse"
          >
            <div className="h-3 bg-[#FFF5F5] rounded w-1/3 mb-3" />
            <div className="h-7 bg-[#FFF5F5] rounded w-2/3 mb-2" />
            <div className="h-3 bg-[#FFF5F5] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  const {
    monthly_burn = 0,
    yearly_cost = 0,
    active_count = 0,
    total_monthly_hours = 0,
    avg_cost_per_hour = 0,
    kill_zone_count = 0,
    kill_zone_monthly_waste = 0,
    realized_monthly_savings = 0,
    realized_yearly_savings = 0,
  } = stats

  const cards = [
    {
      label: t('stats.monthlyBurn'),
      value: `$${monthly_burn.toFixed(2)}`,
      unit: t('stats.monthlyUnit'),
      sub: t('stats.yearlyEst', { val: `$${yearly_cost.toFixed(2)}` }),
      icon: FiDollarSign,
      iconColor: 'text-[#B02A82]',
      iconBg: 'bg-[#FCE7F3]',
      badge: t('stats.activeCount', { count: active_count }),
    },
    {
      label: t('stats.totalUsage'),
      value: `${total_monthly_hours}`,
      unit: t('stats.hoursUnit'),
      sub:
        active_count > 0
          ? t('stats.avgPerApp', { val: (total_monthly_hours / active_count).toFixed(1) })
          : '0',
      icon: FiClock,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      badge: t('stats.totalUsage'),
    },
    {
      label: t('stats.costPerHour'),
      value: `$${avg_cost_per_hour.toFixed(2)}`,
      unit: t('stats.costPerHourUnit'),
      sub: avg_cost_per_hour <= 1.0 ? t('stats.costGood') : t('stats.costReview'),
      icon: FiActivity,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      badge: 'Benchmark',
    },
    {
      label: t('stats.killZoneWaste'),
      value: `$${kill_zone_monthly_waste.toFixed(2)}`,
      unit: t('stats.monthlyUnit'),
      sub: t('stats.killZoneTarget', { count: kill_zone_count }),
      icon: FiAlertTriangle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      badge: kill_zone_count > 0 ? t('stats.killZoneCancelTarget') : t('stats.killZoneSafe'),
      highlight: kill_zone_count > 0,
    },
    {
      label: t('stats.graveyardSavings'),
      value: `+$${realized_monthly_savings.toFixed(2)}`,
      unit: t('stats.monthlyUnit'),
      sub: t('stats.graveyardYearly', { val: `$${realized_yearly_savings.toFixed(2)}` }),
      icon: FiTrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      badge: 'Graveyard',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`card-minimal p-5 flex flex-col justify-between hover:border-[#E2B4BD] hover:shadow-card-hover ${
              card.highlight ? 'border-rose-200/80 bg-gradient-to-b from-white to-rose-50/20' : ''
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold text-[#757575] uppercase tracking-wider line-clamp-1">
                  {card.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Metric Value */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#2D2D2D] tracking-tight tabular">
                  {card.value}
                </span>
                <span className="text-xs text-[#8A8A8A] font-medium">{card.unit}</span>
              </div>
            </div>

            {/* Bottom Subtitle / Badge */}
            <div className="mt-3 pt-2.5 border-t border-[#F0E6E6] flex items-center justify-between text-[11px] text-[#757575]">
              <span className="truncate pr-1">{card.sub}</span>
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#FFF5F5] border border-[#F0E6E6] text-[10px] font-bold text-[#5A5A5A]">
                {card.badge}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
