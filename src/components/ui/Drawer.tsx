'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Drawer Component
 * 
 * Slide-in panel from the edge of the screen.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * Includes focus trap for accessibility (WCAG 2.1.2).
 * 
 * @example
 * ```tsx
 * <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Settings">
 *   <p>Drawer content</p>
 * </Drawer>
 * ```
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  // Capture the element that triggered the drawer so focus can be restored.
  useEffect(() => {
    if (isOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement
      // Focus the close button or first focusable element when drawer opens
      const focusTarget = panelRef.current?.querySelector('[data-drawer-close]') ?? 
        panelRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus()
      }
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus()
      lastFocusedRef.current = null
    }
  }, [isOpen])

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
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap: keep tab focus inside the drawer.
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

  const positionStyles = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  }

  const sizeStyles = {
    left: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-[32rem]',
      full: 'w-full',
    },
    right: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-[32rem]',
      full: 'w-full',
    },
    top: {
      sm: 'h-32',
      md: 'h-48',
      lg: 'h-64',
      xl: 'h-96',
      full: 'h-full',
    },
    bottom: {
      sm: 'h-32',
      md: 'h-48',
      lg: 'h-64',
      xl: 'h-96',
      full: 'h-full',
    },
  }

  const transformStyles = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={panelRef}
        className={cn(
          'fixed z-50 bg-charcoal border-graphite transition-transform duration-300 ease-in-out',
          positionStyles[position],
          sizeStyles[position][size],
          transformStyles[position],
          position === 'left' && 'border-r',
          position === 'right' && 'border-l',
          position === 'top' && 'border-b',
          position === 'bottom' && 'border-t'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        onKeyDown={handleTabKey}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-graphite">
            <h2 id="drawer-title" className="text-lg font-semibold text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              data-drawer-close
              className="text-silver hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] rounded p-1"
              aria-label="Close drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto h-full p-4">
          {children}
        </div>
      </div>
    </>
  )
}

export default Drawer
