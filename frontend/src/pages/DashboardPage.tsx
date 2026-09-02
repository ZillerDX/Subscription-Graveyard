/**
 * Dashboard Page — Production-grade staggered layout with kill zone intelligence
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  FiPlus, FiArrowRight, FiTarget, FiTrendingDown,
  FiShield, FiXCircle, FiZap,
} from 'react-icons/fi'
import { dashboardService } from '../services/dashboardService'
import { subscriptionService } from '../services/subscriptionService'
import StatsCards from '../components/dashboard/StatsCards'
import KillZoneChart from '../components/dashboard/KillZoneChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
  })

  const { data: killZoneData = [], isLoading: killZoneLoading } = useQuery({
    queryKey: ['dashboard-kill-zone'],
    queryFn: dashboardService.getKillZoneData,
  })

  const { data: categoryData = [], isLoading: categoryLoading } = useQuery({
    queryKey: ['dashboard-category-breakdown'],
    queryFn: dashboardService.getCategoryBreakdown,
  })

  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      toast.success(`"${data.name}" moved to the Graveyard. Savings realized!`)
    },
    onError: () => toast.error('Failed to cancel subscription.'),
  })

  const killCandidates = killZoneData
    .filter((sub) => sub.value_score <= 2)
    .sort((a, b) => b.cost - a.cost)

  const totalPotentialMonthlySavings = killCandidates.reduce((sum, sub) => sum + sub.cost, 0)
  const totalPotentialYearlySavings  = Math.round(totalPotentialMonthlySavings * 12 * 100) / 100

  return (
    <div className="space-y-8 pb-16">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <p className="eyebrow mb-1.5">Financial Command Center</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            Monitor recurring burn rate, analyze quadrant efficiency, and eliminate zombie expenses
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/subscriptions"
            className="btn-outline text-xs py-2 px-3.5 rounded-lg"
          >
            Manage All
            <FiArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
          <Link
            to="/subscriptions"
            className="btn-primary text-xs py-2 px-4 rounded-lg"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            Add Subscription
          </Link>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="animate-fade-in-up delay-75">
        <StatsCards stats={stats!} isLoading={statsLoading} />
      </div>

      {/* ── Kill Zone Alert Banner ── */}
      {killCandidates.length > 0 && (
        <div className="relative overflow-hidden bg-zinc-900 border border-rose-500/25 rounded-2xl p-5 sm:p-6 animate-fade-in-up delay-150">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-950/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 rounded-l-2xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {/* Pulsing dot */}
                <div className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping-small absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </div>
                <div className="flex items-center gap-2">
                  <FiTarget className="w-4 h-4 text-rose-400 shrink-0" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    High-Priority Cancellation Targets
                  </h3>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed pl-4">
                You have{' '}
                <strong className="text-rose-300 font-bold">{killCandidates.length} subscription{killCandidates.length !== 1 ? 's' : ''}</strong>
                {' '}with low utility (≤2 stars). Cancelling saves{' '}
                <strong className="text-emerald-400 font-bold">${totalPotentialMonthlySavings.toFixed(2)}/mo</strong>
                {' '}(${totalPotentialYearlySavings.toFixed(2)}/yr).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {killCandidates.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 bg-zinc-950/70 border border-zinc-800 hover:border-rose-500/30 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 group"
                >
                  <span className="font-semibold text-white truncate max-w-[110px]">{sub.name}</span>
                  <span className="text-rose-400 font-bold tabular">${sub.cost.toFixed(2)}</span>
                  <button
                    onClick={() => cancelMutation.mutate(sub.id)}
                    disabled={cancelMutation.isPending}
                    title="Send to Graveyard"
                    className="text-zinc-600 hover:text-rose-400 transition-colors active:scale-[0.9]"
                  >
                    <FiXCircle className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 gap-6 animate-fade-in-up delay-200">
        <KillZoneChart data={killZoneData} isLoading={killZoneLoading} />
        <CategoryBreakdownChart data={categoryData} isLoading={categoryLoading} />
      </div>

      {/* ── Insight Cards ── */}
      {stats && stats.active_count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-300">
          {/* Run-Rate Efficiency */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-200 group">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors">
                <FiTrendingDown className="w-4 h-4 text-indigo-400 shrink-0" />
              </div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Run-Rate Efficiency</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Average active subscription costs{' '}
              <strong className="text-white tabular">
                ${(stats.monthly_burn / stats.active_count).toFixed(2)}/mo
              </strong>
              . Strict value reviews keep your burn predictable.
            </p>
          </div>

          {/* Cost-Weighted Satisfaction */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-200 group">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/15 transition-colors">
                <FiShield className="w-4 h-4 text-amber-400 shrink-0" />
              </div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Weighted Satisfaction</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Spend-weighted satisfaction is{' '}
              <strong className="text-amber-400 tabular">
                {(stats.weighted_value_score || stats.average_value_score || 0).toFixed(1)} / 5.0
              </strong>
              . Higher means spend goes to high-utility tools.
            </p>
          </div>

          {/* Graveyard ROI */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-200 group">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                <FiZap className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Graveyard ROI</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cancelling {stats.cancelled_count} zombie subs preserves{' '}
              <strong className="text-emerald-400 tabular">
                ${stats.realized_yearly_savings.toFixed(2)}/yr
              </strong>
              {' '}in liquid capital.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
