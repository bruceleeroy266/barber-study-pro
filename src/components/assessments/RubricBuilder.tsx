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
    <div className="bg-charcoal border border-graphite rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-[var(--color-brand-gold)]" />
        <h3 className="text-lg font-semibold text-white">{rubric.assessmentType} Rubric</h3>
      </div>
      <p className="text-sm text-silver mb-4">
        Total possible points: <span className="text-white font-bold">{maxScore}</span>
      </p>

      <ul className="space-y-3">
        {rubric.criteria.map((criterion) => (
          <li
            key={criterion.id}
            className="bg-black border border-graphite rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-white">{criterion.name}</div>
                <p className="text-sm text-silver mt-1">{criterion.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-white font-bold">{criterion.maxScore}</div>
                <div className="text-xs text-silver-gray">points</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
