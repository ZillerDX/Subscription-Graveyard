/**
 * Confirmation Dialog Component - Modern Pro SaaS Design
 * Clean dark backdrop, vector warning icon, accessible escape handlers
 */
import React, { useEffect } from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

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
  confirmText = 'Confirm',
  confirmStyle = 'danger',
  isLoading = false,
}) => {
  // Handle Escape key press
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
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-100 animate-scaleIn">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>

          {/* Warning Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              isDanger
                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
            }`}
          >
            <FiAlertTriangle className="w-5 h-5 shrink-0" />
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
            {title}
          </h3>

          {/* Message */}
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded-xl text-xs font-semibold tracking-wide transition-colors border border-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm disabled:opacity-50 flex items-center justify-center space-x-1.5 ${
                isDanger
                  ? 'bg-rose-600 hover:bg-rose-500 hover:shadow-rose-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
