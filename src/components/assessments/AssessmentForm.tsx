'use client'

import { useState } from 'react'
import { Assessment, AssessmentType, ScoringType, QualitativeResult, Profile, AssessmentRubric } from '@/types'
import { calculatePassFail } from '@/lib/assessments'
import { X } from 'lucide-react'
import { Button, Input, Select, Textarea, Card } from '@/components/ui'

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
      <Card variant="default" padding="none" className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-graphite">
          <h2 className="text-lg font-semibold text-white">Add Practical Assessment</h2>
          <button onClick={onClose} className="text-silver hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="student" className="block text-sm text-silver mb-1">
              Student
            </label>
            <Select
              id="student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              options={students.map((s) => ({ value: s.id, label: s.full_name || '' }))}
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm text-silver mb-1">
              Assessment Type
            </label>
            <Select
              id="type"
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
              options={[
                { value: 'HAIRCUT', label: 'Haircut' },
                { value: 'COLOR', label: 'Color' },
                { value: 'CHEMICAL', label: 'Chemical' },
                { value: 'SANITATION', label: 'Sanitation' },
                { value: 'CONSULTATION', label: 'Consultation' },
              ]}
              required
            />
          </div>

          <div>
            <label htmlFor="scoring" className="block text-sm text-silver mb-1">
              Scoring Type
            </label>
            <Select
              id="scoring"
              value={scoringType}
              onChange={(e) => setScoringType(e.target.value as ScoringType)}
              options={[
                { value: 'NUMERIC', label: 'Numeric' },
                { value: 'QUALITATIVE', label: 'Qualitative' },
              ]}
            />
          </div>

          {scoringType === 'NUMERIC' ? (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Score"
                id="score"
                type="number"
                min={0}
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                required
              />
              <Input
                label="Max Score"
                id="max"
                type="number"
                min={1}
                value={maxScore}
                onChange={(e) => setMaxScore(parseFloat(e.target.value) || 1)}
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="qualitative" className="block text-sm text-silver mb-1">
                Result
              </label>
              <Select
                id="qualitative"
                value={qualitativeResult}
                onChange={(e) => setQualitativeResult(e.target.value as QualitativeResult)}
                options={[
                  { value: 'PASS', label: 'Pass' },
                  { value: 'NEEDS_IMPROVEMENT', label: 'Needs Improvement' },
                  { value: 'FAIL', label: 'Fail' },
                ]}
              />
            </div>
          )}

          <Card variant="ghost" padding="sm">
            <div className="text-sm text-silver">Result</div>
            <div className={`text-2xl font-bold ${isPassed ? 'text-gold' : 'text-silver'}`}>
              {isPassed ? 'Passed' : 'Not Passed'}
            </div>
            {scoringType === 'NUMERIC' && (
              <div className="text-xs text-silver-gray">{percentage}%</div>
            )}
          </Card>

          <div>
            <label htmlFor="feedback" className="block text-sm text-silver mb-1">
              Feedback
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Enter detailed feedback..."
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              Save Assessment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
