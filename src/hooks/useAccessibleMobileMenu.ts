'use client'

import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useAccessibleMobileMenu(
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const trigger = triggerRef.current
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFirst = window.requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      ;(first ?? panelRef.current)?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getClientRects().length > 0)

      if (focusable.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFirst)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      window.requestAnimationFrame(() => trigger?.focus())
    }
  }, [isOpen, setIsOpen])

  return { triggerRef, panelRef }
}
