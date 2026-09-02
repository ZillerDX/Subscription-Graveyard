/**
 * Subscription Form Modal — Premium design with hover-preview stars, section separators
 */
import React, { useState, useEffect } from 'react'
import { FiX, FiCheck, FiStar, FiAlertCircle } from 'react-icons/fi'
import type { Subscription, SubscriptionCreate, BillingCycle } from '../../types/subscription'
import { CATEGORIES } from '../../data/platforms'

interface SubscriptionFormProps {
  subscription?: Subscription | null
  onSubmit: (data: SubscriptionCreate) => Promise<void>
  onCancel: () => void
}

const POPULAR_PRESETS = [
  { name: 'Netflix',              cost: 15.49,  cycle: 'monthly' as BillingCycle, category: 'Entertainment' },
  { name: 'Spotify',              cost: 10.99,  cycle: 'monthly' as BillingCycle, category: 'Entertainment' },
  { name: 'ChatGPT Plus',         cost: 20.00,  cycle: 'monthly' as BillingCycle, category: 'Productivity' },
  { name: 'YouTube Premium',      cost: 13.99,  cycle: 'monthly' as BillingCycle, category: 'Entertainment' },
  { name: 'Adobe Creative Cloud', cost: 54.99,  cycle: 'monthly' as BillingCycle, category: 'Productivity' },
  { name: 'iCloud 200GB',         cost: 2.99,   cycle: 'monthly' as BillingCycle, category: 'Productivity' },
  { name: 'Amazon Prime',         cost: 139.00, cycle: 'yearly'  as BillingCycle, category: 'Shopping' },
  { name: 'GitHub Pro',           cost: 4.00,   cycle: 'monthly' as BillingCycle, category: 'Productivity' },
]

const VALUE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Critical Waste — Immediate cancellation candidate',      color: 'text-rose-400' },
  2: { label: 'Poor Utility — Rarely used; questionable return',        color: 'text-orange-400' },
  3: { label: 'Moderate Utility — Acceptable; review periodically',     color: 'text-amber-400' },
  4: { label: 'High Utility — Frequently used; consistent value',       color: 'text-lime-400' },
  5: { label: 'Indispensable — Essential core service',                 color: 'text-emerald-400' },
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ subscription, onSubmit, onCancel }) => {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [valueScore, setValueScore] = useState(3)
  const [hoverScore, setHoverScore] = useState(0)
  const [category, setCategory] = useState('Entertainment')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setCost(subscription.cost.toString())
      setBillingCycle(subscription.billing_cycle)
      setValueScore(subscription.value_score)
      setCategory(subscription.category || 'Other')
    }
  }, [subscription])

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onCancel])

  const handleApplyPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setName(preset.name); setCost(preset.cost.toString())
    setBillingCycle(preset.cycle); setCategory(preset.category)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const costNum = parseFloat(cost)
    if (!name.trim())            { setError('Please provide a subscription name'); return }
    if (isNaN(costNum) || costNum <= 0) { setError('Cost must be a valid positive number'); return }
    setIsSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), cost: costNum, billing_cycle: billingCycle, value_score: valueScore, category: category || undefined, emoji: undefined })
    } catch (err: any) {
      setError(err.message || 'Failed to save subscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayScore = hoverScore || valueScore
  const scoreInfo = VALUE_LABELS[displayScore]

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-modal max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-in">

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {subscription ? 'Edit Subscription' : 'New Subscription'}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Enter recurring expense details and rate your satisfaction
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors active:scale-[0.95]"
          >
            <FiX className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/8 border border-rose-500/25 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 font-medium animate-fade-in">
              <FiAlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* ── Section: Quick Presets ── */}
          {!subscription && (
            <div>
              <p className="label mb-2">Quick Presets</p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 hover:text-white transition-all active:scale-[0.96]"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              {/* Section divider */}
              <div className="divider mt-5" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Section: Basic Info ── */}
            <div className="space-y-4">
              <p className="label">Basic Information</p>

              {/* Name */}
              <div>
                <label htmlFor="sub-name" className="label">Subscription Name *</label>
                <input
                  id="sub-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Netflix, OpenAI, Gym Membership"
                  className="input-md"
                />
              </div>

              {/* Cost + Billing Cycle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sub-cost" className="label">Cost *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 text-sm font-medium">$</span>
                    <input
                      id="sub-cost"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="14.99"
                      className="input-md pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Billing Cycle</label>
                  <div className="grid grid-cols-2 p-1 bg-zinc-950/80 border border-zinc-800 rounded-lg gap-0.5">
                    {(['monthly', 'yearly'] as BillingCycle[]).map((cycle) => (
                      <button
                        key={cycle}
                        type="button"
                        onClick={() => setBillingCycle(cycle)}
                        className={`py-2 text-xs font-semibold rounded-md transition-all active:scale-[0.97] capitalize ${
                          billingCycle === cycle
                            ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/50'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {cycle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="sub-category" className="label">Category</label>
                <select
                  id="sub-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-md"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900 text-white">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Section: Value Rating ── */}
            <div className="divider" />
            <div>
              <p className="label mb-3">Utility & Satisfaction</p>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">How much value do you get from this?</span>
                  <span className="text-sm font-bold text-amber-400 tabular">{displayScore} / 5</span>
                </div>

                {/* Interactive stars */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValueScore(star)}
                      onMouseEnter={() => setHoverScore(star)}
                      onMouseLeave={() => setHoverScore(0)}
                      className="p-1 transition-transform hover:scale-110 active:scale-90"
                    >
                      <FiStar
                        className={`w-7 h-7 transition-colors ${
                          star <= displayScore
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-700 hover:text-zinc-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {scoreInfo && (
                  <p className={`text-[11px] font-medium leading-relaxed ${scoreInfo.color}`}>
                    {scoreInfo.label}
                  </p>
                )}
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary py-2.5 rounded-xl text-xs"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    Saving…
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 shrink-0" />
                    {subscription ? 'Update Subscription' : 'Create Subscription'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionForm
