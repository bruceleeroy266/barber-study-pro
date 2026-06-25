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
      <div className="max-w-md w-full bg-gray-900/80 border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 mb-6">
          School-scoped messaging and notifications are coming soon. In the meantime, please contact your instructor or school administrator directly.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-400">
            Demo Mode preview only. No messages can be sent or received in production yet.
          </p>
        </div>
        <Link
          href={backHref}
          className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
