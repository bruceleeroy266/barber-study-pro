import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'
import { resolveProgramRequirementsForStudents } from '@/lib/programs/requirements'
import { logStudentHours } from '@/app/instructor/hours/actions'
import type { HourCategory } from '@/types'

const categories: HourCategory[] = [
  'Theory',
  'Practical',
  'Clinic',
  'Sanitation',
  'Makeup Hours',
  'Other',
]

function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

interface Props {
  returnTo: '/instructor/hours' | '/school/hours'
  backHref: '/instructor' | '/school'
  title?: string
  saved?: boolean
  error?: string | null
  highlightedStudentId?: string | null
}

export default async function StaffHoursManager({
  returnTo,
  backHref,
  title = 'Student Hours',
  saved = false,
  error = null,
  highlightedStudentId = null,
}: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !hasPermission(actor.role, 'manage_attendance')) {
    redirect('/dashboard')
  }

  const { data: studentsData } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('school_id', actor.school_id)
    .in('role', ['student', 'apprentice'])
    .order('full_name')

  const students = studentsData ?? []
  const studentIds = students.map((student) => student.id)

  const { data: logsData } = studentIds.length
    ? await supabase
        .from('hour_logs')
        .select('id, user_id, date, category, minutes, status, notes, created_at')
        .eq('school_id', actor.school_id)
        .in('user_id', studentIds)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
    : { data: [] }

  const logs = logsData ?? []
  const requirementMap = await resolveProgramRequirementsForStudents(
    supabase,
    actor.school_id,
    studentIds,
  )

  const rows = students.map((student) => {
    const studentLogs = logs.filter((log) => log.user_id === student.id)
    const approvedMinutes = studentLogs
      .filter((log) => log.status === 'approved')
      .reduce((sum, log) => sum + log.minutes, 0)
    const pendingMinutes = studentLogs
      .filter((log) => log.status === 'pending')
      .reduce((sum, log) => sum + log.minutes, 0)

    const requirements = requirementMap.get(student.id)
    const requiredHours = requirements?.requiredHours ?? 1200
    const requiredMinutes = requiredHours * 60
    const remainingMinutes = Math.max(0, requiredMinutes - approvedMinutes)
    const percentage = requiredMinutes > 0
      ? Math.min(100, Math.round((approvedMinutes / requiredMinutes) * 100))
      : 0

    return {
      ...student,
      approvedMinutes,
      pendingMinutes,
      requiredHours,
      remainingMinutes,
      percentage,
      recentLogs: studentLogs.slice(0, 5),
    }
  })

  const selectedId = highlightedStudentId && rows.some((row) => row.id === highlightedStudentId)
    ? highlightedStudentId
    : rows[0]?.id ?? ''

  const errorMessage =
    error === 'missing-fields' ? 'Choose a student and date.' :
    error === 'invalid-category' ? 'Choose a valid hour category.' :
    error === 'invalid-hours' ? 'Enter more than 0 and no more than 24 hours.' :
    error === 'student-not-found' ? 'That student is not in your school.' :
    error === 'save-failed' ? 'Hours could not be saved. Please try again.' :
    null

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href={backHref} className="text-sm text-[var(--color-brand-gold)] hover:underline">
              ← Back
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
            <p className="mt-1 text-silver">
              Log each student&apos;s school hours day by day. Totals are calculated per student.
            </p>
          </div>
        </div>

        {saved && (
          <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4 text-[var(--color-brand-gold)]">
            Hours saved and added to that student&apos;s approved total.
          </div>
        )}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {errorMessage}
          </div>
        )}

        <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Add Daily Hours</h2>
          <p className="mt-1 text-sm text-silver">
            Staff-entered hours are approved immediately and count toward the selected student&apos;s requirement.
          </p>

          <form action={logStudentHours} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <input type="hidden" name="returnTo" value={returnTo} />

            <label className="space-y-1 lg:col-span-2">
              <span className="text-sm text-silver">Student</span>
              <select
                name="studentId"
                defaultValue={selectedId}
                required
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
              >
                {rows.length === 0 && <option value="">No students available</option>}
                {rows.map((student) => (
                  <option key={student.id} value={student.id} className="bg-black text-white">
                    {student.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm text-silver">Date</span>
              <input
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-silver">Hours</span>
              <input
                name="hours"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                placeholder="7.5"
                required
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-silver">Category</span>
              <select
                name="category"
                defaultValue="Clinic"
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-black text-white">
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 md:col-span-2 lg:col-span-4">
              <span className="text-sm text-silver">Notes (optional)</span>
              <input
                name="notes"
                type="text"
                maxLength={500}
                placeholder="Example: Full school day / clinic floor"
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={rows.length === 0}
                className="w-full rounded-lg bg-[var(--color-brand-gold)] px-4 py-3 font-semibold text-black disabled:opacity-50"
              >
                Add Hours
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-xl font-semibold text-white">Individual Student Totals</h2>
            <p className="text-sm text-silver">Each student is tracked independently.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {rows.map((student) => (
              <article
                key={student.id}
                className={`rounded-xl border bg-charcoal p-5 ${
                  student.id === highlightedStudentId
                    ? 'border-[var(--color-brand-gold)]'
                    : 'border-graphite'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold text-white">{student.full_name}</h3>
                    <p className="break-all text-sm text-silver">{student.email}</p>
                  </div>
                  <div className="shrink-0 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-right">
                    <div className="text-lg font-bold text-[var(--color-brand-gold)]">{student.percentage}%</div>
                    <div className="text-xs text-silver">complete</div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-black p-3">
                    <div className="text-xs text-silver">Accumulated</div>
                    <div className="mt-1 text-xl font-bold text-white">{formatHours(student.approvedMinutes)}</div>
                  </div>
                  <div className="rounded-lg bg-black p-3">
                    <div className="text-xs text-silver">Required</div>
                    <div className="mt-1 text-xl font-bold text-white">{student.requiredHours}h</div>
                  </div>
                  <div className="rounded-lg bg-black p-3">
                    <div className="text-xs text-silver">Remaining</div>
                    <div className="mt-1 text-xl font-bold text-warm-bronze">{formatHours(student.remainingMinutes)}</div>
                  </div>
                  <div className="rounded-lg bg-black p-3">
                    <div className="text-xs text-silver">Pending</div>
                    <div className="mt-1 text-xl font-bold text-silver">{formatHours(student.pendingMinutes)}</div>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black">
                  <div
                    className="h-full rounded-full bg-[var(--color-brand-gold)]"
                    style={{ width: `${student.percentage}%` }}
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-2 text-sm font-medium text-white">Recent hour entries</div>
                  {student.recentLogs.length === 0 ? (
                    <p className="text-sm text-silver">No hours logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {student.recentLogs.map((log) => (
                        <div key={log.id} className="flex flex-col gap-1 rounded-lg border border-graphite bg-black p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="text-sm text-white">{log.date} · {log.category}</div>
                            {log.notes && <div className="text-xs text-silver">{log.notes}</div>}
                          </div>
                          <div className="text-sm font-semibold text-[var(--color-brand-gold)]">
                            {formatHours(log.minutes)} · {log.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}

            {rows.length === 0 && (
              <div className="rounded-xl border border-graphite bg-charcoal p-8 text-center text-silver">
                No students are assigned to this school yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
