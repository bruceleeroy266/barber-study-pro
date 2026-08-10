'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackHref: string
  label?: string
}

export default function BackButton({ fallbackHref, label = 'Back' }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-silver hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] rounded px-2 py-1 -ml-2"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
