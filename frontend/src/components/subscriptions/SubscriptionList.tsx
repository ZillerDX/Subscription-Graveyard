/**
 * Subscription List Component - Modern Redesign
 * Displays a grid of subscription cards with enhanced empty states
 */
import React from 'react'
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
    return <LoadingSpinner message="Loading subscriptions..." />
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg mb-6 animate-float">
          <div className="text-7xl">📋</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No subscriptions found</h3>
        <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">
          Add your first subscription to start tracking your monthly burn rate and take control of your spending!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
