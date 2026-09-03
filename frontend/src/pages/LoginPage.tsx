/**
 * Login Page — Minimal Toggl Light Style
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

const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isLoading } = useAuth()
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
      setError(err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้งหรือใช้โหมดทดสอบ')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#757575] text-sm font-medium">
          <div className="w-5 h-5 border-2 border-[#B02A82] border-t-transparent rounded-full animate-spin" />
          <span>กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</span>
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
                วัดความคุ้มค่า<br />
                จากเวลาใช้งานจริง
              </h2>
              <p className="text-xs text-[#757575] leading-relaxed">
                เปลี่ยนการจ่ายเงินเปล่าให้เป็นเงินเก็บ ตรวจสอบว่าบริการใดจ่ายแพงแต่แทบไม่เปิดใช้ พร้อมส่งเข้าสุสานได้ทันที
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#F0E6E6]/80">
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
              <FiClock className="w-4 h-4 text-[#B02A82] shrink-0" />
              <span>คำนวณต้นทุนต่อชั่วโมง ($/hr)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
              <FiDollarSign className="w-4 h-4 text-[#B02A82] shrink-0" />
              <span>ตรวจจับ Kill Zone อัตโนมัติ</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#5A5A5A]">
              <FiShield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ข้อมูลเก็บในเครื่อง ปลอดภัย 100%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2D2D2D] tracking-tight">
              เข้าสู่ระบบ (Sign In)
            </h1>
            <p className="text-xs text-[#757575] mt-1">
              ใส่อีเมลและรหัสผ่านเพื่อเข้าใช้งาน หรือคลิกเปิดโหมดทดสอบได้ทันที
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium">
              <FiAlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-minimal">อีเมล (Email Address)</label>
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
              <label className="label-minimal">รหัสผ่าน (Password)</label>
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
                <span>กำลังเข้าสู่ระบบ...</span>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <FiArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-[#F0E6E6]" />
              <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                หรือทดลองใช้งานทันที
              </span>
            </div>

            {/* Instant Demo Button */}
            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#B02A82]/30 bg-[#FCE7F3]/40 hover:bg-[#FCE7F3] text-[#B02A82] text-xs font-bold transition-all active:scale-[0.98]"
            >
              <FiPlay className="w-3.5 h-3.5 shrink-0" />
              <span>เปิดโหมดทดสอบพร้อมข้อมูลจำลอง (Interactive Demo)</span>
            </button>
          </form>

          <p className="text-center text-xs text-[#757575] mt-6">
            ยังไม่มีบัญชีผู้ใช้?{' '}
            <Link to="/register" className="text-[#B02A82] font-bold hover:underline">
              สมัครสมาชิกฟรี
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
