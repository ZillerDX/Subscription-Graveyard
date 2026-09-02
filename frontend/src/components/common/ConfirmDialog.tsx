/**
 * Confirm Dialog — Premium zinc modal with animated entrance
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
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Confirm', confirmStyle = 'danger', isLoading = false,
}) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isLoading) onClose() }
    if (isOpen) { document.addEventListener('keydown', fn); return () => document.removeEventListener('keydown', fn) }
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const isDanger = confirmStyle === 'danger'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => !isLoading && onClose()}
      />

      {/* Dialog */}
      <div className="relative bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-modal max-w-md w-full p-6 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors active:scale-[0.95] disabled:opacity-50"
        >
          <FiX className="w-4 h-4 shrink-0" />
        </button>

        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${
          isDanger
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
        }`}>
          <FiAlertTriangle className="w-5 h-5 shrink-0" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white tracking-tight mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-secondary py-2.5 rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 hover:shadow-glow-rose'
                : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-glow-indigo'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                Processing…
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
