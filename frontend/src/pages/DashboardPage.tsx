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
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiSliders,
} from 'react-icons/fi'
import { dashboardService } from '../services/dashboardService'
import { subscriptionService } from '../services/subscriptionService'
import StatsCards from '../components/dashboard/StatsCards'
import KillZoneChart from '../components/dashboard/KillZoneChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
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

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Value Zones Matrix (Zone คุ้มค่า vs Zone ไม่คุ้มค่า) */}
        <KillZoneChart
          data={killZoneData}
          isLoading={killZoneLoading}
          onCancel={(id) => cancelMutation.mutate(id)}
          isCancelling={cancelMutation.isPending}
        />

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
