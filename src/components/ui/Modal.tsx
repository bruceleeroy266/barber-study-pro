'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  initialFocusRef?: React.RefObject<HTMLElement | null>
  triggerRef?: React.RefObject<HTMLElement | null>
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  initialFocusRef,
  triggerRef,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  }

  // Capture the element that triggered the modal so focus can be restored.
  useEffect(() => {
    if (isOpen) {
      // Prefer the caller-provided trigger ref; fall back to the currently
      // focused element so keyboard activation restores focus correctly.
      lastFocusedRef.current = triggerRef?.current ?? (document.activeElement as HTMLElement)
      // Use the caller-provided ref as the initial focus target, otherwise the
      // close button.
      const focusTarget = initialFocusRef?.current ?? panelRef.current?.querySelector('[data-modal-close]')
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus()
      }
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus()
      lastFocusedRef.current = null
    }
  }, [isOpen, initialFocusRef, triggerRef])

  // Close on Escape.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  // Prevent body scroll while open.
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Focus trap: keep tab focus inside the modal.
  const handleTabKey = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    []
  )

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`bg-gray-900 border border-gray-800 rounded-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}
        onKeyDown={handleTabKey}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 id="modal-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-modal-close
            aria-label="Close"
            className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer && <div className="p-5 border-t border-gray-800">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
