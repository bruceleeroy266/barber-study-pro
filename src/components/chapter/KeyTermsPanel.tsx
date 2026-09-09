'use client'

import { BookOpen } from 'lucide-react'
import type { Chapter2KeyTerm } from '@/lib/chapter-2-key-terms'
import { groupKeyTermsByConcept } from '@/lib/chapter-2-key-terms'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface KeyTermsPanelProps {
  terms: readonly Chapter2KeyTerm[]
  theme?: ChapterTheme
}

/**
 * Student-facing Chapter Key Terms glossary.
 *
 * Study aid only: no instructor material, no provenance labels, no
 * board-exam framing. Terms are grouped by concept in curriculum order.
 */
export default function KeyTermsPanel({ terms, theme }: KeyTermsPanelProps) {
  const t = theme || defaultTheme
  const groups = groupKeyTermsByConcept(terms)

  if (groups.length === 0) {
    return null
  }

  const termCount = terms.length

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: t.backgroundAlt,
        borderColor: t.border,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div
        className="p-6"
        style={{
          background: `linear-gradient(135deg, ${t.primary}10, ${t.primary}04)`,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6" style={{ color: t.primary }} aria-hidden="true" />
          <div>
            <h3 className="text-lg font-semibold" style={{ color: t.text }}>
              Key Terms
            </h3>
            <p className="text-sm" style={{ color: t.textMuted }}>
              {termCount} essential terms for this chapter — review them alongside the lesson and flashcards
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {groups.map((group) => (
          <section key={group.conceptId} aria-label={group.conceptName}>
            <h4
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: t.primary }}
            >
              {group.conceptName}
            </h4>
            <dl className="space-y-2">
              {group.terms.map((kt) => (
                <div
                  key={kt.id}
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: t.background,
                    borderColor: t.border,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <dt className="text-sm font-medium" style={{ color: t.text }}>
                    {kt.term}
                  </dt>
                  <dd className="text-sm mt-1" style={{ color: t.textMuted }}>
                    {kt.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  )
}
