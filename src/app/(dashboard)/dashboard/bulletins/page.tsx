import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import StudentBulletinFeed from '@/components/messaging/StudentBulletinFeed'
import { loadStudentBulletins } from '@/app/communications/bulletin-actions'

export const dynamic = 'force-dynamic'

export default async function StudentBulletinsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, school_id, role')
    .eq('id', user.id)
    .single()

  if (
    !profile ||
    !profile.school_id ||
    !['student', 'apprentice'].includes(profile.role)
  ) {
    redirect('/dashboard')
  }

  const bulletinsResult = await loadStudentBulletins()
  const bulletins = bulletinsResult.success ? bulletinsResult.data : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Communications</h1>
          <p className="text-silver">School and instructor bulletins targeted to you.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/messages" className="rounded-lg border border-graphite px-4 py-2 text-sm text-silver">
            Messages
          </Link>
          <Link href="/dashboard/bulletins" className="rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black">
            Bulletins
          </Link>
        </div>
      </div>

      <StudentBulletinFeed initialBulletins={bulletins} />
    </div>
  )
}
