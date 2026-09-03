/**
 * Subscription Form Modal — Minimal Toggl Style
 * Real brand logos with interactive presets, and time-usage based evaluation:
 * "คุณใช้เวลากับบริการนี้กี่ชั่วโมงต่อเดือน? ถ้าน้อย = ไม่คุ้ม"
 */
import React, { useState, useEffect } from 'react'
import { FiX, FiCheck, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import type { Subscription, SubscriptionCreate, BillingCycle } from '../../types/subscription'
import { BRAND_PRESETS, BrandLogo, BrandInfo, detectLogoKey } from '../common/BrandLogo'
import { CATEGORIES } from '../../data/platforms'
import { getCostPerHour, classifyQuadrant } from '../../utils/calculations'

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
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [monthlyHours, setMonthlyHours] = useState(15) // Default 15 hours/mo
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
      setMonthlyHours(
        typeof subscription.monthly_hours === 'number'
          ? subscription.monthly_hours
          : subscription.value_score
          ? subscription.value_score * 8
          : 15
      )
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

  // Handle Preset Click: auto-fills name, logo, category, but keeps cost & hours freely editable!
  const handleSelectPreset = (preset: BrandInfo) => {
    setName(preset.name)
    setLogoKey(preset.id)
    setCategory(preset.category)
    setBillingCycle(preset.suggestedCycle)
    // Only set cost/hours if currently empty or matches previous default
    if (!cost) {
      setCost(preset.suggestedCost.toString())
    }
    if (monthlyHours === 15) {
      setMonthlyHours(preset.defaultHours)
    }
  }

  const costNum = parseFloat(cost) || 0
  const normalizedMonthlyCost = billingCycle === 'monthly' ? costNum : costNum / 12
  const costPerHour = getCostPerHour(normalizedMonthlyCost, monthlyHours)
  const { quadrant, recommendation } = classifyQuadrant(normalizedMonthlyCost, monthlyHours)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('กรุณาระบุชื่อบริการ / Subscription')
      return
    }

    if (isNaN(costNum) || costNum <= 0) {
      setError('กรุณาระบุค่าบริการที่ถูกต้อง (ตัวเลขมากกว่า 0)')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        cost: costNum,
        billing_cycle: billingCycle,
        monthly_hours: monthlyHours,
        logo_key: logoKey || detectLogoKey(name),
        category: category || undefined,
      })
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div className="bg-white border border-[#F0E6E6] rounded-2xl shadow-modal max-w-xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F0E6E6] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo logoKey={logoKey} name={name} className="w-9 h-9 rounded-xl" size={18} />
            <div>
              <h2 className="text-base font-bold text-[#2D2D2D] tracking-tight">
                {subscription ? 'แก้ไขบริการ Subscription' : 'เพิ่ม Subscription ใหม่'}
              </h2>
              <p className="text-xs text-[#8A8A8A]">
                ระบุค่าบริการและชั่วโมงการใช้งานเพื่อวิเคราะห์ความคุ้มค่า
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0]/60 text-[#757575] hover:text-[#2D2D2D] flex items-center justify-center transition-colors"
          >
            <FiX className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* ── 1. Quick Brand Presets with Real Logos ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-minimal mb-0">เลือกบริการหรือโลโก้จริง (Quick Preset)</label>
              <span className="text-[11px] text-[#8A8A8A]">คลิกเพื่อกรอกอัตโนมัติ</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {BRAND_PRESETS.map((preset) => {
                const Icon = preset.icon
                const isSelected = logoKey === preset.id || (!logoKey && name.toLowerCase().includes(preset.id))
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
                <label className="label-minimal">ชื่อบริการ (Subscription Name) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setLogoKey(detectLogoKey(e.target.value))
                  }}
                  placeholder="เช่น YouTube Premium, Netflix, ChatGPT"
                  className="input-minimal"
                />
              </div>

              <div>
                <label className="label-minimal">หมวดหมู่ (Category)</label>
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
                <label className="label-minimal">ราคาค่าบริการ (Cost) *</label>
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
                <label className="label-minimal">รอบการชำระเงิน (Billing Plan)</label>
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
                    รายเดือน (Monthly)
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
                    รายปี (Yearly)
                  </button>
                </div>
              </div>
            </div>

            {/* ── 4. New Value Method: Time-Usage Question ── */}
            <div className="p-4 sm:p-5 bg-[#FFF5F5] border border-[#F0E6E6] rounded-2xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E2B4BD]/40 text-[#B02A82] flex items-center justify-center shrink-0">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D2D2D] leading-tight">
                      คุณใช้เวลากับบริการ/แอพนี้กี่ชั่วโมงต่อเดือน?
                    </h3>
                    <p className="text-[11px] text-[#757575] mt-0.5">
                      กฎความคุ้มค่า: ถ้าน้อย = ไม่คุ้ม (Zombie Subscription)
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-bold text-[#B02A82] tabular">{monthlyHours}</span>
                  <span className="text-xs text-[#757575] ml-1 font-medium">ชม./เดือน</span>
                </div>
              </div>

              {/* Interactive Slider */}
              <div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="1"
                  value={monthlyHours}
                  onChange={(e) => setMonthlyHours(parseInt(e.target.value) || 0)}
                  className="w-full accent-[#B02A82] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8A8A8A] mt-1 font-medium">
                  <span>0 ชม. (ไม่เคยเปิดใช้)</span>
                  <span>10 ชม.</span>
                  <span>30 ชม.</span>
                  <span>60 ชม.</span>
                  <span>100+ ชม. (ใช้ทุกวัน)</span>
                </div>
              </div>

              {/* Quick Hours Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: 'แทบไม่ใช้ (1 ชม.)', val: 1 },
                  { label: 'ใช้น้อย (4 ชม.)', val: 4 },
                  { label: 'ปานกลาง (15 ชม.)', val: 15 },
                  { label: 'ใช้บ่อย (35 ชม.)', val: 35 },
                  { label: 'ใช้หนัก (60 ชม.)', val: 60 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => setMonthlyHours(chip.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      monthlyHours === chip.val
                        ? 'border-[#B02A82] bg-white text-[#B02A82] shadow-xs'
                        : 'border-[#F0E6E6] bg-white/70 hover:bg-white text-[#5A5A5A]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Live Value Diagnosis */}
              {costNum > 0 && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-2.5 transition-all duration-200 ${
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
                      <span>ต้นทุนเฉลี่ยต่อชั่วโมง:</span>
                      <span className="text-sm underline tabular">
                        ${costPerHour.toFixed(2)} / ชม.
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium">{recommendation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── 5. Action Buttons ── */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-soft py-2.5 rounded-xl"
              >
                ยกเลิก (Cancel)
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-berry py-2.5 rounded-xl"
              >
                {isSubmitting ? (
                  <span>กำลังบันทึก...</span>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 shrink-0" />
                    <span>{subscription ? 'บันทึกการแก้ไข' : 'สร้าง Subscription'}</span>
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
