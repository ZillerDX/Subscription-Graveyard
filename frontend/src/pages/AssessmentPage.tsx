/**
 * Personalized Category Priority Survey & Value Matrix Assessment Page
 * Grounded in the 50/30/20 Rule, Engagement-Hour Microeconomics, and Subscription Fatigue Research
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  FiCheckCircle,
  FiSliders,
  FiBookOpen,
  FiShield,
  FiTrendingUp,
  FiArrowRight,
  FiInfo,
} from 'react-icons/fi'
import { authStorage } from '../services/authStorage'
import type { CategoryPriority, UserPreferences } from '../types/subscription'
import { useLanguage } from '../context/LanguageContext'

interface CategoryConfig {
  key: string
  nameTh: string
  nameEn: string
  icon: string
  exampleTh: string
  exampleEn: string
}

const CATEGORIES_LIST: CategoryConfig[] = [
  {
    key: 'Productivity',
    nameTh: 'งานและเพิ่มประสิทธิภาพ (Productivity)',
    nameEn: 'Productivity & Software',
    icon: '💼',
    exampleTh: 'ChatGPT Plus, Notion, Figma, GitHub, Google One',
    exampleEn: 'ChatGPT Plus, Notion, Figma, GitHub, Google One',
  },
  {
    key: 'Health & Fitness',
    nameTh: 'สุขภาพและฟิตเนส (Health & Fitness)',
    nameEn: 'Health & Fitness',
    icon: '🧘',
    exampleTh: 'ยิม, ฟิตเนส, แอปฝึกสมาธิ, Strava',
    exampleEn: 'Gym membership, Peloton, Strava, Headspace',
  },
  {
    key: 'Education',
    nameTh: 'การศึกษาและการเรียนรู้ (Education)',
    nameEn: 'Education & Learning',
    icon: '📚',
    exampleTh: 'Duolingo Super, Coursera, Udemy, สื่อการเรียนรู้',
    exampleEn: 'Duolingo, Coursera, MasterClass, Learning tools',
  },
  {
    key: 'Entertainment',
    nameTh: 'ความบันเทิงและสตรีมมิ่ง (Entertainment)',
    nameEn: 'Entertainment & Streaming',
    icon: '🎬',
    exampleTh: 'YouTube Premium, Netflix, Spotify, Disney+',
    exampleEn: 'YouTube Premium, Netflix, Spotify, Disney+',
  },
  {
    key: 'Gaming',
    nameTh: 'เกมและอีสปอร์ต (Gaming)',
    nameEn: 'Gaming',
    icon: '🎮',
    exampleTh: 'PlayStation Plus, Xbox Game Pass, Discord Nitro, Steam',
    exampleEn: 'PlayStation Plus, Game Pass, Discord Nitro, Steam',
  },
  {
    key: 'Shopping',
    nameTh: 'ช้อปปิ้งและไลฟ์สไตล์ (Shopping)',
    nameEn: 'Shopping & Delivery',
    icon: '🛍️',
    exampleTh: 'Amazon Prime, บริการจัดส่งพรีเมียม',
    exampleEn: 'Amazon Prime, Delivery passes, Club memberships',
  },
  {
    key: 'News & Media',
    nameTh: 'ข่าวสารและการอ่าน (News & Media)',
    nameEn: 'News & Media',
    icon: '📰',
    exampleTh: 'The New York Times, Medium, สำนักพิมพ์ออนไลน์',
    exampleEn: 'NY Times, Medium, Online journals',
  },
  {
    key: 'Professional',
    nameTh: 'วิชาชีพและธุรกิจ (Professional)',
    nameEn: 'Professional & Career',
    icon: '👔',
    exampleTh: 'LinkedIn Premium, ซอฟต์แวร์วิชาชีพ',
    exampleEn: 'LinkedIn Premium, Industry portals',
  },
]

const AssessmentPage: React.FC = () => {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    authStorage.getUserPreferences()
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSetPriority = (categoryKey: string, priority: CategoryPriority) => {
    setPreferences((prev) => ({
      ...prev,
      categoryPriorities: {
        ...prev.categoryPriorities,
        [categoryKey]: priority,
      },
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    const updated: UserPreferences = {
      ...preferences,
      completedSurvey: true,
      updated_at: new Date().toISOString(),
    }
    authStorage.saveUserPreferences(updated)

    // Invalidate queries so all calculations and charts update immediately!
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-kill-zone'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-category-breakdown'] })
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] })

    setIsSaving(false)
    toast.success(t('assess.savedToast'))
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7F3] border border-[#FBCFE8] text-[#B02A82] text-xs font-bold mb-3">
          <FiSliders className="w-3.5 h-3.5" />
          <span>{t('dashboard.matrixBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D2D2D] tracking-tight">
          {t('assess.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] mt-1.5 max-w-2xl leading-relaxed">
          {t('assess.subtitle')}
        </p>
      </div>

      {/* ── Research & Economic Benchmarks Card ── */}
      <div className="card-minimal p-6 bg-gradient-to-br from-white via-white to-[#FFF5F5] border border-[#F0E6E6]">
        <div className="flex items-center gap-2.5 mb-4 text-[#B02A82]">
          <FiBookOpen className="w-5 h-5" />
          <h2 className="text-sm sm:text-base font-bold text-[#2D2D2D]">
            {t('assess.methodTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#2D2D2D]">
              <FiShield className="w-3.5 h-3.5 text-[#B02A82]" />
              <span>{t('assess.method1Title')}</span>
            </div>
            <p className="text-[#757575] leading-relaxed">
              {t('assess.method1Desc')}
            </p>
          </div>

          <div className="bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#2D2D2D]">
              <FiTrendingUp className="w-3.5 h-3.5 text-[#B02A82]" />
              <span>{t('assess.method2Title')}</span>
            </div>
            <p className="text-[#757575] leading-relaxed">
              {t('assess.method2Desc')}
            </p>
          </div>

          <div className="bg-[#FFF5F5] border border-[#F0E6E6] rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#2D2D2D]">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('assess.method3Title')}</span>
            </div>
            <p className="text-[#757575] leading-relaxed">
              {t('assess.method3Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Priority Selection Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wider">
            {t('assess.priorityLabel')}
          </h3>
          <span className="text-xs text-[#8A8A8A]">
            {language === 'th'
              ? 'เลือกระดับความสำคัญของแต่ละด้าน'
              : 'Select priority level for each category'}
          </span>
        </div>

        <div className="space-y-3">
          {CATEGORIES_LIST.map((cat) => {
            const currentPriority = preferences.categoryPriorities[cat.key] || 'medium'
            return (
              <div
                key={cat.key}
                className="card-minimal p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E2B4BD]"
              >
                {/* Category Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl shrink-0 select-none">{cat.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#2D2D2D] text-sm">
                      {language === 'th' ? cat.nameTh : cat.nameEn}
                    </h4>
                    <p className="text-xs text-[#8A8A8A] truncate mt-0.5">
                      {language === 'th' ? cat.exampleTh : cat.exampleEn}
                    </p>
                  </div>
                </div>

                {/* Priority Selector Pills */}
                <div className="grid grid-cols-3 sm:flex items-center gap-1.5 shrink-0 bg-[#FFF5F5] p-1 rounded-xl border border-[#F0E6E6]">
                  <button
                    type="button"
                    onClick={() => handleSetPriority(cat.key, 'high')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentPriority === 'high'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#2D2D2D]'
                    }`}
                  >
                    {language === 'th' ? 'สำคัญสูง' : 'High'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetPriority(cat.key, 'medium')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentPriority === 'medium'
                        ? 'bg-[#B02A82] text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#2D2D2D]'
                    }`}
                  >
                    {language === 'th' ? 'ปานกลาง' : 'Medium'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetPriority(cat.key, 'low')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentPriority === 'low'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#2D2D2D]'
                    }`}
                  >
                    {language === 'th' ? 'สำคัญน้อย' : 'Low'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Summary & Save Button ── */}
      <div className="card-minimal p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF5F5] border border-[#F0E6E6]">
        <div className="flex items-center gap-2.5 text-xs text-[#757575]">
          <FiInfo className="w-4 h-4 text-[#B02A82] shrink-0" />
          <span>
            {language === 'th'
              ? 'การบันทึกจะปรับเกณฑ์ใน Kill Zone Matrix และผลการวิเคราะห์ความคุ้มค่าทั้งหมดทันที'
              : 'Saving will immediately update all Kill Zone matrix thresholds and value recommendations'}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-berry py-3 px-6 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 shrink-0"
        >
          <span>{t('assess.saveBtn')}</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default AssessmentPage
