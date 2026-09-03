/**
 * Register Page — Minimal Toggl Light Style
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
  FiCheckCircle,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'ระดับความปลอดภัย: ต่ำ', color: 'bg-rose-500' }
  if (score === 2) return { score, label: 'ระดับความปลอดภัย: ปานกลาง', color: 'bg-amber-500' }
  if (score === 3) return { score, label: 'ระดับความปลอดภัย: ดี', color: 'bg-sky-500' }
  return { score, label: 'ระดับความปลอดภัย: สูงมาก', color: 'bg-emerald-500' }
}

const RegisterPage: React.FC = () => {
  const { register, loginAsDemo, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const strength = getStrength(password)
  const passwordsMatch = confirmPassword !== '' && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
      return
    }

    setIsSubmitting(true)
    try {
      await register({ email, password })
    } catch (err: any) {
      setError(err.message || 'การสมัครสมาชิกล้มเหลว โปรดลองอีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[#757575] text-sm font-medium">
          <div className="w-5 h-5 border-2 border-[#B02A82] border-t-transparent rounded-full animate-spin" />
          <span>กำลังสร้างบัญชีผู้ใช้...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-6 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-3xl overflow-hidden shadow-modal border border-[#F0E6E6]">
        {/* Left Side: Brand Preview */}
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
              <span className="badge-peach text-xs font-bold">เริ่มใช้งานได้ฟรีทันที</span>
              <h2 className="text-2xl font-extrabold text-[#2D2D2D] leading-tight">
                ควบคุมค่าใช้จ่าย<br />
                อย่างชาญฉลาด
              </h2>
              <p className="text-xs text-[#757575] leading-relaxed">
                สร้างบัญชีเพื่อบันทึกและวิเคราะห์ค่าบริการรายเดือน ไม่ต้องผูกบัตรเครดิต ข้อมูลของคุณปลอดภัยและทำงานแบบ Offline-first
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#F0E6E6]/80">
            <div className="flex items-center gap-2 text-xs text-[#5A5A5A]">
              <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ตรวจจับบริการที่เปิดทิ้งไว้แต่ไม่ใช้</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#5A5A5A]">
              <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ส่งออกรายงานเป็นไฟล์ CSV ได้ตลอดเวลา</span>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2D2D2D] tracking-tight">
              สร้างบัญชีใหม่ (Create Account)
            </h1>
            <p className="text-xs text-[#757575] mt-1">
              กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบวิเคราะห์ความคุ้มค่า
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
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  minLength={6}
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

              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength.score ? strength.color : 'bg-[#F0E6E6]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8A8A8A]">{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="label-minimal">ยืนยันรหัสผ่าน (Confirm Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  className="input-minimal pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8A8A] hover:text-[#2D2D2D]"
                >
                  {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && (
                <p
                  className={`text-[10px] mt-1 font-medium ${
                    passwordsMatch ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {passwordsMatch ? '✓ รหัสผ่านตรงกัน' : '✗ รหัสผ่านไม่ตรงกัน'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-berry py-3 rounded-xl text-xs font-bold"
            >
              {isSubmitting ? (
                <span>กำลังสร้างบัญชี...</span>
              ) : (
                <>
                  <span>สมัครสมาชิก</span>
                  <FiArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-[#F0E6E6]" />
              <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                หรือทดลองใช้งานทันที
              </span>
            </div>

            <button
              type="button"
              onClick={loginAsDemo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#B02A82]/30 bg-[#FCE7F3]/40 hover:bg-[#FCE7F3] text-[#B02A82] text-xs font-bold transition-all active:scale-[0.98]"
            >
              <FiPlay className="w-3.5 h-3.5 shrink-0" />
              <span>เปิดโหมดทดสอบพร้อมข้อมูลจำลอง (Demo Mode)</span>
            </button>
          </form>

          <p className="text-center text-xs text-[#757575] mt-6">
            มีบัญชีผู้ใช้อยู่แล้ว?{' '}
            <Link to="/login" className="text-[#B02A82] font-bold hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
