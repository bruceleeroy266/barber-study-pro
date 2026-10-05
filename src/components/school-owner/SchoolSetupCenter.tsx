import Link from 'next/link'
import type { SchoolOnboardingStatus } from '@/lib/onboarding'

interface SchoolSetupCenterProps {
  status: SchoolOnboardingStatus
}

export default function SchoolSetupCenter({ status }: SchoolSetupCenterProps) {
  const complete = status.readyToLaunch

  return (
    <section
      aria-labelledby="school-setup-center-title"
      className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-charcoal p-5 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">
            School Setup
          </p>
          <h2 id="school-setup-center-title" className="text-2xl font-semibold text-white">
            {complete ? 'Ready to Launch' : 'Finish setting up your school'}
          </h2>
          <p className="mt-2 text-sm text-silver">
            {complete
              ? 'ASCYN PRO verified the required onboarding steps for your school.'
              : 'ASCYN PRO checks your school setup automatically and shows the next action needed before launch.'}
          </p>
        </div>

        <div className="min-w-[170px] rounded-lg border border-graphite bg-black p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-silver-gray">Setup progress</p>
          <p className="mt-1 text-3xl font-bold text-white">{status.progressPercent}%</p>
          <p className="mt-1 text-xs text-silver">
            {status.completedSteps} of {status.totalSteps} steps complete
          </p>
        </div>
      </div>

      <div className="mt-5" aria-label={`School setup progress: ${status.progressPercent}%`}>
        <div className="h-2 overflow-hidden rounded-full bg-black" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={status.progressPercent}>
          <div
            className="h-full rounded-full bg-[var(--color-brand-gold)] transition-[width]"
            style={{ width: `${status.progressPercent}%` }}
          />
        </div>
      </div>

      {status.nextAction && (
        <div className="mt-6 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-gold)]">Next action</p>
          <p className="mt-1 font-semibold text-white">{status.nextAction.message}</p>
          <Link
            href={status.nextAction.href}
            className="mt-3 inline-flex rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            {status.nextAction.action}
          </Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {status.steps.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-graphite bg-black p-4"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  item.complete
                    ? 'bg-[var(--color-brand-gold)] text-black'
                    : 'border border-silver-gray text-silver'
                }`}
              >
                {item.complete ? '✓' : '•'}
              </span>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-silver">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {status.blockers.length > 0 && (
        <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <h3 className="font-semibold text-red-300">Launch blockers</h3>
          <div className="mt-3 space-y-3">
            {status.blockers.map((blocker) => (
              <div key={blocker.code} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-red-200">{blocker.message}</p>
                <Link
                  href={blocker.href}
                  className="shrink-0 text-sm font-semibold text-[var(--color-brand-gold)] hover:underline"
                >
                  {blocker.action} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {complete && (
        <div className="mt-6 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4" role="status">
          <p className="font-semibold text-[var(--color-brand-gold)]">Ready to Launch</p>
          <p className="mt-1 text-sm text-silver">
            All required onboarding checks are complete. Your school can begin using ASCYN PRO.
          </p>
        </div>
      )}
    </section>
  )
}
