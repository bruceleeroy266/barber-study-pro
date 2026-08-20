'use client'

/**
 * Phase 6C-3 — Remediation Content Renderer
 *
 * Renders concept-targeted Chapter 2 content sections.
 * Thin wrapper around existing ChapterContent components.
 */

import { useState } from 'react'
import type { ChapterSection } from '@/lib/chapter-content'
import ChapterContent from '@/components/chapter/ChapterContent'
import { Button, Card, Badge } from '@/components/ui'
import { CheckCircle, Circle } from 'lucide-react'

interface RemediationContentRendererProps {
  contentBlocks: ChapterSection[]
  onContentViewed: (contentBlockId: string) => void
  viewedContentIds: Set<string>
}

export default function RemediationContentRenderer({
  contentBlocks,
  onContentViewed,
  viewedContentIds,
}: RemediationContentRendererProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const handleMarkViewed = (sectionId: string) => {
    onContentViewed(sectionId)
  }

  if (contentBlocks.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-silver text-center">
          No specific review materials are assigned for this topic.
          Please review the full chapter for more information.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Review Materials
        </h2>
        <Badge variant="info">
          {viewedContentIds.size} of {contentBlocks.length} viewed
        </Badge>
      </div>

      <div className="space-y-3">
        {contentBlocks.map((section) => {
          const isViewed = viewedContentIds.has(section.id)
          const isExpanded = expandedSections.has(section.id)

          return (
            <Card
              key={section.id}
              className={`overflow-hidden transition-all ${
                isViewed ? 'border-green-500/30' : ''
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isViewed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-silver flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium text-white">
                      {section.title || section.id}
                    </h3>
                    {section.subtitle && (
                      <p className="text-sm text-silver">{section.subtitle}</p>
                    )}
                  </div>
                </div>
                <span className="text-silver text-sm">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-graphite p-4">
                  <ChapterContent sections={[section]} />
                  {!isViewed && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkViewed(section.id)}
                      >
                        Mark as Reviewed
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
