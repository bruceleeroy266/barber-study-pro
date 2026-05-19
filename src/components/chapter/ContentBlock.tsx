'use client'

import type { ContentBlockSection } from '@/lib/chapter-content'

interface ContentBlockProps {
  content: string
  highlight?: string
}

export default function ContentBlock({ content, highlight }: ContentBlockProps) {
  return (
    <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6">
      <p className="text-gray-300 text-sm leading-relaxed">
        {highlight ? (
          <>
            {content.split(highlight).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-[#D4AF37] font-medium">{highlight}</span>
                )}
              </span>
            ))}
          </>
        ) : (
          content
        )}
      </p>
    </div>
  )
}
