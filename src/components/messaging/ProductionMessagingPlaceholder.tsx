import Link from 'next/link'

interface ProductionMessagingPlaceholderProps {
  title?: string
  backHref?: string
  backLabel?: string
}

/**
 * Phase 13C.1 — Messaging is not yet wired to real school-scoped tables.
 * This placeholder prevents fake demo success states in production.
 */
export default function ProductionMessagingPlaceholder({
  title = 'Messaging',
  backHref = '/dashboard',
  backLabel = 'Back to dashboard',
}: ProductionMessagingPlaceholderProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-charcoal/80 border border-graphite rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
        <p className="text-silver mb-6">
          School-scoped messaging and notifications are coming soon. In the meantime, please contact your instructor or school administrator directly.
        </p>
        <div className="bg-warm-bronze/10 border border-warm-bronze/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warm-bronze">
            Demo Mode preview only. No messages can be sent or received in production yet.
          </p>
        </div>
        <Link
          href={backHref}
          className="inline-block px-6 py-3 bg-graphite text-white font-semibold rounded-lg hover:bg-[var(--color-border-secondary)] transition-all duration-200 border border-silver-gray"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
