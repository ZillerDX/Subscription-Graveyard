/**
 * Subscription List Component — Minimal Toggl Style
 * Clean light cards, staggered entrance, and clear empty state
 */
import React from 'react'
import { FiLayers, FiPlus } from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import SubscriptionCard from './SubscriptionCard'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onCancel: (subscription: Subscription) => void
  onReactivate?: (subscription: Subscription) => void
  onDelete?: (subscription: Subscription) => void
  onAddNew?: () => void
  isLoading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#F0E6E6] rounded-2xl p-5 shadow-xs animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-[#FFF5F5] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#FFF5F5] rounded w-2/3" />
          <div className="h-3 bg-[#FFF5F5] rounded w-1/3" />
        </div>
      </div>
      <div className="bg-[#FFF5F5] rounded-xl p-4 my-3 h-16" />
      <div className="h-7 bg-[#FFF5F5] rounded-xl w-full" />
    </div>
  )
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onEdit,
  onCancel,
  onReactivate,
  onDelete,
  onAddNew,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#E5DADA] shadow-xs animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] border border-[#F7D6D0] mx-auto flex items-center justify-center text-[#B02A82] mb-3">
          <FiLayers className="w-6 h-6 shrink-0" />
        </div>
        <h3 className="text-base font-bold text-[#2D2D2D] tracking-tight">ไม่พบรายการ Subscription</h3>
        <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto leading-relaxed">
          ไม่มีบริการที่ตรงกับเงื่อนไขการค้นหา คุณสามารถลองปรับตัวกรองหรือเพิ่มบริการใหม่ได้ทันที
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="btn-berry mt-4 text-xs py-2 px-4 rounded-xl"
          >
            <FiPlus className="w-3.5 h-3.5 shrink-0" />
            <span>เพิ่ม Subscription</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {subscriptions.map((subscription, index) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onCancel={onCancel}
          onReactivate={onReactivate}
          onDelete={onDelete}
          animationDelay={Math.min(index * 40, 300)}
        />
      ))}
    </div>
  )
}

export default SubscriptionList
