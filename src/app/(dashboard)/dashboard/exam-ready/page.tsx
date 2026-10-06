import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getRoleBasedRedirect, validateLoginAccess } from '@/lib/auth-access'
import BackButton from '@/components/ui/BackButton'
import ExamShell from '@/components/comprehensive-exam/ExamShell'

export default async function ExamReadyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard/exam-ready')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, approval_status, is_disabled')
    .eq('id', user.id)
    .single()

  const access = validateLoginAccess(profile)
  if (!access.ok) redirect(`/login?error=${access.errorKey ?? 'unknown'}`)

  if (profile.role !== 'student' && profile.role !== 'apprentice') {
    redirect(getRoleBasedRedirect(profile.role))
  }

  return (
    <div className="space-y-6">
      <BackButton fallbackHref="/dashboard" label="Back to dashboard" />
      <div>
        <h1 className="text-3xl font-bold text-white">Exam Ready</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Timed comprehensive practice with saved answers, review flags, results, and attempt history.
        </p>
      </div>
      <ExamShell />
    </div>
  )
}
