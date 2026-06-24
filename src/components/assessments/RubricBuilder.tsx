'use client'

import { AssessmentRubric } from '@/types'
import { calculateRubricMaxScore } from '@/lib/assessments'
import { ListChecks } from 'lucide-react'

interface RubricBuilderProps {
  rubric: AssessmentRubric
}

export default function RubricBuilder({ rubric }: RubricBuilderProps) {
  const maxScore = calculateRubricMaxScore(rubric)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-[#D4AF37]" />
        <h3 className="text-lg font-semibold text-white">{rubric.assessmentType} Rubric</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Total possible points: <span className="text-white font-bold">{maxScore}</span>
      </p>

      <ul className="space-y-3">
        {rubric.criteria.map((criterion) => (
          <li
            key={criterion.id}
            className="bg-gray-950 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-white">{criterion.name}</div>
                <p className="text-sm text-gray-400 mt-1">{criterion.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-white font-bold">{criterion.maxScore}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
