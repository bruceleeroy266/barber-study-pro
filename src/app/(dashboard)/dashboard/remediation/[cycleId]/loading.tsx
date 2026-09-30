export default function RemediationLoading() {
  return <div className="space-y-6" role="status" aria-live="polite"><div className="h-8 w-48 animate-pulse rounded bg-graphite" /><div className="h-40 animate-pulse rounded-2xl bg-charcoal border border-graphite" /><div className="h-72 animate-pulse rounded-2xl bg-charcoal border border-graphite" /><span className="sr-only">Loading your focus area…</span></div>
}
