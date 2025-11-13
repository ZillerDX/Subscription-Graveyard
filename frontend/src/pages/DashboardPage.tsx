/**
 * Dashboard Page
 * Main dashboard with analytics and visualizations
 */
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import StatsCards from '../components/dashboard/StatsCards'
import KillZoneChart from '../components/dashboard/KillZoneChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'

const DashboardPage: React.FC = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  })

  // Fetch kill zone data
  const { data: killZoneData = [], isLoading: killZoneLoading } = useQuery({
    queryKey: ['dashboard-kill-zone'],
    queryFn: dashboardService.getKillZoneData,
  })

  // Fetch category breakdown
  const { data: categoryData = [], isLoading: categoryLoading } = useQuery({
    queryKey: ['dashboard-category-breakdown'],
    queryFn: dashboardService.getCategoryBreakdown,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slideDown">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-base text-gray-700 font-medium">
          Track your subscriptions and identify wasteful spending
        </p>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} isLoading={statsLoading} />}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kill Zone Chart */}
        <div className="lg:col-span-2">
          <KillZoneChart data={killZoneData} isLoading={killZoneLoading} />
        </div>

        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2">
          <CategoryBreakdownChart data={categoryData} isLoading={categoryLoading} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-100 to-blue-100 border-2 border-primary-300 rounded-2xl p-7 shadow-lg animate-scaleIn">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-primary-900 mb-3 flex items-center space-x-2">
              <span>🎯</span>
              <span>Ready to optimize your subscriptions?</span>
            </h3>
            <p className="text-base text-primary-800 font-medium leading-relaxed">
              Review the Kill Zone chart above to identify high-cost, low-value subscriptions you should cancel.
            </p>
          </div>
          <a
            href="/subscriptions"
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-bold whitespace-nowrap shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            Manage Subscriptions →
          </a>
        </div>
      </div>

      {/* Insights Section */}
      {stats && stats.active_count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-blue-500 hover:shadow-xl transition-all transform hover:scale-105">
            <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center space-x-2">
              <span>💡</span>
              <span>Monthly Insight</span>
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              You're spending <span className="font-extrabold text-blue-600">${stats.monthly_burn.toFixed(2)}</span> per month on {stats.active_count} active subscription{stats.active_count !== 1 ? 's' : ''}.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-orange-500 hover:shadow-xl transition-all transform hover:scale-105">
            <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center space-x-2">
              <span>📅</span>
              <span>Yearly Projection</span>
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              At this rate, you'll spend <span className="font-extrabold text-orange-600">${stats.yearly_cost.toFixed(2)}</span> this year on subscriptions.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-500 hover:shadow-xl transition-all transform hover:scale-105">
            <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center space-x-2">
              <span>🎯</span>
              <span>Kill Candidates</span>
            </h4>
            {(() => {
              // Find low-value subscriptions (value_score <= 2) sorted by cost
              const killCandidates = killZoneData
                .filter((sub: any) => sub.value_score <= 2)
                .sort((a: any, b: any) => b.cost - a.cost)
                .slice(0, 3)

              const totalMonthlySavings = killCandidates.reduce((sum: number, sub: any) => sum + sub.cost, 0)
              const totalYearlySavings = totalMonthlySavings * 12

              if (killCandidates.length === 0) {
                return (
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    Great job! All your subscriptions are rated 3+ stars. Keep monitoring their value! ⭐
                  </p>
                )
              }

              return (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Low-value subscriptions to consider:</p>
                  {killCandidates.map((sub: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-700 font-medium">
                      • {sub.name} (${sub.cost.toFixed(2)}/mo)
                    </div>
                  ))}
                  <p className="text-sm text-gray-900 leading-relaxed font-bold mt-3 pt-2 border-t border-gray-200">
                    Kill {killCandidates.length === 1 ? 'this' : 'these'} to save{' '}
                    <span className="text-green-600">${totalMonthlySavings.toFixed(2)}/mo</span>
                    {' '}or{' '}
                    <span className="text-green-600">${totalYearlySavings.toFixed(2)}/year</span>!
                  </p>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Empty State for New Users */}
      {stats && stats.active_count === 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-16 text-center border-2 border-gray-200 animate-scaleIn">
          <div className="inline-block p-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl shadow-lg mb-6 animate-float">
            <div className="text-7xl">🚀</div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-4">
            Get Started with Subscription Graveyard
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed font-medium">
            Add your first subscription to start tracking your monthly burn rate and identify wasteful spending.
          </p>
          <a
            href="/subscriptions"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            <span>Add Your First Subscription</span>
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
