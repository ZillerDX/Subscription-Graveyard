/**
 * Financial Key Metric Cards - Modern Pro SaaS Design
 * Mathematically sound, zero emojis, crisp vector iconography
 */
import React from 'react'
import { FiDollarSign, FiLayers, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import type { DashboardStats } from '../../services/dashboardService'

interface StatsCardsProps {
  stats: DashboardStats
  isLoading?: boolean
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 animate-pulse"
          >
            <div className="h-3 bg-slate-800 rounded w-1/3 mb-3" />
            <div className="h-7 bg-slate-800 rounded w-2/3 mb-2" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  const avgCostPerSub =
    stats.active_count > 0 ? (stats.monthly_burn / stats.active_count).toFixed(2) : '0.00'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Burn Rate */}
      <div className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-5 backdrop-blur-sm shadow-sm transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Monthly Burn
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
            <FiDollarSign className="w-4 h-4 shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            ${stats.monthly_burn.toFixed(2)}
            <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Projected Annual</span>
            <span className="font-semibold text-slate-300">
              ${stats.yearly_cost.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      {/* 2. Active Subscriptions */}
      <div className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-5 backdrop-blur-sm shadow-sm transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Active Subscriptions
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <FiLayers className="w-4 h-4 shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-white">
            {stats.active_count}
            <span className="text-xs text-slate-500 font-normal ml-1">
              active / {stats.total_count} total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Average Cost</span>
            <span className="font-semibold text-slate-300">${avgCostPerSub}/mo</span>
          </p>
        </div>
      </div>

      {/* 3. Kill Zone Waste (At Risk) */}
      <div className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-5 backdrop-blur-sm shadow-sm transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-400 tracking-wider uppercase flex items-center space-x-1.5">
            <span>Kill Zone Waste</span>
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
            <FiAlertTriangle className="w-4 h-4 shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-rose-400">
            ${stats.kill_zone_monthly_waste.toFixed(2)}
            <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Cancel Candidates</span>
            <span className="font-semibold text-rose-400">
              {stats.kill_zone_count} target{stats.kill_zone_count !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
      </div>

      {/* 4. Realized Savings (From Graveyard) */}
      <div className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-5 backdrop-blur-sm shadow-sm transition-all duration-200 group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            Graveyard Savings
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-emerald-400">
            +${stats.realized_monthly_savings.toFixed(2)}
            <span className="text-xs text-slate-500 font-normal ml-1">/mo</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Annual Saved</span>
            <span className="font-semibold text-emerald-400">
              +${stats.realized_yearly_savings.toFixed(2)}/yr
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsCards
