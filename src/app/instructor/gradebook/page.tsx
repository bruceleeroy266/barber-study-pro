'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Grade, GradeCategory, Profile } from '@/types'
import { supabase } from '@/lib/supabase'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import {
  demoStudents,
  demoGradeCategories,
  demoGrades,
  getDemoGradeHistoryForGrade,
} from '@/lib/demo-data'
import { saveGrade } from './actions'
import { mapGradesFromDb, mapGradeCategoriesFromDb } from '@/lib/mappers/operational-data-mappers'
import GradebookTable from '@/components/gradebook/GradebookTable'
import GradeEntryForm from '@/components/gradebook/GradeEntryForm'
import GradeHistoryModal from '@/components/gradebook/GradeHistoryModal'
import CategoryWeightingPanel from '@/components/gradebook/CategoryWeightingPanel'
import ClassPerformanceReport from '@/components/reports/ClassPerformanceReport'
import { Loader2 } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'

export default function InstructorGradebookPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Profile[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [categories, setCategories] = useState<GradeCategory[]>([])
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [historyGrade, setHistoryGrade] = useState<Grade | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, school_id')
        .eq('id', authUser.id)
        .single()

      if (!profile || !isInstructorOrAdmin(profile.role)) {
        router.push('/dashboard')
        return
      }

      if (!profile.school_id) {
        router.push('/dashboard')
        return
      }

      const schoolId = profile.school_id

      const { data: studentsData } = await supabase
        .from('profiles')
        .select('*')
        .eq('school_id', schoolId)
        .in('role', ['student', 'apprentice'])

      let rosterStudents: Profile[] = (studentsData as Profile[]) || []
      if (rosterStudents.length === 0 && isDemoFallbackEnabled()) {
        rosterStudents = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
      }
      setStudents(rosterStudents)

      const studentIds = rosterStudents.map((s) => s.id)

      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('school_id', schoolId)
        .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])

      let gradeRecords: Grade[] = mapGradesFromDb(gradesData || [])
      if (gradeRecords.length === 0 && isDemoFallbackEnabled()) {
        gradeRecords = demoGrades.filter((g) => studentIds.includes(g.studentId))
      }
      setGrades(gradeRecords)

      const { data: categoriesData } = await supabase
        .from('grade_categories')
        .select('*')
        .or(`school_id.eq.${schoolId},school_id.is.null`)

      let categoryRecords: GradeCategory[] = mapGradeCategoriesFromDb(categoriesData || [])
      if (categoryRecords.length === 0 && isDemoFallbackEnabled()) {
        categoryRecords = demoGradeCategories.filter((c) => c.schoolId === schoolId || !c.schoolId)
      }
      setCategories(categoryRecords)

      setLoading(false)
    }

    init()
  }, [router])

  const selectedStudent = useMemo(() => {
    if (!editingGrade) return null
    return students.find((s) => s.id === editingGrade.studentId) || null
  }, [editingGrade, students])

  const historyRecords = useMemo(() => {
    if (!historyGrade) return []
    return getDemoGradeHistoryForGrade(historyGrade.id)
  }, [historyGrade])

  async function handleSaveGrade(grade: Grade) {
    setSaveError(null)

    if (isDemoFallbackEnabled()) {
      setGrades((prev) => {
        const exists = prev.find((g) => g.id === grade.id)
        if (exists) {
          return prev.map((g) => (g.id === grade.id ? grade : g))
        }
        return [grade, ...prev]
      })
      setEditingGrade(null)
      return
    }

    const result = await saveGrade(grade)
    if (!result.success || !result.grade) {
      setSaveError(result.message)
      return
    }

    setGrades((prev) => {
      const exists = prev.find((g) => g.id === result.grade!.id)
      if (exists) {
        return prev.map((g) => (g.id === result.grade!.id ? result.grade! : g))
      }
      return [result.grade!, ...prev]
    })
    setEditingGrade(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gradebook</h1>
          <p className="text-gray-400">Manage grades and view class performance</p>
        </div>

        {saveError && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg p-4">
            {saveError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Student Grades</h2>
              <GradebookTable
                students={students}
                grades={grades}
                categories={categories}
                onEditGrade={setEditingGrade}
                onViewHistory={setHistoryGrade}
              />
            </div>
          </div>

          <div className="space-y-6">
            <CategoryWeightingPanel categories={categories} />
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Class Report</h2>
              <ClassPerformanceReport
                students={students}
                grades={grades}
                categories={categories}
                assessments={[]}
              />
            </div>
          </div>
        </div>
      </div>

      {editingGrade && (
        <GradeEntryForm
          key={editingGrade.id || 'new-grade'}
          grade={editingGrade}
          student={selectedStudent}
          categories={categories}
          onSave={handleSaveGrade}
          onClose={() => setEditingGrade(null)}
        />
      )}

      {historyGrade && (
        <GradeHistoryModal
          grade={historyGrade}
          histories={historyRecords}
          onClose={() => setHistoryGrade(null)}
        />
      )}
    </div>
  )
}
