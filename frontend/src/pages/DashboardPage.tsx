/**
 * Dashboard Page - Modern Pro SaaS Design
 * Real-time financial telemetry, quadrant intelligence, and quick cancellation action center
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiPlus, FiArrowRight, FiTarget, FiTrendingDown, FiShield, FiXCircle } from 'react-icons/fi'
import { dashboardService } from '../services/dashboardService'
import { subscriptionService } from '../services/subscriptionService'
import StatsCards from '../components/dashboard/StatsCards'
import KillZoneChart from '../components/dashboard/KillZoneChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient()

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

  // Quick cancel mutation directly from kill candidates list
  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      toast.success(`"${data.name}" moved to the Graveyard. Savings realized!`)
    },
    onError: () => {
      toast.error('Failed to cancel subscription.')
    },
  })

  // Filter kill candidates (value_score <= 2) sorted by cost descending
  const killCandidates = killZoneData
    .filter((sub) => sub.value_score <= 2)
    .sort((a, b) => b.cost - a.cost)

  const totalPotentialMonthlySavings = killCandidates.reduce((sum, sub) => sum + sub.cost, 0)
  const totalPotentialYearlySavings = Math.round(totalPotentialMonthlySavings * 12 * 100) / 100

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Monitor recurring burn rate, analyze quadrant efficiency, and eliminate zombie expenses
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/subscriptions"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs"
          >
            <span>Manage All</span>
            <FiArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
          <Link
            to="/subscriptions"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:shadow-rose-500/20 transition-all"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Add Subscription</span>
          </Link>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      {stats && <StatsCards stats={stats} isLoading={statsLoading} />}

      {/* Kill Candidates Action Banner (if any detected) */}
      {killCandidates.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-900/80 border border-rose-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <FiTarget className="w-3 h-3" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  High-Priority Cancellation Targets Detected
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                You have <strong className="text-rose-300 font-semibold">{killCandidates.length}</strong> subscription{killCandidates.length !== 1 ? 's' : ''} with low perceived utility (≤2 stars). Cancelling them saves{' '}
                <strong className="text-emerald-400 font-bold">${totalPotentialMonthlySavings.toFixed(2)}/mo</strong>{' '}
                (${totalPotentialYearlySavings.toFixed(2)}/year).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {killCandidates.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center space-x-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs"
                >
                  <span className="font-semibold text-white truncate max-w-[120px]">{sub.name}</span>
                  <span className="text-rose-400 font-bold">${sub.cost.toFixed(2)}</span>
                  <button
                    onClick={() => cancelMutation.mutate(sub.id)}
                    disabled={cancelMutation.isPending}
                    title="Send to Graveyard"
                    className="text-slate-400 hover:text-rose-400 transition-colors p-0.5"
                  >
                    <FiXCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Kill Zone Scatter Plot */}
        <div>
          <KillZoneChart data={killZoneData} isLoading={killZoneLoading} />
        </div>

        {/* Category Breakdown Progress */}
        <div>
          <CategoryBreakdownChart data={categoryData} isLoading={categoryLoading} />
        </div>
      </div>

      {/* Key Analytical Insights */}
      {stats && stats.active_count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FiTrendingDown className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Run-Rate Efficiency
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your average active subscription costs{' '}
              <strong className="text-white">
                ${(stats.monthly_burn / stats.active_count).toFixed(2)}/mo
              </strong>
              . Maintaining strict value reviews keeps your fixed monthly burn predictable.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FiShield className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cost-Weighted Satisfaction
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Overall satisfaction weighted by expenditure is{' '}
              <strong className="text-amber-400">{stats.weighted_value_score || stats.average_value_score} / 5.0</strong>
              . Higher scores reflect investment in high-utility tools rather than low-value subscriptions.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/90 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FiShield className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Graveyard Savings ROI
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By cancelling {stats.cancelled_count} zombie subscriptions, you preserve{' '}
              <strong className="text-emerald-400">
                ${stats.realized_yearly_savings.toFixed(2)} per year
              </strong>{' '}
              in liquid capital.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
