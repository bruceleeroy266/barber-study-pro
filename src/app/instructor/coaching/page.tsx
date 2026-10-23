import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function InstructorCoachingCenter() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile, error } = await supabase.from('profiles')
    .select('id,role,approval_status,is_disabled')
    .eq('id',user.id).single()
  if (error || !profile || profile.role !== 'instructor' ||
      profile.approval_status !== 'approved' || profile.is_disabled) notFound()
  return (
    <main className="mx-auto max-w-4xl space-y-5 p-6">
      <Link href="/instructor" className="text-sm text-amber-400 underline">Back to instructor dashboard</Link>
      <h1 className="text-3xl font-bold">Exam Coaching Center</h1>
      <p className="text-gray-400">Find a student in your assigned roster to search their completed Exam Ready questions by keyword, question number or theory topic. View teaching hints and instructor-only explanations.</p>
      <div className="rounded-xl border border-amber-500/40 p-5 space-y-3">
        <h2 className="text-xl font-semibold">Student-specific question search</h2>
        <p className="text-sm text-gray-400">Only finalized attempts are available. Secure exam questions are not exposed as a school-wide searchable answer bank. No answer keys are available for an active test.</p>
        <Link href="/instructor" className="inline-flex min-h-11 items-center rounded-lg bg-amber-500 px-5 py-3 font-semibold text-black">Choose an assigned student</Link>
      </div>
    </main>
  )
}
