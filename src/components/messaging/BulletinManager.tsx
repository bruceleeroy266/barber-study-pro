'use client'

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Archive, Megaphone, Pin, Users } from 'lucide-react'
import {
  archiveBulletin,
  loadBulletinAcknowledgments,
  publishBulletin,
  type ProductionBulletin,
} from '@/app/communications/bulletin-actions'

export interface BulletinAudienceOption {
  id: string
  name: string
  kind: 'student' | 'program'
}

interface BulletinManagerProps {
  role: 'instructor' | 'admin' | 'school_admin'
  initialBulletins: ProductionBulletin[]
  audienceOptions: BulletinAudienceOption[]
}

export default function BulletinManager({
  role,
  initialBulletins,
  audienceOptions,
}: BulletinManagerProps) {
  const [bulletins, setBulletins] = useState(initialBulletins)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal')
  const [isPinned, setIsPinned] = useState(false)
  const [ackRequired, setAckRequired] = useState(false)
  const [publishAt, setPublishAt] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [audienceMode, setAudienceMode] = useState<'school' | 'program' | 'student'>(
    role === 'instructor' ? 'student' : 'school'
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [ackDetails, setAckDetails] = useState<Record<string, Array<{ studentId: string; acknowledgedAt: string }>>>({})
  const [isPending, startTransition] = useTransition()
  const publishOperationIdRef = useRef<string | null>(null)

  useEffect(() => {
    publishOperationIdRef.current = null
  }, [
    title,
    body,
    priority,
    isPinned,
    ackRequired,
    publishAt,
    expiresAt,
    audienceMode,
    selectedIds,
  ])

  const filteredOptions = useMemo(
    () => audienceOptions.filter((option) => option.kind === audienceMode),
    [audienceMode, audienceOptions]
  )

  const handlePublish = (event: FormEvent) => {
    event.preventDefault()

    const audiences =
      audienceMode === 'school'
        ? [{ type: 'school' as const }]
        : selectedIds.map((id) =>
            audienceMode === 'program'
              ? { type: 'program' as const, programId: id }
              : { type: 'student' as const, studentId: id }
          )

    startTransition(() => {
      void (async () => {
        setError(null)
        const operationId =
          publishOperationIdRef.current ?? crypto.randomUUID()
        publishOperationIdRef.current = operationId

        const result = await publishBulletin({
          title,
          body,
          priority,
          isPinned,
          acknowledgmentRequired: ackRequired,
          publishAt: publishAt ? new Date(publishAt).toISOString() : null,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          audiences,
        }, operationId)

        if (!result.success) {
          setError(result.message)
          return
        }

        publishOperationIdRef.current = null
        setBulletins((current) =>
          current.some((bulletin) => bulletin.id === result.data.id)
            ? current
            : [result.data, ...current]
        )
        setTitle('')
        setBody('')
        setPriority('normal')
        setIsPinned(false)
        setAckRequired(false)
        setPublishAt('')
        setExpiresAt('')
        setSelectedIds([])
      })()
    })
  }

  const loadAcknowledgments = (bulletinId: string) => {
    startTransition(() => {
      void (async () => {
        setError(null)
        const result = await loadBulletinAcknowledgments(bulletinId)
        if (!result.success) {
          setError(result.message)
          return
        }
        setAckDetails((current) => ({ ...current, [bulletinId]: result.data }))
      })()
    })
  }

  const handleArchive = (bulletinId: string) => {
    startTransition(() => {
      void (async () => {
        const result = await archiveBulletin(bulletinId)
        if (!result.success) {
          setError(result.message)
          return
        }
        setBulletins((current) =>
          current.map((bulletin) =>
            bulletin.id === bulletinId
              ? { ...bulletin, status: 'archived' }
              : bulletin
          )
        )
      })()
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handlePublish} className="bg-charcoal border border-graphite rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Publish bulletin</h2>
          <p className="text-sm text-silver">Create a one-way announcement for an authorized audience.</p>
        </div>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={160}
          placeholder="Bulletin title"
          className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white"
          required
        />

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={10000}
          rows={5}
          placeholder="Bulletin message"
          className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-3 text-white resize-y"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as typeof priority)}
            className="bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
          >
            <option value="normal">Normal</option>
            <option value="important">Important</option>
            <option value="urgent">Urgent</option>
          </select>

          <input
            type="datetime-local"
            value={publishAt}
            onChange={(event) => setPublishAt(event.target.value)}
            className="bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            aria-label="Publish time"
          />

          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => setExpiresAt(event.target.value)}
            className="bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white"
            aria-label="Expiration time"
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2 text-silver">
            <input type="checkbox" checked={isPinned} onChange={(event) => setIsPinned(event.target.checked)} />
            Pin bulletin
          </label>
          <label className="inline-flex items-center gap-2 text-silver">
            <input type="checkbox" checked={ackRequired} onChange={(event) => setAckRequired(event.target.checked)} />
            Require acknowledgment
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {role !== 'instructor' && (
              <>
                <button type="button" onClick={() => { setAudienceMode('school'); setSelectedIds([]) }} className="px-3 py-2 rounded-lg border border-graphite text-sm text-white">
                  School
                </button>
                <button type="button" onClick={() => { setAudienceMode('program'); setSelectedIds([]) }} className="px-3 py-2 rounded-lg border border-graphite text-sm text-white">
                  Program
                </button>
              </>
            )}
            <button type="button" onClick={() => { setAudienceMode('student'); setSelectedIds([]) }} className="px-3 py-2 rounded-lg border border-graphite text-sm text-white">
              Selected students
            </button>
          </div>

          {audienceMode !== 'school' && (
            <div className="max-h-48 overflow-y-auto rounded-lg border border-graphite divide-y divide-graphite">
              {filteredOptions.length === 0 ? (
                <p className="p-4 text-sm text-silver-gray">No authorized {audienceMode} targets available.</p>
              ) : (
                filteredOptions.map((option) => (
                  <label key={option.id} className="flex items-center gap-3 p-3 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option.id)}
                      onChange={(event) =>
                        setSelectedIds((current) =>
                          event.target.checked
                            ? [...current, option.id]
                            : current.filter((id) => id !== option.id)
                        )
                      }
                    />
                    {option.name}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isPending ||
            !title.trim() ||
            !body.trim() ||
            (audienceMode !== 'school' && selectedIds.length === 0)
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2.5 font-semibold text-black disabled:opacity-50"
        >
          <Megaphone className="w-4 h-4" />
          {isPending ? 'Publishing…' : 'Publish bulletin'}
        </button>
      </form>

      <div className="space-y-3">
        {bulletins.length === 0 ? (
          <div className="bg-charcoal border border-graphite rounded-xl p-6 text-silver-gray">
            No bulletins yet.
          </div>
        ) : (
          bulletins.map((bulletin) => (
            <article key={bulletin.id} className="bg-charcoal border border-graphite rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {bulletin.isPinned && <Pin className="w-4 h-4 text-[var(--color-brand-gold)]" />}
                    <h3 className="text-lg font-semibold text-white">{bulletin.title}</h3>
                    <span className="text-xs uppercase tracking-wide text-silver-gray">{bulletin.priority}</span>
                    <span className="text-xs uppercase tracking-wide text-silver-gray">{bulletin.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-light-gray whitespace-pre-wrap">{bulletin.body}</p>
                </div>
                {bulletin.status !== 'archived' && (
                  <button
                    type="button"
                    onClick={() => handleArchive(bulletin.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-lg border border-graphite px-3 py-2 text-sm text-silver"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-silver-gray">
                <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {bulletin.audiences.length} audience target(s)</span>
                <button
                  type="button"
                  onClick={() => loadAcknowledgments(bulletin.id)}
                  className="underline decoration-dotted underline-offset-2"
                >
                  {bulletin.acknowledgmentCount} acknowledgment(s)
                </button>
                {bulletin.publishAt && <span>Publishes {new Date(bulletin.publishAt).toLocaleString()}</span>}
                {bulletin.expiresAt && <span>Expires {new Date(bulletin.expiresAt).toLocaleString()}</span>}
              </div>

              {ackDetails[bulletin.id] && (
                <div className="mt-3 rounded-lg border border-graphite bg-black/30 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-silver mb-2">
                    Acknowledgments
                  </p>
                  {ackDetails[bulletin.id].length === 0 ? (
                    <p className="text-sm text-silver-gray">No acknowledgments yet.</p>
                  ) : (
                    <ul className="space-y-1 text-sm text-light-gray">
                      {ackDetails[bulletin.id].map((ack) => {
                        const studentName =
                          audienceOptions.find((option) => option.id === ack.studentId)?.name ||
                          'Student'
                        return (
                          <li key={ack.studentId} className="flex flex-wrap justify-between gap-2">
                            <span>{studentName}</span>
                            <span className="text-silver-gray">
                              {new Date(ack.acknowledgedAt).toLocaleString()}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
