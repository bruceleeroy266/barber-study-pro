/**
 * Phase 6C-5 — Detection API Route Tests
 *
 * Tests the POST /api/remediation/detect endpoint.
 * Verifies authentication, authorization, and orchestration integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the modules before importing the route
vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/remediation/detection-orchestrator', () => ({
  createSupabaseDetectionOrchestrator: vi.fn(),
}))

import { POST } from '../detect/route'
import { createClient } from '@/lib/supabase-server'
import { createSupabaseDetectionOrchestrator } from '@/lib/remediation/detection-orchestrator'

describe('POST /api/remediation/detect', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 when not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Authentication required')
  })

  it('should return 400 when chapterId is missing', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ quizAttemptId: 'attempt-123' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('chapterId is required')
  })

  it('should return 400 when quizAttemptId is missing', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('quizAttemptId is required')
  })

  it('should return 404 when quiz attempt not found', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: 'nonexistent-attempt' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Quiz attempt not found')
  })

  it('should return 403 when quiz attempt belongs to another user', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'attempt-1', quiz_id: 'quiz-2', user_id: 'other-user', completed_at: '2026-08-20T10:00:00Z' },
              error: null,
            }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: 'attempt-1' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Quiz attempt does not belong to authenticated user')
  })

  it('should return 400 when quiz attempt is not completed', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'attempt-1', quiz_id: 'quiz-2', user_id: 'user-123', completed_at: null },
              error: null,
            }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: 'attempt-1' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Quiz attempt is not completed')
  })

  it('should return 400 when quiz attempt does not match chapter', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'attempt-1', quiz_id: 'quiz-1', user_id: 'user-123', completed_at: '2026-08-20T10:00:00Z' },
              error: null,
            }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: 'attempt-1' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Quiz attempt does not match chapter')
  })

  it('should return 500 when orchestration fails', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'attempt-1', quiz_id: 'quiz-2', user_id: 'user-123', completed_at: '2026-08-20T10:00:00Z' },
              error: null,
            }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const mockOrchestrator = {
      orchestrateAfterQuizCompletion: vi.fn().mockResolvedValue({
        success: false,
        cyclesCreated: 0,
        existingCyclesFound: 0,
        cycleIds: [],
        conceptsDetected: [],
        error: 'Database connection failed',
      }),
    }
    vi.mocked(createSupabaseDetectionOrchestrator).mockReturnValue(mockOrchestrator as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: 'attempt-1' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Database connection failed')
  })

  it('should return success with orchestration result', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'attempt-1', quiz_id: 'quiz-2', user_id: 'user-123', completed_at: '2026-08-20T10:00:00Z' },
              error: null,
            }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const mockOrchestrator = {
      orchestrateAfterQuizCompletion: vi.fn().mockResolvedValue({
        success: true,
        cyclesCreated: 1,
        existingCyclesFound: 0,
        cycleIds: ['cycle-1'],
        conceptsDetected: ['C-2-01'],
      }),
    }
    vi.mocked(createSupabaseDetectionOrchestrator).mockReturnValue(mockOrchestrator as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: 'attempt-1' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.cyclesCreated).toBe(1)
    expect(data.cycleIds).toContain('cycle-1')
    expect(mockOrchestrator.orchestrateAfterQuizCompletion).toHaveBeenCalledWith('user-123', 'ch-2', 'attempt-1')
  })

  it('should handle non-Chapter 2 chapters gracefully', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'attempt-1', quiz_id: 'quiz-1', user_id: 'user-123', completed_at: '2026-08-20T10:00:00Z' },
              error: null,
            }),
          }),
        }),
      }),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const mockOrchestrator = {
      orchestrateAfterQuizCompletion: vi.fn().mockResolvedValue({
        success: true,
        cyclesCreated: 0,
        existingCyclesFound: 0,
        cycleIds: [],
        conceptsDetected: [],
      }),
    }
    vi.mocked(createSupabaseDetectionOrchestrator).mockReturnValue(mockOrchestrator as any)

    const request = new NextRequest('http://localhost/api/remediation/detect', {
      method: 'POST',
      body: JSON.stringify({ chapterId: 'ch-1', quizAttemptId: 'attempt-1' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.cyclesCreated).toBe(0)
  })
})
