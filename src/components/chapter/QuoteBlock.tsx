'use client'

import { Quote } from 'lucide-react'

interface QuoteBlockProps {
  quote: string
  attribution?: string
}

export default function QuoteBlock({ quote, attribution }: QuoteBlockProps) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 md:p-8">
      <Quote className="w-8 h-8 text-[#D4AF37]/30 mb-3" />
      <blockquote className="text-lg md:text-xl text-gray-200 italic leading-relaxed">
        "{quote}"
      </blockquote>
      {attribution && (
        <div className="mt-4 text-sm text-[#D4AF37]">— {attribution}</div>
      )}
    </div>
  )
}
