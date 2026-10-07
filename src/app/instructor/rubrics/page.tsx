import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AssessmentRubric } from '@/types'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoAssessmentRubrics } from '@/lib/demo-data'
import RubricBuilder from '@/components/assessments/RubricBuilder'
import RubricEvaluator from '@/components/assessments/RubricEvaluator'
import { mapAssessmentRubricsFromDb } from '@/lib/mappers/operational-data-mappers'
import BackButton from '@/components/ui/BackButton'
import { resolveSupportAccessContext } from '@/lib/support-access'

export default async function InstructorRubricsPage() {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!isInstructorOrAdmin(profile.role)) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  const schoolId = profile.school_id

  const { data: rubricsData } = await supabase
    .from('assessment_rubrics')
    .select('*')
    .or(`school_id.eq.${schoolId},school_id.is.null`)

  let rubrics: AssessmentRubric[] = mapAssessmentRubricsFromDb(rubricsData || []) || []
  if (rubrics.length === 0 && isDemoFallbackEnabled()) {
    rubrics = demoAssessmentRubrics.filter((r) => r.schoolId === schoolId || !r.schoolId)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
        <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assessment Rubrics</h1>
          <p className="text-[var(--color-text-muted)]">Review rubric criteria and practice evaluation</p>
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
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-8 text-center text-[var(--color-text-muted)]">
            No rubrics found.
          </div>
        )}
      </div>
    </div>
  )
}
