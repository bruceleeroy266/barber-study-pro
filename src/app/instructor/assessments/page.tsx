'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile, Assessment, AssessmentRubric } from '@/types'
import { supabase } from '@/lib/supabase'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoStudents, demoAssessments, demoAssessmentRubrics } from '@/lib/demo-data'
import { saveAssessment } from './actions'
import { mapAssessmentsFromDb, mapAssessmentRubricsFromDb } from '@/lib/mappers/operational-data-mappers'
import AssessmentList from '@/components/assessments/AssessmentList'
import AssessmentForm from '@/components/assessments/AssessmentForm'
import { Loader2, Plus } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'

export default function InstructorAssessmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Profile[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [rubrics, setRubrics] = useState<AssessmentRubric[]>([])
  const [showForm, setShowForm] = useState(false)
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

      const { data: assessmentsData } = await supabase
        .from('assessments')
        .select('*')
        .eq('school_id', schoolId)
        .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])

      let assessmentRecords: Assessment[] = mapAssessmentsFromDb(assessmentsData || [])
      if (assessmentRecords.length === 0 && isDemoFallbackEnabled()) {
        assessmentRecords = demoAssessments.filter((a) => studentIds.includes(a.studentId))
      }
      setAssessments(assessmentRecords)

      const { data: rubricsData } = await supabase
        .from('assessment_rubrics')
        .select('*')
        .or(`school_id.eq.${schoolId},school_id.is.null`)

      let rubricRecords: AssessmentRubric[] = mapAssessmentRubricsFromDb(rubricsData || [])
      if (rubricRecords.length === 0 && isDemoFallbackEnabled()) {
        rubricRecords = demoAssessmentRubrics.filter((r) => r.schoolId === schoolId || !r.schoolId)
      }
      setRubrics(rubricRecords)

      setLoading(false)
    }

    init()
  }, [router])

  async function handleSaveAssessment(assessment: Assessment) {
    setSaveError(null)

    if (isDemoFallbackEnabled()) {
      setAssessments((prev) => [assessment, ...prev])
      setShowForm(false)
      return
    }

    const result = await saveAssessment(assessment)
    if (!result.success || !result.assessment) {
      setSaveError(result.message)
      return
    }

    setAssessments((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === result.assessment!.id)
      if (existingIndex >= 0) {
        const next = [...prev]
        next[existingIndex] = result.assessment!
        return next
      }
      return [result.assessment!, ...prev]
    })
    setShowForm(false)
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Practical Assessments</h1>
            <p className="text-gray-400">Evaluate student practical skills and track progress</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Assessment
          </button>
        </div>

        {saveError && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg p-4">
            {saveError}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Assessment Records</h2>
          <AssessmentList assessments={assessments} students={students} showStudentName />
        </div>
      </div>

      {showForm && (
        <AssessmentForm
          students={students}
          rubrics={rubrics}
          onSave={handleSaveAssessment}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
