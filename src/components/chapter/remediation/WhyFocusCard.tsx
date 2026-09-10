/**
 * Tier 1 — "Why am I here?" card (student remediation page)
 *
 * Server-presentational: receives finished, pre-translated strings only.
 * Never receives raw evidence objects or diagnostic vocabulary.
 */

interface WhyFocusCardProps {
  conceptName: string
  /** Plain-language reason from buildFocusReason(); null → fallback copy */
  reason: string | null
  /** Formatted last-activity line, or null to omit */
  lastActivity: string | null
  /** Completion guidance for the current step */
  guidance: string
}

export default function WhyFocusCard({
  conceptName,
  reason,
  lastActivity,
  guidance,
}: WhyFocusCardProps) {
  return (
    <div
      className="bg-charcoal border border-graphite rounded-2xl p-6"
      aria-label={`Why you are seeing the focus area ${conceptName}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-silver">
        Why you&apos;re seeing this
      </h2>
      <p className="text-white mt-2">
        {reason ??
          'This topic was flagged for a little extra practice. The review below is a good place to start.'}
      </p>
      {lastActivity && <p className="text-silver text-sm mt-1">{lastActivity}</p>}
      <p className="text-silver text-sm mt-3 border-t border-graphite pt-3">{guidance}</p>
    </div>
  )
}
