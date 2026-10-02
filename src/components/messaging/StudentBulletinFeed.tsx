'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, Pin } from 'lucide-react'
import {
  acknowledgeBulletin,
  type ProductionBulletin,
} from '@/app/communications/bulletin-actions'

interface StudentBulletinFeedProps {
  initialBulletins: ProductionBulletin[]
}

export default function StudentBulletinFeed({
  initialBulletins,
}: StudentBulletinFeedProps) {
  const [bulletins, setBulletins] = useState(initialBulletins)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const acknowledge = (bulletinId: string) => {
    startTransition(() => {
      void (async () => {
        setError(null)
        const result = await acknowledgeBulletin(bulletinId)
        if (!result.success) {
          setError(result.message)
          return
        }
        setBulletins((current) =>
          current.map((bulletin) =>
            bulletin.id === bulletinId
              ? { ...bulletin, acknowledgedByCurrentUser: true }
              : bulletin
          )
        )
      })()
    })
  }

  return (
    <div className="space-y-4">
      {error && (
        <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {bulletins.length === 0 ? (
        <div className="bg-charcoal border border-graphite rounded-xl p-6 text-silver-gray">
          No active bulletins.
        </div>
      ) : (
        bulletins.map((bulletin) => (
          <article key={bulletin.id} className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2">
              {bulletin.isPinned && <Pin className="w-4 h-4 text-[var(--color-brand-gold)]" />}
              <h2 className="text-lg font-semibold text-white">{bulletin.title}</h2>
              <span className="text-xs uppercase tracking-wide text-silver-gray">{bulletin.priority}</span>
            </div>

            <p className="mt-3 text-light-gray whitespace-pre-wrap">{bulletin.body}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-silver-gray">
                {bulletin.publishAt && <span>Published {new Date(bulletin.publishAt).toLocaleString()}</span>}
                {bulletin.expiresAt && <span className="ml-3">Expires {new Date(bulletin.expiresAt).toLocaleString()}</span>}
              </div>

              {bulletin.acknowledgmentRequired && (
                bulletin.acknowledgedByCurrentUser ? (
                  <span className="inline-flex items-center gap-2 text-sm text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    Acknowledged
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => acknowledge(bulletin.id)}
                    disabled={isPending}
                    className="rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                  >
                    Acknowledge
                  </button>
                )
              )}
            </div>
          </article>
        ))
      )}
    </div>
  )
}
