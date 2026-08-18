import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveMissedQuestions, saveLocalMissedQuestions, loadLocalMissedQuestions } from './index'
import type { MissedQuestionInput } from './index'

// Mock the demo-helpers module
vi.mock('@/lib/demo-helpers', () => ({
  isSupabaseConfigured: vi.fn(),
}))

// Mock the supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { isSupabaseConfigured } from '@/lib/demo-helpers'
import { supabase } from '@/lib/supabase'

const mockIsSupabaseConfigured = vi.mocked(isSupabaseConfigured)
const mockSupabaseFrom = vi.mocked(supabase.from)

function createInput(questionId: string, overrides: Partial<MissedQuestionInput> = {}): MissedQuestionInput {
  return {
    userId: 'user-1',
    questionId,
    quizId: 'quiz-1',
    question: 'What is the correct answer?',
    correctAnswer: 'A',
    studentAnswer: 'B',
    explanation: 'Because A is correct.',
    chapterId: 'ch-1',
    chapterNumber: 1,
    category: 'Anatomy',
    ...overrides,
  }
}

describe('saveMissedQuestions — localStorage fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockIsSupabaseConfigured.mockReturnValue(false)
  })

  it('sets times_missed = 1 on first miss', () => {
    const input = createInput('q-1')
    saveLocalMissedQuestions('user-1', [input])

    const saved = loadLocalMissedQuestions('user-1')
    expect(saved).toHaveLength(1)
    expect(saved[0].timesMissed).toBe(1)
  })

  it('increments times_missed to 2 on second miss of same question', () => {
    const input = createInput('q-1')
    saveLocalMissedQuestions('user-1', [input])
    saveLocalMissedQuestions('user-1', [input])

    const saved = loadLocalMissedQuestions('user-1')
    expect(saved).toHaveLength(1)
    expect(saved[0].timesMissed).toBe(2)
  })

  it('increments times_missed to 3 on third miss of same question', () => {
    const input = createInput('q-1')
    saveLocalMissedQuestions('user-1', [input])
    saveLocalMissedQuestions('user-1', [input])
    saveLocalMissedQuestions('user-1', [input])

    const saved = loadLocalMissedQuestions('user-1')
    expect(saved).toHaveLength(1)
    expect(saved[0].timesMissed).toBe(3)
  })

  it('does not create a duplicate entry for the same question', () => {
    const input = createInput('q-1')
    saveLocalMissedQuestions('user-1', [input])
    saveLocalMissedQuestions('user-1', [input])
    saveLocalMissedQuestions('user-1', [input])

    const saved = loadLocalMissedQuestions('user-1')
    expect(saved).toHaveLength(1)
  })

  it('tracks different questions independently', () => {
    saveLocalMissedQuestions('user-1', [createInput('q-1')])
    saveLocalMissedQuestions('user-1', [createInput('q-2')])
    saveLocalMissedQuestions('user-1', [createInput('q-1')])

    const saved = loadLocalMissedQuestions('user-1')
    expect(saved).toHaveLength(2)
    const q1 = saved.find((q) => q.questionId === 'q-1')
    const q2 = saved.find((q) => q.questionId === 'q-2')
    expect(q1?.timesMissed).toBe(2)
    expect(q2?.timesMissed).toBe(1)
  })
})

describe('saveMissedQuestions — Supabase path', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsSupabaseConfigured.mockReturnValue(true)
  })

  it('inserts new record with times_missed = 1 on first miss', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
          insert: mockInsert,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const input = createInput('q-1')
    const result = await saveMissedQuestions('user-1', [input])

    expect(result.ok).toBe(true)
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        user_id: 'user-1',
        question_id: 'q-1',
        times_missed: 1,
      }),
    ])
  })

  it('increments times_missed to 2 on second miss of same question', async () => {
    const existingRow = { question_id: 'q-1', times_missed: 1 }
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    })
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [existingRow], error: null }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
          update: mockUpdate,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const input = createInput('q-1')
    const result = await saveMissedQuestions('user-1', [input])

    expect(result.ok).toBe(true)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        times_missed: 2,
      })
    )
  })

  it('increments times_missed to 3 on third miss of same question', async () => {
    const existingRow = { question_id: 'q-1', times_missed: 2 }
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    })
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [existingRow], error: null }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
          update: mockUpdate,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const input = createInput('q-1')
    const result = await saveMissedQuestions('user-1', [input])

    expect(result.ok).toBe(true)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        times_missed: 3,
      })
    )
  })

  it('handles mixed new and existing questions in one batch', async () => {
    const existingRow = { question_id: 'q-1', times_missed: 2 }
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    })
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [existingRow], error: null }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
          insert: mockInsert,
          update: mockUpdate,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const inputs = [createInput('q-1'), createInput('q-2')]
    const result = await saveMissedQuestions('user-1', inputs)

    expect(result.ok).toBe(true)
    // q-1 should be updated (times_missed: 3)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        times_missed: 3,
      })
    )
    // q-2 should be inserted (times_missed: 1)
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        question_id: 'q-2',
        times_missed: 1,
      }),
    ])
  })

  it('returns error when fetch of existing records fails', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB connection failed' } }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const input = createInput('q-1')
    const result = await saveMissedQuestions('user-1', [input])

    expect(result.ok).toBe(false)
    expect(result.error).toBe('DB connection failed')
  })

  it('returns error when insert fails', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } })
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
          insert: mockInsert,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const input = createInput('q-1')
    const result = await saveMissedQuestions('user-1', [input])

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Insert failed')
  })

  it('returns error when update fails', async () => {
    const existingRow = { question_id: 'q-1', times_missed: 1 }
    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } }),
      }),
    })
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [existingRow], error: null }),
      }),
    })

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'missed_questions') {
        return {
          select: mockSelect,
          update: mockUpdate,
        } as never
      }
      throw new Error(`Unexpected table: ${table}`)
    })

    const input = createInput('q-1')
    const result = await saveMissedQuestions('user-1', [input])

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Update failed')
  })
})
