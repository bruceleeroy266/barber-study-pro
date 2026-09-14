import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: mocks.createClient,
}))

import { SupabaseInstructorDatabaseClient } from '../supabase-client'

describe('SupabaseInstructorDatabaseClient acknowledgement ownership', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not claim success or write an event when another instructor wins the acknowledgement race', async () => {
    const eventInsert = vi.fn()
    let escalationCall = 0

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === 'instructor_escalation_events') {
          return { insert: eventInsert }
        }

        if (table !== 'instructor_escalations') return {}
        escalationCall += 1

        if (escalationCall === 1) {
          // Initial read: still pending and unclaimed.
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'esc-1', status: 'pending', acknowledged_by: null },
                    error: null,
                  }),
                })),
              })),
            })),
          }
        }

        if (escalationCall === 2) {
          // Conditional claim loses the race: zero rows updated.
          return {
            update: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    is: vi.fn(() => ({
                      select: vi.fn(() => ({
                        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                      })),
                    })),
                  })),
                })),
              })),
            })),
          }
        }

        // Follow-up read shows another instructor now owns it.
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { status: 'acknowledged', acknowledged_by: 'instructor-2' },
                  error: null,
                }),
              })),
            })),
          })),
        }
      }),
    }

    mocks.createClient.mockReturnValue(supabase)

    const client = new SupabaseInstructorDatabaseClient({
      url: 'https://example.supabase.co',
      anonKey: 'anon-key',
    })

    const result = await client.acknowledgeEscalationForSchool(
      'esc-1',
      'school-1',
      'instructor-1'
    )

    expect(result).toEqual({
      success: false,
      error: 'Escalation already acknowledged by another instructor',
      alreadyAcknowledged: true,
    })
    expect(eventInsert).not.toHaveBeenCalled()
  })
})
