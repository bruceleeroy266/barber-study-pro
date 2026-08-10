'use client'

import { useMemo, useState } from 'react'
import { Grade, GradeCategory, Profile } from '@/types'
import { calculateCategoryAverage, getLetterGrade, getGradeColorClass } from '@/lib/gradebook'
import { History } from 'lucide-react'

interface GradebookTableProps {
  students: Profile[]
  grades: Grade[]
  categories: GradeCategory[]
  onEditGrade?: (grade: Grade) => void
  onViewHistory?: (grade: Grade) => void
}

const emptyGrade = (studentId: string, category: GradeCategory): Grade => ({
  id: '',
  studentId,
  categoryId: category.id,
  categoryType: category.type,
  score: 0,
  maxScore: 100,
  percentage: 0,
  weight: category.weight,
  dateEntered: new Date().toISOString(),
  instructorId: '',
  instructorName: '',
  isExcused: false,
})

export default function GradebookTable({
  students,
  grades,
  categories,
  onEditGrade,
  onViewHistory,
}: GradebookTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [students, searchQuery])

  const visibleCategories = useMemo(() => {
    return selectedCategory === 'all'
      ? categories.filter((c) => c.isActive)
      : categories.filter((c) => c.id === selectedCategory)
  }, [categories, selectedCategory])

  function getGrade(studentId: string, categoryId: string): Grade | undefined {
    return grades
      .filter((g) => g.studentId === studentId && g.categoryId === categoryId)
      .sort((a, b) => new Date(b.dateEntered).getTime() - new Date(a.dateEntered).getTime())[0]
  }

  function getCategoryAverage(categoryId: string): number {
    return calculateCategoryAverage(grades.filter((g) => g.categoryId === categoryId && !g.isExcused))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="gradebook-search" className="sr-only">
            Search students
          </label>
          <input
            id="gradebook-search"
            type="search"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-2 text-white placeholder-silver-gray focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
          />
        </div>
        <div>
          <label htmlFor="gradebook-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="gradebook-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((c) => c.isActive)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-graphite rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-silver border-b border-graphite bg-charcoal">
              <th className="p-4 sticky left-0 bg-charcoal min-w-[180px]">Student</th>
              {visibleCategories.map((c) => (
                <th key={c.id} className="p-4 min-w-[140px]">
                  <div>{c.name}</div>
                  <div className="text-xs text-silver-gray">{Math.round(c.weight * 100)}% avg</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-graphite/30">
                <td className="p-4 sticky left-0 bg-black">
                  <div className="font-medium text-white">{student.full_name}</div>
                  <div className="text-xs text-silver-gray">{student.email}</div>
                </td>
                {visibleCategories.map((category) => {
                  const grade = getGrade(student.id, category.id)
                  return (
                    <td key={category.id} className="p-4 align-top">
                      {grade ? (
                        <button
                          onClick={() => onEditGrade?.(grade)}
                          className="text-left group"
                        >
                          <div className={`text-lg font-bold ${getGradeColorClass(grade.percentage)}`}>
                            {grade.percentage}%
                          </div>
                          <div className="text-xs text-silver-gray">
                            {grade.score}/{grade.maxScore} · {getLetterGrade(grade.percentage)}
                          </div>
                          {grade.notes && (
                            <div className="text-xs text-silver-gray truncate max-w-[120px]">{grade.notes}</div>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => onEditGrade?.(emptyGrade(student.id, category))}
                          className="text-silver-gray hover:text-[var(--color-brand-gold)] text-sm"
                        >
                          + Add grade
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan={visibleCategories.length + 1}
                  className="p-8 text-center text-silver-gray"
                >
                  No students match your search.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t border-graphite bg-charcoal/50">
            <tr className="text-silver">
              <td className="p-4 sticky left-0 bg-charcoal/50 font-medium">Class Average</td>
              {visibleCategories.map((c) => (
                <td key={c.id} className="p-4">
                  <span className={`font-bold ${getGradeColorClass(getCategoryAverage(c.id))}`}>
                    {getCategoryAverage(c.id)}%
                  </span>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {onViewHistory && (
        <div className="flex justify-end">
          <button
            onClick={() => onViewHistory(grades[0])}
            disabled={grades.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-graphite hover:bg-[var(--color-border-secondary)] text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <History className="w-4 h-4" />
            View Sample History
          </button>
        </div>
      )}
    </div>
  )
}
