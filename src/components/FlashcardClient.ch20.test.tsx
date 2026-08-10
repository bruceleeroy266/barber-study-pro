/**
 * ASCYN PRO — Chapter 20 FlashcardClient Tests
 *
 * Validates the Chapter 20 deck loads, navigates, tracks progress,
 * supports flagging, and reports completion.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FlashcardClient from './FlashcardClient'
import { chapter20PremiumFlashcards } from '@/lib/chapter-20-premium-flashcards'

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null })
  const eq2 = vi.fn().mockReturnValue({ maybeSingle })
  const eq = vi.fn().mockReturnValue({ eq: eq2, maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  const upsert = vi.fn().mockResolvedValue({ error: null })
  const insert = vi.fn().mockResolvedValue({ error: null })

  const eqC = vi.fn().mockResolvedValue({ error: null })
  const eqB = vi.fn().mockReturnValue({ eq: eqC })
  const eqA = vi.fn().mockReturnValue({ eq: eqB })
  const deleteFn = vi.fn().mockReturnValue({ eq: eqA })

  const fromImpl = vi.fn().mockImplementation((table: string) => {
    if (table === 'student_progress') {
      return { select, upsert }
    }
    if (table === 'flagged_flashcards') {
      return { select, insert, delete: deleteFn }
    }
    return {}
  })

  return {
    upsert,
    insert,
    delete: deleteFn,
    deleteEqA: eqA,
    deleteEqB: eqB,
    deleteEqC: eqC,
    select,
    from: fromImpl,
  }
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null }),
    },
    from: mocks.from,
  },
}))

vi.mock('@/lib/demo-helpers', () => ({
  isSupabaseConfigured: () => true,
}))

function getDefaultMockFrom() {
  return vi.fn().mockImplementation((table: string) => {
    if (table === 'student_progress') {
      return { select: mocks.select, upsert: mocks.upsert }
    }
    if (table === 'flagged_flashcards') {
      return { select: mocks.select, insert: mocks.insert, delete: mocks.delete }
    }
    return {}
  })
}

function renderFlashcards(userId: string | undefined = 'user-1') {
  return render(
    <FlashcardClient
      flashcards={chapter20PremiumFlashcards}
      chapterId="ch-20"
      userId={userId}
      isCompleted={false}
    />
  )
}

describe('FlashcardClient — Chapter 20', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.upsert.mockResolvedValue({ error: null })
    mocks.insert.mockResolvedValue({ error: null })
    mocks.deleteEqC.mockResolvedValue({ error: null })
    mocks.deleteEqB.mockReturnValue({ eq: mocks.deleteEqC })
    mocks.deleteEqA.mockReturnValue({ eq: mocks.deleteEqB })
    mocks.delete.mockReturnValue({ eq: mocks.deleteEqA })
    mocks.from.mockImplementation(getDefaultMockFrom())
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('loads all 60 flashcards and shows progress', async () => {
    renderFlashcards()
    expect(await screen.findByText(/Card 1 of 60/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
  })

  it('navigates to the next and previous cards', async () => {
    renderFlashcards()
    expect(await screen.findByText(/Card 1 of 60/i)).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /Next →/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText(/Card 2 of 60/i)).toBeInTheDocument()
    })

    const prevButton = screen.getByRole('button', { name: /← Previous/i })
    fireEvent.click(prevButton)

    await waitFor(() => {
      expect(screen.getByText(/Card 1 of 60/i)).toBeInTheDocument()
    })
  })

  it('flags a card for additional practice', async () => {
    renderFlashcards()
    const flagButton = await screen.findByRole('button', { name: /Flag this flashcard for more practice/i })

    fireEvent.click(flagButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Remove flag from this flashcard/i })).toBeInTheDocument()
    })
    expect(mocks.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      chapter_id: 'ch-20',
      flashcard_id: chapter20PremiumFlashcards[0].id,
    })
  })

  it('flips a card to reveal the back content', async () => {
    renderFlashcards()
    expect(await screen.findByText(/Card 1 of 60/i)).toBeInTheDocument()

    const card = screen.getByText(chapter20PremiumFlashcards[0].front)
    fireEvent.click(card)

    await waitFor(() => {
      expect(screen.getByText(chapter20PremiumFlashcards[0].back)).toBeInTheDocument()
    })
  })

  it('updates progress bar value as cards are navigated', async () => {
    renderFlashcards()
    expect(await screen.findByText(/Card 1 of 60/i)).toBeInTheDocument()

    const progress = screen.getByRole('progressbar')
    // ProgressBar shows percentage: card 1 of 60 = (1/60)*100 = 1.666...
    expect(progress).toHaveAttribute('aria-valuenow', '1.6666666666666667')

    const nextButton = screen.getByRole('button', { name: /Next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      // Card 2 of 60 = (2/60)*100 = 3.333...
      expect(progress).toHaveAttribute('aria-valuenow', '3.3333333333333335')
    })
  })

  it('marks study complete after reaching the last card', async () => {
    renderFlashcards()
    expect(await screen.findByText(/Card 1 of 60/i)).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /Next →/i })
    for (let i = 0; i < chapter20PremiumFlashcards.length - 1; i++) {
      fireEvent.click(nextButton)
    }

    await waitFor(() => {
      expect(screen.getByText(/Card 60 of 60/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Mark Complete/i })).toBeInTheDocument()
  })

  it('preserves progress in localStorage when userId is not available', async () => {
    renderFlashcards(undefined)
    expect(await screen.findByText(/Card 1 of 60/i)).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /Next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText(/Card 2 of 60/i)).toBeInTheDocument()
    })

    expect(localStorage.getItem('flashcard-index-ch-20')).toBe('1')
  })
})
