/**
 * Subscription Form Modal - Modern Pro SaaS Design
 * Unified workflow, quick preset chips, vector star ratings, strict zero-emoji
 */
import React, { useState, useEffect } from 'react'
import { FiX, FiCheck, FiStar } from 'react-icons/fi'
import type { Subscription, SubscriptionCreate, BillingCycle } from '../../types/subscription'
import { CATEGORIES } from '../../data/platforms'

interface SubscriptionFormProps {
  subscription?: Subscription | null
  onSubmit: (data: SubscriptionCreate) => Promise<void>
  onCancel: () => void
}

// Popular quick preset services
const POPULAR_PRESETS = [
  { name: 'Netflix', cost: 15.49, cycle: 'monthly' as BillingCycle, category: 'Entertainment' },
  { name: 'Spotify', cost: 10.99, cycle: 'monthly' as BillingCycle, category: 'Entertainment' },
  { name: 'ChatGPT Plus', cost: 20.00, cycle: 'monthly' as BillingCycle, category: 'Productivity' },
  { name: 'YouTube Premium', cost: 13.99, cycle: 'monthly' as BillingCycle, category: 'Entertainment' },
  { name: 'Adobe Creative Cloud', cost: 54.99, cycle: 'monthly' as BillingCycle, category: 'Productivity' },
  { name: 'iCloud 200GB', cost: 2.99, cycle: 'monthly' as BillingCycle, category: 'Productivity' },
  { name: 'Amazon Prime', cost: 139.00, cycle: 'yearly' as BillingCycle, category: 'Shopping' },
  { name: 'GitHub Pro', cost: 4.00, cycle: 'monthly' as BillingCycle, category: 'Productivity' },
]

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [valueScore, setValueScore] = useState(3)
  const [category, setCategory] = useState('Entertainment')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load subscription if editing
  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setCost(subscription.cost.toString())
      setBillingCycle(subscription.billing_cycle)
      setValueScore(subscription.value_score)
      setCategory(subscription.category || 'Other')
    }
  }, [subscription])

  const handleApplyPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setName(preset.name)
    setCost(preset.cost.toString())
    setBillingCycle(preset.cycle)
    setCategory(preset.category)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const costNum = parseFloat(cost)
    if (isNaN(costNum) || costNum <= 0) {
      setError('Cost must be a valid positive number')
      return
    }

    if (!name.trim()) {
      setError('Please provide a subscription name')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        name: name.trim(),
        cost: costNum,
        billing_cycle: billingCycle,
        value_score: valueScore,
        category: category || undefined,
        emoji: undefined,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to save subscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getValueScoreDescription = (score: number) => {
    switch (score) {
      case 1:
        return 'Critical Waste — Immediate candidate for cancellation'
      case 2:
        return 'Poor Utility — Rarely used; questionable return on spend'
      case 3:
        return 'Moderate Utility — Acceptable value; review periodically'
      case 4:
        return 'High Utility — Frequently used and delivers consistent value'
      case 5:
        return 'Indispensable — Essential core tool or service'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {subscription ? 'Edit Subscription' : 'New Subscription'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter recurring expense details and value satisfaction score
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          {/* Quick Presets (only on new) */}
          {!subscription && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Subscription Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, OpenAI, Fitness Club"
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* Cost & Billing Cycle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Cost *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="14.99"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Billing Cycle
                </label>
                <div className="grid grid-cols-2 p-1 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Rating Matrix */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Utility & Satisfaction Score
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {valueScore} / 5 Stars
                </span>
              </div>

              {/* Star buttons */}
              <div className="flex items-center space-x-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValueScore(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-transform active:scale-95"
                  >
                    <FiStar
                      className={`w-6 h-6 ${
                        star <= valueScore
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                {getValueScoreDescription(valueScore)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded-xl text-xs font-semibold tracking-wide transition-colors border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:shadow-rose-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 shrink-0" />
                    <span>{subscription ? 'Update Subscription' : 'Create Subscription'}</span>
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
