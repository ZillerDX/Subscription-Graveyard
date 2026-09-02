/**
 * Subscription List Component - Modern Pro SaaS Design
 * Strict zero-emoji, responsive card grid with vector empty states
 */
import React from 'react'
import { FiLayers } from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import SubscriptionCard from './SubscriptionCard'
import LoadingSpinner from '../common/LoadingSpinner'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onCancel: (subscription: Subscription) => void
  onReactivate?: (subscription: Subscription) => void
  onDelete?: (subscription: Subscription) => void
  isLoading?: boolean
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onEdit,
  onCancel,
  onReactivate,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="py-16">
        <LoadingSpinner message="Loading subscriptions..." />
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <FiLayers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">No subscriptions found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No subscriptions match the selected criteria. Try adjusting your search or add a new recurring expense.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onCancel={onCancel}
          onReactivate={onReactivate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default SubscriptionList
