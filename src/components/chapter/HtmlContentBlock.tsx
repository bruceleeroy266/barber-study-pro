'use client'

import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface HtmlContentBlockProps {
  html: string
  theme?: ChapterTheme
}

export default function HtmlContentBlock({ html, theme }: HtmlContentBlockProps) {
  const t = theme || defaultTheme

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: t.backgroundAlt,
        borderColor: t.border,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div
        className="ch18-legacy-content p-6"
        style={{ color: t.text }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
