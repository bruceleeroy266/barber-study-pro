import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AssessmentRubric } from '@/types'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoAssessmentRubrics } from '@/lib/demo-data'
import RubricBuilder from '@/components/assessments/RubricBuilder'
import RubricEvaluator from '@/components/assessments/RubricEvaluator'

export default async function InstructorRubricsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) redirect('/dashboard')

  const schoolId = profile.school_id

  const { data: rubricsData } = await supabase
    .from('assessment_rubrics')
    .select('*')
    .eq('school_id', schoolId)

  let rubrics: AssessmentRubric[] = (rubricsData as unknown as AssessmentRubric[]) || []
  if (rubrics.length === 0 && isDemoFallbackEnabled()) {
    rubrics = demoAssessmentRubrics.filter((r) => r.schoolId === schoolId || !r.schoolId)
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assessment Rubrics</h1>
          <p className="text-gray-400">Review rubric criteria and practice evaluation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rubrics.map((rubric) => (
            <RubricBuilder key={rubric.id} rubric={rubric} />
          ))}
          {rubrics.map((rubric) => (
            <RubricEvaluator key={`eval-${rubric.id}`} rubric={rubric} />
          ))}
        </div>

        {rubrics.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
            No rubrics found.
          </div>
        )}
      </div>
    </div>
  )
}
