'use client'

import { useState, useTransition } from 'react'
import type { AuditLogEntry, AuditFilters, AuditHistoryResult, AuditLogResult } from '@/app/admin/audit/actions'
import type { SecurityEventType } from '@/lib/security/audit-logger'

const EVENT_TYPES: SecurityEventType[] = [
  'failed_login',
  'permission_denied',
  'unauthorized_page_access',
  'role_change',
  'sensitive_config_change',
  'school_isolation_violation',
  'id_or_attempt',
  'data_export',
  'session_expired',
  'logout',
]

const RESULTS: AuditLogResult[] = ['allowed', 'denied', 'blocked', 'success', 'failure']

interface AuditHistoryViewerProps {
  initialData: AuditHistoryResult
}

export default function AuditHistoryViewer({ initialData }: AuditHistoryViewerProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(initialData.logs)
  const [count, setCount] = useState(initialData.count)
  const [error, setError] = useState(initialData.error)
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState<AuditFilters>({
    dateFrom: '',
    dateTo: '',
    userId: '',
    schoolId: '',
    type: undefined,
    result: undefined,
    limit: 50,
    offset: 0,
  })

  async function handleSubmit(formData: FormData) {
    const nextFilters: AuditFilters = {
      dateFrom: (formData.get('dateFrom') as string) || undefined,
      dateTo: (formData.get('dateTo') as string) || undefined,
      userId: (formData.get('userId') as string) || undefined,
      schoolId: (formData.get('schoolId') as string) || undefined,
      type: (formData.get('type') as SecurityEventType) || undefined,
      result: (formData.get('result') as AuditLogResult) || undefined,
      limit: 50,
      offset: 0,
    }

    setFilters(nextFilters)

    startTransition(async () => {
      const { getAuditHistory } = await import('@/app/admin/audit/actions')
      const result = await getAuditHistory(nextFilters)
      setLogs(result.logs)
      setCount(result.count)
      setError(result.error)
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Audit History</h1>

      <form action={handleSubmit} className="bg-charcoal border border-graphite rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="dateFrom" className="block text-sm text-silver mb-1">Date From</label>
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              defaultValue={filters.dateFrom}
              className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-sm text-silver mb-1">Date To</label>
            <input
              id="dateTo"
              name="dateTo"
              type="date"
              defaultValue={filters.dateTo}
              className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="userId" className="block text-sm text-silver mb-1">User ID</label>
            <input
              id="userId"
              name="userId"
              type="text"
              defaultValue={filters.userId}
              placeholder="UUID"
              className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="schoolId" className="block text-sm text-silver mb-1">School ID</label>
            <input
              id="schoolId"
              name="schoolId"
              type="text"
              defaultValue={filters.schoolId}
              placeholder="UUID"
              className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm text-silver mb-1">Event Type</label>
            <select
              id="type"
              name="type"
              defaultValue={filters.type ?? ''}
              className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            >
              <option value="">All</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="result" className="block text-sm text-silver mb-1">Result</label>
            <select
              id="result"
              name="result"
              defaultValue={filters.result ?? ''}
              className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            >
              <option value="">All</option>
              {RESULTS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50"
          >
            {isPending ? 'Loading...' : 'Filter'}
          </button>
          <span className="text-sm text-silver">{count} total results</span>
        </div>
      </form>

      {error && (
        <div className="bg-charcoal/20 border border-silver/30 rounded-xl p-4 text-silver">
          {error}
        </div>
      )}

      <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-silver border-b border-graphite">
                <th className="p-4">Time</th>
                <th className="p-4">Type</th>
                <th className="p-4">Result</th>
                <th className="p-4">User</th>
                <th className="p-4">School</th>
                <th className="p-4">Resource</th>
                <th className="p-4">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-graphite/30">
                  <td className="p-4 text-light-gray whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-light-gray">{log.type}</td>
                  <td className="p-4">
                    <ResultBadge result={log.result} />
                  </td>
                  <td className="p-4 text-light-gray">
                    {log.email ?? log.user_id ?? '—'}
                  </td>
                  <td className="p-4 text-light-gray">{log.school_id ?? '—'}</td>
                  <td className="p-4 text-light-gray">
                    {log.resource ? `${log.resource}${log.resource_id ? ` (${log.resource_id.slice(0, 8)})` : ''}` : '—'}
                  </td>
                  <td className="p-4 text-silver max-w-xs truncate" title={log.reason ?? undefined}>
                    {log.reason ?? '—'}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !error && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-silver">
                    No audit log entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ResultBadge({ result }: { result: AuditLogResult }) {
  const classes: Record<AuditLogResult, string> = {
    allowed: 'bg-silver/10 text-silver border-silver/20',
    denied: 'bg-silver/10 text-silver border-silver/20',
    blocked: 'bg-silver/10 text-silver border-silver/20',
    success: 'bg-gold/10 text-gold border-gold/20',
    failure: 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes[result]}`}>
      {result}
    </span>
  )
}
