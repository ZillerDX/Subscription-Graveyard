/**
 * Dashboard Page — Minimal Toggl Style
 * Telemetry, Kill Zone Matrix based on usage hours, and quick cancellation action center
 * Dual-Language support (TH/EN) & Personalized Assessment link
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  FiPlus,
  FiArrowRight,
  FiTarget,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSliders,
} from 'react-icons/fi'
import { dashboardService } from '../services/dashboardService'
import { subscriptionService } from '../services/subscriptionService'
import StatsCards from '../components/dashboard/StatsCards'
import KillZoneChart from '../components/dashboard/KillZoneChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
import { BrandLogo } from '../components/common/BrandLogo'
import type { SubscriptionCreate } from '../types/subscription'
import { useLanguage } from '../context/LanguageContext'

const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)

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

  // Quick cancel mutation
  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      toast.success(
        language === 'th'
          ? `"${data.name}" ถูกย้ายไปที่ Graveyard เรียบร้อย ประหยัดเงินทันที!`
          : `"${data.name}" moved to Graveyard!`
      )
    },
    onError: () => {
      toast.error(language === 'th' ? 'ไม่สามารถยกเลิกได้' : 'Failed to cancel')
    },
  })

  // Create mutation for quick add
  const createMutation = useMutation({
    mutationFn: subscriptionService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
      setIsFormOpen(false)
      toast.success(
        language === 'th' ? `เพิ่ม "${data.name}" เรียบร้อยแล้ว` : `Added "${data.name}" successfully`
      )
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error')
    },
  })

  // Filter high-priority kill candidates (Kill Zone: high cost, low hours)
  const killCandidates = killZoneData
    .filter((sub) => sub.quadrant === 'kill_zone' || (sub.monthly_hours < 5 && sub.cost >= 15))
    .sort((a, b) => b.cost - a.cost)

  const totalPotentialMonthlySavings = killCandidates.reduce((sum, sub) => sum + sub.cost, 0)
  const totalPotentialYearlySavings = Math.round(totalPotentialMonthlySavings * 12 * 100) / 100

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2D2D2D]">
            {t('dashboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] mt-1 font-medium">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/assessment"
            className="btn-soft text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <FiSliders className="w-3.5 h-3.5 text-[#B02A82] shrink-0" />
            <span>{t('dashboard.reassess')}</span>
          </Link>
          <Link
            to="/subscriptions"
            className="btn-soft text-xs py-2 px-3.5 rounded-xl shadow-xs"
          >
            <span>{t('dashboard.manageAll')}</span>
            <FiArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-berry text-xs py-2 px-4 rounded-xl shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            <span>{t('dashboard.addSubscription')}</span>
          </button>
        </div>
      </div>

      {/* Primary Financial & Usage Metric Cards */}
      {stats && <StatsCards stats={stats} isLoading={statsLoading} />}

      {/* Kill Candidates Action Banner (If any detected) */}
      {killCandidates.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <FiTarget className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-rose-900 tracking-tight">
                  {t('dashboard.killCandidatesTitle')}
                </h3>
              </div>
              <p className="text-xs text-rose-800/90 leading-relaxed">
                {t('dashboard.killCandidatesDesc', {
                  count: killCandidates.length,
                  monthly: `$${totalPotentialMonthlySavings.toFixed(2)}`,
                  yearly: `$${totalPotentialYearlySavings.toFixed(2)}`,
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {killCandidates.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2.5 bg-white border border-rose-200 px-3 py-1.5 rounded-xl text-xs shadow-xs"
                >
                  <BrandLogo logoKey={sub.logo_key} name={sub.name} className="w-6 h-6 rounded-lg" size={12} />
                  <div className="min-w-0">
                    <span className="font-bold text-[#2D2D2D] truncate block max-w-[100px] leading-tight">
                      {sub.name}
                    </span>
                    <span className="text-[10px] text-[#8A8A8A]">
                      {t('dashboard.usedHours', { hours: sub.monthly_hours })}
                    </span>
                  </div>
                  <span className="text-rose-600 font-extrabold tabular">${sub.cost.toFixed(2)}</span>
                  <button
                    onClick={() => cancelMutation.mutate(sub.id)}
                    disabled={cancelMutation.isPending}
                    title={t('dashboard.killAction')}
                    className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                  >
                    <FiXCircle className="w-4 h-4" />
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
        <KillZoneChart data={killZoneData} isLoading={killZoneLoading} />

        {/* Category Breakdown Progress */}
        <CategoryBreakdownChart data={categoryData} isLoading={categoryLoading} />
      </div>

      {/* Analytical Insights */}
      {stats && stats.active_count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-minimal p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <FiClock className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                {t('insight.efficiencyTitle')}
              </h4>
            </div>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              {t('insight.efficiencyDesc', {
                hours: (stats.total_monthly_hours / stats.active_count).toFixed(1),
                cost: `$${stats.avg_cost_per_hour.toFixed(2)}`,
              })}
            </p>
          </div>

          <div className="card-minimal p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-[#FCE7F3] text-[#B02A82] flex items-center justify-center">
                <FiTrendingDown className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                {t('insight.spendTitle')}
              </h4>
            </div>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              {t('insight.spendDesc', {
                cost: `$${(stats.monthly_burn / stats.active_count).toFixed(2)}`,
              })}
            </p>
          </div>

          <div className="card-minimal p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                {t('insight.roiTitle')}
              </h4>
            </div>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              {t('insight.roiDesc', {
                count: stats.cancelled_count,
                cost: `$${stats.realized_yearly_savings.toFixed(2)}`,
              })}
            </p>
          </div>
        </div>
      )}

      {/* Quick Add Form Modal */}
      {isFormOpen && (
        <SubscriptionForm
          onSubmit={async (data: SubscriptionCreate) => {
            await createMutation.mutateAsync(data)
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardPage
