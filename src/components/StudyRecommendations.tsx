'use client'

import { StudyRecommendation } from '@/types'
import { BookOpen, RotateCcw, ClipboardList, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface StudyRecommendationsProps {
  recommendations: StudyRecommendation[]
  studentId?: string
  instructorView?: boolean
}

function iconForType(type: StudyRecommendation['type']) {
  switch (type) {
    case 'study':
      return BookOpen
    case 'review':
      return RotateCcw
    case 'practice':
      return ClipboardList
    default:
      return BookOpen
  }
}

function priorityColor(priority: StudyRecommendation['priority']) {
  switch (priority) {
    case 'critical':
      return 'bg-silver/20 text-silver border-silver/30'
    case 'high':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'medium':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'low':
      return 'bg-gold/20 text-gold border-gold/30'
    default:
      return 'bg-[var(--color-border-secondary)] text-light-gray border-silver-gray'
  }
}

export default function StudyRecommendations({ recommendations, studentId, instructorView }: StudyRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-charcoal border border-graphite rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Study Recommendations</h3>
        <p className="text-silver-gray text-sm">
          Complete a quiz to generate personalized study recommendations.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-charcoal border border-graphite rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recommended Next Steps</h3>
      <div className="space-y-3">
        {recommendations.map((rec) => {
          const Icon = iconForType(rec.type)
          const href = rec.chapterNumber
            ? `/dashboard/chapters/${rec.chapterNumber}`
            : rec.type === 'review'
            ? '/dashboard/missed-questions'
            : '/dashboard/chapters'

          const isInstructorScoped = instructorView && studentId
          const cardContent = (
            <>
              <div className="p-2 bg-charcoal rounded-lg shrink-0">
                <Icon className="w-5 h-5 text-[var(--color-brand-gold)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-white font-medium">{rec.title}</p>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColor(
                      rec.priority
                    )}`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-silver">{rec.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-silver-gray">
                  <Clock className="w-3 h-3" />
                  {rec.estimatedMinutes} min
                </div>
              </div>
            </>
          )

          return isInstructorScoped ? (
            <div
              key={rec.id}
              className="flex items-start gap-4 p-4 bg-black border border-graphite rounded-lg transition-colors"
            >
              {cardContent}
            </div>
          ) : (
            <Link
              key={rec.id}
              href={href}
              className="flex items-start gap-4 p-4 bg-black border border-graphite rounded-lg hover:border-[var(--color-brand-gold)]/30 transition-colors group"
            >
              {cardContent}
              <ChevronRight className="w-5 h-5 text-silver-gray group-hover:text-[var(--color-brand-gold)] shrink-0 mt-1" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
