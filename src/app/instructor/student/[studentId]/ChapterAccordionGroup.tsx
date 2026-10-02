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
    <details className="group rounded-xl border border-graphite bg-charcoal overflow-hidden">
      <summary className="cursor-pointer list-none p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-gold)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white">Chapter Diagnostics</h2>
            <p className="mt-1 text-sm text-silver-gray">
              21 chapters · select to view chapter-by-chapter grades and diagnostics.
            </p>
          </div>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-silver transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </div>
      </summary>

      <div className="border-t border-graphite p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-silver-gray">
            Open only the chapters you want to inspect.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAll(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-graphite bg-black px-3 py-2 text-sm font-medium text-light-gray hover:border-[var(--color-brand-gold)] hover:text-white"
            >
              <ChevronsDown className="h-4 w-4" aria-hidden="true" />
              Expand All
            </button>
            <button
              type="button"
              onClick={() => setAll(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-graphite bg-black px-3 py-2 text-sm font-medium text-light-gray hover:border-[var(--color-brand-gold)] hover:text-white"
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
    </details>
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
