/**
 * Confirmation Dialog Component — Minimal Toggl Style
 */
import React, { useEffect } from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

import { useLanguage } from '../../context/LanguageContext'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmStyle?: 'danger' | 'primary'
  isLoading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmStyle = 'danger',
  isLoading = false,
}) => {
  const { t } = useLanguage()
  const defaultConfirmText = confirmText || (confirmStyle === 'danger' ? t('dialog.confirmCancelBtn') : 'OK')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const isDanger = confirmStyle === 'danger'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-xs"
        onClick={() => {
          if (!isLoading) onClose()
        }}
      />

      {/* Dialog Card */}
      <div className="relative bg-white border border-[#F0E6E6] rounded-2xl shadow-modal max-w-md w-full p-6 text-[#2D2D2D] animate-scale-in">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[#FFF5F5] hover:bg-[#F7D6D0]/60 text-[#757575] hover:text-[#2D2D2D] flex items-center justify-center transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
            isDanger
              ? 'bg-rose-50 text-rose-600 border border-rose-100'
              : 'bg-[#FCE7F3] text-[#B02A82] border border-[#FBCFE8]'
          }`}
        >
          <FiAlertTriangle className="w-5 h-5 shrink-0" />
        </div>

        {/* Title & Message */}
        <h3 className="text-base font-bold text-[#2D2D2D] tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-xs text-[#757575] leading-relaxed mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-soft py-2.5 rounded-xl text-xs"
          >
            {t('dialog.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/10'
                : 'btn-berry'
            }`}
          >
            {isLoading ? <span>...</span> : <span>{defaultConfirmText}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
