'use client'

import { useState } from 'react'
import { Grade, GradeCategory, Profile } from '@/types'
import { X } from 'lucide-react'
import { Button, Input, Select, Textarea, Card, Checkbox } from '@/components/ui'

interface GradeEntryFormProps {
  grade: Grade | null
  student: Profile | null
  categories: GradeCategory[]
  onSave: (grade: Grade) => void
  onClose: () => void
}

export default function GradeEntryForm({
  grade,
  student,
  categories,
  onSave,
  onClose,
}: GradeEntryFormProps) {
  const [score, setScore] = useState<number>(grade?.score ?? 0)
  const [maxScore, setMaxScore] = useState<number>(grade?.maxScore ?? 100)
  const [notes, setNotes] = useState(grade?.notes || '')
  const [categoryId, setCategoryId] = useState(grade?.categoryId || categories[0]?.id || '')
  const [isExcused, setIsExcused] = useState(grade?.isExcused ?? false)

  const selectedCategory = categories.find((c) => c.id === categoryId)
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 1000) / 10 : 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedCategory) return

    onSave({
      id: grade?.id || `grade-${Date.now()}`,
      studentId: student?.id || grade?.studentId || '',
      categoryId: selectedCategory.id,
      categoryType: selectedCategory.type,
      score,
      maxScore,
      percentage,
      weight: selectedCategory.weight,
      dateEntered: grade?.dateEntered || new Date().toISOString(),
      dateModified: grade ? new Date().toISOString() : null,
      instructorId: grade?.instructorId || 'demo-instructor',
      instructorName: grade?.instructorName || 'Demo Instructor',
      notes: notes || null,
      isExcused,
    })
  }

  if (!grade && categories.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card variant="default" padding="none" className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-graphite">
          <h2 className="text-lg font-semibold text-white">
            {grade?.id ? 'Edit Grade' : 'Add Grade'}
          </h2>
          <button onClick={onClose} className="text-silver hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {student && (
            <div>
              <label className="block text-sm text-silver mb-1">Student</label>
              <div className="text-white font-medium">{student.full_name}</div>
            </div>
          )}

          <div>
            <label htmlFor="category" className="block text-sm text-silver mb-1">
              Category
            </label>
            <Select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories
                .filter((c) => c.isActive)
                .map((c) => ({ value: c.id, label: `${c.name} (${Math.round(c.weight * 100)}%)` }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Score"
              id="score"
              type="number"
              min={0}
              step="0.1"
              value={score}
              onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
              required
            />
            <Input
              label="Max Score"
              id="maxScore"
              type="number"
              min={1}
              step="0.1"
              value={maxScore}
              onChange={(e) => setMaxScore(parseFloat(e.target.value) || 1)}
              required
            />
          </div>

          <Card variant="ghost" padding="sm">
            <div className="text-sm text-silver">Calculated Percentage</div>
            <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{percentage}%</div>
          </Card>

          <div>
            <label htmlFor="notes" className="block text-sm text-silver mb-1">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add optional notes..."
            />
          </div>

          <Checkbox
            label="Excused / Drop this grade"
            checked={isExcused}
            onChange={(e) => setIsExcused(e.target.checked)}
          />

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
              Save Grade
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
