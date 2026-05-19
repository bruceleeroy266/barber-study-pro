'use client'

import { Quote } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface QuoteBlockProps {
  quote: string
  attribution?: string
  theme?: ChapterTheme
}

export default function QuoteBlock({ quote, attribution, theme }: QuoteBlockProps) {
  const t = theme || defaultTheme
  const qt = t.quote || {}

  return (
    <div 
      className="rounded-xl p-6 md:p-8"
      style={{ 
        backgroundColor: (qt && qt.bg) || t.backgroundAlt,
        borderColor: (qt && qt.border) || t.border,
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <Quote className="w-8 h-8 mb-3" style={{ color: (qt && qt.icon) || t.primary }} />
      <blockquote className="text-lg md:text-xl italic leading-relaxed" style={{ color: t.text }}>
        "{quote}"
      </blockquote>
      {attribution && (
        <div className="mt-4 text-sm" style={{ color: t.primary }}>— {attribution}</div>
      )}
    </div>
  )
}
