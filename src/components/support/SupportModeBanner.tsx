import Link from 'next/link'
import { stopSupportMode } from '@/app/admin/support-access/actions'

interface Props {
  actorEmail: string | null
  targetName: string | null
  targetEmail: string | null
  targetRole: string
  schoolName?: string | null
}

export default function SupportModeBanner({
  actorEmail,
  targetName,
  targetEmail,
  targetRole,
  schoolName,
}: Props) {
  return (
    <div className="sticky top-0 z-[70] border-b border-amber-400/40 bg-amber-400/10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Platform Admin Support Mode</div>
          <div className="text-sm text-white">
            Acting with {targetName || targetEmail || 'staff'}&apos;s <span className="font-semibold capitalize">{targetRole.replace('_', ' ')}</span> permissions
            {schoolName ? <> at <span className="font-semibold">{schoolName}</span></> : null}.
          </div>
          <div className="text-xs text-silver">True actor: {actorEmail || 'platform administrator'} — support actions are audited.</div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/support-access" className="rounded-lg border border-amber-300/30 px-3 py-2 text-sm font-medium text-amber-200">
            Support Access
          </Link>
          <form action={stopSupportMode}>
            <button type="submit" className="rounded-lg bg-amber-300 px-3 py-2 text-sm font-semibold text-black">
              Exit Support Mode
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
