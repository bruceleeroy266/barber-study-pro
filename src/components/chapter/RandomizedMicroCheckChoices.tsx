'use client'

import { useState } from 'react'
import type { ChapterTheme } from '@/lib/chapter-content'
import {
  buildShuffledMicroCheckChoices,
  type FourChoiceMicroCheckQuestion,
  type MicroCheckAnswerKey,
} from '@/lib/micro-checks/randomization'

interface Props {
  question: FourChoiceMicroCheckQuestion
  chosen?: MicroCheckAnswerKey
  recordedAnswer?: MicroCheckAnswerKey
  locked: boolean
  disabled: boolean
  theme: ChapterTheme
  onSelect: (answer: MicroCheckAnswerKey) => void
}

export default function RandomizedMicroCheckChoices({
  question,
  chosen,
  recordedAnswer,
  locked,
  disabled,
  theme,
  onSelect,
}: Props) {
  const [choices] = useState(() => buildShuffledMicroCheckChoices(question))

  return (
    <div className="grid gap-2">
      {choices.map((choice) => {
        const active = locked
          ? recordedAnswer === choice.sourceKey
          : chosen === choice.sourceKey

        return (
          <button
            key={choice.sourceKey}
            type="button"
            disabled={locked || disabled}
            onClick={() => onSelect(choice.sourceKey)}
            className="w-full rounded-lg border px-3 py-3 text-left disabled:cursor-default"
            style={{
              borderColor: active ? theme.primary : theme.border,
              background: active ? `${theme.primary}18` : theme.background,
              color: theme.text,
            }}
          >
            <span className="font-semibold uppercase mr-2">
              {choice.displayLabel}.
            </span>
            {choice.text}
          </button>
        )
      })}
    </div>
  )
}
