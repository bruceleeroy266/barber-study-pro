import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import AnswerKeySearch, { type AnswerKeySearchEntry } from './AnswerKeySearch'

const entries: AnswerKeySearchEntry[] = [
  {
    id: 'qq-10-034',
    chapterNumber: 10,
    chapterTitle: 'Properties and Disorders of the Hair and Scalp',
    questionNumber: 34,
    question: 'During scalp analysis, a barber identifies live head lice before the service begins. What is the correct professional response?',
    answers: {
      a: 'Refer the client to a physician or pharmacist',
      b: 'Treat the client in the barbershop',
      c: 'Disinfect tools and continue',
      d: 'Shave the affected area',
    },
    correctAnswer: 'a',
    explanation: 'Head lice should not be treated in the barbershop.',
  },
  {
    id: 'qq-12-035',
    chapterNumber: 12,
    chapterTitle: "Men's Facial Massage and Treatments",
    questionNumber: 35,
    question: 'Which condition contraindicates massage?',
    answers: {
      a: 'Acute inflammation',
      b: 'Normal skin',
      c: 'Dry cheeks',
      d: 'Mild shoulder tension',
    },
    correctAnswer: 'a',
    explanation: 'Massage should be withheld for acute inflammation.',
  },
]

describe('AnswerKeySearch', () => {
  it('searches across questions, answers, explanations, and chapter metadata', () => {
    render(<AnswerKeySearch entries={entries} />)

    const search = screen.getByRole('searchbox', { name: /search all chapter answer keys/i })
    fireEvent.change(search, { target: { value: 'head lice' } })

    expect(screen.getByText(/identifies live head lice/i)).toBeInTheDocument()
    expect(screen.getByText(/refer the client to a physician or pharmacist/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open in chapter/i })).toHaveAttribute(
      'href',
      '/instructor/answer-keys/10#qq-10-034',
    )
  })

  it('shows no-results feedback for a missing term', () => {
    render(<AnswerKeySearch entries={entries} />)

    fireEvent.change(
      screen.getByRole('searchbox', { name: /search all chapter answer keys/i }),
      { target: { value: 'not-a-real-concept' } },
    )

    expect(screen.getByText(/no answer-key matches found/i)).toBeInTheDocument()
  })
})
