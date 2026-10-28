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
    <main className="mx-auto w-full max-w-5xl min-w-0 space-y-5 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <Link href="/instructor" className="text-sm text-amber-400 underline">Back to instructor dashboard</Link>
      <h1 className="break-words text-2xl font-bold sm:text-3xl">Exam Coaching Center</h1>
      <p className="text-gray-400">Find a student in your assigned roster to search their completed Exam Ready questions by keyword, question number or theory topic. View teaching hints and instructor-only explanations.</p>
      <div className="min-w-0 space-y-3 rounded-xl border border-amber-500/40 p-4 sm:p-6">
        <h2 className="text-xl font-semibold">Student-specific question search</h2>
        <p className="text-sm text-gray-400">Only finalized attempts are available. Secure exam questions are not exposed as a school-wide searchable answer bank. No answer keys are available for an active test.</p>
        <Link href="/instructor" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-center font-semibold text-black sm:w-auto">Choose an assigned student</Link>
      </div>
    </main>
  )
}
