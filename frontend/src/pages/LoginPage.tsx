/**
 * Login Page — Minimal Toggl Light Style
 * Dual-Language support
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiPlay,
  FiActivity,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiShield,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading } = useAuth()
  const { t, language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
    } catch (err: any) {
      setError(
        err.message ||
          (language === 'th'
            ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้งหรือใช้โหมดทดสอบ'
            : 'Invalid email or password. Please try again or launch demo mode.')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#757575] text-sm font-medium">
          <div className="w-5 h-5 border-2 border-[#B02A82] border-t-transparent rounded-full animate-spin" />
          <span>{language === 'th' ? 'กำลังตรวจสอบสถานะการเข้าสู่ระบบ...' : 'Checking session...'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-6 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-3xl overflow-hidden shadow-modal border border-[#F0E6E6]">
        {/* Left Side: Brand Preview (Toggl Style) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-[#FFF5F5] border-r border-[#F0E6E6] p-8">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#B02A82] text-white flex items-center justify-center shadow-xs">
                <FiActivity className="w-5 h-5 shrink-0" />
              </div>
              <span className="font-extrabold text-[#2D2D2D] tracking-tight text-base">
                Subscription Graveyard
              </span>
            </div>

            <div className="space-y-3">
              <span className="badge-mauve text-xs font-bold">Time-Usage Analytics</span>
              <h2 className="text-2xl font-extrabold text-[#2D2D2D] leading-tight">
                {language === 'th' ? (
                  <>
                    วัดความคุ้มค่า<br />
                    จากเวลาใช้งานจริง
                  </>
                ) : (
                  <>
                    Evaluate Value<br />
                    From Actual Time
                  </>
                )}
              </h2>
              <p className="text-xs text-[#757575] leading-relaxed">
                {language === 'th'
                  ? 'เปลี่ยนการจ่ายเงินเปล่าให้เป็นเงินเก็บ ตรวจสอบว่าบริการใดจ่ายแพงแต่แทบไม่เปิดใช้ พร้อมส่งเข้าสุสานได้ทันที'
                  : 'Turn wasted subscription fees into realized savings. Uncover zombie services with high costs and low engagement.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#F0E6E6]/80">
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
              <FiClock className="w-4 h-4 text-[#B02A82] shrink-0" />
              <span>{language === 'th' ? 'คำนวณต้นทุนต่อชั่วโมง ($/hr)' : 'Calculate Cost Per Hour ($/hr)'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
              <FiDollarSign className="w-4 h-4 text-[#B02A82] shrink-0" />
              <span>{language === 'th' ? 'ตรวจจับ Kill Zone อัตโนมัติ' : 'Automated Kill Zone detection'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
              <FiShield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'th' ? 'ข้อมูลเก็บในเครื่อง ปลอดภัย 100%' : '100% Local-first & Private'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2D2D2D] tracking-tight">
              {t('auth.signinTitle')}
            </h1>
            <p className="text-xs text-[#757575] mt-1">{t('auth.signinSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
              <FiAlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-minimal">
                {language === 'th' ? 'อีเมล (Email Address)' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-minimal pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-minimal">
                {language === 'th' ? 'รหัสผ่าน (Password)' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-minimal pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8A8A] hover:text-[#2D2D2D]"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-berry py-3 rounded-xl text-xs font-bold"
            >
              {isSubmitting ? (
                <span>...</span>
              ) : (
                <>
                  <span>{t('auth.signinTitle')}</span>
                  <FiArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-[#F0E6E6]" />
              <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                {language === 'th' ? 'หรือทดลองใช้งานทันที' : 'OR INSTANT DEMO'}
              </span>
            </div>

            {/* Instant Demo Button */}
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#B02A82]/30 bg-[#FCE7F3]/40 hover:bg-[#FCE7F3] text-[#B02A82] text-xs font-bold transition-all active:scale-[0.98]"
            >
              <FiPlay className="w-3.5 h-3.5 shrink-0" />
              <span>{t('auth.demoBtn')}</span>
            </button>
          </form>

          <p className="text-center text-xs text-[#757575] mt-6">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-[#B02A82] font-bold hover:underline">
              {t('auth.signupLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
