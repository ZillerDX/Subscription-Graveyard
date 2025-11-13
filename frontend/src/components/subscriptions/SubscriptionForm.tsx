/**
 * Subscription Form Component - Redesigned for Better UX
 * Simple, clear platform selection with visible grid layout
 */
import React, { useState, useEffect } from 'react'
import { FiX, FiCheck, FiSearch } from 'react-icons/fi'
import type { Subscription, SubscriptionCreate, BillingCycle } from '../../types/subscription'
import { POPULAR_PLATFORMS, CATEGORIES, Platform } from '../../data/platforms'
import CustomSelect from '../common/CustomSelect'

interface SubscriptionFormProps {
  subscription?: Subscription | null
  onSubmit: (data: SubscriptionCreate) => Promise<void>
  onCancel: () => void
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onSubmit,
  onCancel,
}) => {
  // Step 1: Platform Selection, Step 2: Details
  const [step, setStep] = useState(subscription ? 2 : 1)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [isCustom, setIsCustom] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [valueScore, setValueScore] = useState(3)
  const [category, setCategory] = useState('')
  const [emoji, setEmoji] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load subscription data if editing
  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setCost(subscription.cost.toString())
      setBillingCycle(subscription.billing_cycle)
      setValueScore(subscription.value_score)
      setCategory(subscription.category || '')
      setEmoji(subscription.emoji || '')
      setIsCustom(true)
      setStep(2)
    }
  }, [subscription])

  // Handle platform selection
  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform)
    setName(platform.name)
    setCategory(platform.category)
    setEmoji(platform.icon)
    if (platform.suggestedPrice) {
      setCost(platform.suggestedPrice.toString())
    }
    if (platform.suggestedCycle) {
      setBillingCycle(platform.suggestedCycle)
    }
    setIsCustom(false)
    setStep(2)
  }

  const handleCustom = () => {
    setSelectedPlatform(null)
    setIsCustom(true)
    setName('')
    setCost('')
    setCategory('')
    setEmoji('')
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate cost
    const costNum = parseFloat(cost)
    if (isNaN(costNum) || costNum <= 0) {
      setError('Cost must be a positive number')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        name,
        cost: costNum,
        billing_cycle: billingCycle,
        value_score: valueScore,
        category: category || undefined,
        emoji: emoji || undefined,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to save subscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredPlatforms = POPULAR_PLATFORMS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex justify-between items-center flex-shrink-0 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {subscription ? 'Edit Subscription' : 'Add New Subscription'}
          </h2>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* STEP 1: Platform Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search platforms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  autoFocus
                />
              </div>

              {/* Custom Option Card */}
              <button
                onClick={handleCustom}
                className="w-full p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-3 border-orange-300 rounded-xl hover:from-orange-100 hover:to-yellow-100 transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-6xl">✏️</span>
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-900">Create Custom Subscription</div>
                    <div className="text-sm text-gray-700 font-medium mt-1">Add any service not in our list</div>
                  </div>
                </div>
              </button>

              {/* Platform Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform)}
                    className="p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-5xl">{platform.icon}</span>
                      {platform.suggestedPrice && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${platform.suggestedPrice}</div>
                          <div className="text-xs text-gray-600 font-medium">
                            /{platform.suggestedCycle === 'monthly' ? 'mo' : 'yr'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-gray-900 text-lg mb-1">{platform.name}</div>
                    <div className="text-sm text-gray-600 font-medium">{platform.category}</div>
                  </button>
                ))}
              </div>

              {filteredPlatforms.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No platforms found</p>
                  <p className="text-gray-600">Try a different search term or create a custom subscription</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Subscription Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Show selected platform */}
              {!subscription && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{selectedPlatform?.icon || emoji || '📦'}</span>
                    <div>
                      <div className="font-bold text-gray-900">
                        {selectedPlatform?.name || (isCustom ? 'Custom Subscription' : 'Subscription')}
                      </div>
                      <div className="text-sm text-gray-600">{selectedPlatform?.category || category || 'Subscription'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Name Input (for custom or editing) */}
              {(isCustom || subscription) && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Subscription Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    placeholder="e.g., Netflix, Spotify, Custom Service"
                  />
                </div>
              )}

              {/* Cost and Billing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cost" className="block text-sm font-semibold text-gray-700">
                    Cost * 💵
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-500 font-medium">$</span>
                    <input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                      placeholder="9.99"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <CustomSelect
                    label="Billing Cycle 📅"
                    value={billingCycle}
                    onChange={(value) => setBillingCycle(value as BillingCycle)}
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'yearly', label: 'Yearly' },
                    ]}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <CustomSelect
                label="Category 🏷️"
                value={category}
                onChange={setCategory}
                options={[
                  { value: '', label: 'Select a category' },
                  ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
                ]}
                placeholder="Select a category"
              />

              {/* Custom Emoji */}
              {(isCustom || subscription) && (
                <div className="space-y-2">
                  <label htmlFor="emoji" className="block text-sm font-semibold text-gray-700">
                    Custom Icon (Emoji) 😊
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      id="emoji"
                      type="text"
                      maxLength={2}
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      placeholder="Pick one"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-4xl"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['💰', '🎮', '📺', '🎵', '☁️', '📱', '🍕', '🏋️', '📚', '🎨', '✈️', '🎬'].map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={`px-3 py-2 text-3xl rounded-lg border-2 hover:border-primary-500 transition-all ${
                          emoji === e ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Value Score - Star Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  How valuable is this subscription? ⭐
                </label>
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 border-3 border-yellow-400 rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValueScore(star)}
                        className="group relative transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                      >
                        {star <= valueScore ? (
                          <span className="text-4xl block relative" style={{
                            filter: 'drop-shadow(0 2px 6px rgba(234, 179, 8, 0.6))',
                          }}>
                            ⭐
                          </span>
                        ) : (
                          <span className="text-4xl block text-gray-300 group-hover:text-gray-400 transition-colors">
                            ☆
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-yellow-300">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {valueScore} out of 5 Stars
                    </div>
                    <div className="text-sm font-semibold" style={{
                      color: valueScore <= 2 ? '#dc2626' : valueScore === 3 ? '#f59e0b' : '#16a34a'
                    }}>
                      {valueScore === 1 && '😞 Not worth it at all'}
                      {valueScore === 2 && '😕 Barely worth it'}
                      {valueScore === 3 && '😐 It\'s okay'}
                      {valueScore === 4 && '😊 Really valuable'}
                      {valueScore === 5 && '🤩 Absolutely essential!'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                {!subscription && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      <span>{subscription ? 'Update Subscription' : 'Add Subscription'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionForm
