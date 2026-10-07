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

      let profile: { id?: string; role: string; school_id: string | null } | null = null
      try {
        const supportResponse = await fetch('/api/support-context', { cache: 'no-store' })
        if (supportResponse.ok) {
          const support = await supportResponse.json()
          if (support?.supportActive && support?.effectiveProfile) {
            profile = support.effectiveProfile
          }
        }
      } catch {
        // Fall through to the authenticated profile.
      }

      if (!profile) {
        const { data: authenticatedProfile } = await supabase
          .from('profiles')
          .select('id, role, school_id')
          .eq('id', authUser.id)
          .single()
        profile = authenticatedProfile
      }

      if (!profile || !isInstructorOrAdmin(profile.role)) {
        router.push('/dashboard')
        return
      }

      const schoolId = profile.school_id
      if (!schoolId) {
        router.push('/dashboard')
        return
      }

      let assignedStudentIds: string[] | null = null
      if (profile.role === 'instructor' && profile.id) {
        const { data: assignments } = await supabase
          .from('student_instructor_assignments')
          .select('student_id')
          .eq('school_id', schoolId)
          .eq('instructor_id', profile.id)
          .eq('is_active', true)
          .is('ended_at', null)
        assignedStudentIds = (assignments ?? []).map((row) => row.student_id)
      }

      let studentsQuery = supabase
        .from('profiles')
        .select('*')
        .eq('school_id', schoolId)
        .in('role', ['student', 'apprentice'])

      if (assignedStudentIds) {
        studentsQuery = studentsQuery.in(
          'id',
          assignedStudentIds.length > 0 ? assignedStudentIds : ['__none__']
        )
      }

      const { data: studentsData } = await studentsQuery
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
      <div className="min-h-screen bg-[var(--color-background-primary)] flex items-center justify-center">
        <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
        <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Practical Assessments</h1>
            <p className="text-[var(--color-text-muted)]">Evaluate student practical skills and track progress</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-light)] text-black font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Assessment
          </button>
        </div>

        {saveError && (
          <div className="bg-charcoal/30 border border-silver/50 text-silver rounded-lg p-4">
            {saveError}
          </div>
        )}

        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-5">
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
