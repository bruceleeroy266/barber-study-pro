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
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'low':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    default:
      return 'bg-gray-700 text-gray-300 border-gray-600'
  }
}

export default function StudyRecommendations({ recommendations, studentId, instructorView }: StudyRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Study Recommendations</h3>
        <p className="text-gray-500 text-sm">
          Complete a quiz to generate personalized study recommendations.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
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
              <div className="p-2 bg-gray-900 rounded-lg shrink-0">
                <Icon className="w-5 h-5 text-[#D4AF37]" />
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
                <p className="text-sm text-gray-400">{rec.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {rec.estimatedMinutes} min
                </div>
              </div>
            </>
          )

          return isInstructorScoped ? (
            <div
              key={rec.id}
              className="flex items-start gap-4 p-4 bg-gray-950 border border-gray-800 rounded-lg transition-colors"
            >
              {cardContent}
            </div>
          ) : (
            <Link
              key={rec.id}
              href={href}
              className="flex items-start gap-4 p-4 bg-gray-950 border border-gray-800 rounded-lg hover:border-[#D4AF37]/30 transition-colors group"
            >
              {cardContent}
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#D4AF37] shrink-0 mt-1" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
