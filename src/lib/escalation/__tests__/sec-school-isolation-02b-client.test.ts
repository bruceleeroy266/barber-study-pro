import { describe, expect, it, vi } from 'vitest'

const createClientMock = vi.hoisted(() => vi.fn(() => ({ rpc: vi.fn() })))

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}))

import { SupabaseEscalationDatabaseClient } from '../supabase-client'

describe('SEC-SCHOOL-ISOLATION-02B: privileged escalation client', () => {
  it('rejects anonymous-key-only construction before opening a Supabase client', () => {
    createClientMock.mockClear()
    expect(() => new SupabaseEscalationDatabaseClient({
      url: 'https://isolated-qa.example.invalid',
      anonKey: 'public-example-only',
    })).toThrow('Server-side escalation credentials are required')
    expect(createClientMock).not.toHaveBeenCalled()
  })

  it('uses only the server credential when explicitly supplied', () => {
    createClientMock.mockClear()
    new SupabaseEscalationDatabaseClient({
      url: 'https://isolated-qa.example.invalid',
      anonKey: 'public-example-only',
      serviceRoleKey: 'test-server-secret-not-a-real-key',
    })
    expect(createClientMock).toHaveBeenCalledTimes(1)
    expect(createClientMock).toHaveBeenCalledWith(
      'https://isolated-qa.example.invalid',
      'test-server-secret-not-a-real-key',
      expect.objectContaining({
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    )
  })
})
