'use client'

import type { ExamItem } from '@/lib/comprehensive-exam/types'

type Props = {
  items: ExamItem[]
  currentPosition: number
  onSelect: (position: number) => void
}

export default function QuestionNavigator({ items, currentPosition, onSelect }: Props) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
        <span>Outlined: unanswered</span>
        <span>Filled: answered</span>
        <span>★: flagged</span>
      </div>
      <div className="grid grid-cols-10 gap-2 sm:grid-cols-11" aria-label="Question navigator">
        {items.map((item) => {
          const current = item.position === currentPosition
          const answered = Boolean(item.selectedOption)
          return (
            <button
              key={item.position}
              type="button"
              onClick={() => onSelect(item.position)}
              aria-label={`Question ${item.position}${answered ? ', answered' : ', unanswered'}${item.flagged ? ', flagged' : ''}`}
              aria-current={current ? 'step' : undefined}
              className={[
                'relative flex aspect-square min-h-9 items-center justify-center rounded border text-xs font-semibold',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]',
                current ? 'ring-2 ring-[var(--color-brand-gold)]' : '',
                answered
                  ? 'border-silver-gray bg-silver-gray text-black'
                  : 'border-graphite bg-transparent text-[var(--color-text-secondary)]',
              ].join(' ')}
            >
              {item.position}
              {item.flagged && (
                <span aria-hidden="true" className="absolute -right-1 -top-1 text-[10px] text-[var(--color-brand-gold)]">★</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
