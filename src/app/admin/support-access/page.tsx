import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isPlatformAdminProfile } from '@/lib/auth-helpers'
import BackButton from '@/components/ui/BackButton'
import { GraduationCap, School, ShieldCheck } from 'lucide-react'
import { startSupportMode } from './actions'

interface SupportAccessPageProps {
  searchParams: Promise<{ q?: string; error?: string }>
}

interface SupportStaffRow {
  id: string
  full_name: string
  email: string
  role: string
  school_id: string | null
  approval_status: string
  is_disabled: boolean
  schools: { name?: string } | null
}

export default async function AdminSupportAccessPage({ searchParams }: SupportAccessPageProps) {
  const { q, error: supportError } = await searchParams
  const search = (q ?? '').trim().toLowerCase()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: caller } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  // This is intentionally platform-admin-only. School admins must never gain
  // cross-tenant support access through this surface.
  if (!caller || !isPlatformAdminProfile(caller)) {
    redirect('/admin')
  }

  const { data: staff, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, school_id, approval_status, is_disabled, schools(name)')
    .in('role', ['instructor', 'school_admin', 'admin'])
    .not('school_id', 'is', null)
    .order('full_name')

  const rows = ((staff ?? []) as unknown as SupportStaffRow[])
    .filter((row) => !row.is_disabled)
    .filter((row) => {
      if (!search) return true
      const haystack = [
        row.full_name,
        row.email,
        row.role,
        row.schools?.name ?? '',
      ].join(' ').toLowerCase()
      return haystack.includes(search)
    })

  const instructors = rows.filter((row) => row.role === 'instructor')
  const schoolAdmins = rows.filter((row) => row.role === 'school_admin' || row.role === 'admin')

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />

        <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-gold)]" />
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">Support Access</h1>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Platform-admin support center for opening instructor and school-admin dashboards
                without changing your own ASCYN PRO administrator login.
              </p>
            </div>
          </div>
        </div>

        <form className="flex gap-2" action="/admin/support-access">
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search instructor, admin, school, or email"
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] px-4 py-3 text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-brand-gold)] px-5 py-3 font-semibold text-black"
          >
            Search
          </button>
        </form>

        {(error || supportError) && (
          <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {supportError ? decodeURIComponent(supportError) : 'Staff dashboards could not be loaded. Please try again.'}
          </div>
        )}

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[var(--color-brand-gold)]" />
            <h2 className="text-xl font-semibold text-white">Instructor Dashboards ({instructors.length})</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {instructors.map((row) => (
              <div key={row.id} className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
                <div className="font-semibold text-white">{row.full_name || 'Instructor'}</div>
                <div className="mt-1 break-all text-sm text-[var(--color-text-muted)]">{row.email}</div>
                <div className="mt-2 text-sm text-[var(--color-text-muted)]">{row.schools?.name ?? 'School unavailable'}</div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs capitalize text-[var(--color-text-muted)]">{row.approval_status}</span>
                  <form action={startSupportMode}>
                    <input type="hidden" name="targetProfileId" value={row.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm font-medium text-[var(--color-brand-gold)]"
                    >
                      Enter Support Mode
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-[var(--color-brand-gold)]" />
            <h2 className="text-xl font-semibold text-white">School Admin Dashboards ({schoolAdmins.length})</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {schoolAdmins.map((row) => (
              <div key={row.id} className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-5">
                <div className="font-semibold text-white">{row.full_name || 'School Administrator'}</div>
                <div className="mt-1 break-all text-sm text-[var(--color-text-muted)]">{row.email}</div>
                <div className="mt-2 text-sm text-[var(--color-text-muted)]">{row.schools?.name ?? 'School unavailable'}</div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs capitalize text-[var(--color-text-muted)]">{row.approval_status}</span>
                  {row.school_id && (
                    <form action={startSupportMode}>
                      <input type="hidden" name="targetProfileId" value={row.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm font-medium text-[var(--color-brand-gold)]"
                      >
                        Enter Support Mode
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
