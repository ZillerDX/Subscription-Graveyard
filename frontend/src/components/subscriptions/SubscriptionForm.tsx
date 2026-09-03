/**
 * Subscription Form Modal — Minimal Toggl Style
 * Features:
 * - Unclipped, fully responsive modal container
 * - Daily Usage (ชม./วัน) with instant automatic Monthly (~x30.4) & Yearly (~x365) projections
 * - Real Brand Vector Logos with instant preset auto-fill
 * - Personalized Category Priority Matrix Diagnosis
 * - Dual-Language Support (TH/EN)
 */
import React, { useState, useEffect } from 'react'
import { FiX, FiCheck, FiClock, FiAlertTriangle, FiCheckCircle, FiCalendar } from 'react-icons/fi'
import type { Subscription, SubscriptionCreate, BillingCycle } from '../../types/subscription'
import { BRAND_PRESETS, BrandLogo, BrandInfo, detectLogoKey } from '../common/BrandLogo'
import { CATEGORIES } from '../../data/platforms'
import {
  dailyToMonthlyHours,
  dailyToYearlyHours,
  monthlyToDailyHours,
  formatDailyHours,
  getCostPerHour,
  classifyQuadrant,
} from '../../utils/calculations'
import { useLanguage } from '../../context/LanguageContext'

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
  const { t, language } = useLanguage()

  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [dailyHours, setDailyHours] = useState(0.5) // Default 30 min/day
  const [logoKey, setLogoKey] = useState<string | null>(null)
  const [category, setCategory] = useState('Entertainment')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing subscription if editing
  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setCost(subscription.cost.toString())
      setBillingCycle(subscription.billing_cycle)

      if (typeof subscription.daily_hours === 'number') {
        setDailyHours(subscription.daily_hours)
      } else if (typeof subscription.monthly_hours === 'number') {
        setDailyHours(monthlyToDailyHours(subscription.monthly_hours))
      } else if (subscription.value_score) {
        setDailyHours(subscription.value_score * 0.3)
      } else {
        setDailyHours(0.5)
      }

      setLogoKey(subscription.logo_key || detectLogoKey(subscription.name))
      setCategory(subscription.category || 'Other')
    }
  }, [subscription])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // Handle Preset Selection
  const handleSelectPreset = (preset: BrandInfo) => {
    setName(preset.name)
    setLogoKey(preset.id)
    setCategory(preset.category)
    setBillingCycle(preset.suggestedCycle)
    if (!cost) {
      setCost(preset.suggestedCost.toString())
    }
    // Set daily hours from default monthly hours
    setDailyHours(monthlyToDailyHours(preset.defaultHours))
  }

  const costNum = parseFloat(cost) || 0
  const normalizedMonthlyCost = billingCycle === 'monthly' ? costNum : costNum / 12
  const monthlyHours = dailyToMonthlyHours(dailyHours)
  const yearlyHours = dailyToYearlyHours(dailyHours)
  const costPerHour = getCostPerHour(normalizedMonthlyCost, monthlyHours)
  const { quadrant, recommendation } = classifyQuadrant(normalizedMonthlyCost, monthlyHours, category)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError(language === 'th' ? 'กรุณาระบุชื่อบริการ' : 'Please provide a subscription name')
      return
    }

    if (isNaN(costNum) || costNum <= 0) {
      setError(
        language === 'th'
          ? 'กรุณาระบุค่าบริการที่ถูกต้อง (ตัวเลขมากกว่า 0)'
          : 'Please enter a valid positive cost'
      )
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        cost: costNum,
        billing_cycle: billingCycle,
        daily_hours: Math.round(dailyHours * 100) / 100,
        monthly_hours: monthlyHours,
        logo_key: logoKey || detectLogoKey(name),
        category: category || undefined,
      })
    } catch (err: any) {
      setError(err.message || (language === 'th' ? 'เกิดข้อผิดพลาด' : 'Failed to save'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="relative my-auto bg-white border border-[#F0E6E6] rounded-3xl shadow-modal max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Sticky Header - NEVER clipped! */}
        <div className="px-6 py-4 border-b border-[#F0E6E6] flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <BrandLogo logoKey={logoKey} name={name} className="w-10 h-10 rounded-xl" size={20} />
            <div>
              <h2 className="text-base font-extrabold text-[#2D2D2D] tracking-tight">
                {subscription ? t('form.titleEdit') : t('form.titleNew')}
              </h2>
              <p className="text-xs text-[#8A8A8A]">{t('form.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0]/60 text-[#757575] hover:text-[#2D2D2D] flex items-center justify-center transition-colors"
          >
            <FiX className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto min-h-0 flex-1 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* ── 1. Quick Brand Presets with Real Logos ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-minimal mb-0">{t('form.quickPresets')}</label>
              <span className="text-[11px] text-[#8A8A8A]">{t('form.quickPresetsSub')}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {BRAND_PRESETS.map((preset) => {
                const Icon = preset.icon
                const isSelected =
                  logoKey === preset.id || (!logoKey && name.toLowerCase().includes(preset.id))
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                      isSelected
                        ? 'border-[#B02A82] bg-[#FCE7F3]/40 text-[#B02A82] shadow-xs'
                        : 'border-[#F0E6E6] bg-white hover:bg-[#FFF5F5] text-[#4A4A4A]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: preset.bgColor }}
                    >
                      <Icon size={13} style={{ color: preset.color }} />
                    </div>
                    <span>{preset.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── 2. Name & Category ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-minimal">{t('form.nameLabel')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setLogoKey(detectLogoKey(e.target.value))
                  }}
                  placeholder={t('form.namePlaceholder')}
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="label-minimal">{t('form.categoryLabel')}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-minimal bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── 3. Cost & Plan Cycle ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-minimal">{t('form.costLabel')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A] text-sm font-semibold">
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
                    className="input-minimal pl-8 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="label-minimal">{t('form.billingPlan')}</label>
                <div className="grid grid-cols-2 p-1 bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-[#B02A82] shadow-xs'
                        : 'text-[#757575] hover:text-[#2D2D2D]'
                    }`}
                  >
                    {t('form.monthlyPlan')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-[#B02A82] shadow-xs'
                        : 'text-[#757575] hover:text-[#2D2D2D]'
                    }`}
                  >
                    {t('form.yearlyPlan')}
                  </button>
                </div>
              </div>
            </div>

            {/* ── 4. Daily Usage Input Paradigm (Hours per Day -> Month/Year) ── */}
            <div className="p-4 sm:p-5 bg-[#FFF5F5] border border-[#F0E6E6] rounded-2xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E2B4BD]/40 text-[#B02A82] flex items-center justify-center shrink-0">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D2D2D] leading-tight">
                      {t('form.dailyQuestion')}
                    </h3>
                    <p className="text-[11px] text-[#757575] mt-0.5">{t('form.dailyRule')}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-extrabold text-[#B02A82] tabular">
                    {formatDailyHours(dailyHours, language)}
                  </span>
                </div>
              </div>

              {/* Interactive Daily Range Slider */}
              <div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.25"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value) || 0)}
                  className="w-full accent-[#B02A82] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8A8A8A] mt-1 font-medium">
                  <span>{t('form.dailyZero')}</span>
                  <span>1 ชม./วัน</span>
                  <span>2 ชม./วัน</span>
                  <span>3 ชม./วัน</span>
                  <span>{t('form.dailyMax')}</span>
                </div>
              </div>

              {/* Quick Daily Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: t('form.chipRare'), val: 0.05 },
                  { label: t('form.chip15m'), val: 0.25 },
                  { label: t('form.chip30m'), val: 0.5 },
                  { label: t('form.chip1h'), val: 1.0 },
                  { label: t('form.chip2h'), val: 2.0 },
                  { label: t('form.chip3h'), val: 3.0 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => setDailyHours(chip.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      Math.abs(dailyHours - chip.val) < 0.01
                        ? 'border-[#B02A82] bg-white text-[#B02A82] shadow-xs'
                        : 'border-[#F0E6E6] bg-white/80 hover:bg-white text-[#5A5A5A]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Real-time Projection Telemetry Box */}
              <div className="bg-white border border-[#F0E6E6] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#757575]">
                  <span className="font-semibold flex items-center gap-1.5 text-[#2D2D2D]">
                    <FiCalendar className="w-3.5 h-3.5 text-[#B02A82]" />
                    {t('form.timeSummary')}
                  </span>
                  <div className="flex items-center gap-3 font-semibold text-[#2D2D2D] tabular">
                    <span>{monthlyHours} ชม./เดือน</span>
                    <span className="text-[#8A8A8A]">|</span>
                    <span>~{yearlyHours} ชม./ปี</span>
                  </div>
                </div>

                {/* Live Value Diagnosis */}
                {costNum > 0 && (
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all duration-200 mt-2 ${
                      quadrant === 'kill_zone'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : quadrant === 'silent_bleed'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {quadrant === 'kill_zone' || quadrant === 'silent_bleed' ? (
                      <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    ) : (
                      <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    )}
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2 font-bold">
                        <span>{t('form.avgCostPerHour')}</span>
                        <span className="text-sm underline tabular">
                          ${costPerHour.toFixed(2)} / ชม.
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-medium">{recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── 5. Action Buttons ── */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-soft py-2.5 rounded-xl"
              >
                {t('form.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-berry py-2.5 rounded-xl"
              >
                {isSubmitting ? (
                  <span>{t('form.saving')}</span>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 shrink-0" />
                    <span>{t('form.save')}</span>
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
