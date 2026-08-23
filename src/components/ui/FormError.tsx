'use client'

import { useEffect, useRef } from 'react'

interface FormErrorProps {
  id: string
  message: string
  title?: string
  className?: string
}

/**
 * Accessible, reusable form-level error feedback.
 *
 * The alert receives focus when it appears so keyboard and assistive-technology
 * users are moved directly to submission feedback. The icon and explicit title
 * ensure the state is distinguishable without relying on color alone.
 */
export function FormError({
  id,
  message,
  title = 'Unable to complete this action',
  className = '',
}: FormErrorProps) {
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    alertRef.current?.focus()
  }, [message])

  return (
    <div
      ref={alertRef}
      id={id}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
      className={`rounded-lg border-2 border-red-400/70 bg-red-950/70 px-4 py-3 text-red-50 shadow-lg shadow-red-950/20 outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-black ${className}`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-0.5 text-lg font-bold text-red-300">
          !
        </span>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-red-100">{message}</p>
        </div>
      </div>
    </div>
  )
}
