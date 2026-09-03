/**
 * Dashboard Page — Minimal Toggl Style
 * Telemetry, Kill Zone Matrix based on usage hours, and quick cancellation action center
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
} from 'react-icons/fi'
import { dashboardService } from '../services/dashboardService'
import { subscriptionService } from '../services/subscriptionService'
import StatsCards from '../components/dashboard/StatsCards'
import KillZoneChart from '../components/dashboard/KillZoneChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'
import SubscriptionForm from '../components/subscriptions/SubscriptionForm'
import { BrandLogo } from '../components/common/BrandLogo'
import type { SubscriptionCreate } from '../types/subscription'

const DashboardPage: React.FC = () => {
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
      toast.success(`"${data.name}" ถูกย้ายไปที่ Graveyard เรียบร้อย ประหยัดเงินทันที!`)
    },
    onError: () => {
      toast.error('ไม่สามารถยกเลิก Subscription ได้')
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
      toast.success(`เพิ่ม "${data.name}" เรียบร้อยแล้ว`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'เกิดข้อผิดพลาดในการสร้าง')
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
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] mt-1 font-medium">
            วิเคราะห์ความคุ้มค่าตามเวลาใช้งานจริง (Usage Time) และกำจัดบริการที่เสียเปล่า
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/subscriptions"
            className="btn-soft text-xs py-2 px-3.5 rounded-xl shadow-xs"
          >
            <span>จัดการทั้งหมด</span>
            <FiArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-berry text-xs py-2 px-4 rounded-xl shadow-xs"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            <span>เพิ่ม Subscription</span>
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
                  พบเป้าหมายที่ควรยกเลิกด่วน (Kill Zone Candidates)
                </h3>
              </div>
              <p className="text-xs text-rose-800/90 leading-relaxed">
                คุณมี <strong className="text-rose-900 font-bold">{killCandidates.length} บริการ</strong>{' '}
                ที่จ่ายค่าบริการสูงแต่ใช้งานน้อยมาก หากยกเลิกจะช่วยประหยัดเงินได้ถึง{' '}
                <strong className="text-emerald-700 font-bold">
                  ${totalPotentialMonthlySavings.toFixed(2)}/เดือน
                </strong>{' '}
                (${totalPotentialYearlySavings.toFixed(2)}/ปี)
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
                      ใช้ {sub.monthly_hours} ชม.
                    </span>
                  </div>
                  <span className="text-rose-600 font-extrabold tabular">${sub.cost.toFixed(2)}</span>
                  <button
                    onClick={() => cancelMutation.mutate(sub.id)}
                    disabled={cancelMutation.isPending}
                    title="ส่งไป Graveyard (ยกเลิก)"
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
                ประสิทธิภาพเวลา (Usage Efficiency)
              </h4>
            </div>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              คุณใช้งานเฉลี่ย{' '}
              <strong className="text-[#2D2D2D]">
                {(stats.total_monthly_hours / stats.active_count).toFixed(1)} ชม./แอพ
              </strong>{' '}
              ต่อเดือน โดยมีต้นทุนการใช้งานรวมอยู่ที่{' '}
              <strong className="text-[#B02A82]">${stats.avg_cost_per_hour.toFixed(2)} / ชม.</strong>
            </p>
          </div>

          <div className="card-minimal p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-[#FCE7F3] text-[#B02A82] flex items-center justify-center">
                <FiTrendingDown className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                ค่าเฉลี่ยต่อบริการ (Average Spend)
              </h4>
            </div>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              ค่าใช้จ่ายเฉลี่ยอยู่ที่{' '}
              <strong className="text-[#2D2D2D]">
                ${(stats.monthly_burn / stats.active_count).toFixed(2)}/เดือน
              </strong>{' '}
              ต่อหนึ่งบริการ การตัดบริการที่ไม่ได้ใช้งานช่วยลด Fixed Cost ได้อย่างมีนัยสำคัญ
            </p>
          </div>

          <div className="card-minimal p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                ผลตอบแทนจากการตัดรายจ่าย (Savings ROI)
              </h4>
            </div>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              คุณได้ยกเลิกไปแล้ว {stats.cancelled_count} รายการ ช่วยรักษาเงินสดในกระเป๋าได้ถึง{' '}
              <strong className="text-emerald-600 font-bold">
                +${stats.realized_yearly_savings.toFixed(2)} ต่อปี
              </strong>
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
