'use client'

import { useState } from 'react'
import { Assessment, AssessmentType, ScoringType, QualitativeResult, Profile, AssessmentRubric } from '@/types'
import { calculatePassFail } from '@/lib/assessments'
import { X } from 'lucide-react'

interface AssessmentFormProps {
  students: Profile[]
  rubrics: AssessmentRubric[]
  onSave: (assessment: Assessment) => void
  onClose: () => void
}

export default function AssessmentForm({ students, rubrics, onSave, onClose }: AssessmentFormProps) {
  const [studentId, setStudentId] = useState(students[0]?.id || '')
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('HAIRCUT')
  const [scoringType, setScoringType] = useState<ScoringType>('NUMERIC')
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(100)
  const [qualitativeResult, setQualitativeResult] = useState<QualitativeResult>('PASS')
  const [feedback, setFeedback] = useState('')

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 1000) / 10 : 0
  const isPassed = scoringType === 'NUMERIC' ? calculatePassFail(score, maxScore) : qualitativeResult === 'PASS'
  const rubric = rubrics.find((r) => r.assessmentType === assessmentType)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    onSave({
      id: `assessment-${Date.now()}`,
      studentId,
      assessmentType,
      score: scoringType === 'NUMERIC' ? score : 0,
      scoringType,
      qualitativeResult: scoringType === 'QUALITATIVE' ? qualitativeResult : null,
      feedback,
      assessmentDate: new Date().toISOString(),
      evaluatorId: 'demo-instructor',
      evaluatorName: 'Demo Instructor',
      rubricId: rubric?.id || '',
      isPassed,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Add Practical Assessment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="student" className="block text-sm text-gray-400 mb-1">
              Student
            </label>
            <select
              id="student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm text-gray-400 mb-1">
              Assessment Type
            </label>
            <select
              id="type"
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            >
              <option value="HAIRCUT">Haircut</option>
              <option value="COLOR">Color</option>
              <option value="CHEMICAL">Chemical</option>
              <option value="SANITATION">Sanitation</option>
              <option value="CONSULTATION">Consultation</option>
            </select>
          </div>

          <div>
            <label htmlFor="scoring" className="block text-sm text-gray-400 mb-1">
              Scoring Type
            </label>
            <select
              id="scoring"
              value={scoringType}
              onChange={(e) => setScoringType(e.target.value as ScoringType)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="NUMERIC">Numeric</option>
              <option value="QUALITATIVE">Qualitative</option>
            </select>
          </div>

          {scoringType === 'NUMERIC' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="score" className="block text-sm text-gray-400 mb-1">
                  Score
                </label>
                <input
                  id="score"
                  type="number"
                  min={0}
                  value={score}
                  onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label htmlFor="max" className="block text-sm text-gray-400 mb-1">
                  Max Score
                </label>
                <input
                  id="max"
                  type="number"
                  min={1}
                  value={maxScore}
                  onChange={(e) => setMaxScore(parseFloat(e.target.value) || 1)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="qualitative" className="block text-sm text-gray-400 mb-1">
                Result
              </label>
              <select
                id="qualitative"
                value={qualitativeResult}
                onChange={(e) => setQualitativeResult(e.target.value as QualitativeResult)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="PASS">Pass</option>
                <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                <option value="FAIL">Fail</option>
              </select>
            </div>
          )}

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400">Result</div>
            <div className={`text-2xl font-bold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {isPassed ? 'Passed' : 'Not Passed'}
            </div>
            {scoringType === 'NUMERIC' && (
              <div className="text-xs text-gray-500">{percentage}%</div>
            )}
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm text-gray-400 mb-1">
              Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Enter detailed feedback..."
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-semibold rounded-lg transition-colors"
            >
              Save Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
