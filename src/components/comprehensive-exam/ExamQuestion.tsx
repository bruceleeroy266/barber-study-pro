'use client'

import type { ExamItem, ExamOption } from '@/lib/comprehensive-exam/types'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const optionEntries: Array<[ExamOption, keyof Pick<ExamItem, 'optionA' | 'optionB' | 'optionC' | 'optionD'>]> = [
  ['a', 'optionA'],
  ['b', 'optionB'],
  ['c', 'optionC'],
  ['d', 'optionD'],
]

type Props = {
  item: ExamItem
  total: number
  saving: boolean
  flagSaving: boolean
  saveMessage: string | null
  error: string | null
  onSelect: (option: ExamOption) => Promise<void>
  onToggleFlag: () => Promise<void>
}

export default function ExamQuestion({
  item,
  total,
  saving,
  flagSaving,
  saveMessage,
  error,
  onSelect,
  onToggleFlag,
}: Props) {
  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--color-brand-gold)]">
          Question {item.position} of {total}
        </p>
        <Button
          type="button"
          variant={item.flagged ? 'primary' : 'outline'}
          size="sm"
          loading={flagSaving}
          onClick={() => void onToggleFlag()}
          aria-pressed={item.flagged}
        >
          {item.flagged ? 'Flagged for review' : 'Flag for review'}
        </Button>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
        {item.prompt}
      </h2>

      <fieldset className="space-y-3" disabled={saving}>
        <legend className="sr-only">Choose one answer</legend>
        {optionEntries.map(([key, property]) => {
          const selected = item.selectedOption === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => void onSelect(key)}
              className={[
                'w-full min-h-14 rounded-lg border p-4 text-left transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]',
                selected
                  ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10 text-white'
                  : 'border-graphite bg-charcoal text-[var(--color-text-secondary)] hover:border-silver-gray',
              ].join(' ')}
              aria-pressed={selected}
            >
              <span className="mr-3 font-bold uppercase text-[var(--color-brand-gold)]">{key}.</span>
              {item[property]}
            </button>
          )
        })}
      </fieldset>

      <div className="min-h-6 text-sm" aria-live="polite">
        {saving && <span className="text-[var(--color-text-muted)]">Saving answer…</span>}
        {!saving && saveMessage && <span className="text-[var(--color-brand-gold)]">{saveMessage}</span>}
        {error && <span className="text-red-300">{error}</span>}
      </div>
    </Card>
  )
}
