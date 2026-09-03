/**
 * Subscription Card Component — Minimal Toggl Style
 * Authentic brand vector logos, usage hours telemetry, and cost-per-hour diagnosis
 */
import React from 'react'
import {
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiXCircle,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
} from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import { BrandLogo } from '../common/BrandLogo'
import {
  getMonthlyCost,
  getYearlyCost,
  getMonthlyHours,
  getCostPerHour,
  classifyQuadrant,
} from '../../utils/calculations'

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onCancel: (subscription: Subscription) => void
  onReactivate?: (subscription: Subscription) => void
  onDelete?: (subscription: Subscription) => void
  animationDelay?: number
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onCancel,
  onReactivate,
  onDelete,
  animationDelay = 0,
}) => {
  const cost = Number(subscription.cost) || 0
  const monthlyCost = getMonthlyCost(subscription)
  const monthlyHours = getMonthlyHours(subscription)
  const costPerHour = getCostPerHour(monthlyCost, monthlyHours)
  const isCancelled = subscription.status === 'cancelled'
  const isYearly = subscription.billing_cycle === 'yearly'

  const { quadrant } = classifyQuadrant(monthlyCost, monthlyHours)

  return (
    <div
      className={`card-minimal flex flex-col justify-between p-5 relative overflow-hidden transition-all duration-200 animate-fade-in-up ${
        isCancelled
          ? 'bg-[#FAF8F8] border-dashed border-[#E5DADA] opacity-75 hover:opacity-100'
          : 'hover:border-[#E2B4BD] hover:shadow-card-hover'
      }`}
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      <div>
        {/* Header Row: Real Brand Logo + Title + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo
              logoKey={subscription.logo_key}
              name={subscription.name}
              className="w-11 h-11 rounded-2xl shrink-0"
              size={22}
            />
            <div className="min-w-0">
              <h3 className="font-bold text-[#2D2D2D] text-sm sm:text-base tracking-tight truncate leading-snug">
                {subscription.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {subscription.category && (
                  <span className="badge-peach text-[10px] py-0 px-2">
                    {subscription.category}
                  </span>
                )}
                <span className="text-[11px] text-[#8A8A8A] font-medium capitalize">
                  {isYearly ? 'รายปี (Yearly)' : 'รายเดือน (Monthly)'}
                </span>
              </div>
            </div>
          </div>

          {/* Active status pill */}
          <div className="shrink-0">
            {isCancelled ? (
              <span className="badge-rose text-[10px]">
                <FiXCircle className="w-3 h-3" />
                <span>ยกเลิกแล้ว</span>
              </span>
            ) : (
              <span className="badge-emerald text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ใช้งานอยู่</span>
              </span>
            )}
          </div>
        </div>

        {/* Cost & Time Usage Telemetry Block */}
        <div className="bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl p-3.5 my-3 space-y-2.5">
          {/* Main cost row */}
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#757575] font-medium">ค่าบริการ</span>
            <div className="text-right">
              <span className="text-xl font-bold text-[#2D2D2D] tracking-tight tabular">
                ${cost.toFixed(2)}
              </span>
              <span className="text-xs text-[#8A8A8A] ml-1">/{isYearly ? 'ปี' : 'เดือน'}</span>
            </div>
          </div>

          {/* Hours used & Cost per hour (New Method) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0E6E6]/80 text-xs">
            <div className="flex items-center gap-1.5 text-[#5A5A5A]">
              <FiClock className="w-3.5 h-3.5 text-[#B02A82] shrink-0" />
              <span>
                ใช้{' '}
                <strong className="text-[#2D2D2D] font-bold tabular">{monthlyHours}</strong>{' '}
                ชม./เดือน
              </span>
            </div>
            <div className="text-right text-[#5A5A5A]">
              <span>
                เฉลี่ย{' '}
                <strong className="text-[#2D2D2D] font-bold tabular">
                  ${costPerHour.toFixed(2)}
                </strong>
                /ชม.
              </span>
            </div>
          </div>
        </div>

        {/* Value Diagnosis Badge */}
        <div className="mb-4">
          {!isCancelled ? (
            quadrant === 'kill_zone' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <FiAlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>ไม่คุ้มค่า! (Kill Zone) ใช้น้อยแต่จ่ายแพง</span>
              </div>
            ) : quadrant === 'silent_bleed' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <FiAlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>เสี่ยงเสียเปล่า (ใช้น้อย ${costPerHour.toFixed(2)}/ชม.)</span>
              </div>
            ) : quadrant === 'premium_investment' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FCE7F3] border border-[#FBCFE8] text-[#9D174D] text-xs font-semibold">
                <FiCheckCircle className="w-3.5 h-3.5 shrink-0 text-[#B02A82]" />
                <span>คุ้มค่าสมราคา (ใช้งานสม่ำเสมอ)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <FiCheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>คุ้มค่ามาก! (ตกเพียง ${costPerHour.toFixed(2)}/ชม.)</span>
              </div>
            )
          ) : (
            <div className="text-xs text-emerald-600 font-medium">
              ประหยัดเงินได้ +${getYearlyCost(subscription).toFixed(2)}/ปี
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#F0E6E6]">
        {!isCancelled ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(subscription)}
              className="flex-1 btn-soft py-2 rounded-xl"
            >
              <FiEdit2 className="w-3 h-3 shrink-0" />
              <span>แก้ไข</span>
            </button>
            <button
              onClick={() => onCancel(subscription)}
              className="flex-1 btn-danger-soft py-2 rounded-xl"
            >
              <FiXCircle className="w-3 h-3 shrink-0" />
              <span>ยกเลิก (Kill)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {onReactivate && (
              <button
                onClick={() => onReactivate(subscription)}
                className="flex-1 btn-success-soft py-2 rounded-xl"
              >
                <FiRefreshCw className="w-3 h-3 shrink-0" />
                <span>กู้คืน</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subscription)}
                className="flex-1 btn-soft text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-xl"
              >
                <FiTrash2 className="w-3 h-3 shrink-0" />
                <span>ลบถาวร</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionCard
