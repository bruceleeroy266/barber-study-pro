/**
 * Tier 1 — Cycle step map (student remediation page)
 *
 * Presentational three-step map: Review → Knowledge Check → Complete.
 * Current step highlighted, completed steps checked. No diagnostic terms.
 */

import type { CycleStep } from '@/lib/presentation/student-evidence'

interface CycleStepMapProps {
  currentStep: CycleStep
}

const STEPS = [
  { step: 1 as const, label: 'Review' },
  { step: 2 as const, label: 'Knowledge Check' },
  { step: 3 as const, label: 'Complete' },
]

export default function CycleStepMap({ currentStep }: CycleStepMapProps) {
  return (
    <nav aria-label="Focus area progress" className="bg-charcoal border border-graphite rounded-2xl p-6">
      <ol className="flex items-center gap-2 sm:gap-4">
        {STEPS.map(({ step, label }, idx) => {
          const isComplete = step < currentStep
          const isCurrent = step === currentStep
          return (
            <li key={step} className="flex items-center gap-2 sm:gap-4 flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={[
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0',
                    isComplete
                      ? 'bg-gold text-black'
                      : isCurrent
                        ? 'bg-gold/20 text-gold border border-gold'
                        : 'bg-graphite text-silver',
                  ].join(' ')}
                >
                  {isComplete ? '✓' : step}
                </span>
                <span
                  className={[
                    'text-sm',
                    isCurrent ? 'text-white font-medium' : isComplete ? 'text-white' : 'text-silver',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <span aria-hidden="true" className="flex-1 h-px bg-graphite" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
