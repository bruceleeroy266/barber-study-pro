import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { isAdmin } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  category?: string
  severity?: string
}>

const categories = ['all', 'bug', 'feature', 'ux', 'content', 'other'] as const
const severities = ['all', 'low', 'medium', 'high', 'critical'] as const

export default async function BetaFeedbackAdminPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdmin(profile.role)) {
    redirect('/admin')
  }

  const category = categories.includes((params.category || 'all') as typeof categories[number])
    ? (params.category || 'all')
    : 'all'
  const severity = severities.includes((params.severity || 'all') as typeof severities[number])
    ? (params.severity || 'all')
    : 'all'

  const service = createServiceRoleClient()
  let query = service
    .from('beta_feedback')
    .select('id, user_id, checklist_item_id, category, severity, message, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (category !== 'all') query = query.eq('category', category)
  if (severity !== 'all') query = query.eq('severity', severity)

  const { data: feedback, error } = await query

  const userIds = Array.from(
    new Set((feedback ?? []).map((item) => item.user_id).filter(Boolean)),
  ) as string[]

  const { data: submitters } = userIds.length > 0
    ? await service
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds)
    : { data: [] as Array<{ id: string; full_name: string | null; email: string | null }> }

  const submitterMap = new Map(
    (submitters ?? []).map((submitter) => [submitter.id, submitter]),
  )

  const counts = (feedback ?? []).reduce(
    (acc, item) => {
      acc.total += 1
      acc[item.severity as 'low' | 'medium' | 'high' | 'critical'] += 1
      return acc
    },
    { total: 0, low: 0, medium: 0, high: 0, critical: 0 },
  )

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Beta Tester Feedback</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Review feedback submitted from the production beta checklist.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ['Total', counts.total],
            ['Critical', counts.critical],
            ['High', counts.high],
            ['Medium', counts.medium],
            ['Low', counts.low],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-[var(--color-border-primary)] p-4">
              <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{value}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Category</span>
          {categories.map((value) => (
            <Link
              key={value}
              href={`/admin/beta-feedback?category=${value}&severity=${severity}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                category === value
                  ? 'border-[var(--color-brand-gold)] text-[var(--color-brand-gold)]'
                  : 'border-[var(--color-border-primary)] text-[var(--color-text-muted)]'
              }`}
            >
              {value === 'all' ? 'All' : value.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Severity</span>
          {severities.map((value) => (
            <Link
              key={value}
              href={`/admin/beta-feedback?category=${category}&severity=${value}`}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                severity === value
                  ? 'border-[var(--color-brand-gold)] text-[var(--color-brand-gold)]'
                  : 'border-[var(--color-border-primary)] text-[var(--color-text-muted)]'
              }`}
            >
              {value === 'all' ? 'All' : value.toUpperCase()}
            </Link>
          ))}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            Could not load feedback: {error.message}
          </div>
        ) : (feedback ?? []).length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border-primary)] p-8 text-center text-[var(--color-text-muted)]">
            No feedback matches these filters yet.
          </div>
        ) : (
          <div className="space-y-4">
            {(feedback ?? []).map((item) => {
              const submitter = item.user_id ? submitterMap.get(item.user_id) : null
              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-2 py-1 text-xs font-semibold uppercase text-[var(--color-brand-gold)]">
                          {item.category}
                        </span>
                        <span className="rounded-md border border-[var(--color-border-primary)] px-2 py-1 text-xs font-semibold uppercase text-white">
                          {item.severity}
                        </span>
                      </div>
                      <p className="mt-3 font-medium text-white">
                        {submitter?.full_name || submitter?.email || 'Beta tester'}
                      </p>
                      {submitter?.email && (
                        <p className="text-sm text-[var(--color-text-muted)]">{submitter.email}</p>
                      )}
                    </div>
                    <time className="text-sm text-[var(--color-text-muted)]">
                      {new Date(item.created_at).toLocaleString('en-US', {
                        timeZone: 'America/Chicago',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>

                  {item.checklist_item_id && (
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      Checklist item: {item.checklist_item_id}
                    </p>
                  )}

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-silver">
                    {item.message}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
