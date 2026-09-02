/**
 * Subscription Card — Left accent border, pulsing status dot, clean action bar
 */
import React from 'react'
import {
  FiEdit2, FiTrash2, FiRefreshCw, FiXCircle, FiStar, FiCalendar,
} from 'react-icons/fi'
import type { Subscription } from '../../types/subscription'
import { getMonthlyCost, getYearlyCost } from '../../utils/calculations'

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit: (subscription: Subscription) => void
  onCancel: (subscription: Subscription) => void
  onReactivate?: (subscription: Subscription) => void
  onDelete?: (subscription: Subscription) => void
  animationDelay?: number
}

/* ── Accent color per name ────────────────────────────────── */
const ACCENTS = [
  { text: 'text-indigo-400', bg: 'bg-indigo-500/10',  border: 'border-indigo-500/25', bar: 'bg-indigo-500',  glow: 'hover:shadow-glow-indigo' },
  { text: 'text-rose-400',   bg: 'bg-rose-500/10',    border: 'border-rose-500/25',   bar: 'bg-brand-500',   glow: 'hover:shadow-glow-rose' },
  { text: 'text-emerald-400',bg: 'bg-emerald-500/10', border: 'border-emerald-500/25',bar: 'bg-emerald-500', glow: 'hover:shadow-glow-emerald' },
  { text: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/25',  bar: 'bg-amber-500',   glow: '' },
  { text: 'text-sky-400',    bg: 'bg-sky-500/10',     border: 'border-sky-500/25',    bar: 'bg-sky-500',     glow: '' },
  { text: 'text-purple-400', bg: 'bg-purple-500/10',  border: 'border-purple-500/25', bar: 'bg-purple-500',  glow: '' },
]

function getAccent(name: string) {
  const idx = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % ACCENTS.length
  return ACCENTS[idx]
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription, onEdit, onCancel, onReactivate, onDelete, animationDelay = 0,
}) => {
  const cost       = Number(subscription.cost) || 0
  const monthlyCost = getMonthlyCost(subscription)
  const isCancelled = subscription.status === 'cancelled'
  const isYearly    = subscription.billing_cycle === 'yearly'
  const accent      = getAccent(subscription.name)

  return (
    <div
      className={`group relative flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden
                  hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200
                  animate-fade-in-up ${accent.glow} ${isCancelled ? 'opacity-70 hover:opacity-100' : ''}`}
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'both' }}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accent.bar} ${isCancelled ? 'opacity-30' : ''}`} />

      {/* Cancelled diagonal watermark */}
      {isCancelled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
          <span
            className="text-zinc-700 font-black text-4xl select-none"
            style={{ transform: 'rotate(-20deg)', letterSpacing: '0.4em', opacity: 0.06 }}
          >
            CANCELLED
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-5 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Monogram */}
            <div className={`w-10 h-10 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center font-bold text-xs tracking-wider ${accent.text} shrink-0 shadow-sm`}>
              {getInitials(subscription.name)}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-white text-sm tracking-tight truncate leading-snug group-hover:text-zinc-100 transition-colors">
                {subscription.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {subscription.category && (
                  <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700/60 rounded uppercase tracking-wider">
                    {subscription.category}
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 font-medium capitalize">{subscription.billing_cycle}</span>
              </div>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-0.5 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className={`w-3 h-3 shrink-0 transition-colors ${
                  star <= subscription.value_score
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Cost block */}
        <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-3 mb-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Cost</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-white tracking-tight tabular">${cost.toFixed(2)}</span>
              <span className="text-xs text-zinc-500 ml-1">/{isYearly ? 'yr' : 'mo'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 pt-2 border-t border-zinc-800/50">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-3 h-3 shrink-0" />
              {isYearly ? 'Monthly equiv.' : 'Annual run-rate'}
            </span>
            <span className="font-semibold text-zinc-400 tabular">
              {isYearly ? `$${monthlyCost.toFixed(2)}/mo` : `$${getYearlyCost(subscription).toFixed(2)}/yr`}
            </span>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-4 flex items-center justify-between">
          {isCancelled ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400">
              <FiXCircle className="w-3 h-3 shrink-0" />
              In Graveyard
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Pulsing active dot */}
              <div className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping-small absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400">Active</span>
            </div>
          )}
          {isCancelled && (
            <span className="text-[10px] text-emerald-400 font-semibold tabular">
              +${getYearlyCost(subscription).toFixed(2)}/yr saved
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="pt-3 border-t border-zinc-800/60">
          {!isCancelled ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(subscription)}
                title="Edit subscription"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 rounded-lg text-xs font-semibold transition-all duration-150 border border-zinc-700/60 active:scale-[0.97]"
              >
                <FiEdit2 className="w-3 h-3 shrink-0" />
                Edit
              </button>
              <button
                onClick={() => onCancel(subscription)}
                title="Cancel subscription"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 rounded-lg text-xs font-semibold transition-all duration-150 border border-rose-800/30 hover:border-rose-700/50 active:scale-[0.97]"
              >
                <FiXCircle className="w-3 h-3 shrink-0" />
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onReactivate && (
                <button
                  onClick={() => onReactivate(subscription)}
                  title="Restore subscription"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 rounded-lg text-xs font-semibold transition-all duration-150 border border-emerald-800/30 active:scale-[0.97]"
                >
                  <FiRefreshCw className="w-3 h-3 shrink-0" />
                  Restore
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(subscription)}
                  title="Delete permanently"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-900 hover:bg-rose-950/50 text-zinc-500 hover:text-rose-400 rounded-lg text-xs font-semibold transition-all duration-150 border border-zinc-800 hover:border-rose-900/60 active:scale-[0.97]"
                >
                  <FiTrash2 className="w-3 h-3 shrink-0" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCard
