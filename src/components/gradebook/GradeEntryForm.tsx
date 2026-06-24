'use client'

import { useState } from 'react'
import { Grade, GradeCategory, Profile } from '@/types'
import { X } from 'lucide-react'

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
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            {grade?.id ? 'Edit Grade' : 'Add Grade'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {student && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Student</label>
              <div className="text-white font-medium">{student.full_name}</div>
            </div>
          )}

          <div>
            <label htmlFor="category" className="block text-sm text-gray-400 mb-1">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            >
              {categories
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({Math.round(c.weight * 100)}%)
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="score" className="block text-sm text-gray-400 mb-1">
                Score
              </label>
              <input
                id="score"
                type="number"
                min={0}
                step="0.1"
                value={score}
                onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
              />
            </div>
            <div>
              <label htmlFor="maxScore" className="block text-sm text-gray-400 mb-1">
                Max Score
              </label>
              <input
                id="maxScore"
                type="number"
                min={1}
                step="0.1"
                value={maxScore}
                onChange={(e) => setMaxScore(parseFloat(e.target.value) || 1)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
              />
            </div>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-400">Calculated Percentage</div>
            <div className="text-2xl font-bold text-[#D4AF37]">{percentage}%</div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm text-gray-400 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              placeholder="Add optional notes..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isExcused}
              onChange={(e) => setIsExcused(e.target.checked)}
              className="rounded border-gray-700 bg-gray-950 text-[#D4AF37] focus:ring-[#D4AF37]"
            />
            Excused / Drop this grade
          </label>

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
              Save Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
