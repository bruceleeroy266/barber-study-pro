import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotificationService } from './NotificationService'

const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockSelectSingle = vi.fn()

const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  update: mockUpdate,
}))

vi.mock('@/lib/supabase-service-role', () => ({
  createServiceRoleClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

mockInsert.mockImplementation(() => ({
  select: vi.fn(() => ({
    single: mockSelectSingle,
  })),
}))

mockUpdate.mockImplementation(() => ({
  eq: vi.fn().mockResolvedValue({ error: null }),
}))

const mockSend = vi.fn()

function createService() {
  return new NotificationService([
    {
      name: 'email',
      send: mockSend,
    },
  ])
}

describe('NotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockResolvedValue({ success: true })
  })

  const payload = {
    timeSubmitted: 'Jul 21, 2026, 10:00 PM',
    schoolName: 'Test School',
    contactName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-1234',
    studentCount: '25',
    state: 'Oklahoma',
    message: 'Interested in a demo',
  }

  it('persists the notification and sends through the channel', async () => {
    mockSelectSingle.mockResolvedValue({
      data: { id: 'notif-1', payload },
      error: null,
    })

    const service = createService()
    const result = await service.notifyOwner('demo_request', payload)

    expect(result.success).toBe(true)
    expect(result.notificationId).toBe('notif-1')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'demo_request',
        payload,
        status: 'unread',
        email_status: 'pending',
      })
    )
    expect(mockSend).toHaveBeenCalled()
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        email_status: 'sent',
      })
    )
  })

  it('returns duplicate=true when the dedup_hash conflicts', async () => {
    mockSelectSingle.mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'duplicate key value' },
    })

    const service = createService()
    const result = await service.notifyOwner('demo_request', payload)

    expect(result.success).toBe(true)
    expect(result.duplicate).toBe(true)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('records a failed email status when the channel fails', async () => {
    mockSelectSingle.mockResolvedValue({
      data: { id: 'notif-2', payload },
      error: null,
    })
    mockSend.mockResolvedValue({ success: false, error: 'Resend rejected' })

    const service = createService()
    const result = await service.notifyOwner('pilot_request', payload)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Resend rejected')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        email_status: 'failed',
        email_error: 'Resend rejected',
      })
    )
  })

  it('uses the provided source type and id', async () => {
    mockSelectSingle.mockResolvedValue({
      data: { id: 'notif-3', payload },
      error: null,
    })

    const service = createService()
    await service.notifyOwner('pilot_request', payload, {
      sourceType: 'pilot_inquiries',
      sourceId: 'pilot-1',
    })

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source_type: 'pilot_inquiries',
        source_id: 'pilot-1',
      })
    )
  })
})
