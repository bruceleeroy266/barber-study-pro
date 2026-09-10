/**
 * @vitest-environment node
 *
 * Unit tests for the shared server-side learning-activity mechanism.
 *
 * Proves:
 *   - last_studied_at is advanced through student_progress with the canonical
 *     (user_id, chapter_id) conflict key — the same column/quiz/flashcard
 *     clients use, so all learning activity lands on one signal.
 *   - Failures are returned and logged loudly, never thrown and never silent.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

import { recordLearningActivity } from './learning-activity'

type UpsertImpl = (
  values: Record<string, unknown>,
  options: { onConflict: string }
) => Promise<{ error: { message: string } | null }>

function createStubClient(impl: UpsertImpl) {
  const upsert = vi.fn(impl)
  const from = vi.fn(() => ({ upsert }))
  return { client: { from }, from, upsert }
}

describe('recordLearningActivity', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('upserts student_progress with the canonical conflict key and timestamp', async () => {
    const { client, from, upsert } = createStubClient(async () => ({ error: null }))
    const now = new Date('2026-09-09T20:00:00.000Z')

    const result = await recordLearningActivity(client, 'user-1', 'ch-2', now)

    expect(result).toEqual({ ok: true })
    expect(from).toHaveBeenCalledWith('student_progress')
    expect(upsert).toHaveBeenCalledTimes(1)
    const [values, options] = upsert.mock.calls[0]
    expect(values).toMatchObject({
      user_id: 'user-1',
      chapter_id: 'ch-2',
      last_studied_at: '2026-09-09T20:00:00.000Z',
      updated_at: '2026-09-09T20:00:00.000Z',
    })
    // No progress/scoring fields are touched — activity tracking only.
    expect(values).not.toHaveProperty('progress_percentage')
    expect(values).not.toHaveProperty('quiz_completed')
    expect(values).not.toHaveProperty('best_quiz_score')
    expect(options).toEqual({ onConflict: 'user_id,chapter_id' })
  })

  it('defaults the timestamp to now', async () => {
    const { client, upsert } = createStubClient(async () => ({ error: null }))
    const before = Date.now()

    await recordLearningActivity(client, 'user-1', 'ch-2')

    const [values] = upsert.mock.calls[0]
    const written = new Date(values.last_studied_at as string).getTime()
    expect(written).toBeGreaterThanOrEqual(before)
    expect(written).toBeLessThanOrEqual(Date.now())
  })

  it('returns ok:false and logs (never throws, never silent) when the write fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { client } = createStubClient(async () => ({ error: { message: 'RLS denied' } }))

    const result = await recordLearningActivity(client, 'user-1', 'ch-2')

    expect(result.ok).toBe(false)
    expect(result.error).toBe('RLS denied')
    expect(errorSpy).toHaveBeenCalledOnce()
    expect(errorSpy.mock.calls[0][0]).toContain('[learning-activity]')
  })

  it('returns ok:false and logs when the client throws unexpectedly', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { client } = createStubClient(async () => {
      throw new Error('connection reset')
    })

    const result = await recordLearningActivity(client, 'user-1', 'ch-2')

    expect(result.ok).toBe(false)
    expect(result.error).toBe('connection reset')
    expect(errorSpy).toHaveBeenCalledOnce()
  })
})
