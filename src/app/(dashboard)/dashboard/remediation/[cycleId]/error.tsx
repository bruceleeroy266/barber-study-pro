'use client'

export default function RemediationError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="rounded-2xl border border-red-500/30 bg-charcoal p-6" role="alert"><h2 className="text-xl font-semibold text-white">We couldn’t load your focus area.</h2><p className="mt-2 text-sm text-silver">Your completed work is still saved. Try loading this focus area again.</p><button type="button" onClick={reset} className="mt-4 min-h-11 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black">Try again</button></div>
}
