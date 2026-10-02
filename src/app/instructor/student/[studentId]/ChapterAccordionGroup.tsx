'use client'

import { ReactNode, useRef } from 'react'
import { ChevronDown, ChevronsDown, ChevronsUp } from 'lucide-react'

interface ChapterAccordionGroupProps {
  children: ReactNode
}

export default function ChapterAccordionGroup({ children }: ChapterAccordionGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  function setAll(open: boolean) {
    containerRef.current
      ?.querySelectorAll<HTMLDetailsElement>('details[data-chapter-accordion]')
      .forEach((details) => {
        details.open = open
      })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Chapter Diagnostics</h2>
          <p className="text-sm text-silver-gray">
            Open only the chapters you want to inspect.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-graphite bg-charcoal px-3 py-2 text-sm font-medium text-light-gray hover:border-[var(--color-brand-gold)] hover:text-white"
          >
            <ChevronsDown className="h-4 w-4" aria-hidden="true" />
            Expand All
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="inline-flex items-center gap-2 rounded-lg border border-graphite bg-charcoal px-3 py-2 text-sm font-medium text-light-gray hover:border-[var(--color-brand-gold)] hover:text-white"
          >
            <ChevronsUp className="h-4 w-4" aria-hidden="true" />
            Collapse All
          </button>
        </div>
      </div>

      <div ref={containerRef} className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export function ChapterAccordionChevron() {
  return (
    <ChevronDown
      className="h-5 w-5 shrink-0 text-silver transition-transform duration-200 group-open:rotate-180"
      aria-hidden="true"
    />
  )
}
