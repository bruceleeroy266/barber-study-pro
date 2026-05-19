'use client'

import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ContentBlockProps {
  content: string
  highlight?: string
  theme?: ChapterTheme
}

export default function ContentBlock({ content, highlight, theme }: ContentBlockProps) {
  const t = theme || defaultTheme
  const cbt = t.contentBlock || {}

  return (
    <div 
      className="rounded-xl p-6"
      style={{
        backgroundColor: (cbt && cbt.bg) || t.backgroundAlt,
        borderColor: (cbt && cbt.border) || t.border,
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
        {highlight ? (
          <>
            {content.split(highlight).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="font-medium" style={{ color: (cbt && cbt.highlightColor) || t.highlight }}>
                    {highlight}
                  </span>
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
