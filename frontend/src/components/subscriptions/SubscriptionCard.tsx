/**
 * Subscription Card Component - Modern Pro SaaS Design
 * Strict zero-emoji policy, vector star ratings, clean telemetry and status badges
 */
import React from 'react'
import {
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiXCircle,
  FiStar,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import { getMonthlyCost, getYearlyCost } from '../../utils/calculations'

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
  const cost = Number(subscription.cost) || 0
  const monthlyCost = getMonthlyCost(subscription)
  const isCancelled = subscription.status === 'cancelled'
  const isYearly = subscription.billing_cycle === 'yearly'

  // Get initial letters for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // Pick an avatar accent color based on name
  const getAccentColor = (name: string) => {
    const colors = [
      'from-indigo-500/20 to-indigo-600/20 text-indigo-400 border-indigo-500/30',
      'from-rose-500/20 to-rose-600/20 text-rose-400 border-rose-500/30',
      'from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30',
      'from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500/30',
      'from-sky-500/20 to-sky-600/20 text-sky-400 border-sky-500/30',
      'from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30',
    ]
    const idx = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length
    return colors[idx]
  }

  return (
    <div
      className={`group relative rounded-xl border p-5 backdrop-blur-sm transition-all duration-200 flex flex-col justify-between ${
        isCancelled
          ? 'bg-slate-950/60 border-dashed border-slate-800 opacity-75 hover:opacity-100 hover:border-slate-700'
          : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700/90 hover:shadow-lg'
      }`}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Monogram Icon Badge */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAccentColor(
                subscription.name
              )} border flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-xs`}
            >
              {getInitials(subscription.name)}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white text-base tracking-tight truncate group-hover:text-rose-200 transition-colors">
                {subscription.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {subscription.category && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60 rounded">
                    {subscription.category}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 capitalize font-medium">
                  {subscription.billing_cycle}
                </span>
              </div>
            </div>
          </div>

          {/* Star Rating Badge */}
          <div className="flex items-center space-x-0.5 bg-slate-950/70 border border-slate-800 px-2 py-1 rounded-lg shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className={`w-3 h-3 ${
                  star <= subscription.value_score
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pricing Metrics Section */}
        <div className="bg-slate-950/50 border border-slate-800/70 rounded-lg p-3 mb-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400 font-medium">Cost</span>
            <div className="text-right">
              <span className="text-xl font-bold text-white tracking-tight">
                ${cost.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 ml-1">
                /{isYearly ? 'yr' : 'mo'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/50">
            <span className="flex items-center space-x-1">
              <FiCalendar className="w-3 h-3 text-slate-500" />
              <span>{isYearly ? 'Monthly Equiv.' : 'Annual Run-Rate'}</span>
            </span>
            <span className="font-semibold text-slate-300">
              {isYearly ? `$${monthlyCost.toFixed(2)}/mo` : `$${getYearlyCost(subscription).toFixed(2)}/yr`}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            {isCancelled ? (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-semibold">
                <FiXCircle className="w-3 h-3" />
                <span>In Graveyard (Cancelled)</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                <FiCheckCircle className="w-3 h-3" />
                <span>Active Subscription</span>
              </span>
            )}
          </div>

          {isCancelled && (
            <span className="text-[11px] text-emerald-400 font-medium">
              Saving +${getYearlyCost(subscription).toFixed(2)}/yr
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        {!isCancelled ? (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
            <button
              onClick={() => onEdit(subscription)}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 rounded-lg text-xs font-semibold tracking-wide transition-colors border border-slate-700/70"
            >
              <FiEdit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onCancel(subscription)}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 rounded-lg text-xs font-semibold tracking-wide transition-colors border border-rose-800/40"
            >
              <FiXCircle className="w-3 h-3" />
              <span>Kill Sub</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
            {onReactivate && (
              <button
                onClick={() => onReactivate(subscription)}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 rounded-lg text-xs font-semibold tracking-wide transition-colors border border-emerald-800/40"
              >
                <FiRefreshCw className="w-3 h-3" />
                <span>Reactivate</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(subscription)}
                className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-900 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold tracking-wide transition-colors border border-slate-800 hover:border-rose-900"
              >
                <FiTrash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionCard
