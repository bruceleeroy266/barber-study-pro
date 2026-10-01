'use client'

export default function ChaptersError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="rounded-2xl border border-red-500/30 bg-charcoal p-6" role="alert"><h2 className="text-xl font-semibold text-white">We couldn’t load this chapter.</h2><p className="mt-2 text-sm text-silver">Your saved progress has not been changed. Try loading it again.</p><button type="button" onClick={reset} className="mt-4 min-h-11 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black">Try again</button></div>
}
