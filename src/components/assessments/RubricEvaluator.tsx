'use client'

import { useState } from 'react'
import { AssessmentRubric } from '@/types'
import {
  calculateRubricScore,
  getDefaultCriterionScores,
  CriterionScore,
} from '@/lib/assessments'
import { CheckCircle } from 'lucide-react'

interface RubricEvaluatorProps {
  rubric: AssessmentRubric
}

export default function RubricEvaluator({ rubric }: RubricEvaluatorProps) {
  const [scores, setScores] = useState<CriterionScore[]>(getDefaultCriterionScores(rubric))

  const percentage = calculateRubricScore(rubric, scores)
  const isPassed = percentage >= 70

  function updateScore(criterionId: string, value: number) {
    const criterion = rubric.criteria.find((c) => c.id === criterionId)
    if (!criterion) return
    const clamped = Math.max(0, Math.min(criterion.maxScore, value))
    setScores((prev) =>
      prev.map((s) => (s.criterionId === criterionId ? { ...s, score: clamped } : s))
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Evaluate {rubric.assessmentType}</h3>
        <div className="text-right">
          <div className={`text-3xl font-bold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
            {percentage}%
          </div>
          <div className="text-xs text-gray-500">{isPassed ? 'Passing' : 'Below passing'}</div>
        </div>
      </div>

      <div className="space-y-4">
        {rubric.criteria.map((criterion) => {
          const score = scores.find((s) => s.criterionId === criterion.id)?.score || 0
          return (
            <div key={criterion.id}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">{criterion.name}</label>
                <span className="text-sm text-gray-400">
                  {score} / {criterion.maxScore}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={criterion.maxScore}
                step={1}
                value={score}
                onChange={(e) => updateScore(criterion.id, parseInt(e.target.value, 10))}
                className="w-full accent-[#D4AF37]"
              />
              <p className="text-xs text-gray-500 mt-1">{criterion.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-lg flex items-center gap-3">
        <CheckCircle className={`w-5 h-5 ${isPassed ? 'text-green-400' : 'text-red-400'}`} />
        <span className={`text-sm ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
          {isPassed
            ? 'Student meets rubric standards for this assessment.'
            : 'Student needs additional practice before passing this assessment.'}
        </span>
      </div>
    </div>
  )
}
