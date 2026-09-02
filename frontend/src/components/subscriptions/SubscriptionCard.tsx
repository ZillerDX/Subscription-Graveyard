/**
 * Subscription Card Component - Modern Redesign
 * Displays a single subscription with actions and platform icons
 */
import React from 'react'
import { FiEdit2, FiTrash2, FiCalendar, FiDollarSign, FiRefreshCw, FiXCircle } from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import { POPULAR_PLATFORMS } from '../../data/platforms'

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onCancel: (subscription: Subscription) => void
  onReactivate?: (subscription: Subscription) => void
  onDelete?: (subscription: Subscription) => void
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onCancel,
  onReactivate,
  onDelete,
}) => {
  const cost = typeof subscription.cost === 'number' ? subscription.cost : parseFloat(String(subscription.cost)) || 0
  const monthlyCost =
    subscription.billing_cycle === 'monthly'
      ? cost
      : (cost / 12).toFixed(2)

  // Get platform icon if it exists
  const platform = POPULAR_PLATFORMS.find(
    (p) => p.name.toLowerCase() === subscription.name.toLowerCase()
  )

  const valueScoreColors = [
    { bg: 'bg-gradient-to-br from-red-500 to-red-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-green-500 to-green-600', text: 'text-white' },
    { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', text: 'text-white' },
  ]

  const valueColor = valueScoreColors[subscription.value_score - 1] || valueScoreColors[2]

  return (
    <div
      className={`relative bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:border-primary-300 transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 animate-slideUp ${
        subscription.status === 'cancelled' ? 'opacity-60 grayscale hover:opacity-70' : ''
      }`}
    >
      {/* Top Section - Platform Icon & Name */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3 flex-1">
          {subscription.emoji ? (
            <div className="text-5xl transform hover:scale-125 hover:rotate-12 transition-all duration-300">
              {subscription.emoji}
            </div>
          ) : platform ? (
            <div className="text-4xl transform hover:scale-125 hover:rotate-12 transition-all duration-300">
              {platform.icon}
            </div>
          ) : null}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate">{subscription.name}</h3>
            {subscription.category && (
              <span className="inline-block mt-1.5 px-3 py-1 text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full border border-gray-300 shadow-sm">
                {subscription.category}
              </span>
            )}
          </div>
        </div>

        {/* Value Score Badge */}
        <div
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl shadow-lg ${valueColor.bg} ${valueColor.text} font-bold text-sm whitespace-nowrap transform transition-all duration-300 hover:scale-110`}
        >
          <span>⭐</span>
          <span>{subscription.value_score}/5</span>
        </div>
      </div>

      {/* Cost Section */}
      <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-xl p-4 mb-4 border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-gray-700">
            <FiDollarSign className="w-4 h-4" />
            <span className="text-sm font-bold">Cost</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 drop-shadow-sm">
              ${cost.toFixed(2)}
              <span className="text-base font-semibold text-gray-600">
                /{subscription.billing_cycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            {subscription.billing_cycle === 'yearly' && (
              <div className="text-xs text-gray-600 font-semibold">≈ ${monthlyCost}/month</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-bold">Status</span>
          </div>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
              subscription.status === 'active'
                ? 'bg-gradient-to-r from-zombie-100 to-zombie-200 text-zombie-800 border-2 border-zombie-400'
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 border-2 border-gray-400'
            }`}
          >
            {subscription.status === 'active' ? '✓ Active' : '✕ Cancelled'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {subscription.status === 'active' && (
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(subscription)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-primary-400 hover:text-primary-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onCancel(subscription)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-death-600 via-death-700 to-death-800 rounded-xl hover:from-death-700 hover:via-death-800 hover:to-death-900 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {subscription.status === 'cancelled' && (
        <div className="space-y-3">
          <div className="text-center py-2 bg-gradient-to-r from-graveyard-100 to-graveyard-200 rounded-lg border-2 border-graveyard-300 shadow-sm">
            <span className="text-sm font-bold text-graveyard-800">⚠️ This subscription is cancelled</span>
          </div>
          <div className="flex space-x-3">
            {onReactivate && (
              <button
                onClick={() => onReactivate(subscription)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#4ade80'
                }}
              >
                <FiRefreshCw className="w-5 h-5 flex-shrink-0" />
                <span>Reactivate</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subscription)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#ef4444'
                }}
              >
                <FiXCircle className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Delete Forever</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionCard
