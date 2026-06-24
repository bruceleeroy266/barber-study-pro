import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Assessment, AssessmentRubric } from '@/types'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoAssessments, demoAssessmentRubrics } from '@/lib/demo-data'
import AssessmentList from '@/components/assessments/AssessmentList'
import RubricBuilder from '@/components/assessments/RubricBuilder'

export default async function StudentAssessmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: assessmentsData } = await supabase
    .from('assessments')
    .select('*')
    .eq('student_id', user.id)

  let assessments: Assessment[] = (assessmentsData as unknown as Assessment[]) || []
  if (assessments.length === 0 && isDemoFallbackEnabled()) {
    assessments = demoAssessments.filter((a) => a.studentId === user.id)
  }

  const { data: profile } = await supabase.from('profiles').select('school_id').eq('id', user.id).single()
  const schoolId = profile?.school_id

  const { data: rubricsData } = await supabase
    .from('assessment_rubrics')
    .select('*')
    .eq('school_id', schoolId)

  let rubrics: AssessmentRubric[] = (rubricsData as unknown as AssessmentRubric[]) || []
  if (rubrics.length === 0 && isDemoFallbackEnabled()) {
    rubrics = demoAssessmentRubrics.filter((r) => r.schoolId === schoolId || !r.schoolId)
  }

  const passedCount = assessments.filter((a) => a.isPassed).length
  const failedCount = assessments.length - passedCount

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Assessments</h1>
        <p className="text-gray-400">Review your practical skill evaluations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-white">{assessments.length}</div>
          <div className="text-xs text-gray-400 mt-1">Total Assessments</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-green-400">{passedCount}</div>
          <div className="text-xs text-gray-400 mt-1">Passed</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-red-400">{failedCount}</div>
          <div className="text-xs text-gray-400 mt-1">Needs Practice</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-[#D4AF37]">
            {assessments.length > 0 ? Math.round((passedCount / assessments.length) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-400 mt-1">Pass Rate</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Assessment Records</h2>
        <AssessmentList assessments={assessments} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Rubrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rubrics.slice(0, 2).map((rubric) => (
            <RubricBuilder key={rubric.id} rubric={rubric} />
          ))}
        </div>
      </div>

      <div className="flex justify-start">
        <Link
          href="/dashboard/grades"
          className="text-[#D4AF37] hover:text-[#F4E4A6] text-sm font-medium"
        >
          Back to my grades →
        </Link>
      </div>
    </div>
  )
}
