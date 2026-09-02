/**
 * Subscription List — Staggered animated grid, floating empty state
 */
import React from 'react'
import { FiLayers } from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import SubscriptionCard from './SubscriptionCard'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onCancel: (subscription: Subscription) => void
  onReactivate?: (subscription: Subscription) => void
  onDelete?: (subscription: Subscription) => void
  isLoading?: boolean
}

/* ── Skeleton card ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl skeleton shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 skeleton w-2/3" />
          <div className="h-2.5 skeleton w-1/3" />
        </div>
        <div className="w-16 h-5 skeleton rounded" />
      </div>
      <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3 mb-4 space-y-2">
        <div className="h-6 skeleton w-1/2 ml-auto" />
        <div className="h-2 skeleton w-full" />
      </div>
      <div className="h-2.5 skeleton w-1/3 mb-4" />
      <div className="pt-3 border-t border-zinc-800/60 flex gap-2">
        <div className="flex-1 h-8 skeleton rounded-lg" />
        <div className="flex-1 h-8 skeleton rounded-lg" />
      </div>
    </div>
  )
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions, onEdit, onCancel, onReactivate, onDelete, isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-800 animate-fade-in">
        {/* Animated tombstone illustration */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 animate-float" style={{ animationDuration: '4s' }}>
              <FiLayers className="w-5 h-5 shrink-0" />
            </div>
          </div>
          {/* Glow under the icon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-zinc-700/30 rounded-full blur-sm" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">No subscriptions found</h3>
        <p className="text-xs text-zinc-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
          No subscriptions match the selected criteria. Try adjusting your filter or search, or add a new recurring expense.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription, index) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onCancel={onCancel}
          onReactivate={onReactivate}
          onDelete={onDelete}
          animationDelay={Math.min(index * 50, 400)}
        />
      ))}
    </div>
  )
}

export default SubscriptionList
