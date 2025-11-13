/**
 * Stats Cards Component
 * Displays key metrics in card format
 */
import React from 'react'
import type { DashboardStats } from '../../services/dashboardService'

interface StatsCardsProps {
  stats: DashboardStats
  isLoading?: boolean
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Active Subscriptions */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl shadow-lg p-6 border-2 border-blue-300 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Active</p>
            <p className="text-4xl font-extrabold text-blue-900 mt-2 drop-shadow-sm">{stats.active_count}</p>
            <p className="text-xs text-blue-700 mt-1 font-semibold">subscriptions</p>
          </div>
          <div className="text-5xl transform transition-transform duration-300 hover:scale-125 hover:rotate-12">📊</div>
        </div>
      </div>

      {/* Monthly Burn Rate */}
      <div className="bg-gradient-to-br from-red-50 via-red-100 to-red-200 rounded-2xl shadow-lg p-6 border-2 border-red-300 hover:shadow-2xl hover:border-red-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slideUp animate-delay-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-800 uppercase tracking-wide">Monthly Burn</p>
            <p className="text-4xl font-extrabold text-red-900 mt-2 drop-shadow-sm">
              ${stats.monthly_burn.toFixed(2)}
            </p>
            <p className="text-xs text-red-700 mt-1 font-semibold">per month</p>
          </div>
          <div className="text-5xl transform transition-transform duration-300 hover:scale-125 hover:rotate-12">🔥</div>
        </div>
      </div>

      {/* Yearly Cost */}
      <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-2xl shadow-lg p-6 border-2 border-orange-300 hover:shadow-2xl hover:border-orange-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slideUp animate-delay-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Yearly Cost</p>
            <p className="text-4xl font-extrabold text-orange-900 mt-2 drop-shadow-sm">
              ${stats.yearly_cost.toFixed(2)}
            </p>
            <p className="text-xs text-orange-700 mt-1 font-semibold">per year</p>
          </div>
          <div className="text-5xl transform transition-transform duration-300 hover:scale-125 hover:rotate-12">💸</div>
        </div>
      </div>

      {/* Total Subscriptions */}
      <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-2xl shadow-lg p-6 border-2 border-purple-300 hover:shadow-2xl hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slideUp animate-delay-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-800 uppercase tracking-wide">Total</p>
            <p className="text-4xl font-extrabold text-purple-900 mt-2 drop-shadow-sm">{stats.total_count}</p>
            <p className="text-xs text-purple-700 mt-1 font-semibold">
              {stats.total_count - stats.active_count} cancelled
            </p>
          </div>
          <div className="text-5xl transform transition-transform duration-300 hover:scale-125 hover:rotate-12">📋</div>
        </div>
      </div>
    </div>
  )
}

export default StatsCards
